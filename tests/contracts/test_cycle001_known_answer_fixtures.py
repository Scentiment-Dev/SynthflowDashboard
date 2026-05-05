from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
EXAMPLES = ROOT / "packages" / "shared-contracts" / "examples"
SOURCE_TRUTH_SERVICE = (
    ROOT / "services" / "analytics-api" / "app" / "services" / "source_truth_service.py"
)


def _read_json(filename: str) -> dict:
    return json.loads((EXAMPLES / filename).read_text())


def test_cancelled_subscription_fixture_requires_confirmed_cancelled_state_or_official_path():
    fixture = _read_json("stayai_cancellation_outcome_confirmed.example.json")
    assert fixture["event_type"] == "subscription_cancelled"
    assert fixture["confirmed_state"] == "cancelled"


def test_retained_save_fixture_requires_confirmed_retained_state():
    fixture = _read_json("stayai_save_outcome_confirmed.example.json")
    assert fixture["event_type"] == "subscription_saved"
    assert fixture["confirmed_state"] in {"retained", "saved", "active"}


def test_shopify_context_fixture_is_secondary_only():
    fixture = _read_json("shopify_subscription_secondary_context.example.json")
    assert fixture["subscription_finalization_allowed"] is False
    assert fixture["context_role"] == "secondary_only"


def test_portal_link_sent_fixture_is_not_portal_completion():
    fixture = _read_json("portal_link_sent_not_completed.example.json")
    assert fixture["event_type"] == "portal_link_sent"
    assert fixture["completed"] is False


def test_missing_source_data_lowers_trust_or_maps_to_pending_unknown():
    fixture = _read_json("subscription_analytics_response.example.json")
    assert fixture["source_confirmation_status"] in {"confirmed", "pending", "missing"}
    assert fixture["final_subscription_state"] in {"active", "retained", "saved", "cancelled", "pending", "unknown"}
    assert fixture["subscription_overview"]["pending_stayai_confirmation_count"] >= 0
    assert fixture["metric_metadata"]["trust_label"] in {"high", "medium", "low", "untrusted"}


def test_subscription_outcomes_fixture_keeps_stayai_as_source_of_truth():
    fixture = _read_json("subscription_outcomes_response.example.json")
    metrics = fixture["metrics"]
    metadata = fixture["metadata"]

    assert fixture["source_of_truth_system"] == "stayai"
    assert metrics["confirmed_cancellations_total"] <= metrics["cancellation_requests_total"]
    assert metrics["confirmed_retained_total"] <= metrics["save_or_retention_attempts_total"]
    assert metrics["portal_completion_confirmed_total"] <= metrics["portal_link_sent_total"]
    assert metadata["source_confirmation_status"] in {"confirmed", "pending", "missing"}
    assert metadata["trust_label"] in {"high", "medium", "low", "untrusted"}
    assert "presentation" in metadata


def test_subscription_contract_examples_include_presentation_safe_metadata():
    analytics_fixture = _read_json("subscription_analytics_response.example.json")
    outcomes_fixture = _read_json("subscription_outcomes_response.example.json")
    source_health_fixture = _read_json("subscription_source_health.example.json")

    for fixture in [
        analytics_fixture["metric_metadata"]["presentation"],
        outcomes_fixture["metadata"]["presentation"],
        source_health_fixture["metadata"]["presentation"],
        source_health_fixture["sources"][0]["presentation"],
    ]:
        for field in [
            "display_label",
            "short_label",
            "executive_summary",
            "format_type",
            "unit",
            "trend_direction",
            "comparison_label",
            "severity",
            "visual_tone",
            "source_authority_explanation",
            "trust_explanation",
            "freshness_explanation",
            "drilldown_hint",
            "empty_state_copy",
            "blocked_state_copy",
        ]:
            assert field in fixture


def test_contract_examples_do_not_emit_skeleton_or_starter_copy():
    combined = json.dumps(
        {
            "analytics": _read_json("subscription_analytics_response.example.json"),
            "outcomes": _read_json("subscription_outcomes_response.example.json"),
            "source_health": _read_json("subscription_source_health.example.json"),
        }
    ).lower()
    assert "starter baseline" not in combined
    assert "starter" not in combined
    assert "skeleton" not in combined


def test_abandoned_dropped_unresolved_transferred_excluded_from_successful_containment():
    service_text = SOURCE_TRUTH_SERVICE.read_text()
    assert "abandoned or request.unresolved or request.transferred_to_agent" in service_text
    assert "excluded from successful containment" in service_text


def test_trust_labels_cannot_be_manually_elevated():
    service_text = SOURCE_TRUTH_SERVICE.read_text()
    assert "def trust_label_can_be_manual(self) -> bool" in service_text
    assert "return False" in service_text


def test_historical_backfill_requires_governed_pipeline():
    service_text = SOURCE_TRUTH_SERVICE.read_text()
    assert "Historical backfill is not base launch scope" in service_text
    assert "governed reprocess/backfill pipeline" in service_text
