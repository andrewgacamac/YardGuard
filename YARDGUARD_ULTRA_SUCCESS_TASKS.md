# YardGuard Ultra-Success Task Backlog

This document converts the July 2026 read-only website audit into an actionable backlog. Complete tasks in priority order. Do not increase paid traffic until all P0 tasks and the P1 lead-path tasks are complete.

## Progress Log

### Batch 1 — Current-Tree Security Containment (July 21, 2026)

- Completed an exact inventory of tracked database, debug, schema-export, and local Supabase cache artifacts.
- Removed the plaintext credential helper and obsolete database/debug helpers from the current working tree.
- Removed the legacy debug upload page, tracked API schema export, and tracked `supabase/.temp` metadata.
- Expanded `.gitignore` to block local environment variants, database helpers, debug pages/scripts, schema exports, and Supabase temporary metadata.
- Verified that the current working tree has no matching plaintext database credential or secret-token patterns.
- Verified that the production build still succeeds.
- Confirmed that credential-bearing commits remain in Git history, but the credential belonged to the deleted Supabase project and is no longer operational. History cleanup and GitHub secret-scanning controls remain optional repository-hardening work.
- Owner confirmed that the Supabase project and every associated Supabase API have been permanently removed; P0.2 is closed as retired infrastructure.

### Batch 2 — Honest Design Consultation Handoff (July 21, 2026)

- Replaced the nonfunctional photo-upload form and false success confirmation with an honest design-consultation page.
- Routed every design-page CTA into the working quote flow with `source=design-consultation` attribution.
- Removed the ignored hidden photo input and unconditional design-visualization promise from the quote form.
- Added lead-source and offer-code attribution to the quote payload and notification email.
- Updated page metadata, structured data, `llms.txt`, and sitemap modification dates.
- Removed the nested main landmark from the design page and loaded the shared responsive site shell.
- Verified the production build and a mocked quote-notification attribution test.

### Batch 3 — Municipal Guidance Correction (July 21, 2026)

- Replaced the copied, incorrectly structured bylaw page with a focused GTA property-planning guide using one main landmark and the shared responsive site shell.
- Removed blanket statements about permission, permits, soft landscaping, turf friendliness, and bypassing driveway restrictions.
- Added cautious, municipality-specific guidance for Toronto, Vaughan, Brampton, and Mississauga with direct official sources and a July 21, 2026 verification date.
- Added a property-specific disclaimer and pre-construction checks for zoning, grading, drainage, utilities, easements, conservation controls, and private-property rules.
- Updated the four municipal FAQ answers and their FAQPage structured data so the visible and machine-readable guidance agree.
- Added the guide to `llms.txt`, refreshed sitemap dates, and verified the production build, JSON-LD parsing, landmark structure, and prohibited-phrase scan.
- Established a quarterly municipal-content review cadence for January, April, July, and October, plus an additional review before any municipality-specific campaign launches.

### Batch 4 — High-Risk Claims Containment, Part 1 (July 21, 2026)

- Removed the expired January 31 winter promotion, offer code, unsupported "Mississauga's #1" ranking, zero-maintenance-cost claim, and unverified testimonial/video control from the Mississauga page.
- Replaced the warranty page's unsupported fixed term, "ironclad/no loopholes," freeze-thaw guarantee, and five-day response promise with a clear documentation process that separates manufacturer product coverage from YardGuard workmanship terms.
- Removed unsupported package price ranges, fixed ROI/savings calculations, financing examples, price-lock absolutes, and fixed warranty terms from the Products page and its structured data.
- Rewrote FAQ pricing, payback, drainage, heat, environmental, pet/child safety, PFAS, lifespan, winter-performance, and warranty answers to avoid unverified absolutes and point customers to product- and project-specific documentation.
- Removed placeholder analytics from the four pages touched in this batch and replaced retired design-visualization CTAs with working consultation routes.
- Updated `llms.txt` and sitemap dates to match the safer public pricing and warranty position.
- Verified the production build, JSON-LD parsing, one-main structure, and full visible/schema FAQ question alignment.

### Batch 5 — Core Lead-Path Claims Cleanup (July 21, 2026)

- Removed unverified review ratings, review counts, experience, project-count, fixed warranty, and PFAS-guarantee trust signals from the homepage and removed the corresponding aggregate-rating schema.
- Replaced homepage pet-safety, appearance, and ROI/payback absolutes in both visible FAQ content and FAQPage structured data.
- Removed the homepage's unverified customer review strip while retaining the route to the project gallery for a later authenticity review.
- Rewrote the How It Works page around the real consultation, site review, itemized proposal, scheduled installation, and final walkthrough workflow.
- Removed design-visualization, fixed completion-time, no-hidden-cost, satisfaction-guarantee, and conflicting 10/15-year warranty promises from the process page.
- Replaced quote-page experience, warranty, price-lock, and hidden-fee trust claims with neutral, verifiable process statements.
- Removed placeholder analytics from the process page, corrected its metadata/social image, refreshed sitemap dates, and preserved the working quote handoff.
- Verified the production build, JSON-LD parsing, one-main structure, and exact homepage FAQ/schema question alignment.

### Batch 6 — Pet Safety and Company Trust Cleanup (July 21, 2026)

