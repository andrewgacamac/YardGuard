// DigitalOcean Function: emails a YardGuard quote-form lead via Resend.
//
// Runs on DO's free serverless Functions tier — no server to manage, holds the
// Resend key safely (never exposed to the browser), wakes on each submission.
// The static site POSTs JSON here; this validates it and sends the email.
//
// Env vars (set at deploy time, never committed):
//   RESEND_API_KEY     - Resend API key
//   LEAD_NOTIFY_EMAIL  - inbox that receives leads (Michael)
//   FROM_EMAIL         - verified sender, e.g. "YardGuard <quotes@ygtoronto.com>"
//   ALLOWED_ORIGIN     - comma-delimited browser origins (defaults to production hosts)

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const { randomUUID, createHash } = require('node:crypto');
const MAX_PAYLOAD_BYTES = 16 * 1024;
const MAX_IDEMPOTENCY_KEY_LENGTH = 128;
const DEFAULT_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const DEFAULT_RATE_LIMIT_MAX = 5;
const IDEMPOTENCY_TTL_MS = 30 * 60 * 1000;
const MAX_IDEMPOTENCY_ENTRIES = 1000;

// These maps deliberately provide best-effort protection within a warm
// function instance. They are not a durable queue or a replacement for an
// edge/WAF limiter; a production deployment should add one when traffic grows.
const rateLimitBuckets = new Map();
const idempotencyCache = new Map();
const idempotencyInFlight = new Map();

const ALLOWED_VALUES = {
  package: new Set(['easy-lawn', 'pet-yard', 'golfers-green', 'not-sure']),
  project_type: new Set(['backyard', 'frontyard', 'sideyard', 'patio']),
  size: new Set(['', 'under-300', '300-500', '500-800', '800-1200', 'over-1200', 'not-sure']),
  timeline: new Set(['', 'asap', '1-month', '1-3-months', '3-6-months', 'just-exploring']),
  howHeard: new Set(['', 'google', 'facebook', 'referral', 'neighbour', 'other']),
};

// Lead fields in the order they appear in the email, with human labels.
const FIELD_LABELS = [
  ['lead_source', 'Lead source'],
  ['offer', 'Offer code'],
  ['package', 'Package interest'],
  ['project_type', 'Project areas'],
  ['size', 'Approximate size'],
  ['timeline', 'Timeline'],
  ['address', 'Street address'],
  ['city', 'City'],
  ['postalCode', 'Postal code'],
  ['howHeard', 'Heard about us via'],
  ['message', 'Message'],
  ['casl-optin', 'Opted in to marketing'],
];

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildEmailHtml(fields, projectTypes) {
  const rows = [];
  rows.push(['Lead ID', fields.leadId]);
  rows.push(['Name', `${fields.firstName || ''} ${fields.lastName || ''}`.trim()]);
  rows.push(['Email', fields.email || '']);
  rows.push(['Phone', fields.phone || '']);

  for (const [key, label] of FIELD_LABELS) {
    let value;
    if (key === 'project_type') value = projectTypes.join(', ');
    else if (key === 'casl-optin') value = fields[key] ? 'Yes' : 'No';
    else value = fields[key];
    if (value === undefined || value === null || String(value).trim() === '') continue;
    rows.push([label, value]);
  }

  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px;font-weight:600;color:#374151;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td><td style="padding:6px 12px;color:#111827">${escapeHtml(value).replace(/\n/g, '<br>')}</td></tr>`
    )
    .join('');

  return `<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;background:#f9fafb;padding:24px;margin:0">
    <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;border:1px solid #e5e7eb">
      <div style="background:#166534;color:#fff;padding:18px 24px;font-size:18px;font-weight:700">New Quote Request — YardGuard</div>
      <table style="width:100%;border-collapse:collapse;font-size:14px">${tableRows}</table>
      <div style="padding:14px 24px;color:#6b7280;font-size:12px;border-top:1px solid #e5e7eb">Reply directly to this email to reach the customer. Sent automatically from the ygtoronto.com quote form.</div>
    </div>
  </body></html>`;
}

