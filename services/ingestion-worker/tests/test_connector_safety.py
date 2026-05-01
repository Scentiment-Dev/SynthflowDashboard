from pathlib import Path

from app.connectors.registry import build_connectors
from app.schemas.raw_event import RawSource

SAMPLE_DIR = Path(__file__).resolve().parents[1] / "app" / "sample_payloads"


def test_sample_connectors_load_local_payloads() -> None:
    connectors = build_connectors(SAMPLE_DIR)
    events = connectors[RawSource.STAYAI].fetch_since(None)
    assert events
    assert all(event.source == RawSource.STAYAI for event in events)


def test_connectors_fail_closed_without_sample_dir() -> None:
    connectors = build_connectors(None)
    assert connectors[RawSource.SYNTHFLOW].fetch_since(None) == []
