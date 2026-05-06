from __future__ import annotations

from fastapi.testclient import TestClient

from app.services import subscription_service


PRESENTATION_FIELDS = [
    "display_label",
    "short_label",
    "executive_summary",
    "format_type",
    "unit",
    "trend_direction",
    "comparison_label",
    "comparison_value",
    "severity",
    "visual_tone",
    "source_authority_explanation",
    "trust_explanation",
    "freshness_explanation",
    "drilldown_hint",
    "empty_state_copy",
    "blocked_state_copy",
]


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
    assert payload["metric_metadata"]["presentation"]["severity"] == "critical"
    assert payload["metric_metadata"]["presentation"]["visual_tone"] == "critical"
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
        "presentation",
    ]:
        assert field in metadata
    for field in PRESENTATION_FIELDS:
        assert field in metadata["presentation"]


def test_subscription_summary_uses_presentation_safe_copy(client: TestClient) -> None:
    response = client.get("/subscriptions/summary")
    assert response.status_code == 200
    cards = response.json()["cards"]
    rendered_values = " ".join(str(card["value"]).lower() for card in cards)
    assert "starter" not in rendered_values
    assert "skeleton" not in rendered_values


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
    assert payload["metadata"]["presentation"]["severity"] == "warning"
    assert payload["metadata"]["presentation"]["visual_tone"] == "caution"
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
    assert payload["metadata"]["presentation"]["severity"] == "critical"
    assert payload["metadata"]["presentation"]["visual_tone"] == "critical"
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
    for field in PRESENTATION_FIELDS:
        assert field in metadata["presentation"]


def test_subscription_source_health_source_rows_include_presentation_metadata(client: TestClient) -> None:
    response = client.get("/subscriptions/source-health")
    assert response.status_code == 200
    sources = response.json()["sources"]
    assert sources
    for source in sources:
        for field in PRESENTATION_FIELDS:
            assert field in source["presentation"]


def test_subscription_business_value_contract_exposes_stateful_metrics(client: TestClient) -> None:
    response = client.get("/subscriptions/business-value")
    assert response.status_code == 200
    payload = response.json()

    assert payload["module"] == "subscriptions"
    assert payload["source_of_truth_system"] == "stayai"
    assert payload["scenario"] == "baseline"
    assert payload["source_confirmation_status"] == "pending"
    assert payload["metadata"]["metric_id"] == "subscription_business_value_summary"
    assert payload["metadata"]["blocked_metrics_count"] == 1
    assert payload["metadata"]["trust_label"] == "medium"
    assert payload["metrics"]
    states = {metric["state"] for metric in payload["metrics"]}
    assert {"confirmed", "estimated", "pending", "blocked_by_data"}.issubset(states)


def test_subscription_business_value_contains_required_p0_metric_family(client: TestClient) -> None:
    response = client.get("/subscriptions/business-value")
    assert response.status_code == 200
    metrics = response.json()["metrics"]
    metric_ids = {metric["metric_id"] for metric in metrics}
    required_metric_ids = {
        "net_business_value_impact",
        "gross_value_protected",
        "net_retained_recovered_value",
        "confirmed_business_value_impact",
        "estimated_business_value_impact",
        "revenue_saved_estimate",
        "gross_saved_value",
        "confirmed_saved_revenue",
        "net_saved_revenue",
        "offer_cost",
        "discount_cost",
        "free_shipping_cost",
        "revenue_at_risk",
        "support_cost_avoided",
        "cost_per_contained_call",
        "net_value_per_contained_call",
        "automation_roi",
        "retention_roi_estimate",
        "estimated_churn_prevented_count",
        "confirmed_churn_prevented_count",
        "revenue_leakage_after_save",
        "high_value_churn_risk",
        "stay_ai_confirmation_coverage",
        "true_subscription_containment_rate",
    }
    assert required_metric_ids.issubset(metric_ids)


def test_subscription_business_value_metric_contract_has_plain_language_and_audit_fields(
    client: TestClient,
) -> None:
    response = client.get("/subscriptions/business-value")
    assert response.status_code == 200
    metric = response.json()["metrics"][0]
    required_fields = [
        "metric_id",
        "display_label",
        "plain_language_summary",
        "value_state",
        "formula_version",
        "source_confirmation_status",
        "trust_label",
        "freshness_status",
        "owner",
        "timestamp",
        "fingerprint",
        "audit_reference",
        "missing_data_reason",
        "next_action_hint",
        "support_label",
        "support_summary",
        "why_it_matters",
        "what_to_do_next",
        "blocked_reason_plain_language",
    ]
    for field in required_fields:
        assert field in metric


