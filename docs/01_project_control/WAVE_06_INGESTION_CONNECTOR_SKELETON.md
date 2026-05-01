# Wave 6 — Ingestion and Connector Skeleton

## Status

Complete / locked.

## Goal

Create a safe ingestion-worker foundation for Synthflow, Stay.ai, Shopify,
portal events, and live-agent/RingCX events.

## Development files created or expanded

- `services/ingestion-worker/app/core/`
- `services/ingestion-worker/app/connectors/`
- `services/ingestion-worker/app/pipelines/`
- `services/ingestion-worker/app/storage/`
- `services/ingestion-worker/app/sample_payloads/`
- `services/ingestion-worker/tests/`
- `scripts/validate_wave6_ingestion_files.py`

## Acceptance criteria

- Connectors fail closed unless sample/local mode is explicitly used.
- Normalization rejects source-truth violations.
- Stay.ai is preserved as subscription outcome source of truth.
- Shopify remains order/customer/product context.
- Portal link sent is not portal completion.
- Transfers/abandoned calls are not contained success.
- Trust labels are system-calculated.
- Sample payloads exist for every source.
- Local JSONL sink, checkpoint store, dead-letter sink, and retry wrapper exist.
