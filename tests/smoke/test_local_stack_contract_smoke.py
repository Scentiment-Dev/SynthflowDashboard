from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]


def test_local_stack_has_required_services_declared():
    compose = (ROOT / "docker-compose.yml").read_text().lower()
    for service in ["postgres", "analytics-api", "dashboard-web"]:
        assert service in compose


def test_smoke_plan_preserves_no_drift_scope():
    plan = (ROOT / "tests/smoke/smoke_test_plan.md").read_text().lower()
    assert "no-drift" in plan
    assert "stay.ai" in plan
    assert "portal completion" in plan