def test_subscription_business_value_confirmed_and_estimated_and_pending_and_blocked_are_distinct(
    client: TestClient,
) -> None:
    response = client.get("/subscriptions/business-value")
    assert response.status_code == 200
    states = {metric["value_state"] for metric in response.json()["metrics"]}
    assert {"confirmed", "estimated", "pending", "blocked_by_data"}.issubset(states)


def test_subscription_business_value_source_confirmation_status_derived_per_metric(
    client: TestClient,
) -> None:
    response = client.get("/subscriptions/business-value")
    assert response.status_code == 200
    metrics = {
        metric["metric_id"]: metric
        for metric in response.json()["metrics"]
    }
    assert (
        metrics["confirmed_business_value_impact"]["source_confirmation_status"]
        == "confirmed"
    )
    assert (
        metrics["cost_too_high_funnel_sequence_metrics"]["source_confirmation_status"]
        == "missing"
    )


def test_subscription_business_value_revenue_metrics_not_confirmed_without_confirmed_source(
    client: TestClient,
) -> None:
    response = client.get("/subscriptions/business-value")
    assert response.status_code == 200
    revenue_metric_ids = {
        "net_business_value_impact",
        "gross_value_protected",
        "net_retained_recovered_value",
        "estimated_business_value_impact",
        "revenue_saved_estimate",
        "gross_saved_value",
        "net_saved_revenue",
        "revenue_at_risk",
        "revenue_leakage_after_save",
    }
    for metric in response.json()["metrics"]:
        if metric["metric_id"] in revenue_metric_ids:
            assert not (
                metric["value_state"] == "confirmed"
                and metric["source_confirmation_status"] != "confirmed"
            )


def test_subscription_advanced_filter_contract_includes_required_dimensions(client: TestClient) -> None:
    response = client.get("/subscriptions/advanced-filters")
    assert response.status_code == 200
    options = response.json()["options"]
    filter_ids = {option["filter_id"] for option in options}
    required_filter_ids = {
        "date_preset",
        "custom_date_range",
        "comparison_period",
        "cancellation_reason",
        "offer_type",
        "offer_version",
        "subscription_status",
        "product_sku",
        "match_confidence",
        "portal_state",
        "outcome",
        "escalation_state",
        "repeat_contact",
        "value_range",
        "trust_label",
        "synthflow_flow_version",
        "stayai_action_type",
        "stayai_offer_version",
        "stayai_freshness_api_state",
        "current_vs_future_flow_state",
        "saved_view_id",
        "saved_view_name",
    }
    assert required_filter_ids.issubset(filter_ids)
    for option in options:
        assert "is_disabled_reason" in option
        if option["is_enabled"] is False:
            assert option["is_disabled_reason"]


