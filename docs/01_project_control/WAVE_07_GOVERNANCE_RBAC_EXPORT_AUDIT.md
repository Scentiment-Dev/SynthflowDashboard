# Wave 7 — Governance, RBAC, Export, Audit Skeleton

## Status
Complete / locked.

## Goal
Add implementation-ready governance surfaces for explicit-deny RBAC, export audit metadata, audit logs, trust-label enforcement, and governed backfill controls.

## Development files created or updated
- `services/analytics-api/app/core/security.py`
- `services/analytics-api/app/api/dependencies.py`
- `services/analytics-api/app/api/governance.py`
- `services/analytics-api/app/api/audit.py`
- `services/analytics-api/app/api/exports.py`
- `services/analytics-api/app/schemas/governance.py`
- `services/analytics-api/app/services/governance_service.py`
- `services/analytics-api/app/services/rbac_service.py`
- `services/analytics-api/app/services/audit_service.py`
- `services/analytics-api/app/models/audit_log.py`
- `services/analytics-api/app/models/permission_policy.py`
- `services/analytics-api/app/models/trust_label_audit.py`
- `data/warehouse/schema/011_governance_rbac_audit.sql`
- `data/warehouse/seeds/permission_policy_seed.csv`
- `data/warehouse/seeds/governance_rule_registry_seed.csv`
- `data/dbt/models/marts/*governance*.sql`
- `data/dbt/tests/assert_*governance*.sql`
- `apps/dashboard-web/src/components/governance/*`

## Acceptance criteria
- RBAC is explicit-deny by default.
- Backend permission checks are server-side.
- Exports require filters, definitions, trust labels, freshness, formula versions, owner, timestamp, fingerprint, and audit reference.
- Trust labels cannot be manually elevated.
- Backfills require a governed approved change request.
- Audit evidence surfaces exist in backend, data, and frontend skeletons.
