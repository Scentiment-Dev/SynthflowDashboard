from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]


def test_export_audit_flow_has_backend_data_and_frontend_surfaces():
    backend = (ROOT / "services/analytics-api/app/services/export_service.py").read_text().lower()
    frontend = (ROOT / "apps/dashboard-web/src/components/forms/ExportAuditForm.tsx").read_text().lower()
    warehouse = (ROOT / "data/warehouse/schema/004_export_audit.sql").read_text().lower()
    for anchor in ["filters", "fingerprint", "audit"]:
        assert anchor in backend
        assert anchor in frontend
        assert anchor in warehouse


def test_explicit_deny_flow_has_policy_test_and_ui_surface():
    security = (ROOT / "services/analytics-api/app/core/security.py").read_text().lower()
    dbt_test = (ROOT / "data/dbt/tests/assert_explicit_deny_permissions.sql").read_text().lower()
    governance_ui = "\n".join(path.read_text().lower() for path in (ROOT / "apps/dashboard-web/src/components/governance").glob("*.tsx"))
    assert "explicit" in security and "deny" in security
    assert "explicit" in dbt_test and "deny" in dbt_test
    assert "explicit" in governance_ui and "deny" in governance_ui
