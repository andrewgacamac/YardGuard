# YardGuard commercial source of truth

Status: working public-copy baseline; requires owner approval before any numeric
price, warranty, financing, savings, or performance claim is reintroduced.

Last reviewed: 2026-07-21

## Public pricing position

YardGuard does not publish a universal installed price, price-per-square-foot
range, financing example, guaranteed savings amount, or guaranteed payback
period. The customer-facing pages use the same position for every package:
pricing is an itemized, property-specific site quote.

The proposal should identify, as applicable:

- measured or estimated area and access assumptions;
- demolition/removal, excavation, base preparation, grading, drainage, edging,
  turf, infill, labour, cleanup, taxes, and optional work;
- selected product SKUs and supplier documentation; and
- change-order conditions and any applicable product and workmanship terms.

## Cost-comparison assumptions

Any future natural-grass comparison must show the inputs rather than present a
universal ROI result. At minimum, record the property area, installation scope,
watering and mowing frequency, local service rates, equipment and disposal,
expected ownership period, turf-care assumptions, replacement timing, taxes,
and whether the comparison includes the homeowner's time. Label estimates as
illustrative, identify the date and geography, and provide an editable way for
the customer to change assumptions.

## Warranty and financing

Public copy must distinguish the manufacturer's product warranty from any
YardGuard workmanship terms. Do not state a duration, remedy, freeze-thaw
guarantee, response-time promise, or "no loopholes" language until the exact
current documents and operating process are registered here.

Do not publish financing terms until the lender, APR, term, eligibility,
payment schedule, fees, and total cost are approved and available to customers.

## Evidence register requirements

Before a claim is promoted into page copy, add an entry to the claims register
with the claim wording, evidence owner, source document or test report, SKU or
service scope, effective/expiry date, reviewer, and approved public wording.
Unverified review counts, project counts, rankings, memberships, insurance,
WSIB status, environmental/safety claims, and testimonials remain unpublished.

## Change control

When an approved source changes, update the visible page copy, metadata,
JSON-LD, FAQ schema, quote choices, `public/llms.txt`, and sitemap metadata in
the same change. Run `npm test`, `npm run build`, and the browser smoke suite
before release.
