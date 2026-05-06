# Shared Contracts

JSON schemas and examples for ingestion, warehouse, dbt, backend, and tests.

Cycle 001 adds subscription backend foundation fixtures, including:

- `schemas/subscription_analytics_response.schema.json`
- Stay.ai subscription state/action/cancellation/save examples
- Portal link-sent vs completion distinction example
- Shopify secondary-context-only subscription example

Cycle 002 expands the subscription analytics response contract to support a dashboard-facing
vertical slice with deterministic overview counts, source confirmation status, synthflow journey
status breakdown, and export/audit metadata fields (filters, metric definitions, trust/freshness,
formula version, owner, timestamp, fingerprint, and audit reference).

Cycle 007 adds a fixture-backed `subscription_business_value_response` contract for
`GET /subscriptions/business-value`, explicitly distinguishing confirmed, estimated, pending,
unknown, and blocked-by-data business-value states.
