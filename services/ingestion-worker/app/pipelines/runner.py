from __future__ import annotations

from collections.abc import Iterable
import logging

from app.connectors.base import Connector
from app.core.checkpoints import CheckpointStore
from app.core.errors import DeadLetterRecord, SourceTruthViolation
from app.core.retry import run_with_retries
from app.pipelines.normalize_events import normalize_event
from app.schemas.pipeline import PipelineResult
from app.storage.local_jsonl_store import LocalJsonlStore

logger = logging.getLogger(__name__)


class IngestionPipelineRunner:
    def __init__(
        self,
        pipeline_name: str,
        connector: Connector,
        checkpoint_store: CheckpointStore,
        normalized_store: LocalJsonlStore,
        dead_letter_store: LocalJsonlStore,
        max_retries: int = 3,
    ) -> None:
        self.pipeline_name = pipeline_name
        self.connector = connector
        self.checkpoint_store = checkpoint_store
        self.normalized_store = normalized_store
        self.dead_letter_store = dead_letter_store
        self.max_retries = max_retries

    def run_once(self) -> PipelineResult:
        source_name = self.connector.source.value
        cursor_before = self.checkpoint_store.read(source_name)
        raw_events = run_with_retries(lambda: self.connector.fetch_since(cursor_before), self.max_retries)
        normalized_count = 0
        dead_letter_count = 0
        cursor_after = cursor_before
        warnings: list[str] = []

        for raw in raw_events:
            try:
                normalized = normalize_event(raw)
            except SourceTruthViolation as exc:
                dead_letter_count += 1
                warnings.append(str(exc))
                self.dead_letter_store.append(
                    DeadLetterRecord(
                        source=source_name,
                        pipeline=self.pipeline_name,
                        reason=str(exc),
                        raw_payload=raw.model_dump(mode="json"),
                    ).__dict__
                )
                continue
            self.normalized_store.append(normalized)
            normalized_count += 1
            cursor_after = raw.cursor or raw.external_id

        self.checkpoint_store.write(source_name, cursor_after)
        return PipelineResult(
            pipeline=self.pipeline_name,
            source=source_name,
            status="ok" if dead_letter_count == 0 else "completed_with_dead_letters",
            cursor_before=cursor_before,
            cursor_after=cursor_after,
            raw_events_seen=len(raw_events),
            normalized_events_written=normalized_count,
            dead_letters_written=dead_letter_count,
            warnings=warnings,
        )


def run_many(runners: Iterable[IngestionPipelineRunner]) -> list[PipelineResult]:
    return [runner.run_once() for runner in runners]
