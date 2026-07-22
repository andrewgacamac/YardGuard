# Run YardGuard locally

The public site is a static Vite build and does not require Supabase, a login,
or production credentials for local work.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173/`). The
quote form uses Vite's built-in `/api/quote` mock during local development. A
successful submission returns a `local-*` lead ID and never contacts Resend or
an owner mailbox.

For an exact dry-run of the DigitalOcean function handler, use a second
terminal:

```bash
node functions/dev-server.mjs
```

That helper also stubs the email provider. Do not put production API keys in a
local `.env`; production values belong in the deployment platform's secret
configuration.

Useful checks:

```bash
npm test
npm run build
npm run test:browser
```
