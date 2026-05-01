from __future__ import annotations

from app.connectors.registry import build_connectors
from app.schemas.raw_event import RawSource


def test_connector_registry_contains_all_locked_sources():
    connectors = build_connectors()
    expected = {
        RawSource.SYNTHFLOW,
        RawSource.STAYAI,
        RawSource.SHOPIFY,
        RawSource.PORTAL,
        RawSource.LIVE_AGENT,
    }
    assert expected.issubset(set(connectors))
