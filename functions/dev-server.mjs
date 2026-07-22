// Local dev wrapper for the DigitalOcean Function — lets you test the exact same
// handler in the browser without deploying. Simulates how DO invokes the function
// (JSON body merged into args) and serves it at http://localhost:3000/api/quote.
//
// Run: node dev-server.mjs
// This server is a dry-run by default and never contacts Resend. The main Vite
// dev server already includes a mock /api/quote route for normal local work.

import http from 'node:http';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { main } = require('./packages/api/quote/index.js');

const PORT = process.env.PORT || 3000;
process.env.RESEND_API_KEY ||= 'local-dry-run-key';
process.env.LEAD_NOTIFY_EMAIL ||= 'local@example.invalid';

const server = http.createServer((req, res) => {
  const url = (req.url || '').split('?')[0];

  if (req.method === 'GET' && (url === '/' || url === '/health')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, service: 'yardguard-function-dev' }));
    return;
  }

  if (url === '/api/quote') {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', async () => {
      const args = { __ow_method: (req.method || 'post').toLowerCase() };
      if (body) {
        try { Object.assign(args, JSON.parse(body)); }
        catch {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
          return;
        }
      }
      const originalFetch = globalThis.fetch;
      globalThis.fetch = async () => ({ ok: true, status: 200, text: async () => '' });
      let r;
      try {
        r = await main(args);
      } finally {
        globalThis.fetch = originalFetch;
      }
      res.writeHead(r.statusCode || 200, r.headers || { 'Content-Type': 'application/json' });
      res.end(typeof r.body === 'string' ? r.body : JSON.stringify(r.body || {}));
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`YardGuard dry-run function server on :${PORT} — no email will be sent`);
});
