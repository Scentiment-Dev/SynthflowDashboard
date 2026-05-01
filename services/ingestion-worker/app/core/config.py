from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import os


@dataclass(frozen=True)
class SourceConfig:
    name: str
    api_base_url: str | None = None
    api_key: str | None = None
    enabled: bool = False
    sample_file: str | None = None


@dataclass(frozen=True)
class IngestionSettings:
    mode: str = "sample"  # sample | live
    checkpoint_path: Path = Path(".local/ingestion/checkpoints.json")
    normalized_output_path: Path = Path(".local/ingestion/normalized_events.jsonl")
    dead_letter_path: Path = Path(".local/ingestion/dead_letters.jsonl")
    sample_payload_dir: Path = Path("services/ingestion-worker/app/sample_payloads")
    batch_size: int = 250
    max_retries: int = 3

    @property
    def sample_mode(self) -> bool:
        return self.mode.lower() == "sample"


def _env_bool(name: str, default: bool = False) -> bool:
    raw = os.getenv(name)
    if raw is None:
        return default
    return raw.strip().lower() in {"1", "true", "yes", "on"}


def load_settings() -> IngestionSettings:
    return IngestionSettings(
        mode=os.getenv("INGESTION_MODE", "sample"),
        checkpoint_path=Path(os.getenv("INGESTION_CHECKPOINT_PATH", ".local/ingestion/checkpoints.json")),
        normalized_output_path=Path(os.getenv("INGESTION_NORMALIZED_OUTPUT_PATH", ".local/ingestion/normalized_events.jsonl")),
        dead_letter_path=Path(os.getenv("INGESTION_DEAD_LETTER_PATH", ".local/ingestion/dead_letters.jsonl")),
        sample_payload_dir=Path(os.getenv("INGESTION_SAMPLE_PAYLOAD_DIR", "services/ingestion-worker/app/sample_payloads")),
        batch_size=int(os.getenv("INGESTION_BATCH_SIZE", "250")),
        max_retries=int(os.getenv("INGESTION_MAX_RETRIES", "3")),
    )


def source_config(source_name: str, sample_file: str) -> SourceConfig:
    prefix = source_name.upper().replace("-", "_")
    return SourceConfig(
        name=source_name,
        api_base_url=os.getenv(f"{prefix}_API_BASE_URL"),
        api_key=os.getenv(f"{prefix}_API_KEY"),
        enabled=_env_bool(f"{prefix}_INGESTION_ENABLED", False),
        sample_file=sample_file,
    )