- Replaced the Pets page's nested-main, copied About metadata, fake testimonials, and unsupported PFAS, non-toxic, drainage-rate, antimicrobial, odour, digging, and cooling claims.
- Added practical pet-area guidance covering site drainage, cleaning routines, heat precautions, product documentation, and the limits of general safety claims.
- Replaced the About page's unverified experience, project volume, rating, warranty, membership, education, insurance, WSIB, named-team, start-time, and visualization claims.
- Added a transparent contractor due-diligence note that asks customers to review current, project-relevant documentation instead of relying on undated badges.
- Corrected canonical/hreflang, breadcrumbs, social metadata, public image URLs, machine-readable page descriptions, and campaign-source quote links on both pages.
- Updated `llms.txt` and sitemap dates, then verified the production build, JSON-LD, internal links, and one-main structure.

### Batch 7 — Gallery and Partner Content Cleanup (July 21, 2026)

- Removed Gallery's inert View Full Story and Load More controls, inaccurate "10 of 50+" count, unverified testimonial, unsupported antimicrobial labels, retired design CTA, and placeholder analytics.
- Replaced the aggressive partner-comparison page and its invented lifecycle cost, labour savings, PFAS, odour, fixed warranty, and freeze-thaw claims with a neutral shared-decision guide.
- Connected the Partner Program hero and final CTA to the working quote flow with `source=partner-program` attribution.
- Removed the Partner Program's 48-hour guarantee, unverified testimonial/video control, experience, project-count, membership, certification, warranty, and 3D-design claims.
- Removed the last active placeholder analytics instance from the Accessibility Statement page.
- Corrected social images and page metadata, refreshed sitemap dates, and verified the production build, JSON-LD, one-main structure, and targeted claim/control scans.

### Batch 8 — Owned Icon Runtime (July 21, 2026)

- Added an exact local Lucide dependency and bundled the 38 icons used by active public pages through the shared main module.
- Removed every active public-page reference to the unavailable external Lucide CDN.
- Removed duplicate inline icon initializers and corrected the broken `cide.createIcons()` Products-page call by eliminating it.
- Preserved dynamic quote-form icon rendering through a small compatibility wrapper backed by the owned icon bundle.
- Removed the obsolete `fix_lucide.js` repair helper.
- Verified the production build, confirmed complete icon-name coverage, and scanned active pages for external Lucide, typo, and placeholder analytics references.

### Batch 9 — Quote Validation and Safe Local Development (July 21, 2026)

- Added server-side payload-size, required-field, email, phone, Canadian postal code, field-length, enum, and project-type validation.
- Added an application-level allowed-origin check for browser submissions and retained explicit method handling.
- Added a generated lead ID to successful responses, notification subjects, and notification content; durable persistence and idempotency still require a datastore.
- Removed stale numeric package ranges from the quote form so it matches the itemized site-quote position used elsewhere.
- Added browser autocomplete, length, phone, and postal-code constraints that mirror backend rules.
- Made the production function URL conditional on the production host; local Vite development now uses a built-in `/api/quote` mock that never emails owners.
- Converted the standalone local function helper and test harness to dry-run email behavior.
- Replaced the intentionally failing test script with five mocked API tests covering valid leads, origin rejection, contact/enum validation, postal/payload validation, and honeypot handling.
- Verified `npm test`, the production build, a live local mock submission returning HTTP 201 and a `local-*` lead ID, and diff formatting.

### Batch 10 — Supported Runtime and Dependency Health (July 21, 2026)

- Upgraded the build system from Vite 7.3.1 to exact Vite 8.1.5, replacing the vulnerable Rollup/esbuild chain with the current Rolldown-based toolchain and patched Picomatch and PostCSS releases.
- Removed the unused PostgreSQL client dependency left behind by the retired Supabase integration.
- Moved the DigitalOcean function runtime from Node.js 18 to Node.js 24 and added compatibility for both current DigitalOcean HTTP events and legacy OpenWhisk request fields.
- Pinned the deployable Node.js 22.23.1 LTS release through `.nvmrc` and `package.json`, and aligned the Node type definitions.
- Verified the official Node.js and DigitalOcean runtime support documentation on July 21, 2026.
- Verified zero dependency vulnerabilities, six mocked quote API tests, the full production build, and diff formatting; the release checks also pass specifically under Node.js 22.23.1 LTS.

### Batch 11 — Lead-Path Accessibility and FAQ Navigation (July 21, 2026)

- Hid collapsed homepage and FAQ accordion answers from the accessibility tree while preserving synchronized `aria-expanded` and `aria-controls` states.
- Added accessible names to icon-only footer social links across pages that use the shared site module.
- Added visible keyboard focus treatment to the quote form's custom package radios and project-type checkboxes.
- Associated quote-form validation messages with their fields, exposed invalid state with `aria-invalid`, and replaced the blocking submission alert with a focused inline alert region.
- Added missing city and Canadian postal-code error messages and retained appropriate contact and address autocomplete tokens.
- Removed the unsupported 24-hour response promise from quote-form help and success copy.
- Made FAQ categories a horizontally scrollable control on phones and synchronized the active link, `aria-current`, URL hash, clicks, and page scroll position.
- Added a shared reduced-motion stylesheet and motion-aware scripted scrolling for all pages using the main site module.
- Verified six API tests, the production build, diff formatting, and live desktop/mobile browser checks for accordion state, accessibility-tree hiding, form error focus, social-link names, FAQ overflow/hash/scroll synchronization, and reduced motion.

### Batch 12 — Accessible Sliders and Automated Quality Gates (July 21, 2026)

