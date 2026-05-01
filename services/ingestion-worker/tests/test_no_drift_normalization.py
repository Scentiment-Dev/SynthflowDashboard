import pytest

from app.core.errors import SourceTruthViolation
from app.pipelines.normalize_events import normalize_event
from app.schemas.raw_event import RawEvent, RawSource


def test_synthflow_cannot_claim_subscription_saved() -> None:
    raw = RawEvent(source=RawSource.SYNTHFLOW, external_id="bad-1", event_type="subscription_saved", occurred_at="2026-04-29T00:00:00Z")
    with pytest.raises(SourceTruthViolation):
        normalize_event(raw)


def test_portal_link_sent_is_not_completion() -> None:
    raw = RawEvent(source=RawSource.PORTAL, external_id="p-1", event_type="portal_link_sent", occurred_at="2026-04-29T00:00:00Z", payload={"customer_id": "c1"})
    event = normalize_event(raw)
    assert event.is_official_outcome is False
    assert "Portal link sent is not portal completion." in event.source_truth_notes


def test_stayai_subscription_cancelled_is_official() -> None:
    raw = RawEvent(source=RawSource.STAYAI, external_id="s-1", event_type="subscription_cancelled", occurred_at="2026-04-29T00:00:00Z", payload={"subscription_id": "sub1"})
    event = normalize_event(raw)
    assert event.is_official_outcome is True
    assert event.trust_label == "official"


def test_manual_trust_elevation_rejected() -> None:
    raw = RawEvent(source=RawSource.SHOPIFY, external_id="x", event_type="order_created", occurred_at="2026-04-29T00:00:00Z", payload={"manual_trust_label": "official"})
    with pytest.raises(SourceTruthViolation):
        normalize_event(raw)
