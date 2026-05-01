# Repo Ownership Map

| Path | Primary Owner | Review Owner | Notes |
|---|---|---|---|
| `services/analytics-api` | Cursor Agent A | Cursor Agent C | Backend/API and source-of-truth enforcement. |
| `services/ingestion-worker` | Cursor Agent A | Cursor Agent C | Connector and normalization pipelines. |
| `data` | Cursor Agent A | Cursor Agent C | dbt, warehouse schemas, metric registry, tests. |
| `apps/dashboard-web` | Cursor Agent B | Cursor Agent C | Dashboard UI, routes, components, filters, charts, tests. |
| `packages/shared-contracts` | Cursor Agent A | Cursor Agent C | Event contracts and versioning. |
| `.github`, `tests`, `docs/10_qa_acceptance`, `docs/11_security_governance_rbac` | Cursor Agent C | AI PM | CI, QA, RBAC, export/audit, no-drift gates. |
| `project-management`, `cursor-agent-system` | AI PM | Cursor Agent C | Wave schedule, prompts, run reports, PM review. |

Major scope changes require Kevin approval through a change request.
