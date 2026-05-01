from __future__ import annotations

import json
from pathlib import Path
from typing import Protocol

from app.core.config import SourceConfig
from app.core.errors import ConnectorDisabledError
from app.schemas.raw_event import RawEvent, RawSource


class Connector(Protocol):
    source: RawSource

    def fetch_since(self, cursor: str | None = None) -> list[RawEvent]:
        ...


class SafeConnectorBase:
    """Fail-closed connector base.

    Live connectors must be explicitly enabled and implemented. In sample mode,
    connectors can read local payload files so the repo has runnable ingestion
    behavior without calling external systems or fabricating official outcomes.
    """

    source: RawSource

    def __init__(self, config: SourceConfig, sample_payload_dir: Path | None = None) -> None:
        self.config = config
        self.sample_payload_dir = sample_payload_dir

    def fetch_since(self, cursor: str | None = None) -> list[RawEvent]:
        if self.sample_payload_dir and self.config.sample_file:
            return self._load_sample_events(cursor)
        if not self.config.enabled:
            return []
        raise ConnectorDisabledError(
            f"Live connector for {self.config.name} is intentionally not implemented. "
            "Add auth, pagination, rate-limit, and source-contract tests before enabling."
        )

    def _load_sample_events(self, cursor: str | None = None) -> list[RawEvent]:
        assert self.sample_payload_dir is not None
        assert self.config.sample_file is not None
        path = self.sample_payload_dir / self.config.sample_file
        if not path.exists():
            return []
        rows = json.loads(path.read_text(encoding="utf-8"))
        events = [RawEvent.model_validate(row) for row in rows]
        if cursor is None:
            return events
        return [event for event in events if (event.cursor or event.external_id) > cursor]
