from __future__ import annotations


def test_health_contract_contains_service_status(client):
    response = client.get("/health")
    assert response.status_code == 200
    payload = response.json()
    assert payload.get("status") in {"ok", "healthy"}
    assert "analytics-api" in payload.get("message", "")


def test_metric_module_summary_contract_for_subscriptions(client):
    response = client.get("/metrics/modules/subscriptions/summary")
    assert response.status_code == 200
    payload = response.json()
    assert "module" in payload
    assert "metrics" in payload
    assert isinstance(payload["metrics"], list)


def test_governance_endpoint_is_explicit_deny_surface(client):
    response = client.get("/governance/rules")
    assert response.status_code in {200, 403}
    if response.status_code == 200:
        text = response.text.lower()
        assert "explicit" in text
        assert "deny" in text
