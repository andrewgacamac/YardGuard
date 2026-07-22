const test = require('node:test');
const assert = require('node:assert/strict');
const { main, __resetSecurityState } = require('../functions/packages/api/quote/index.js');

const validLead = {
  __ow_method: 'post',
  __ow_headers: { origin: 'https://ygtoronto.com' },
  firstName: 'Jane',
  lastName: 'Homeowner',
  email: 'jane@example.com',
  phone: '(647) 555-1234',
  package: 'pet-yard',
  project_type: ['backyard'],
  size: '500-800',
  city: 'Mississauga',
  postalCode: 'L5A 1A1',
  timeline: '1-3-months',
  howHeard: 'google',
  lead_source: 'test-suite',
};

function parseBody(response) {
  return JSON.parse(response.body);
}

test.beforeEach(() => {
  __resetSecurityState();
  process.env.RESEND_API_KEY = 'test-key';
  process.env.LEAD_NOTIFY_EMAIL = 'owner@example.invalid';
  process.env.ALLOWED_ORIGIN = 'https://ygtoronto.com,https://www.ygtoronto.com';
  delete process.env.QUOTE_RATE_LIMIT_MAX;
  delete process.env.QUOTE_RATE_LIMIT_WINDOW_MS;
});

test('accepts a valid lead, returns an ID, and sends one mocked notification', async () => {
  let sent;
  global.fetch = async (_url, options) => {
    sent = JSON.parse(options.body);
    return { ok: true, status: 200, text: async () => '' };
  };

  const response = await main({ ...validLead });
  const body = parseBody(response);
  assert.equal(response.statusCode, 201);
  assert.equal(body.ok, true);
  assert.match(body.leadId, /^[0-9a-f-]{36}$/);
  assert.equal(sent.reply_to, 'jane@example.com');
  assert.match(sent.subject, new RegExp(body.leadId));
  assert.match(sent.html, /Lead source/);
  assert.match(sent.html, /test-suite/);
});

test('rejects an unapproved browser origin before sending', async () => {
  let calls = 0;
  global.fetch = async () => { calls += 1; };
  const response = await main({ ...validLead, __ow_headers: { origin: 'https://example.com' } });
  assert.equal(response.statusCode, 403);
  assert.equal(calls, 0);
});

test('supports the current DigitalOcean HTTP event shape', async () => {
  let calls = 0;
  global.fetch = async () => {
    calls += 1;
    return { ok: true, status: 200, text: async () => '' };
  };

  const { __ow_method, __ow_headers, ...lead } = validLead;
  const response = await main({
    ...lead,
    http: { method: 'POST', headers: { origin: 'https://ygtoronto.com' } },
  });
  assert.equal(response.statusCode, 201);
  assert.equal(calls, 1);
});

test('rejects invalid contact and enum values', async () => {
  global.fetch = async () => { throw new Error('should not send'); };
  const badEmail = await main({ ...validLead, email: 'not-an-email' });
  assert.equal(badEmail.statusCode, 400);
  const badPackage = await main({ ...validLead, package: 'invented-package' });
  assert.equal(badPackage.statusCode, 400);
});

test('rejects invalid Canadian postal codes and oversized payloads', async () => {
  global.fetch = async () => { throw new Error('should not send'); };
  const badPostal = await main({ ...validLead, postalCode: '12345' });
  assert.equal(badPostal.statusCode, 400);
  const oversized = await main({ ...validLead, message: 'x'.repeat(17 * 1024) });
  assert.equal(oversized.statusCode, 400);
});

test('silently discards honeypot submissions without sending', async () => {
  let calls = 0;
  global.fetch = async () => { calls += 1; };
  const response = await main({ ...validLead, _gotcha: 'spam' });
  assert.equal(response.statusCode, 200);
  assert.equal(calls, 0);
  assert.match(parseBody(response).leadId, /^discarded-/);
});

test('replays an idempotent submission without sending a duplicate notification', async () => {
  let calls = 0;
  global.fetch = async () => {
    calls += 1;
    return { ok: true, status: 200, text: async () => '' };
  };

  const first = await main({ ...validLead, idempotencyKey: 'quote-test-1' });
  const second = await main({ ...validLead, idempotencyKey: 'quote-test-1' });
  assert.equal(first.statusCode, 201);
  assert.equal(second.statusCode, 201);
  assert.equal(parseBody(second).leadId, parseBody(first).leadId);
  assert.equal(calls, 1);
});

test('rejects reuse of an idempotency key with different form data', async () => {
  let calls = 0;
  global.fetch = async () => {
    calls += 1;
    return { ok: true, status: 200, text: async () => '' };
  };

  await main({ ...validLead, idempotencyKey: 'quote-test-2' });
  const response = await main({ ...validLead, city: 'Toronto', idempotencyKey: 'quote-test-2' });
  assert.equal(response.statusCode, 409);
  assert.equal(calls, 1);
});

test('coalesces concurrent requests that share an idempotency key', async () => {
  let calls = 0;
  global.fetch = async () => {
    calls += 1;
    await new Promise((resolve) => setTimeout(resolve, 10));
    return { ok: true, status: 200, text: async () => '' };
  };

  const [first, second] = await Promise.all([
    main({ ...validLead, idempotencyKey: 'quote-concurrent-1' }),
    main({ ...validLead, idempotencyKey: 'quote-concurrent-1' }),
  ]);
  assert.equal(first.statusCode, 201);
  assert.equal(second.statusCode, 201);
  assert.equal(parseBody(second).leadId, parseBody(first).leadId);
  assert.equal(calls, 1);
});

test('rate-limits repeated requests from a proxy-provided client address', async () => {
  process.env.QUOTE_RATE_LIMIT_MAX = '2';
  process.env.QUOTE_RATE_LIMIT_WINDOW_MS = '60000';
  global.fetch = async () => ({ ok: true, status: 200, text: async () => '' });
  const request = { ...validLead, __ow_headers: { origin: 'https://ygtoronto.com', 'x-forwarded-for': '198.51.100.42' } };

  assert.equal((await main(request)).statusCode, 201);
  assert.equal((await main({ ...request, email: 'second@example.com' })).statusCode, 201);
  const limited = await main({ ...request, email: 'third@example.com' });
  assert.equal(limited.statusCode, 429);
  assert.match(limited.headers['Retry-After'], /^\d+$/);
});

test('rejects malformed idempotency keys before contacting the mail provider', async () => {
  let calls = 0;
  global.fetch = async () => { calls += 1; };
  const response = await main({ ...validLead, idempotencyKey: 'not safe/for headers' });
  assert.equal(response.statusCode, 400);
  assert.equal(calls, 0);
});

test('fails safely when the production notification mailbox is malformed', async () => {
  process.env.LEAD_NOTIFY_EMAIL = 'not-an-email';
  let calls = 0;
  global.fetch = async () => { calls += 1; };
  const response = await main(validLead);
  assert.equal(response.statusCode, 500);
  assert.match(parseBody(response).error, /temporarily unavailable/i);
  assert.equal(calls, 0);
});
