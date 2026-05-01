# CI/CD Gate Map — Wave 9

| Workflow | Purpose | Required before merge |
|---|---|---|
| `ci.yml` | Orchestrates repo validation, no-drift, backend, ingestion, frontend, dbt, contract, and smoke workflows. | Yes |
| `backend-tests.yml` | FastAPI tests, ruff, mypy. | Yes for backend changes |
| `ingestion-tests.yml` | Connector/normalization tests, ruff, mypy. | Yes for ingestion changes |
| `frontend-tests.yml` | React tests, typecheck, lint, build. | Yes for dashboard changes |
| `dbt-tests.yml` | dbt parse/test. | Yes for data model changes |
| `lint-typecheck.yml` | Matrix lint/typecheck for backend, ingestion, frontend. | Yes |
| `contract-tests.yml` | Shared contract/schema/API alignment. | Yes for contract-touching PRs |
| `smoke-tests.yml` | Local smoke skeleton. | Before release |
| `governance-validation.yml` | RBAC/export/audit/no-drift validation. | Yes for governance changes |
| `release-readiness.yml` | Manual or PR release readiness packet. | Before production release |

## Merge rule

No direct-to-main merge should proceed unless:
1. no-drift validation passes,
2. impacted code tests pass,
3. contract tests pass when contracts are touched,
4. QA evidence is attached for implementation waves,
5. Agent C signs off using the PR review checklist.
