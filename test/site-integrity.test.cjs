const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const publicPages = require('../config/public-pages.json');

function attributes(source, name) {
  const pattern = new RegExp(`\\b${name}\\s*=\\s*["']([^"']+)["']`, 'gi');
  return [...source.matchAll(pattern)].map((match) => match[1]);
}

function localTarget(fromPage, reference) {
  if (!reference || reference.startsWith('#')) return null;
  if (/^(?:https?:|mailto:|tel:|javascript:|data:)/i.test(reference)) return null;
  const [pathname] = reference.split(/[?#]/, 1);
  if (!pathname) return null;
  const decoded = decodeURIComponent(pathname);
  if (decoded.startsWith('/')) return path.join(root, decoded.replace(/^\/+/, ''));
  return path.resolve(path.dirname(path.join(root, fromPage)), decoded);
}

function faqText(source) {
  const decode = (value) => value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&rsquo;/g, '’')
    .replace(/&ldquo;/g, '“')
    .replace(/&rdquo;/g, '”')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&nbsp;/g, ' ');
  const strip = (value) => decode(value.replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,;:!?])/g, '$1')
    .trim();
  const withLists = source.replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (_, item) => {
    const itemText = strip(item).replace(/[.;]+$/g, '');
    return ` • ${itemText}; `;
  });
  return strip(withLists.replace(/<\/(?:p|ul|ol)>/gi, ' ').replace(/<br\s*\/?>/gi, ' '))
    .replace(/;\s*$/g, '')
    .trim();
}

test('public page allowlist is unique and every page has one main landmark', () => {
  assert.equal(new Set(publicPages).size, publicPages.length, 'public page allowlist contains duplicates');
  for (const page of publicPages) {
    const file = path.join(root, page);
    assert.ok(fs.existsSync(file), `${page} is missing`);
    const html = fs.readFileSync(file, 'utf8');
    assert.equal((html.match(/<main\b/gi) || []).length, 1, `${page} must contain exactly one <main>`);
    assert.match(html, /<h1\b/i, `${page} must contain an h1`);
  }
});

test('internal links, fragments, images, and source sets resolve', () => {
  const failures = [];

  for (const page of publicPages) {
    const html = fs.readFileSync(path.join(root, page), 'utf8');
    const references = [
      ...attributes(html, 'href'),
      ...attributes(html, 'src'),
      ...attributes(html, 'poster'),
    ];

    for (const srcset of attributes(html, 'srcset')) {
      references.push(...srcset.split(',').map((candidate) => candidate.trim().split(/\s+/)[0]));
    }

    for (const reference of references) {
      const target = localTarget(page, reference);
      if (target && !fs.existsSync(target)) failures.push(`${page}: ${reference}`);

      const hashIndex = reference.indexOf('#');
      if (hashIndex < 0 || /^(?:https?:|mailto:|tel:)/i.test(reference)) continue;
      const fragment = decodeURIComponent(reference.slice(hashIndex + 1));
      if (!fragment) continue;
      const targetFile = target || path.join(root, page);
      if (!fs.existsSync(targetFile) || path.extname(targetFile) !== '.html') continue;
      const targetHtml = fs.readFileSync(targetFile, 'utf8');
      const escaped = fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (!new RegExp(`\\bid=["']${escaped}["']`, 'i').test(targetHtml)) {
        failures.push(`${page}: missing fragment ${reference}`);
      }
    }
  }

  assert.deepEqual(failures, []);
});

test('all JSON-LD blocks contain valid JSON', () => {
  for (const page of publicPages) {
    const html = fs.readFileSync(path.join(root, page), 'utf8');
    const blocks = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
    for (const [, json] of blocks) {
      assert.doesNotThrow(() => JSON.parse(json), `${page} contains invalid JSON-LD`);
    }
  }
});

test('structured data uses the expected schema shapes', () => {
  for (const page of publicPages) {
    const html = fs.readFileSync(path.join(root, page), 'utf8');
    const blocks = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
      .map(([, json]) => JSON.parse(json));
    for (const block of blocks) {
      assert.equal(block['@context'], 'https://schema.org', `${page} JSON-LD must use schema.org`);
      assert.ok(block['@type'] || Array.isArray(block['@graph']), `${page} JSON-LD must declare a type or graph`);
      if (block['@type'] === 'FAQPage') {
        assert.ok(Array.isArray(block.mainEntity) && block.mainEntity.length, `${page} FAQPage must contain questions`);
        for (const question of block.mainEntity) {
          assert.equal(question['@type'], 'Question', `${page} FAQ entries must be Question objects`);
          assert.ok(question.name && question.acceptedAnswer?.text, `${page} FAQ questions need names and answers`);
        }
      }
      if (block['@type'] === 'BreadcrumbList') {
        assert.ok(Array.isArray(block.itemListElement) && block.itemListElement.length, `${page} breadcrumb list is empty`);
      }
    }
  }
});

test('full FAQ visible questions and answers match FAQPage structured data', () => {
  const html = fs.readFileSync(path.join(root, 'faq.html'), 'utf8');
  const visible = [...html.matchAll(/<span class="faq-accordion__question"[^>]*>([\s\S]*?)<\/span[\s\S]*?<div class="faq-accordion__answer">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/g)]
    .map(([, question, answer]) => ({ name: faqText(question), text: faqText(answer) }));
  const faqPage = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map(([, json]) => JSON.parse(json))
    .find((block) => block['@type'] === 'FAQPage');
  const structured = faqPage.mainEntity.map((entry) => ({
    name: entry.name,
    text: entry.acceptedAnswer.text,
  }));

  assert.equal(visible.length, 29, 'faq.html should expose all 29 visible questions');
  assert.deepEqual(structured, visible, 'FAQPage schema must mirror visible FAQ copy');
});

test('public pages keep basic non-visual semantics intact', () => {
  for (const page of publicPages) {
    const html = fs.readFileSync(path.join(root, page), 'utf8');
    const images = [...html.matchAll(/<img\b([^>]*)>/gi)].map((match) => match[1]);
    for (const attributes of images) {
      assert.match(attributes, /\balt\s*=\s*["'][^"']*["']/i, `${page} contains an image without alt text`);
    }

    const buttons = [...html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)];
    for (const [, attributes, content] of buttons) {
      const text = content.replace(/<[^>]+>/g, '').replace(/&nbsp;/gi, ' ').trim();
      assert.ok(text || /\baria-(?:label|labelledby)\s*=/i.test(attributes), `${page} contains an unnamed button`);
    }

    const ids = [...html.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map((match) => match[1]);
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    assert.deepEqual([...new Set(duplicates)], [], `${page} contains duplicate IDs`);

    for (const tag of ['table', 'thead', 'tbody']) {
      const openings = (html.match(new RegExp(`<${tag}\\b`, 'gi')) || []).length;
      const closings = (html.match(new RegExp(`</${tag}>`, 'gi')) || []).length;
      assert.equal(openings, closings, `${page} contains unbalanced <${tag}> markup`);
    }
  }
});

test('static deployment headers include the safe baseline', () => {
  const headers = fs.readFileSync(path.join(root, 'public/_headers'), 'utf8');
  for (const header of [
    'X-Content-Type-Options: nosniff',
    'Referrer-Policy: strict-origin-when-cross-origin',
    'Permissions-Policy: camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security: max-age=31536000; includeSubDomains',
  ]) {
    assert.match(headers, new RegExp(header.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});
