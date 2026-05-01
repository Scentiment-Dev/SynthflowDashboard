from __future__ import annotations

import pytest

from app.core.errors import SourceTruthViolation
from app.pipelines.normalize_events import normalize_event
from app.schemas.raw_event import RawEvent, RawSource


def test_synthflow_normalization_does_not_confirm_subscription_outcome():
    with pytest.raises(SourceTruthViolation):
        normalize_event(
            RawEvent(
                source=RawSource.SYNTHFLOW,
                external_id="call_qa_001",
                event_type="subscription_cancelled",
                occurred_at="2026-04-30T00:00:00Z",
                payload={"call_id": "call_qa_001"},
            )
        )


def test_stayai_normalization_can_be_official_outcome_source():
    normalized = normalize_event(
        RawEvent(
            source=RawSource.STAYAI,
            external_id="sub_qa_001",
            event_type="subscription_cancelled",
            occurred_at="2026-04-30T00:00:00Z",
            payload={"subscription_id": "sub_qa_001"},
        )
    )
    assert normalized.source == "stayai"
    assert normalized.is_official_outcome is True
    assert normalized.trust_label == "official"


def test_portal_link_sent_is_not_portal_completion():
    normalized = normalize_event(
        RawEvent(
            source=RawSource.PORTAL,
            external_id="portal_qa_001",
            event_type="portal_link_sent",
            occurred_at="2026-04-30T00:00:00Z",
            payload={"portal_link_sent": True},
        )
    )
    assert normalized.is_official_outcome is False
    assert "Portal link sent is not portal completion." in normalized.source_truth_notes