function response(statusCode, obj, extraHeaders = {}) {
  // NOTE: DigitalOcean's web-function platform adds permissive CORS headers
  // (Access-Control-Allow-Origin: * etc.) automatically. We must NOT add our
  // own, or the response ends up with duplicate ACAO headers and browsers
  // reject it as invalid. Non-CORS headers (for example Retry-After) are safe.
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
    body: JSON.stringify(obj),
  };
}

function getHeaders(args) {
  return args.http?.headers || args.__ow_headers || {};
}

function getClientAddress(args) {
  const headers = getHeaders(args);
  const forwarded = headers['x-forwarded-for'] || headers['X-Forwarded-For'];
  const address = String(forwarded || headers['x-real-ip'] || headers['X-Real-IP'] || '').split(',')[0].trim();
  // Do not rate-limit requests without a proxy-provided identity. Local tests,
  // server-to-server calls, and privacy-preserving browsers may omit it.
  return address;
}

function rateLimitConfig() {
  const max = Number.parseInt(process.env.QUOTE_RATE_LIMIT_MAX || '', 10);
  const windowMs = Number.parseInt(process.env.QUOTE_RATE_LIMIT_WINDOW_MS || '', 10);
  return {
    max: Number.isFinite(max) && max > 0 ? max : DEFAULT_RATE_LIMIT_MAX,
    windowMs: Number.isFinite(windowMs) && windowMs > 0 ? windowMs : DEFAULT_RATE_LIMIT_WINDOW_MS,
  };
}

function checkRateLimit(args) {
  const address = getClientAddress(args);
  if (!address) return null;

  const now = Date.now();
  const { max, windowMs } = rateLimitConfig();
  const previous = rateLimitBuckets.get(address);
  const bucket = previous && now - previous.startedAt < windowMs
    ? previous
    : { startedAt: now, count: 0 };
  bucket.count += 1;
  rateLimitBuckets.set(address, bucket);

  // Keep the map bounded if a function instance is kept warm under a scan.
  if (rateLimitBuckets.size > 2000) {
    for (const [key, value] of rateLimitBuckets) {
      if (now - value.startedAt >= windowMs) rateLimitBuckets.delete(key);
      if (rateLimitBuckets.size <= 1500) break;
    }
  }

  if (bucket.count > max) {
    const retryAfter = Math.max(1, Math.ceil((bucket.startedAt + windowMs - now) / 1000));
    return response(429, { error: 'Too many quote requests. Please try again shortly.' }, { 'Retry-After': String(retryAfter) });
  }
  return null;
}

function getIdempotencyKey(args) {
  const headers = getHeaders(args);
  const candidate = args.idempotencyKey || args.idempotency_key || headers['idempotency-key'] || headers['Idempotency-Key'] || '';
  const key = String(candidate).trim();
  if (!key) return '';
  if (key.length > MAX_IDEMPOTENCY_KEY_LENGTH || !/^[A-Za-z0-9._:-]+$/.test(key)) {
    return null;
  }
  return key;
}

function fingerprintLead(fields, projectTypes) {
  return createHash('sha256')
    .update(JSON.stringify({ fields, projectTypes }))
    .digest('hex');
}

function pruneIdempotencyCache(now = Date.now()) {
  for (const [key, entry] of idempotencyCache) {
    if (entry.expiresAt <= now) idempotencyCache.delete(key);
  }
  if (idempotencyCache.size >= MAX_IDEMPOTENCY_ENTRIES) {
    const oldest = idempotencyCache.keys().next().value;
    if (oldest) idempotencyCache.delete(oldest);
  }
}

function getRequestOrigin(args) {
  const headers = getHeaders(args);
  return String(headers.origin || headers.Origin || '').trim();
}

function isAllowedOrigin(args) {
  const requestOrigin = getRequestOrigin(args);
  if (!requestOrigin) return true;
  const configured = process.env.ALLOWED_ORIGIN || 'https://ygtoronto.com,https://www.ygtoronto.com';
  const allowed = configured.split(',').map((value) => value.trim()).filter(Boolean);
  return allowed.includes(requestOrigin);
}