- Consolidated homepage and Mississauga comparison behavior into the shared slider implementation and removed the Mississauga page's duplicate mouse/touch script.
- Added keyboard control, slider roles, names, value ranges, live value text, and vertical-touch-scroll preservation to the Mississauga comparison.
- Rebuilt all Gallery before/after controls as focusable keyboard and pointer sliders, removed the pointer-following/touch-blocking inline implementation, and added visible focus treatment.
- Replaced Vite's automatic root-HTML discovery with a reviewed 17-page public allowlist shared by the build and tests.
- Added structural tests for the public allowlist, one-main landmarks, H1 presence, local links, fragments, images, source sets, and JSON-LD parsing.
- Added 21 Playwright tests covering every public page, runtime/console health, mobile navigation, FAQ accordions and categories, homepage/Mississauga/Gallery sliders, inline form validation, and a successful local quote submission that cannot send email.
- Added a Node.js 22 LTS GitHub Actions quality workflow for every push and pull request, plus a monthly scheduled dependency audit; CI runs install, audit, unit/integrity tests, production build, and Chromium browser tests.
- Verified 9 API/integrity tests, 21 browser tests, zero dependency vulnerabilities, the production build, and diff formatting.

### Batch 13 — Quote Retry and Abuse Guardrails (July 21, 2026)

- Added a client-generated idempotency key to each quote attempt; the function
  replays the original lead ID for retries and rejects reuse with different
  form data. The current cache and in-flight lock are bounded and warm-instance
  only until a durable lead store/outbox is selected.
- Added bounded per-client-address rate limiting with `Retry-After` responses,
  configurable through `QUOTE_RATE_LIMIT_MAX` and
  `QUOTE_RATE_LIMIT_WINDOW_MS`; the existing honeypot remains in place.
- Added notification-recipient validation so malformed production mailbox
  configuration fails safely before a provider call.
- Documented the production mailbox release test, reply-path check, inbox
  ownership/SLA, and the limits of local-only retry/rate controls in
  `functions/README.md` and `.env.example`.
- Verified 18 Node/integrity tests, 22 browser tests, and the production build. Durable lead
  persistence, queue/outbox retries, bounce alerts, and the real mailbox
  delivery confirmation remain open follow-up work.

### Batch 14 — Commercial Claims Substantiation Register (July 21, 2026)

- Added `COMMERCIAL_CLAIMS_REGISTER.md`, a single register for trust, product,
  environmental, safety, drainage, heat, warranty, service-level, and package
  descriptor claims.
- Mapped each P0.5 claim area to the active public-page position, a status, the
  exact evidence needed, an accountable owner, and a next action.
- Recorded qualified interim wording and a workflow that keeps visible copy,
  metadata, JSON-LD, FAQ schema, `public/llms.txt`, proposals, and sales scripts
  synchronized when evidence is approved or expires.
- Confirmed that the repository does not contain current review exports,
  project-count records, insurance/WSIB/membership proof, SKU-level supplier or
  laboratory reports, or the actual manufacturer and YardGuard warranty terms;
  the affected P0.5 checkboxes therefore remain open.

### Batch 15 — Deployment SHA and Release Verification (July 21, 2026)

- Replaced `deploy.sh`'s auto-commit and unconditional success message with a
  clean-main-branch release gate that runs tests/build checks, pushes the exact
  reviewed commit, and verifies the remote branch resolves to that SHA.
- Added `dist/deployment.json` to every production build with a schema version,
  public-page count, build timestamp, and normalized source commit SHA.
- Added a distribution verification gate and a sitemap-driven HTTP smoke test
  that check every public URL, HTML landmarks, and the deployed SHA manifest.
- Updated GitHub Actions with cancellation of superseded runs, read-only
  permissions, an exact-SHA build, distribution verification, and a retained
  validated build artifact for deployment handoff.
- Verified the production build, distribution manifest checks,
  shell syntax, and the expected refusal when deployment is attempted from a
  non-main or dirty branch.

### Batch 16 — Claims Source, Quote Abuse Controls, and Release Baseline (July 21, 2026)

- Added `COMMERCIAL_SOURCE_OF_TRUTH.md` for the single public pricing, cost-
  comparison, warranty, financing, and change-control position, and aligned
  `public/llms.txt` with that policy.
- Added static deployment headers for HSTS, content-type sniffing protection,
  strict-origin referrer handling, and disabled camera/microphone/location
  permissions; CSP remains gated until inline code is migrated.
- Added non-visual integrity checks for image alt text, named buttons, duplicate
  IDs, and the deployment-header baseline; Products comparison rows now expose
  a caption plus column and row scopes.
- Added `LOCAL_DEVELOPMENT.md` documenting the no-login Vite workflow and the
  dry-run function helper; local quote submissions remain email-free.
- Added build-size guardrails for every public HTML page and the compiled
  JavaScript/CSS totals, wired into CI as `npm run test:performance`.
- Added structured-data shape checks for schema.org contexts, declared types,
  FAQ answers, and breadcrumb lists.
- Removed dormant analytics calls and the placeholder tracking stub so no
  analytics provider is contacted until a consent-aware implementation is
  deliberately configured.
- Added bounded warm-instance quote idempotency replay/locking, per-client
  rate limiting, recipient configuration validation, and a production mailbox
  release checklist. These controls do not replace durable persistence,
  queueing, or a managed bot challenge.
