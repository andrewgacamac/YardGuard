// Local test harness for the DO Function handler (no doctl needed).
// Run: node functions/test-local.mjs
// It invokes main() the same way DigitalOcean would (fields merged into args).

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { main } = require('./packages/api/quote/index.js');
process.env.RESEND_API_KEY = 'local-test-key';
process.env.LEAD_NOTIFY_EMAIL = 'local@example.invalid';
globalThis.fetch = async () => ({ ok: true, status: 200, text: async () => '' });

const cases = [
  {
    name: 'honeypot filled -> silent ok, no email',
    args: { __ow_method: 'post', firstName: 'Bot', lastName: 'Spam', email: 'b@s.com', phone: '1', _gotcha: 'x' },
  },
  {
    name: 'missing required -> 400',
    args: { __ow_method: 'post', firstName: 'Test', lastName: 'User', email: 't@e.com' },
  },
  {
    name: 'valid lead -> mocked email only',
    args: {
      __ow_method: 'post',
      firstName: 'Jane', lastName: 'Homeowner', email: 'jane@example.com', phone: '6475551234',
      package: 'golfers-green', project_type: ['backyard', 'patio'], size: 'over-1200',
      city: 'Etobicoke', timeline: '1-month', howHeard: 'referral',
      message: 'DO Function local test — real send.',
    },
  },
];

for (const c of cases) {
  const res = await main(c.args);
  console.log(`\n[${c.name}]`);
  console.log(`  status: ${res.statusCode}  body: ${res.body}`);
}
