from app.pipelines.normalize_events import normalize_event
from app.schemas.raw_event import RawEvent, RawSource
def test_stayai_state_is_official_outcome() -> None:
    raw = RawEvent(source=RawSource.STAYAI, external_id='sub-1', event_type='subscription_state', occurred_at='2026-04-29T00:00:00Z', payload={'subscription_id':'sub-1'})
    assert normalize_event(raw).is_official_outcome is True
def test_synthflow_intent_is_not_subscription_outcome() -> None:
    raw = RawEvent(source=RawSource.SYNTHFLOW, external_id='call-1', event_type='intent_captured', occurred_at='2026-04-29T00:00:00Z', payload={'call_id':'call-1'})
    assert normalize_event(raw).is_official_outcome is False