- Verified 18 Node tests, 22 browser tests, the distribution and performance
  gates, and the
  production build.

### Batch 17 — Learning Centre Sample (July 21, 2026)

- Added a clean Learning Centre hub at `learn.html` without changing the
  existing homepage layout or primary conversion flow.
- Added three sample long-form guides covering artificial turf fundamentals,
  base and drainage, and transparent cost planning.
- Added a reusable article/card design system in `assets/css/learn.css`, with
  breadcrumbs, reading metadata, tables, related guides, source-aware notes,
  and consultation CTAs.
- Added the four pages to the reviewed public-page allowlist, sitemap, and
  `public/llms.txt`, plus a low-visibility homepage footer link.
- Added a compact “Learn before you choose” bridge to `products.html` so the
  learning library is discoverable at the decision point without expanding the
  package cards or changing the page’s visual hierarchy.
- Verified 22 public pages in the build, 27 browser tests, integrity checks,
  distribution checks, and performance budgets.

### Batch 18 — GTA Homeowner Learning Library (July 21, 2026)

- [x] Added nine focused guides for the questions most Mississauga and GTA homeowners ask before committing: municipal planning/drainage, pets and children, maintenance and repairs, heat, installation, backyard design, winter, alternatives, and contractor/warranty due diligence.
- [x] Added a dedicated GTA homeowner library section to `learn.html` with direct links and reading-time labels.
- [x] Re-pointed the topic map to the dedicated articles so visitors can browse by question instead of jumping into one long page.
- [x] Added the new guides to the public-page allowlist, sitemap, and `llms.txt` resource index.
- [x] Grounded local planning content in current City of Mississauga and Peel Region drainage/property guidance and linked the official sources in the guide.
- [x] Kept health, product, warranty, municipal, and lifespan claims scoped with source links, limitations, and exact-SKU/documentation prompts.
- [x] Verified 31 public pages in the build, 36 browser tests, content integrity, distribution checks, and performance budgets.

### Batch 19 — Learning Centre Sitewide Navigation (July 21, 2026)

- [x] Added a visible `Learn` link to the primary navigation on every public page, including the legal pages.
- [x] Added `Learning Centre` footer links where the page has a standard footer.
- [x] Verified the complete 31-page build and all 36 browser tests after the navigation update.

### Batch 20 — Authoritative Technical Learning Library (July 21, 2026)

- [x] Added ten expert-level resources covering turf manufacturing, product specifications, infill systems, testing and standards, health and safety evidence, environmental lifecycle, installation quality control, product comparison, a searchable 70+ term glossary, and public editorial standards.
- [x] Expanded the base and drainage guide with surface, vertical, lateral, and overflow flow paths; site infiltration versus outlets; subgrade, aggregate, geotextile, freeze-thaw, commissioning, and failure diagnosis.
- [x] Expanded the GTA planning guide with an official-source municipality matrix for Mississauga, Brampton, Toronto, Oakville, Burlington, Milton, Caledon, Vaughan, Richmond Hill, and Markham, plus conservation-authority checks.
- [x] Added source-scoped evidence boxes, technical system diagrams, comparison tables, decision checklists, and a printable product-and-quote worksheet while preserving the existing clean visual system.
- [x] Added client-side search to the Learning Centre and glossary, including live result announcements and keyboard-accessible native controls.
- [x] Corrected reading-time labels to match actual article length instead of overstating the depth of shorter guides.
- [x] Added all new resources to the reviewed page registry, XML sitemap, and `llms.txt` content index.
- [x] Verified 41 public pages, 18 integrity/unit tests, 49 browser tests, the production build, distribution checks, and performance budgets.

### Batch 21 — Local FAQ Runtime Recovery (July 21, 2026)

- [x] Diagnosed FAQ clicks failing locally as a stale pre-upgrade Vite browser client, not an accordion markup or content defect.
- [x] Restarted the validated YardGuard development server on `127.0.0.1:5173`; the replacement client loads without unresolved build placeholders.
- [x] Confirmed all 29 FAQ questions open in a fresh preview and documented the required restart after Vite or dependency updates in `LOCAL_DEVELOPMENT.md`.

### Batch 22 — FAQ Accuracy and Claims Review (July 21, 2026)

- [x] Audited all 29 visible FAQ answers against current primary health, environmental, consumer-protection, utility-locate, drainage, and municipal sources.
- [x] Replaced unsupported or overly broad claims about pet odour, digging resistance, child safety, installation duration and excavation depth, stain solvents, maintenance, drainage, and seamless repairs with evidence-informed, project-specific guidance.
- [x] Added the practical limitations homeowners need before deciding: fall-protection design for play equipment, hot-surface precautions, PFAS documentation limits, product-specific infill review, lifecycle trade-offs, drainage design, Ontario One Call, written contracts, estimate changes, and exact warranty terms.
- [x] Corrected GTA planning guidance for Toronto, Mississauga, Brampton, Vaughan, and Richmond Hill, including the conflict between Vaughan's published FAQ and zoning-by-law text and Richmond Hill's appealed comprehensive zoning by-law.
- [x] Removed unsupported universal installation-day claims from the Mississauga, Products, and Partner Program pages and aligned the commercial claims register with project-specific scheduling.
- [x] Synchronized every visible FAQ question and answer with the `FAQPage` structured data and added an automated regression test that requires exact content parity.
- [x] Expanded browser coverage to exercise every FAQ accordion, not only a sample, and retained clear source and address-specific verification prompts where no honest universal answer exists.
- [x] Verified 19 integrity/unit tests, all 49 browser tests, the 41-page production build, and the live local FAQ response after the review.

