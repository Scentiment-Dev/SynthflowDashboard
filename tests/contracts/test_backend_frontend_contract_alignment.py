from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]


def test_frontend_uses_wave3_metric_module_contract():
    api = (ROOT / "apps/dashboard-web/src/services/dashboardApi.ts").read_text()
    assert "/metrics/modules/" in api
    assert "/summary" in api


def test_backend_exposes_metric_module_summary_contract():
    metrics_api = (ROOT / "services/analytics-api/app/api/metrics.py").read_text()
    assert "modules" in metrics_api.lower()
    assert "summary" in metrics_api.lower()


def test_export_audit_contract_mentions_required_metadata():
    export_schema = (ROOT / "services/analytics-api/app/schemas/export.py").read_text().lower()
    for anchor in ["filters", "trust", "freshness", "formula", "created_at", "fingerprint"]:
        assert anchor in export_schema
