from __future__ import annotations

from app.connectors.base import SafeConnectorBase
from app.core.config import SourceConfig
from app.schemas.raw_event import RawSource


class LiveAgentConnector(SafeConnectorBase):
    """Live-agent/RingCX escalation connector.

    Transfers and unresolved escalations are downstream support evidence and are
    excluded from successful containment.
    """

    source = RawSource.LIVE_AGENT

    def __init__(self, config: SourceConfig, sample_payload_dir=None) -> None:
        super().__init__(config, sample_payload_dir)
