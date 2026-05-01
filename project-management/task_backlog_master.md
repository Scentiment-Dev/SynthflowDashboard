# Task Backlog Master

| ID | Owner | Area | Task | Priority | Acceptance |
| --- | --- | --- | --- | --- | --- |
| A-001 | Cursor Agent A | backend | Replace fixture metric service with warehouse-backed queries. | P0 | Metric definitions and module summaries query semantic/warehouse tables. |
| A-002 | Cursor Agent A | ingestion | Implement Stay.ai connector with pagination/retries/raw persistence. | P0 | Confirmed subscription outcomes land in raw/staging tables. |
| A-003 | Cursor Agent A | dbt | Build subscription and retention marts. | P0 | Save/cancel/portal metrics pass dbt tests. |
| B-001 | Cursor Agent B | frontend | Wire pages to analytics API with loading/error states. | P0 | Each page renders API-backed cards and empty states. |
| B-002 | Cursor Agent B | frontend | Improve customer journey and retention flow visuals. | P0 | Cost Too High sequence is readable with no overlap. |
| C-001 | Cursor Agent C | qa | Expand source-of-truth unit/dbt tests. | P0 | No-drift rules have automated tests where feasible. |
| C-002 | Cursor Agent C | governance | Implement server-side RBAC policy resolver. | P0 | Explicit deny tested; frontend cannot grant access. |
