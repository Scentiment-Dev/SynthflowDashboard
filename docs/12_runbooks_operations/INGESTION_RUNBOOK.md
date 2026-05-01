# Ingestion Runbook

## Local smoke run

```bash
cd services/ingestion-worker
python -m app.main --once --pipeline all
```

## Expected local outputs

- `.local/ingestion/checkpoints.json`
- `.local/ingestion/normalized_events.jsonl`
- `.local/ingestion/dead_letters.jsonl`

## Failure handling

1. Check dead-letter records first.
2. Confirm source-truth violations are legitimate and not code drift.
3. Do not manually elevate trust labels.
4. Do not convert portal handoff into portal completion.
5. Do not convert Synthflow retention-intent events into Stay.ai saved outcomes.

## Production hardening still required

- Real API auth for each connector.
- Pagination, rate limit, replay, and idempotency tests.
- Durable sink selection.
- Alerting on source freshness and dead-letter volume.
- Secrets management.
