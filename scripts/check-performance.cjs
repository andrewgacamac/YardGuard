const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const publicPages = require('../config/public-pages.json');

assert.ok(fs.existsSync(dist), 'dist/ is missing; run npm run build first');

// These are intentionally conservative transfer-size guardrails, not a claim
// about Core Web Vitals. They catch accidental debug dumps and unbounded inline
// assets before a release reaches a customer.
const budgets = {
  html: 130 * 1024,
  javascript: 120 * 1024,
  css: 120 * 1024,
};

function filesWithExtension(directory, extension) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return filesWithExtension(fullPath, extension);
    return entry.name.endsWith(extension) ? [fullPath] : [];
  });
}

function bytes(file) {
  return fs.statSync(file).size;
}

for (const page of publicPages) {
  const file = path.join(dist, page);
  assert.ok(fs.existsSync(file), `built public page is missing: ${page}`);
  assert.ok(bytes(file) <= budgets.html, `${page} exceeds the ${budgets.html} byte HTML budget`);
}

for (const [extension, budget, label] of [
  ['.js', budgets.javascript, 'JavaScript'],
  ['.css', budgets.css, 'CSS'],
]) {
  const total = filesWithExtension(path.join(dist, 'assets'), extension).reduce((sum, file) => sum + bytes(file), 0);
  assert.ok(total <= budget, `${label} bundle total ${total} exceeds the ${budget} byte budget`);
}

console.log(`Performance budgets passed for ${publicPages.length} pages.`);
