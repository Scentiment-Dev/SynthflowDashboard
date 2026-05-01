# Contract Test Strategy — Wave 9

## Purpose

Contract tests protect the handoff between ingestion, backend, data/dbt, and frontend modules.

## Contract areas

1. Shared JSON schemas and examples in `packages/shared-contracts`.
2. Ingestion normalized events and backend event schemas.
3. Backend module summary routes and frontend API client calls.
4. Export audit metadata and dashboard export UI.
5. dbt no-drift tests and dashboard trust labels.

## Protected no-drift logic

- Synthflow can describe calls, intents, nodes, and transfers, but cannot confirm subscription save/cancel outcomes.
- Stay.ai is the source of truth for subscription save/cancel/state/retention outcomes.
- Shopify is order/customer/product/order-status context only.
- Portal link sent is not portal completion.
- Trust labels cannot be manually elevated.
- Export audit metadata must be present.

## Future expansion

When real vendor payloads arrive, add golden contract fixtures under `tests/contracts/fixtures/` and map them through ingestion normalization, API responses, and dbt models.
