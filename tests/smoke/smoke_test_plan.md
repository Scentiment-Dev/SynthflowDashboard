# Smoke Test Plan — Wave 9

## Purpose

This smoke suite verifies that the project can boot, expose core contracts, and preserve no-drift rules before deeper implementation begins.

## Local smoke sequence

1. `make validate-structure`
2. `make validate-no-drift`
3. `make validate-wave9`
4. `docker compose up --build`
5. In another terminal, set `API_BASE_URL=http://localhost:8000`
6. Run `pytest tests/smoke`

## No-drift smoke anchors

- Stay.ai remains the source of truth for subscription state, saves, cancellations, and retention outcomes.
- Shopify remains the source of truth for order/product/customer/order-status context only.
- Portal success requires confirmed portal completion, not only a link sent.
- Abandoned, unresolved, and transferred calls are not successful containment.
- Trust labels cannot be manually elevated.
- Export metadata must include filters, definitions, trust labels, freshness, formula version, owner, timestamp, fingerprint, and audit reference.