### Batch 23 — Desktop Before/After Slider Recovery (July 21, 2026)

- [x] Diagnosed the Mac desktop failure as pointer-active hero text sitting above the comparison slider in a separate stacking layer, while the mobile layout moved the knob clear of that content.
- [x] Routed hero dragging through the common hero surface while preserving links, buttons, form controls, and the trust bar as normal interactive content.
- [x] Disabled native photo dragging and text selection that can interrupt comparison movement in desktop browsers.
- [x] Removed unnecessary pointer interception from hero headlines and descriptions on the homepage, Mississauga, and Partner Program pages.
- [x] Connected the previously static-looking Partner Program comparison to the shared accessible slider behavior.
- [x] Made Gallery comparisons draggable from the complete image surface instead of relying on a three-pixel divider and retained pointer capture when the cursor leaves the handle.
- [x] Added desktop mouse hit-testing and drag regression coverage for the homepage, Mississauga, Partner Program, and Gallery before/after controls, while retaining keyboard support and ARIA state.
- [x] Verified 19 integrity/unit tests, the 41-page production build, clean diffs, test syntax, and a healthy local homepage response.
- [ ] Confirm the new real-pointer regression in an available Mac browser session; the integrated visual browser was unavailable during this batch.

### Batch 24 — DigitalOcean Build Recovery (July 22, 2026)

- [x] Confirmed from the failed build log that DigitalOcean could not resolve the unpublished Node.js requirement `>=24.18.0 <25` and stopped before dependency installation.
- [x] Pinned the project, `.nvmrc`, type definitions, and lockfile to the published Node.js 22.23.1 LTS runtime supported by the platform buildpack.
- [x] Regenerated the dependency lockfile with Node.js 22.23.1 and npm 10.9.8 so a clean `npm ci` succeeds in the deployment runtime.
- [x] Reproduced the install, post-install build, 19 integrity/unit tests, 41-page production build, distribution verification, and performance budgets using the exact deployment runtime.
- [ ] Push the runtime correction to GitHub `main` and confirm the replacement DigitalOcean deployment succeeds.

## P0 — Immediate Security, Legal, and Lead Protection

### P0.1 Contain the exposed database credential

- [x] Rotate/revoke the PostgreSQL credential found in tracked repository history — satisfied by permanent deletion of the associated Supabase project and APIs.
- [x] Audit database authentication, query, storage, and administration logs for unauthorized access — closed per owner direction because the retired project is gone.
- [x] Remove the plaintext credential and obsolete database repair scripts from the working tree.
- [ ] Purge the credential from all Git branches, tags, forks, pull requests, and cached artifacts.
- [ ] Coordinate any required history rewrite before force-pushing shared branches.
- [ ] Enable GitHub secret scanning and push protection.
- [ ] Confirm no other secrets exist in tracked files or Git history.

**Done when:** the old credential no longer works, the exposure has been reviewed, repository scans are clean, and preventive controls are enabled.

**Current status:** Active-risk containment is complete. The retired credential remains visible in historical commits but cannot access the deleted project. History cleanup and GitHub security controls remain optional hardening tasks.

### P0.2 Audit or retire the legacy Supabase project

- [x] Determine whether the Supabase project is still used by any production workflow — owner confirmed it is not.
- [x] Review Row Level Security, RPC permissions, storage policies, and anonymous access — closed as not applicable because the project is deleted.
- [x] Verify that anonymous users cannot list or read customer uploads — closed as not applicable because the project and APIs are deleted.
- [x] Audit project access and storage logs — closed as not applicable for the retired project.
- [x] Rotate relevant credentials if the project remains active — not applicable because it is no longer active.
- [x] Delete the project and associated artifacts if the email-only architecture replaced it — owner confirmed deletion; repository artifacts were removed in Batch 1.

**Done when:** the active data architecture is documented and no legacy project exposes customer or operational data.

**Current status:** Complete. The owner confirmed that the Supabase project and all associated APIs are gone, and the repository no longer contains the legacy debug/upload helpers or tracked Supabase temporary metadata.

### P0.3 Repair or suspend the Free Design Visualization offer

- [x] Stop presenting a success message unless the photo and lead have been received successfully.
- [x] Choose between implementing a secure design-intake workflow or temporarily redirecting/removing the offer — the upload offer was retired in favour of an honest consultation handoff.
- [x] Submit the photo, project vision, contact fields, consent, and campaign source — closed as not applicable because the page no longer collects files or PII; campaign source now carries into the working quote flow.
- [x] Validate JPG, PNG, and HEIC uploads with a 10 MB maximum — closed as not applicable because uploads are no longer offered.
- [x] Persist the lead before triggering notifications — tracked under P1.1 for the working quote system; the design page itself no longer submits leads.
- [x] Add safe retry handling, upload progress, inline errors, and delivery monitoring — upload-specific work is no longer applicable.
- [x] Make the upload control keyboard accessible and technically enforce required fields — the inaccessible upload control was removed.
- [x] Update the progress indicator from three steps to the actual number of steps — the nonfunctional multi-step form was removed.
- [x] Add the real workflow to the privacy policy and retention schedule — no design-page data or photo collection remains to disclose.

