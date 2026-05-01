from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_metric_definitions_include_subscription_save_rate() -> None:
    response = client.get("/metrics/definitions")
    assert response.status_code == 200
    keys = {item["metric_key"] for item in response.json()}
    assert "subscription_save_rate" in keys
    assert "confirmed_cancellation_rate" in keys


def test_subscription_module_summary() -> None:
    response = client.get("/metrics/modules/subscriptions/summary")
    assert response.status_code == 200
    body = response.json()
    assert body["module"] == "subscriptions"
    assert body["cards"]
