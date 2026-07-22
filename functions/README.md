# YardGuard quote email — DigitalOcean Function

A serverless DigitalOcean Function that receives the quote form (JSON) and emails
the lead to the owner via [Resend](https://resend.com). No server to manage, free
tier, holds the Resend key safely (never exposed to the browser). The static site
stays static and just POSTs to this function's URL.

## Layout

```
functions/
  project.yml                     # DO Functions project (env, runtime, web:true)
  packages/api/quote/index.js     # the handler (main)
  test-local.mjs                  # local test harness (no doctl needed)
  .env.example                    # template for deploy-time env values
```

## Test locally (no deploy)

```bash
cd functions
cp .env.example .env       # fill in RESEND_API_KEY + LEAD_NOTIFY_EMAIL
node --env-file=.env test-local.mjs
```

## One-time Resend setup

1. Free Resend account.
2. Verify the `ygtoronto.com` domain (SPF/DKIM DNS records) so mail lands in the
   inbox, then set `FROM_EMAIL` to e.g. `quotes@ygtoronto.com`. Until verified,
   `onboarding@resend.dev` works but only delivers to the Resend account's email.
3. Create an API key → put it in `functions/.env`.

## Deploy to DigitalOcean

```bash
# one-time: install doctl and connect the serverless namespace
doctl serverless install
doctl serverless connect

# deploy (reads functions/.env to fill the ${...} vars in project.yml)
cd functions
doctl serverless deploy .

# get the public URL of the function:
doctl serverless functions get api/quote --url
```

Take that URL and point the form at it — set `window.QUOTE_ENDPOINT` to it in
`quote.html`, e.g.:

```html
<script>window.QUOTE_ENDPOINT = "https://faas-xxx.doserverless.co/api/v1/web/fn-.../api/quote";</script>
```

(The function URL is public, not a secret — the Resend key stays inside the
function via the env vars, never in the page.)

## Config (env vars)

`RESEND_API_KEY` and `LEAD_NOTIFY_EMAIL` are required; `FROM_EMAIL` and
`ALLOWED_ORIGIN` are optional. `QUOTE_RATE_LIMIT_MAX` and
`QUOTE_RATE_LIMIT_WINDOW_MS` default to 5 and 600000 respectively. Set them in
`functions/.env` (gitignored) — they're injected at deploy time and never
committed.

## Reliability and abuse controls

The quote page sends a client-generated idempotency key with each form attempt.
While a function instance is warm, repeated requests with the same key replay
the original lead ID and do not send another notification. The handler also
applies a small per-client-address rate limit (five POSTs per ten minutes by
default; configure `QUOTE_RATE_LIMIT_MAX` and `QUOTE_RATE_LIMIT_WINDOW_MS`).
These controls are intentionally local and bounded: serverless instances can be
recycled, so they are not durable persistence, a queue, or an edge/WAF control.
Do not treat them as a substitute for a durable lead store/outbox or a managed
bot challenge when traffic or abuse risk requires those services.

## Production mailbox release check

Before a production release, an operator must complete this checklist and keep
the result with the deployment record:

1. Confirm `LEAD_NOTIFY_EMAIL` contains the monitored owner inbox and that any
   `LEAD_CC_EMAIL`/`LEAD_BCC_EMAIL` addresses are current. The handler rejects
   malformed recipient addresses before calling Resend.
2. Confirm the `FROM_EMAIL` domain is verified in Resend (SPF/DKIM) and that
   the owner can reply to the lead using the included `reply_to` address.
3. Submit one controlled test quote from the production domain, record its
   lead ID, confirm delivery in the inbox and Resend activity log, then reply
   to it and verify the customer address receives the reply.
4. Record who monitors the inbox, the expected response SLA, and the fallback
   phone number `(647) 216-7787`. Repeat this check after mailbox or sender
   changes.

The repository cannot verify delivery to a real mailbox without sending a
controlled production test. Durable lead persistence, notification retries,
and bounce/failure alerting remain planned follow-up work.