**Done when:** the site either provides a verified secure upload workflow or makes no upload/receipt claim and sends visitors through a truthful working lead path.

**Current status:** Complete using the approved interim approach. The public page no longer claims to upload or receive photos; it explains the consultation process and hands visitors to the working quote form. Any future upload feature must be treated as a new, secure capability.

### P0.4 Correct municipal bylaw content

- [x] Remove statements such as "100% allowed," "turf counts as soft landscaping," "turf-friendly," and "bypasses" restrictions.
- [x] Rewrite Toronto guidance using current City of Toronto zoning and artificial-turf guidance.
- [x] Rewrite Vaughan guidance using the current City of Vaughan zoning FAQ.
- [x] Rewrite Brampton and Mississauga guidance using current municipal sources.
- [x] Add direct primary-source links, verification dates, and property-specific disclaimers.
- [x] Ensure the FAQ, dedicated bylaw page, schema, and machine-readable content say the same thing.
- [x] Establish a recurring review schedule for municipal content — January, April, July, and October, plus before municipality-specific campaigns.

**Done when:** every legal statement is sourced, current, consistent, and reviewed by a qualified Ontario professional where necessary.

**Current status:** Public content remediation is complete and uses official primary sources without offering blanket approvals. A qualified Ontario professional should review any future copy that interprets municipal law beyond these source-backed summaries.

### P0.5 Create a commercial-claims substantiation register

- [ ] Document approved evidence for review rating/count, project count, experience, insurance, WSIB, and memberships.
- [ ] Document supplier SKUs, laboratory reports, and definitions supporting PFAS-free, lead-free, antimicrobial, drainage, heat, and safety claims.
- [ ] Obtain the actual manufacturer warranty and YardGuard workmanship warranty.
- [x] Separate manufacturer coverage from installation/workmanship coverage on the public warranty page; the actual documents still need to be obtained and registered.
- [ ] Verify Price-Lock, freeze-thaw, response-time, and satisfaction promises against contracts and operating capacity.
- [x] Remove or qualify "Mississauga's #1," "completely non-toxic," "no loopholes," and other unsupported absolutes from active public pages.

**Done when:** every prominent factual claim maps to current evidence and approved website wording.

**Current status:** A working register and evidence-intake workflow now live in
`COMMERCIAL_CLAIMS_REGISTER.md`. Public copy remains qualified or held where
the repository lacks proof. Collect and approve the listed records before
checking the evidence-dependent rows above.

### P0.6 Establish one pricing, warranty, financing, and ROI source of truth

- [x] Reconcile Easy Lawn pricing: `$10–12/sq. ft.` versus `$12–14/sq. ft.` — both unsupported ranges were removed; public copy now uses an itemized site quote.
- [x] Reconcile 10-year and 15-year warranty references — fixed public terms were withdrawn pending the actual product and workmanship documents.
- [x] Reconcile 3–5-year and 5–7-year payback claims — unsupported universal payback claims were removed.
- [x] Reconcile 200+ annual labour hours with 800 hours over 15 years — both unsupported labour-savings claims were removed.
- [x] Replace `$0 maintenance` with truthful care guidance; optional service pricing still needs an approved source.
- [x] Publish the assumptions behind natural-grass and artificial-turf cost comparisons — documented in `COMMERCIAL_SOURCE_OF_TRUTH.md`; a customer-facing calculator remains future work.
- [x] Remove financing examples until the lender, APR, term, eligibility, and total cost are available.
- [x] Update visible copy, metadata, JSON-LD, FAQ schema, quote choices, and `llms.txt` from the approved data — the current approved position is property-specific pricing and written terms; future numeric evidence must update all surfaces together.

**Done when:** customers and search engines see one consistent set of approved commercial terms.

## P1 — Revenue Path and Production Reliability

### P1.1 Make the quote pipeline durable and abuse-resistant

- [ ] Persist each valid lead before sending email notifications.
- [x] Return a stable lead ID and use a bounded warm-instance idempotency lock/cache to prevent duplicate retries; durable idempotency remains open.
- [ ] Add a notification queue/outbox, retries, bounce handling, and failure alerts.
- [x] Enforce allowed origins at the function handler before processing browser submissions; the hosting platform's response headers remain platform-managed.
- [x] Add bounded per-client-address rate limiting and retain the honeypot; a managed edge limiter or bot challenge remains future hardening.
- [x] Validate email, phone, postal code, field lengths, enum values, and payload size server-side.
- [x] Align required fields between the UI and backend.
- [ ] Confirm the production mailbox receives, monitors, and responds to leads.
- [x] Make local development use a mock/dev endpoint instead of emailing production owners.

**Done when:** a lead survives email-provider failure, abuse controls work, and local testing cannot contact real customers or owners accidentally.

### P1.2 Establish a reliable deployment workflow

- [ ] Choose one canonical public hosting environment.
- [ ] Merge the audited branch through the normal review process.
- [ ] Deploy the exact intended Git SHA through CI.
- [x] Replace or correct `deploy.sh`, which can report success without deploying the current commit.
- [x] Add sitemap-driven post-deployment smoke tests and a build-distribution gate; browser tests continue to cover critical interactions.
- [ ] Configure `www.ygtoronto.com` and redirect it to the canonical apex domain.
- [ ] Ensure any preview intended for customers opens without authentication.
- [ ] Purge CDN HTML after release while retaining immutable caching for fingerprinted assets.

