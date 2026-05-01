from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]


def test_ingestion_normalized_event_fields_align_with_backend_event_schema():
    backend_schema = (ROOT / "services/analytics-api/app/schemas/event.py").read_text().lower()
    normalizer = (ROOT / "services/ingestion-worker/app/pipelines/normalize_events.py").read_text().lower()
    for anchor in ["event_id", "source", "event_type", "occurred_at"]:
        assert anchor in backend_schema
        assert anchor in normalizer


def test_ingestion_outputs_can_feed_raw_event_warehouse():
    raw_schema = (ROOT / "data/warehouse/schema/001_raw_events.sql").read_text().lower()
    normalizer = (ROOT / "services/ingestion-worker/app/pipelines/normalize_events.py").read_text().lower()
    for anchor in ["raw_payload", "raw_payload_hash", "source"]:
        assert anchor in raw_schema
        assert anchor in normalizer