function cleanString(value, maxLength) {
  const cleaned = String(value ?? '').trim();
  if (cleaned.length > maxLength) throw new Error(`must be ${maxLength} characters or fewer`);
  return cleaned;
}

function validateLead(args) {
  if (Buffer.byteLength(JSON.stringify(args), 'utf8') > MAX_PAYLOAD_BYTES) {
    return { error: 'The request is too large.' };
  }

  try {
    const fields = {
      firstName: cleanString(args.firstName, 80),
      lastName: cleanString(args.lastName, 80),
      email: cleanString(args.email, 254).toLowerCase(),
      phone: cleanString(args.phone, 40),
      package: cleanString(args.package, 40),
      size: cleanString(args.size, 40),
      address: cleanString(args.address, 200),
      city: cleanString(args.city, 100),
      postalCode: cleanString(args.postalCode, 16).toUpperCase(),
      timeline: cleanString(args.timeline, 40),
      howHeard: cleanString(args.howHeard, 40),
      message: cleanString(args.message, 2000),
      lead_source: cleanString(args.lead_source || 'website-quote', 80),
      offer: cleanString(args.offer, 80),
      'casl-optin': args['casl-optin'] === true,
    };

    const projectTypes = (Array.isArray(args.project_type) ? args.project_type : [args.project_type])
      .filter(Boolean)
      .map((value) => cleanString(value, 40));

    const missing = ['firstName', 'lastName', 'email', 'phone', 'package', 'city']
      .filter((key) => !fields[key]);
    if (!projectTypes.length) missing.push('project_type');
    if (missing.length) return { error: `Please fill in: ${missing.join(', ')}.` };

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      return { error: 'Please enter a valid email address.' };
    }
    const phoneDigits = fields.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      return { error: 'Please enter a valid phone number.' };
    }
    if (fields.postalCode && !/^[A-Z]\d[A-Z][ -]?\d[A-Z]\d$/.test(fields.postalCode)) {
      return { error: 'Please enter a valid Canadian postal code.' };
    }
    for (const key of ['package', 'size', 'timeline', 'howHeard']) {
      if (!ALLOWED_VALUES[key].has(fields[key])) return { error: `Please select a valid ${key}.` };
    }
    if (projectTypes.some((value) => !ALLOWED_VALUES.project_type.has(value))) {
      return { error: 'Please select a valid project type.' };
    }

    return { fields, projectTypes: [...new Set(projectTypes)] };
  } catch (error) {
    return { error: `A submitted field ${error.message}.` };
  }
}

// Split a comma/semicolon-separated list of addresses into a clean array.
// Lets LEAD_NOTIFY_EMAIL / LEAD_CC_EMAIL / LEAD_BCC_EMAIL each hold one or more
// recipients, e.g. "michael@ygtoronto.com, andrew@me.com".
function parseRecipients(value) {
  return String(value || '')
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function areValidRecipients(recipients) {
  return recipients.length > 0 && recipients.every((address) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address));
}

