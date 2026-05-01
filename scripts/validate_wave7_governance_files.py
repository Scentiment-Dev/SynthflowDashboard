from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = [
    'services/analytics-api/app/schemas/governance.py',
    'services/analytics-api/app/services/governance_service.py',
    'services/analytics-api/app/services/rbac_service.py',
    'services/analytics-api/app/services/audit_service.py',
    'services/analytics-api/app/api/audit.py',
    'services/analytics-api/app/api/governance.py',
    'services/analytics-api/app/models/audit_log.py',
    'services/analytics-api/app/models/permission_policy.py',
    'services/analytics-api/app/models/trust_label_audit.py',
    'services/analytics-api/tests/test_wave7_rbac_governance.py',
    'services/analytics-api/tests/test_wave7_audit_service.py',
    'data/warehouse/schema/011_governance_rbac_audit.sql',
    'data/warehouse/seeds/permission_policy_seed.csv',
    'data/warehouse/seeds/governance_rule_registry_seed.csv',
    'data/dbt/models/marts/dim_permission_policy.sql',
    'data/dbt/models/marts/dim_governance_rule_registry.sql',
    'data/dbt/models/marts/mart_export_audit_governance.sql',
    'data/dbt/models/marts/mart_rbac_audit.sql',
    'data/dbt/tests/assert_explicit_deny_permissions.sql',
    'data/dbt/tests/assert_export_audit_fingerprint_present.sql',
    'data/dbt/tests/assert_backfill_requires_governed_request.sql',
    'data/dbt/tests/assert_manual_trust_label_elevation_blocked.sql',
    'data/dbt/tests/assert_governance_rules_registered.sql',
    'apps/dashboard-web/src/components/governance/GovernanceRuleCard.tsx',
    'apps/dashboard-web/src/components/governance/PermissionMatrixTable.tsx',
    'apps/dashboard-web/src/components/governance/ExportGovernanceChecklist.tsx',
    'apps/dashboard-web/src/components/governance/AuditEvidenceTable.tsx',
]
TEXT_ANCHORS = [
    ('services/analytics-api/app/core/security.py', 'explicit deny'),
    ('services/analytics-api/app/services/governance_service.py', 'Trust labels are system-calculated'),
    ('services/analytics-api/app/services/governance_service.py', 'Historical backfill is not base launch scope'),
    ('data/dbt/tests/assert_explicit_deny_permissions.sql', 'explicit-deny'),
    ('apps/dashboard-web/src/pages/GovernancePage.tsx', 'server-side'),
]

missing = [path for path in REQUIRED if not (ROOT / path).exists()]
if missing:
    raise SystemExit('Missing Wave 7 files:\n' + '\n'.join(missing))
for path, anchor in TEXT_ANCHORS:
    text = (ROOT / path).read_text(encoding='utf-8').lower()
    if anchor.lower() not in text:
        raise SystemExit(f'Missing anchor {anchor!r} in {path}')
print('Wave 7 governance file validation passed.')
