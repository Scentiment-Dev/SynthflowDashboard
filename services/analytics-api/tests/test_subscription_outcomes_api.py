from __future__ import annotations

from fastapi.testclient import TestClient


def test_subscription_outcomes_confirmed_cancellation(client: TestClient) -> None:
    response = client.get(
        "/subscriptions/outcomes",
        params={"scenario": "confirmed_cancellation"},
    )
    assert response.status_code == 200
    payload = response.json()
    metrics = payload["metrics"]
    metadata = payload["metadata"]

    assert metrics["cancellation_requests_total"] == 1
    assert metrics["confirmed_cancellations_total"] == 1
    assert metrics["cancellation_confirmation_rate"] == 1.0
    assert metadata["source_confirmation_status"] == "confirmed"


def test_subscription_outcomes_pending_cancellation_confirmation(client: TestClient) -> None:
    response = client.get(
        "/subscriptions/outcomes",
        params={"scenario": "pending_cancellation_confirmation"},
    )
    assert response.status_code == 200
    payload = response.json()
    metrics = payload["metrics"]
    metadata = payload["metadata"]

    assert metrics["cancellation_requests_total"] == 1
    assert metrics["confirmed_cancellations_total"] == 0
    assert metrics["pending_stayai_confirmation_total"] == 1
    assert metadata["source_confirmation_status"] == "pending"
    assert metadata["trust_label"] == "medium"


def test_subscription_outcomes_save_attempt_confirmed_retained(client: TestClient) -> None:
    response = client.get(
        "/subscriptions/outcomes",
        params={"scenario": "save_confirmed_retained"},
    )
    assert response.status_code == 200
    payload = response.json()
    metrics = payload["metrics"]

    assert metrics["save_or_retention_attempts_total"] == 1
    assert metrics["confirmed_retained_total"] == 1
    assert metrics["retention_rate"] == 1.0


def test_subscription_outcomes_save_without_confirmation(client: TestClient) -> None:
    response = client.get(
        "/subscriptions/outcomes",
        params={"scenario": "save_missing_confirmation"},
    )
    assert response.status_code == 200
    payload = response.json()
    metrics = payload["metrics"]
    metadata = payload["metadata"]

    assert metrics["save_or_retention_attempts_total"] == 1
    assert metrics["confirmed_retained_total"] == 0
    assert metrics["missing_stayai_final_state_total"] == 1
    assert metadata["source_confirmation_status"] == "missing"
    assert metadata["trust_label"] == "low"


def test_subscription_outcomes_non_cancellation_action_completed(client: TestClient) -> None:
    response = client.get(
        "/subscriptions/outcomes",
        params={"scenario": "non_cancellation_action_completed"},
    )
    assert response.status_code == 200
    metrics = response.json()["metrics"]
    assert metrics["non_cancellation_actions_total"] == 1
    assert metrics["subscription_outcome_unknown_total"] == 0


def test_subscription_outcomes_portal_link_not_counted_as_completion(client: TestClient) -> None:
    response = client.get(
        "/subscriptions/outcomes",
        params={"scenario": "portal_link_without_completion"},
    )
    assert response.status_code == 200
    metrics = response.json()["metrics"]
    assert metrics["portal_link_sent_total"] == 1
    assert metrics["portal_completion_confirmed_total"] == 0
    assert metrics["portal_completion_rate"] == 0.0


def test_subscription_outcomes_shopify_context_does_not_confirm_state(client: TestClient) -> None:
    response = client.get(
        "/subscriptions/outcomes",
        params={"scenario": "shopify_context_missing_final_state"},
    )
    assert response.status_code == 200
    payload = response.json()
    metrics = payload["metrics"]
    metadata = payload["metadata"]

    assert metrics["shopify_context_available_total"] == 1
    assert metrics["confirmed_cancellations_total"] == 0
    assert metrics["confirmed_retained_total"] == 0
    assert metadata["source_confirmation_status"] == "missing"


def test_subscription_outcomes_incomplete_synthflow_journey_not_final_state(client: TestClient) -> None:
    response = client.get(
        "/subscriptions/outcomes",
        params={"scenario": "synthflow_journey_incomplete"},
    )
    assert response.status_code == 200
    payload = response.json()
    metrics = payload["metrics"]

    assert metrics["synthflow_subscription_journeys_total"] == 1
    assert metrics["confirmed_cancellations_total"] == 0
    assert metrics["subscription_outcome_unknown_total"] == 1


def test_subscription_outcomes_unknown_outcome_is_tracked(client: TestClient) -> None:
    response = client.get("/subscriptions/outcomes", params={"scenario": "unknown_outcome"})
    assert response.status_code == 200
    payload = response.json()
    metrics = payload["metrics"]
    metadata = payload["metadata"]

    assert metrics["subscription_outcome_unknown_total"] == 1
    assert metrics["missing_stayai_final_state_total"] == 0
    assert metadata["source_confirmation_status"] == "confirmed"
    assert metadata["trust_label"] == "medium"


def test_subscription_outcomes_metadata_contains_required_audit_fields(client: TestClient) -> None:
    response = client.get("/subscriptions/outcomes")
    assert response.status_code == 200
    payload = response.json()
    metadata = payload["metadata"]
    metrics = payload["metrics"]

    for field in [
        "trust_label",
        "freshness_status",
        "formula_version",
        "owner",
        "timestamp",
        "fingerprint",
        "audit_reference",
        "source_confirmation_status",
        "filters",
        "metric_definitions",
    ]:
        assert field in metadata
    for field in [
        "subscription_contacts_total",
        "subscription_action_requests_total",
        "cancellation_requests_total",
        "confirmed_cancellations_total",
        "save_or_retention_attempts_total",
        "confirmed_retained_total",
        "non_cancellation_actions_total",
        "pending_stayai_confirmation_total",
        "missing_stayai_final_state_total",
        "portal_link_sent_total",
        "portal_completion_confirmed_total",
        "shopify_context_available_total",
        "synthflow_subscription_journeys_total",
        "subscription_outcome_unknown_total",
        "retention_rate",
        "cancellation_confirmation_rate",
        "portal_completion_rate",
    ]:
        assert field in metrics


def test_subscription_outcomes_deduplicates_contacts_total(client: TestClient) -> None:
    response = client.get(
        "/subscriptions/outcomes",
        params={"scenario": "duplicate_contact_records"},
    )
    assert response.status_code == 200
    metrics = response.json()["metrics"]
    assert metrics["subscription_action_requests_total"] == 2
    assert metrics["subscription_contacts_total"] == 1


def test_subscription_outcomes_requires_subscription_permission(client: TestClient) -> None:
    response = client.get(
        "/subscriptions/outcomes",
        headers={"x-scentiment-roles": "viewer"},
    )
    assert response.status_code == 403
    assert "Explicit deny" in response.json()["detail"]
