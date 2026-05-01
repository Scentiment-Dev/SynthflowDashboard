# Local Test Matrix — Wave 9

| Gate | Command | Owner | Blocks PR? | Notes |
|---|---|---|---|---|
| Structure validation | `make validate-structure` | Agent C | Yes | Confirms required repo files exist. |
| No-drift validation | `make validate-no-drift` | Agent C | Yes | Confirms source-of-truth anchors are present. |
| Wave 8 validation | `make validate-wave8` | Agent C | Yes | Confirms Cursor agent workflow files remain intact. |
| Wave 9 validation | `make validate-wave9` | Agent C | Yes | Confirms QA/CI/CD skeleton files exist. |
| Backend tests | `make test-backend` | Agent A | Yes | FastAPI route/schema/source-truth tests. |
| Ingestion tests | `make test-ingestion` | Agent A | Yes | Connector registry, payload, and normalization tests. |
| Frontend tests | `make test-frontend` | Agent B | Yes | React rendering/API alignment tests. |
| Contract tests | `make test-contract` | Agent C | Yes | Shared schema/example and API alignment tests. |
| Smoke tests | `make smoke` | Agent C | Before release | Local stack and no-drift smoke checks. |
| dbt tests | `make dbt-test` | Agent A | Yes when dbt dependencies are installed | dbt parse/test and locked assertions. |
| Lint/typecheck | `make lint && make typecheck` | All agents | Yes | Python and TypeScript quality checks. |
| QA evidence | `make qa-evidence` | Agent C | PR artifact | Produces `.qa-evidence/qa_evidence.json`. |

## No-drift gates

Any PR that touches metrics, source logic, exports, RBAC, trust labels, containment, portal handoff, subscription outcomes, or cancellation outcomes must run no-drift validation and contract tests.
