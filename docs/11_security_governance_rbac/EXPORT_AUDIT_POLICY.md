# Export Audit Policy

Every export must include:

1. Filters.
2. Definitions.
3. Trust labels.
4. Freshness.
5. Formula versions.
6. Owner.
7. Timestamp.
8. Fingerprint.
9. Audit reference.

An export missing one of these fields is not governance-compliant. This is enforced in:

- `services/analytics-api/app/services/export_service.py`
- `services/analytics-api/app/services/governance_service.py`
- `data/dbt/tests/assert_export_audit_fingerprint_present.sql`
- `apps/dashboard-web/src/components/governance/ExportGovernanceChecklist.tsx`
