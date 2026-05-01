from __future__ import annotations

from app.connectors.base import SafeConnectorBase
from app.core.config import SourceConfig
from app.schemas.raw_event import RawSource


class PortalConnector(SafeConnectorBase):
    """Portal completion connector.

    A link-sent event is only handoff evidence. Portal success requires a
    confirmed completion event from the portal/completion source.
    """

    source = RawSource.PORTAL

    def __init__(self, config: SourceConfig, sample_payload_dir=None) -> None:
        super().__init__(config, sample_payload_dir)
