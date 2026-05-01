from __future__ import annotations

from typing import Any
from pydantic import BaseModel, Field


class NormalizedEvent(BaseModel):
    event_id: str
    source: str
    event_type: str
    occurred_at: str
    customer_id: str | None = None
    call_id: str | None = None
    subscription_id: str | None = None
    order_id: str | None = None
    is_official_outcome: bool = False
    trust_label: str = "low"
    formula_version: str = "ingestion-normalization-v1"
    source_truth_notes: list[str] = Field(default_factory=list)
    payload: dict[str, Any] = Field(default_factory=dict)
