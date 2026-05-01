# Project Structure

This file locks the Wave 2 development-root skeleton so Cursor agents know where to work.

## Development zones

| Zone | Path | Owner | Purpose |
|---|---|---|---|
| Frontend dashboard | `apps/dashboard-web` | Cursor Agent B | React/Vite/TypeScript dashboard UI, routes, components, filters, API client, frontend tests. |
| Backend analytics API | `services/analytics-api` | Cursor Agent A | FastAPI routers, schemas, source-of-truth services, governance/export APIs, database models, backend tests. |
| Ingestion worker | `services/ingestion-worker` | Cursor Agent A | Synthflow, Stay.ai, Shopify, portal, and live-agent connector stubs plus normalization pipelines. |
| Shared contracts | `packages/shared-contracts` | Agent A + Agent C | JSON schemas, examples, and contract versioning. |
| Analytics warehouse/dbt | `data/dbt`, `data/warehouse` | Cursor Agent A | Source definitions, staging/intermediate/mart models, metric registry, SQL DDL, dbt tests. |
| CI/QA/governance | `.github`, `tests`, `docs/10_qa_acceptance`, `docs/11_security_governance_rbac` | Cursor Agent C | CI workflows, smoke tests, acceptance gates, RBAC/export/audit/no-drift controls. |
| PM and agent system | `project-management`, `cursor-agent-system` | AI PM + Cursor Agent C | Wave schedule, backlog, prompts, run reports, risk/blocker/conflict logs. |

## Wave 2 lock

Wave 2 is complete when the required development folders exist, starter files are non-empty, validation scripts pass, and the repo can be used as the actual root folder for future implementation waves.
