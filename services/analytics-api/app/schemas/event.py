from datetime import UTC, datetime
from pydantic import BaseModel, Field

from app.schemas.common import Platform


class EventLogRecord(BaseModel):
    event_id: str
    source: Platform
    event_type: str
    occurred_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    payload: dict[str, object] = Field(default_factory=dict)
    normalized: bool = False
    source_reference_id: str | None = None
