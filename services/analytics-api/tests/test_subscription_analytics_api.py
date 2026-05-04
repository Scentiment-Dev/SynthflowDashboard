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


def test_unknown_scenario_uses_baseline_fixture_metadata(client: TestClient) -> None:
    baseline = client.get("/subscriptions/analytics")
    unknown = client.get("/subscriptions/analytics", params={"scenario": "not-a-real-scenario"})
    assert baseline.status_code == 200
    assert unknown.status_code == 200

    baseline_payload = baseline.json()
    unknown_payload = unknown.json()

    assert unknown_payload["subscription_overview"] == baseline_payload["subscription_overview"]
    assert unknown_payload["metric_metadata"]["fingerprint"] == baseline_payload["metric_metadata"]["fingerprint"]
    assert unknown_payload["metric_metadata"]["audit_reference"] == baseline_payload["metric_metadata"]["audit_reference"]


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


def test_subscription_source_health_has_expected_authority_labels(client: TestClient) -> None:
    response = client.get("/subscriptions/source-health")
    assert response.status_code == 200
    payload = response.json()

    sources = {source["source_system"]: source for source in payload["sources"]}
    assert sources["stay_ai"]["source_authority_level"] == "authoritative_final_state"
    assert sources["synthflow"]["source_authority_level"] == "journey_event_authoritative"
    assert sources["shopify"]["source_authority_level"] == "context_only"
    assert sources["portal"]["source_authority_level"] == "completion_signal"
    assert payload["shopify_context_warning"]


def test_subscription_source_health_missing_stay_ai_forces_pending_outcome(client: TestClient) -> None:
    response = client.get(
        "/subscriptions/source-health",
        params={"scenario": "missing_stayai_final_state"},
    )
    assert response.status_code == 200
    payload = response.json()
    sources = {source["source_system"]: source for source in payload["sources"]}

    assert payload["pending_or_unknown_final_outcome"] is True
    assert payload["conflict_status"] == "pending"
    assert payload["overall_source_health"] == "warning"
    assert payload["missing_stay_ai_final_state_warning"]
    assert sources["stay_ai"]["source_confirmation_status"] == "missing"
    assert sources["stay_ai"]["freshness_status"] == "stale"
    assert sources["stay_ai"]["trust_label"] == "low"
    assert sources["shopify"]["source_authority_level"] == "context_only"


def test_subscription_source_health_uses_degraded_for_failing_quality(client: TestClient) -> None:
    response = client.get(
        "/subscriptions/source-health",
        params={"scenario": "failing_quality_with_missing_stayai"},
    )
    assert response.status_code == 200
    payload = response.json()
    sources = {source["source_system"]: source for source in payload["sources"]}

    assert payload["pending_or_unknown_final_outcome"] is True
    assert payload["overall_source_health"] == "degraded"
    assert sources["synthflow"]["data_quality_status"] == "failing"


def test_subscription_source_health_conflicts_do_not_override_stay_ai(client: TestClient) -> None:
    response = client.get(
        "/subscriptions/source-health",
        params={"scenario": "conflicting_sources"},
    )
    assert response.status_code == 200
    payload = response.json()
    sources = {source["source_system"]: source for source in payload["sources"]}

    assert payload["conflict_status"] == "conflict_detected"
    assert payload["overall_source_health"] == "warning"
    assert sources["stay_ai"]["source_authority_level"] == "authoritative_final_state"
    assert sources["stay_ai"]["source_confirmation_status"] == "confirmed"
    assert sources["stay_ai"]["trust_label"] == "high"
    assert sources["synthflow"]["conflict_count"] > 0


def test_subscription_source_health_portal_link_sent_not_completion(client: TestClient) -> None:
    response = client.get("/subscriptions/source-health")
    assert response.status_code == 200
    payload = response.json()
    portal = next(source for source in payload["sources"] if source["source_system"] == "portal")

    assert portal["source_confirmation_status"] == "pending"
    assert portal["missing_required_fields"] == ["confirmed_completion_event_id"]
    assert "link sent" in payload["portal_completion_warning"].lower()


def test_subscription_source_health_unknown_source_is_rejected(client: TestClient) -> None:
    response = client.get("/subscriptions/source-health?sources=unknown_source")
    assert response.status_code == 422


def test_subscription_source_health_filter_does_not_change_global_assessment(client: TestClient) -> None:
    response = client.get("/subscriptions/source-health?sources=shopify")
    assert response.status_code == 200
    payload = response.json()

    assert payload["pending_or_unknown_final_outcome"] is False
    assert payload["conflict_status"] == "none"
    assert payload["missing_stay_ai_final_state_warning"] is None
    assert len(payload["sources"]) == 1
    assert payload["sources"][0]["source_system"] == "shopify"


def test_subscription_source_health_metadata_contains_audit_and_fingerprint(client: TestClient) -> None:
    response = client.get("/subscriptions/source-health")
    assert response.status_code == 200
    metadata = response.json()["metadata"]
    for field in ["timestamp", "fingerprint", "formula_version", "owner", "audit_reference"]:
        assert field in metadata