**Done when:** production identifies the deployed SHA and automated checks prove the current fixes are publicly available.

### P1.3 Repair site-wide icons and runtime errors

- [x] Replace the unavailable Lucide CDN version by bundling icons locally.
- [x] Correct the `cide.createIcons()` typo on the Products page.
- [x] Remove duplicate and unsafe direct icon initialization calls.
- [x] Verify icon coverage without third-party icon networks; browser-level visual confirmation remains part of release QA.
- [x] Confirm the browser console is clean on every public page — 22 Playwright tests loaded all 17 public pages with page-error and console-error capture.

**Done when:** all icons render from owned assets and no public page has runtime errors.

### P1.4 Repair broken CTAs and controls

- [x] Connect the Partner Program hero CTA to a real partner application or partner-specific contact route — it now uses the working quote route with partner source attribution.
- [ ] Capture partner intent, source, and relevant qualification data.
- [x] Implement or remove Gallery "View Full Story" — removed.
- [x] Implement or remove Gallery "Load More Projects" — removed with the inaccurate project-count claim.
- [x] Implement or remove both "Watch Their Story" controls — removed from Gallery/Mississauga and Partner Program content.
- [x] Replace "Download Partner Comparison Sheet (PDF)" with a real PDF or rename it as an HTML page — renamed as an HTML decision guide.
- [x] Remove or replace the expired January 31 promotion — removed from the Mississauga page.
- [ ] Capture future promotion codes in the lead record.

**Done when:** every visible button has a truthful, tested result.

### P1.5 Rebuild gallery proof with authentic projects

- [ ] Remove duplicate image pairs presented as different locations or project types.
- [ ] Verify customer permission for every displayed project and testimonial.
- [ ] Correct each project's city, package, size, duration, challenge, and outcome.
- [ ] Replace the inaccurate "10 of 50+" count.
- [ ] Add real case-study destinations where promised.
- [ ] Link verified reviews to their source where permitted.

**Done when:** every gallery claim is authentic, internally consistent, and permission-backed.

### P1.6 Reduce page weight and layout instability

- [ ] Set responsive image `sizes` to actual rendered card widths.
- [ ] Generate smaller AVIF/WebP variants for large images.
- [ ] Lazy-load below-fold media.
- [ ] Add intrinsic `width` and `height` to images.
- [ ] Compress and resize the social image to approximately 1200×630.
- [ ] Set one-year immutable caching for hashed assets and short-lived/purgeable caching for HTML.
- [ ] Define and enforce page-weight and Core Web Vitals budgets in CI.
- [ ] Test the homepage, gallery, products, and quote pages on throttled mobile connections.

**Done when:** critical pages meet the agreed performance budgets without visible quality loss or layout shifts.

### P1.7 Implement trustworthy analytics

- [x] Remove all `G-XXXXXXXXXX` placeholders from active public pages.
- [x] Configure one environment-driven analytics implementation or remove analytics until ready — dormant tracking calls and the placeholder strategy stub were removed pending consent-aware analytics.
- [ ] Add appropriate consent and privacy handling.
- [ ] Verify quote success, design-intake success, partner applications, calls, emails, and key CTA events.
- [ ] Exclude internal and test traffic.
- [ ] Connect Search Console and establish baseline organic and conversion metrics.
- [ ] Create a funnel dashboard and alert on sudden submission drops.

**Done when:** test conversions appear exactly once and decision-makers can measure the full lead funnel.

### P1.8 Correct SEO, social, and structured-data errors

- [ ] Move stable social/schema images into a public, non-fingerprinted asset location.
- [ ] Repair all Open Graph, LocalBusiness, and Product image URLs returning 404.
- [ ] Represent per-square-foot product pricing correctly or remove invalid offer markup.
- [ ] Correct copied `about.html` hreflang and breadcrumb data on Pets, Warranty, Bylaws, and Partner Comparison.
- [ ] Use one shared organization entity ID, an owned logo, and consistent NAP/service areas.
- [ ] Standardize homepage links on `/` instead of mixing `/` and `/index.html`.
- [ ] Add complete Twitter/social metadata, favicons, and a branded 404 page.
- [ ] Generate sitemap dates from real page changes.

**Done when:** social previews render, schema validation has no material errors, and no crawlable metadata asset returns 404.

## P2 — Accessibility, Legal, Architecture, and Sustainable Growth

### P2.1 Complete accessibility remediation

- [ ] Use exactly one `<main>` landmark on every page.
- [ ] Consolidate and correctly style the mobile navigation toggle across all pages.
- [x] Add accessible names to icon-only social links.
- [x] Make Gallery and Mississauga comparison sliders keyboard operable with correct ARIA.
- [x] Prevent sliders from trapping vertical touch scrolling.
- [x] Add visible `:focus-visible` styling to custom checkboxes and radio controls.
- [x] Associate form errors using IDs and `aria-describedby`.
- [x] Replace blocking alerts with focused inline status/error regions.
- [x] Add appropriate autocomplete tokens.
- [x] Hide collapsed accordion content from the accessibility tree.
- [x] Make FAQ category navigation usable on phones and synchronize active state with scroll/hash.
- [ ] Correct known contrast failures and responsive inline grids.
- [x] Add captions, column scopes, and row scopes to the Products comparison table.
- [x] Respect reduced-motion preferences in CSS and scripted scrolling.
- [ ] Qualify the accessibility statement until testing supports conformance claims.

