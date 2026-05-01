from __future__ import annotations

from fastapi.testclient import TestClient


def test_subscription_analytics_baseline_contract(client: TestClient) -> None:
    response = client.get("/subscriptions/analytics")
    assert response.status_code == 200
    payload = response.json()

    assert payload["module"] == "subscriptions"
    assert payload["source_of_truth_system"] == "stayai"
    assert payload["source_confirmation_status"] == "confirmed"

    overview = payload["subscription_overview"]
    assert overview["cancellation_requests_count"] >= overview["confirmed_cancellations_count"]
    assert overview["save_retention_attempts_count"] >= overview["confirmed_retained_subscriptions_count"]

    portal = payload["portal_journey"]
    assert portal["portal_link_sent_count"] >= portal["confirmed_portal_completion_count"]

    shopify = payload["shopify_context"]
    assert shopify["context_role"] == "context_only"
    assert shopify["finalization_allowed"] is False


def test_subscription_analytics_missing_stayai_confirmation_is_low_trust(client: TestClient) -> None:
    response = client.get("/subscriptions/analytics", params={"scenario": "missing_stayai_confirmation"})
    assert response.status_code == 200
    payload = response.json()

    assert payload["final_subscription_state"] == "unknown"
    assert payload["source_confirmation_status"] == "missing"
    assert payload["metric_metadata"]["trust_label"] == "low"
    assert payload["source_confirmation"]["missing_records_count"] > 0
    assert payload["subscription_overview"]["confirmed_cancellations_count"] == 0
    assert payload["subscription_overview"]["confirmed_retained_subscriptions_count"] == 0


def test_subscription_analytics_metadata_contains_export_audit_fields(client: TestClient) -> None:
    response = client.get("/subscriptions/analytics")
    assert response.status_code == 200
    metadata = response.json()["metric_metadata"]

    for field in [
        "filters",
        "metric_definitions",
        "trust_label",
        "freshness",
        "formula_version",
        "owner",
        "timestamp",
        "fingerprint",
        "audit_reference",
        "source_confirmation_status",
    ]:
        assert field in metadata


def test_subscription_analytics_requires_subscription_permission(client: TestClient) -> None:
    response = client.get(
        "/subscriptions/analytics",
        headers={"x-scentiment-roles": "viewer"},
    )
    assert response.status_code == 403
    assert "Explicit deny" in response.json()["detail"]


def test_exports_audit_requires_export_permission_server_side(client: TestClient) -> None:
    response = client.post(
        "/exports/audit",
        headers={"x-scentiment-roles": "viewer"},
        json={
            "requested_by": "viewer@scentiment.internal",
            "module": "subscriptions",
            "metric_keys": ["subscription_analytics_overview"],
        },
    )
    assert response.status_code == 403
    assert "Explicit deny" in response.json()["detail"]
