# GitHub Actions Workflow Map — Wave 9

## Workflows created or hardened

- `ci.yml`
- `backend-tests.yml`
- `ingestion-tests.yml`
- `frontend-tests.yml`
- `dbt-tests.yml`
- `lint-typecheck.yml`
- `contract-tests.yml`
- `smoke-tests.yml`
- `governance-validation.yml`
- `release-readiness.yml`

## Design

The workflows are intentionally split by ownership area so Cursor agents can diagnose failures quickly:

- Agent A: backend, ingestion, dbt.
- Agent B: frontend.
- Agent C: QA, governance, contracts, smoke, release readiness.

## Cost control

The CI skeleton is path-filtered where possible. Heavy tests should remain local or manual until real implementation code needs protected automation.