**Done when:** keyboard, screen-reader, zoom, contrast, reduced-motion, and mobile testing supports WCAG 2.2 AA claims.

### P2.2 Replace generic legal documents

- [ ] Identify the operating legal entity and Ontario/Canadian governing jurisdiction.
- [ ] Document DigitalOcean, Resend, Cloudflare, analytics, and any CRM/storage processors.
- [ ] Explain collection purposes, retention, security, cross-border processing, access, correction, withdrawal, and deletion rights.
- [ ] Explain photo-upload handling and project-photo permissions.
- [ ] Add clear marketing opt-in and unsubscribe handling.
- [ ] Define estimates, deposits, cancellations, change orders, financing, warranty relationships, and design ownership.
- [ ] Add an explicit privacy notice next to form submission controls.
- [ ] Obtain Ontario-focused PIPEDA, CASL, consumer-claims, warranty, and financing review.

**Done when:** counsel-approved documents accurately describe the real business and technical workflows.

### P2.3 Consolidate the site architecture

- [ ] Move shared header, footer, navigation, metadata, analytics, CSS, and scripts into templates/components.
- [x] Replace Vite's dynamic root-HTML discovery with an explicit public-page allowlist.
- [ ] Remove duplicated inline scripts and event-handler attributes.
- [ ] Centralize approved prices, warranties, claims, contact information, and service areas.
- [ ] Archive obsolete fix scripts, backups, screenshots, generated artifacts, and strategy documents outside the public repository.
- [ ] Move private operational documentation to a private repository where appropriate.
- [ ] Reduce unused source-media storage and document the image-generation pipeline.

**Done when:** changing shared content in one place updates all intended pages without publishing diagnostics or internal files.

### P2.4 Add automated quality gates

- [x] Replace the intentionally failing test script with real commands.
- [x] Add mocked unit and integration tests for the active quote endpoint; the retired design upload has no endpoint to test.
- [x] Ensure automated tests never send real email.
- [x] Add browser smoke tests for every public page and critical CTA.
- [x] Test desktop/mobile navigation, sliders, accordions, filters, forms, and error states.
- [x] Add internal-link and fragment validation.
- [x] Add basic HTML semantics validation for image alt text, button names, duplicate IDs, and JSON-LD parsing.
- [ ] Add HTML and structured-data validation.
- [ ] Add automated accessibility checks plus a manual QA checklist.
- [ ] Add performance budgets and Lighthouse-style checks.
- [ ] Block deployment when critical tests fail.

**Done when:** CI provides repeatable evidence that the public build is functional, accessible, secure, and deployable.

### P2.5 Modernize dependencies and runtime

- [x] Upgrade Vite and vulnerable Rollup, Picomatch, PostCSS, and esbuild dependencies.
- [x] Move the serverless function from Node.js 18 to a supported runtime.
- [x] Pin the supported Node version using `engines` and a version file.
- [x] Run dependency audits in CI and define an update cadence.

**Done when:** production and build tooling use supported versions with no unresolved high-severity advisories.

### P2.6 Add production security headers

- [x] Configure HSTS.
- [ ] Configure Content Security Policy, including `frame-ancestors`.
- [x] Configure `X-Content-Type-Options: nosniff`.
- [x] Configure Referrer Policy and Permissions Policy.
- [ ] Self-host scripts and fonts where practical.
- [ ] Refactor inline scripts/styles as necessary for a maintainable CSP.
- [ ] Verify headers on HTML, assets, errors, and redirects.

**Done when:** automated header tests pass and the site works under the enforced policy.

### P2.7 Resolve brand, domain, and content architecture

- [ ] Decide whether `ygtoronto.com` or `yardguardlandscaping.com` is the primary brand/domain.
- [ ] Redirect or clearly differentiate the secondary domain after reviewing backlinks, Google Business Profile, and Search Console.
- [ ] Add intentional internal links to Pets, Design, Warranty, and Bylaw pages.
- [ ] Build service architecture for Lawn Turf, Pet Turf, Putting Greens, pricing, warranty, and care.
- [ ] Create city pages only where unique local experience, project proof, reviews, and accurate guidance exist.
- [ ] Replace vague testimonials with detailed case studies.
- [ ] Add a transparent cost calculator using editable, disclosed assumptions.
- [ ] Unify the premium brand tone and remove aggressive or dismissive phrases such as "Spouse-Veto Killer."

**Done when:** one clear brand, one primary offer, authentic proof, and measurable conversion paths support organic and paid growth.

## Final Release Checklist

- [ ] All P0 tasks are complete and independently reviewed.
- [ ] Security and privacy reviews are signed off.
- [ ] All critical lead flows pass end-to-end production tests.
- [ ] Pricing, warranty, financing, and municipal content match approved source documents.
- [ ] No broken links, fragments, icons, metadata assets, or inert controls remain.
- [ ] Analytics records each test conversion exactly once.
- [ ] Accessibility and responsive testing passes on representative devices and assistive technologies.
- [ ] Performance and dependency budgets pass in CI.
- [ ] Production serves the approved Git SHA from the canonical no-login domain.

## Audit Constraints

- Search Console, Google Business Profile, CRM data, supplier certificates, warranty contracts, and analytics reports were not available during the audit.
- Claims depending on those sources should remain unverified until evidence is supplied.
- No tracked files, deployments, or customer-facing submissions were changed during the original audit.
