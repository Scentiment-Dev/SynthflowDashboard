from __future__ import annotations

from app.connectors.base import SafeConnectorBase
from app.core.config import SourceConfig
from app.schemas.raw_event import RawSource


class SynthflowConnector(SafeConnectorBase):
    """Synthflow call journey connector.

    Synthflow may provide call, intent, node, drop-off, transfer, and abandonment
    evidence. It cannot confirm subscription saved/cancelled outcomes.
    """

    source = RawSource.SYNTHFLOW

    def __init__(self, config: SourceConfig, sample_payload_dir=None) -> None:
        super().__init__(config, sample_payload_dir)
