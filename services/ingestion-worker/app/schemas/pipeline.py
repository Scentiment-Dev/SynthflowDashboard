from __future__ import annotations

from pydantic import BaseModel, Field


class PipelineResult(BaseModel):
    pipeline: str
    source: str
    status: str
    cursor_before: str | None = None
    cursor_after: str | None = None
    raw_events_seen: int = 0
    normalized_events_written: int = 0
    dead_letters_written: int = 0
    warnings: list[str] = Field(default_factory=list)
