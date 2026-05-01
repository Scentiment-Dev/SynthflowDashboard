from __future__ import annotations

from pathlib import Path

from app.connectors.base import Connector
from app.connectors.live_agent_connector import LiveAgentConnector
from app.connectors.portal_connector import PortalConnector
from app.connectors.shopify_connector import ShopifyConnector
from app.connectors.stayai_connector import StayAiConnector
from app.connectors.synthflow_connector import SynthflowConnector
from app.core.config import SourceConfig
from app.schemas.raw_event import RawSource


SAMPLE_FILES = {
    RawSource.SYNTHFLOW: "synthflow_call_events.json",
    RawSource.STAYAI: "stayai_subscription_events.json",
    RawSource.SHOPIFY: "shopify_order_events.json",
    RawSource.PORTAL: "portal_events.json",
    RawSource.LIVE_AGENT: "live_agent_events.json",
}


def build_connectors(sample_payload_dir: Path | None = None) -> dict[RawSource, Connector]:
    return {
        RawSource.SYNTHFLOW: SynthflowConnector(SourceConfig("synthflow", sample_file=SAMPLE_FILES[RawSource.SYNTHFLOW]), sample_payload_dir),
        RawSource.STAYAI: StayAiConnector(SourceConfig("stayai", sample_file=SAMPLE_FILES[RawSource.STAYAI]), sample_payload_dir),
        RawSource.SHOPIFY: ShopifyConnector(SourceConfig("shopify", sample_file=SAMPLE_FILES[RawSource.SHOPIFY]), sample_payload_dir),
        RawSource.PORTAL: PortalConnector(SourceConfig("portal", sample_file=SAMPLE_FILES[RawSource.PORTAL]), sample_payload_dir),
        RawSource.LIVE_AGENT: LiveAgentConnector(SourceConfig("live_agent", sample_file=SAMPLE_FILES[RawSource.LIVE_AGENT]), sample_payload_dir),
    }
