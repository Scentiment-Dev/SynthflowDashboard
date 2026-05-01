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
