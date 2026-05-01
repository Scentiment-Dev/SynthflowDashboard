from pathlib import Path

from app.connectors.registry import build_connectors
from app.core.checkpoints import CheckpointStore
from app.pipelines.runner import IngestionPipelineRunner
from app.schemas.raw_event import RawSource
from app.storage.local_jsonl_store import LocalJsonlStore

SAMPLE_DIR = Path(__file__).resolve().parents[1] / "app" / "sample_payloads"


def test_pipeline_runner_writes_normalized_events(tmp_path: Path) -> None:
    connectors = build_connectors(SAMPLE_DIR)
    runner = IngestionPipelineRunner(
        pipeline_name="Stay.ai subscriptions",
        connector=connectors[RawSource.STAYAI],
        checkpoint_store=CheckpointStore(tmp_path / "checkpoints.json"),
        normalized_store=LocalJsonlStore(tmp_path / "normalized.jsonl"),
        dead_letter_store=LocalJsonlStore(tmp_path / "dead.jsonl"),
    )
    result = runner.run_once()
    assert result.status == "ok"
    assert result.normalized_events_written >= 1
    rows = LocalJsonlStore(tmp_path / "normalized.jsonl").read_all()
    assert rows[0]["source"] == "stayai"