def test_subscription_export_preflight_denies_unauthorized_role(client: TestClient) -> None:
    response = client.post(
        "/subscriptions/export/preflight",
        json={
            "requested_scope": "export_current_page",
            "requested_format": "pdf",
            "requester_role": "admin",
            "filters": {"date_preset": "last_30_days"},
            "comparison_period": "previous_period",
            "included_widgets": ["outcome_funnel"],
        },
        headers={"x-scentiment-roles": "support_lead"},
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["export_allowed"] is False
    assert payload["permission_decision"] == "explicit_deny"
    assert payload["requester_role"] == "support_lead"
    assert "cannot export this scope" in payload["blocked_reason"].lower()


def test_subscription_export_preflight_denies_missing_role(client: TestClient) -> None:
    response = client.post(
        "/subscriptions/export/preflight",
        json={
            "requested_scope": "export_current_page",
            "requested_format": "pdf",
            "filters": {"date_preset": "last_30_days"},
            "comparison_period": "none",
            "included_widgets": ["outcome_funnel"],
        },
        headers={"x-scentiment-roles": "support_lead"},
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["requester_role"] == "support_lead"
    assert payload["permission_decision"] == "explicit_deny"
    assert payload["export_allowed"] is False


def test_subscription_export_preflight_includes_required_manifest_metadata(client: TestClient) -> None:
    response = client.post(
        "/subscriptions/export/preflight",
        json={
            "requested_scope": "export_table_rows",
            "requested_format": "csv",
            "requester_role": "support_lead",
            "filters": {"date_preset": "last_30_days", "outcome": "save"},
            "comparison_period": "none",
            "included_widgets": ["follow_up_table"],
        },
        headers={"x-scentiment-roles": "support_lead"},
    )
    assert response.status_code == 200
    payload = response.json()
    required_fields = [
        "export_allowed",
        "blocked_reason",
        "requested_scope",
        "requested_format",
        "filters",
        "comparison_period",
        "metric_definitions",
        "trust_labels",
        "freshness",
        "formula_versions",
        "owner",
        "timestamp",
        "fingerprint",
        "audit_reference",
        "requester_role",
        "permission_decision",
        "source_confirmation_status",
        "included_widgets",
        "excluded_widgets",
        "missing_required_metadata",
    ]
    for field in required_fields:
        assert field in payload


def test_subscription_export_preflight_preserves_explicit_empty_included_widgets(
    client: TestClient,
) -> None:
    response = client.post(
        "/subscriptions/export/preflight",
        json={
            "requested_scope": "export_table_rows",
            "requested_format": "csv",
            "filters": {"date_preset": "last_30_days"},
            "comparison_period": "none",
            "included_widgets": [],
        },
        headers={"x-scentiment-roles": "support_lead"},
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["export_allowed"] is True
    assert payload["included_widgets"] == []
    assert payload["excluded_widgets"] == []


def test_subscription_follow_up_contract_exposes_actionability_fields(client: TestClient) -> None:
    response = client.get("/subscriptions/follow-up")
    assert response.status_code == 200
    record = response.json()["records"][0]
    required_fields = [
        "customer_or_case_id",
        "recommended_action",
        "reason",
        "priority",
        "status",
        "source_system",
        "blocking_data_gap",
        "stayai_confirmation_status",
        "portal_completion_status",
        "estimated_value_at_risk",
        "last_event_at",
        "owner_queue",
        "sla_status",
        "audit_reference",
        "support_label",
        "support_summary",
        "why_it_matters",
        "what_to_do_next",
        "blocked_reason_plain_language",
    ]
    for field in required_fields:
        assert field in record


def test_subscription_business_value_missing_confirmation_degrades_trust(client: TestClient) -> None:
    response = client.get(
        "/subscriptions/business-value",
        params={"scenario": "missing_source_confirmations"},
    )
    assert response.status_code == 200
    payload = response.json()

    assert payload["source_confirmation_status"] == "missing"
    assert payload["metadata"]["source_confirmation_status"] == "missing"
    assert payload["metadata"]["trust_label"] == "low"
    assert payload["metadata"]["blocked_metrics_count"] == 1
    net_business_value = next(
        metric for metric in payload["metrics"] if metric["metric_key"] == "net_business_value_impact"
    )
    assert net_business_value["value"] is None
    assert net_business_value["state"] == "blocked_by_data"


def test_subscription_business_value_requires_subscription_permission(client: TestClient) -> None:
    response = client.get(
        "/subscriptions/business-value",
        headers={"x-scentiment-roles": "viewer"},
    )
    assert response.status_code == 403
    assert "Explicit deny" in response.json()["detail"]


def test_source_health_fingerprint_is_stable_under_presentation_copy_change(
    client: TestClient,
    monkeypatch,
) -> None:
    baseline = client.get("/subscriptions/source-health")
    assert baseline.status_code == 200
    baseline_payload = baseline.json()

    monkeypatch.setattr(
        subscription_service,
        "_source_authority_explanation",
        lambda _source_system: "Presentation-only authority copy change for UI phrasing.",
    )

    mutated = client.get("/subscriptions/source-health")
    assert mutated.status_code == 200
    mutated_payload = mutated.json()

    assert (
        baseline_payload["metadata"]["fingerprint"]
        == mutated_payload["metadata"]["fingerprint"]
    )
    assert (
        baseline_payload["sources"][0]["presentation"]["source_authority_explanation"]
        != mutated_payload["sources"][0]["presentation"]["source_authority_explanation"]
    )
