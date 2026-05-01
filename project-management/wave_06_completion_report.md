# Wave 6 Completion Report — Ingestion and Connector Skeleton

## Status

Complete / locked.

## Summary

Wave 6 expanded `services/ingestion-worker` with fail-closed connector classes,
source registry, sample payload loading, normalization, retry handling,
checkpointing, local JSONL output, dead-letter output, CLI execution, validation,
and tests.

## Owner

Cursor Agent A owns the ingestion-worker implementation.

## Locked rules preserved

- Stay.ai remains source of truth for subscription save/cancel/state/retention outcomes.
- Shopify remains order/product/customer/fulfillment/order-status context.
- Portal link sent is not portal completion.
- Portal success requires confirmed portal completion.
- Synthflow cannot confirm subscription save/cancel outcomes.
- Live-agent transfer is not containment success.
- Trust labels cannot be manually elevated.

## Next wave

Wave 7 — Governance, RBAC, Export, Audit Skeleton.
