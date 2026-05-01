from __future__ import annotations

from app.connectors.base import SafeConnectorBase
from app.core.config import SourceConfig
from app.schemas.raw_event import RawSource


class StayAiConnector(SafeConnectorBase):
    """Stay.ai subscription source-of-truth connector.

    Stay.ai is the official source for subscription state, cancellation, save,
    retention, and pause/skip/frequency-change outcomes.
    """

    source = RawSource.STAYAI

    def __init__(self, config: SourceConfig, sample_payload_dir=None) -> None:
        super().__init__(config, sample_payload_dir)