async function main(args) {
  // Support the current DigitalOcean event shape and the legacy OpenWhisk
  // fields so existing deployments and local tests behave identically.
  const method = String(args.http?.method || args.__ow_method || 'post').toLowerCase();

  // CORS preflight
  if (method === 'options') return response(204, {});
  if (method !== 'post') return response(405, { error: 'Method not allowed' });
  if (!isAllowedOrigin(args)) return response(403, { error: 'Origin not allowed.' });

  const idempotencyKey = getIdempotencyKey(args);
  if (idempotencyKey === null) return response(400, { error: 'Invalid idempotency key.' });

  // Honeypot: real users never fill this. Pretend success so bots do not retry.
  if (args._gotcha && String(args._gotcha).trim() !== '') {
    return response(200, { ok: true, leadId: `discarded-${randomUUID()}` });
  }

  const validation = validateLead(args);
  if (validation.error) return response(400, { error: validation.error });
  const { fields, projectTypes } = validation;
  const fingerprint = fingerprintLead(fields, projectTypes);

  // A client-generated key keeps a retry from sending a second notification.
  // The cache is intentionally process-local until a durable store is chosen.
  if (idempotencyKey) {
    pruneIdempotencyCache();
    const cached = idempotencyCache.get(idempotencyKey);
    if (cached) {
      if (cached.fingerprint !== fingerprint) return response(409, { error: 'This idempotency key was already used for different form data.' });
      return response(cached.statusCode, cached.body);
    }
    const pending = idempotencyInFlight.get(idempotencyKey);
    if (pending) {
      if (pending.fingerprint !== fingerprint) return response(409, { error: 'This idempotency key is already being used for different form data.' });
      return pending.promise;
    }
  }

  const limited = checkRateLimit(args);
  if (limited) return limited;

  fields.leadId = randomUUID();

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const LEAD_NOTIFY_EMAIL = process.env.LEAD_NOTIFY_EMAIL;
  const FROM_EMAIL = process.env.FROM_EMAIL || 'YardGuard Quotes <onboarding@resend.dev>';
  const LEAD_CC_EMAIL = process.env.LEAD_CC_EMAIL;   // optional, visible copy
  const LEAD_BCC_EMAIL = process.env.LEAD_BCC_EMAIL; // optional, blind copy
  if (!RESEND_API_KEY || !LEAD_NOTIFY_EMAIL) {
    return response(500, { error: 'The quote form is not configured. Please call us instead.' });
  }

  const notifyRecipients = parseRecipients(LEAD_NOTIFY_EMAIL);
  const ccRecipients = parseRecipients(LEAD_CC_EMAIL);
  const bccRecipients = parseRecipients(LEAD_BCC_EMAIL);
  if (!areValidRecipients(notifyRecipients) || (ccRecipients.length && !areValidRecipients(ccRecipients)) || (bccRecipients.length && !areValidRecipients(bccRecipients))) {
    console.error('Quote notification mailbox configuration is invalid.');
    return response(500, { error: 'The quote form is temporarily unavailable. Please call us instead.' });
  }

  const subject = `New Quote Request — ${fields.firstName} ${fields.lastName} (${fields.package}) [${fields.leadId}]`;
  const emailBody = {
    from: FROM_EMAIL,
    to: notifyRecipients,
    subject,
    html: buildEmailHtml(fields, projectTypes),
  };
  // Optional CC (visible) and BCC (blind) copies.
  const cc = ccRecipients;
  const bcc = bccRecipients;
  if (cc.length) emailBody.cc = cc;
  if (bcc.length) emailBody.bcc = bcc;
  // Let the owner reply straight to the customer.
  emailBody.reply_to = fields.email;

  const sendTask = (async () => {
    try {
      const r = await fetch(RESEND_ENDPOINT, {
        method: 'POST',
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(emailBody),
      });
      if (!r.ok) {
        const text = await r.text().catch(() => '');
        throw new Error(`Resend responded ${r.status}: ${text}`);
      }
      return response(201, { ok: true, leadId: fields.leadId });
    } catch (err) {
      console.error('Email send failed:', err.message);
      return response(502, { error: 'We could not send your request right now. Please try again or call us at (647) 216-7787.' });
    }
  })();

  if (idempotencyKey) {
    idempotencyInFlight.set(idempotencyKey, { fingerprint, promise: sendTask });
  }
  const result = await sendTask;
  if (idempotencyKey) {
    idempotencyInFlight.delete(idempotencyKey);
    if (result.statusCode === 201) {
      pruneIdempotencyCache();
      idempotencyCache.set(idempotencyKey, {
        fingerprint,
        statusCode: result.statusCode,
        body: JSON.parse(result.body),
        expiresAt: Date.now() + IDEMPOTENCY_TTL_MS,
      });
    }
  }
  return result;
}

exports.main = main;
// Exposed only for the local test harness; production callers use main().
exports.__resetSecurityState = () => {
  rateLimitBuckets.clear();
  idempotencyCache.clear();
  idempotencyInFlight.clear();
};
