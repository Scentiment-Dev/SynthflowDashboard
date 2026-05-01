from __future__ import annotations

from app.connectors.registry import build_connectors
from app.core.checkpoints import CheckpointStore
from app.core.config import load_settings
from app.pipelines.runner import IngestionPipelineRunner
from app.schemas.raw_event import RawSource
from app.storage.local_jsonl_store import LocalJsonlStore


def run(cursor: str | None = None) -> dict[str, object]:
    settings = load_settings()
    source = RawSource.SYNTHFLOW
    connectors = build_connectors(settings.sample_payload_dir if settings.sample_mode else None)
    checkpoint_store = CheckpointStore(settings.checkpoint_path)
    if cursor is not None:
        checkpoint_store.write(source.value, cursor)
    runner = IngestionPipelineRunner(
        pipeline_name="Synthflow calls",
        connector=connectors[source],
        checkpoint_store=checkpoint_store,
        normalized_store=LocalJsonlStore(settings.normalized_output_path),
        dead_letter_store=LocalJsonlStore(settings.dead_letter_path),
        max_retries=settings.max_retries,
    )
    return runner.run_once().model_dump(mode="json")
