# Warehouse Layer

Wave 5 expands the warehouse from raw landing tables into a launch-ready analytics skeleton.

## Schemas

- `raw`: append-only or source-synced raw event tables.
- `analytics`: normalized event tables, metric snapshots, facts, marts, audit tables, and governed backfill control.
- `governance`: data quality and reprocess metadata.

## Locked Rules

- Stay.ai confirms subscription outcomes.
- Shopify confirms order context only.
- Synthflow provides journey evidence only.
- Portal completion requires confirmed completion, not link sent.
- Trust labels are system-calculated and cannot be manually elevated.
- Historical backfill is outside base launch scope unless governed through the backfill control table.
