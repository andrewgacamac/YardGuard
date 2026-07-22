const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const publicPages = require('../config/public-pages.json');
const expectedSha = process.env.YARDGUARD_EXPECTED_COMMIT_SHA;

assert.ok(fs.existsSync(dist), 'dist/ is missing; run npm run build first');

for (const page of publicPages) {
  const output = path.join(dist, page);
  assert.ok(fs.existsSync(output), `built public page is missing: ${page}`);
}

const manifestPath = path.join(dist, 'deployment.json');
assert.ok(fs.existsSync(manifestPath), 'dist/deployment.json is missing');

let manifest;
assert.doesNotThrow(() => {
  manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}, 'dist/deployment.json is not valid JSON');

assert.equal(manifest.schemaVersion, 1, 'deployment manifest schemaVersion must be 1');
assert.match(manifest.commitSha, /^(?:[0-9a-f]{40}|local|unknown)$/i, 'deployment manifest has an invalid commit SHA');
assert.equal(manifest.publicPageCount, publicPages.length, 'deployment manifest page count is stale');

if (expectedSha) {
  assert.equal(manifest.commitSha, expectedSha, 'deployment manifest does not identify the expected commit');
}

console.log(`Verified ${publicPages.length} public pages and deployment SHA ${manifest.commitSha}.`);
