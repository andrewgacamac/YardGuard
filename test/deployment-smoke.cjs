const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const publicPages = require('../config/public-pages.json');
const baseUrl = process.env.SMOKE_BASE_URL || process.argv[2];
const expectedSha = process.env.YARDGUARD_EXPECTED_COMMIT_SHA;

if (!baseUrl) {
  console.error('Usage: SMOKE_BASE_URL=https://example.com npm run smoke:production');
  process.exit(64);
}

const base = new URL(baseUrl);
base.pathname = base.pathname.replace(/\/$/, '');

function pageUrl(page) {
  return new URL(`/${page}`, base);
}

async function fetchChecked(url) {
  const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(15_000) });
  assert.ok(response.status >= 200 && response.status < 400, `${url} returned HTTP ${response.status}`);
  return response;
}

async function main() {
  const sitemap = fs.readFileSync(path.join(root, 'public/sitemap.xml'), 'utf8');
  const sitemapPaths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/gi)]
    .map(([, location]) => new URL(location).pathname.replace(/^\/$/, 'index.html').replace(/^\//, ''));
  assert.deepEqual(sitemapPaths.sort(), [...publicPages].sort(), 'sitemap and public page allowlist differ');

  for (const page of publicPages) {
    const response = await fetchChecked(pageUrl(page));
    const contentType = response.headers.get('content-type') || '';
    assert.match(contentType, /text\/html/i, `${page} did not return HTML`);
    const html = await response.text();
    assert.equal((html.match(/<main\b/gi) || []).length, 1, `${page} must contain exactly one main landmark`);
    assert.match(html, /<h1\b/i, `${page} must contain an h1`);
  }

  const manifestResponse = await fetchChecked(new URL('/deployment.json', base));
  assert.match(manifestResponse.headers.get('content-type') || '', /application\/json/i, 'deployment manifest is not JSON');
  const manifest = await manifestResponse.json();
  assert.equal(manifest.publicPageCount, publicPages.length, 'deployed page count is stale');
  assert.match(manifest.commitSha || '', /^(?:[0-9a-f]{40}|local|unknown)$/i, 'deployed SHA is invalid');
  if (expectedSha) assert.equal(manifest.commitSha, expectedSha, 'deployed SHA does not match expected commit');

  console.log(`Smoke-tested ${publicPages.length} sitemap pages at ${base.origin}; deployed SHA ${manifest.commitSha}.`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
