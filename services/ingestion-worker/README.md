# Ingestion Worker

Wave 6 turns this service into the safe ingestion foundation for the Scentiment
Analytics Dashboard.

## Purpose

The worker collects raw events from source systems, normalizes them into stable
analytics events, and writes local JSONL output for development. Production can
replace the local JSONL sink with Postgres, S3, SQS, or another durable store.

## Sources

- Synthflow: call journey, intent, node, abandonment, transfer context.
- Stay.ai: official subscription state, cancellation, save, retention outcomes.
- Shopify: order, product, customer, fulfillment, and tracking context.
- Portal: portal link/handoff and confirmed portal completion evidence.
- Live-agent/RingCX: transfer, escalation, case, and downstream support evidence.

## No-drift rules

- Stay.ai remains source of truth for subscription outcomes.
- Shopify cannot override Stay.ai subscription state.
- Portal link sent is not portal completion.
- Transfers and unresolved/abandoned calls are excluded from containment success.
- Trust labels are system-calculated and cannot be manually elevated.

## Local run

```bash
cd services/ingestion-worker
python -m app.main --once --pipeline all
```

Outputs default to `.local/ingestion/` at the repo root.
