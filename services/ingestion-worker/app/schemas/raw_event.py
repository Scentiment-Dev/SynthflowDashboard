from __future__ import annotations

from enum import StrEnum
from typing import Any
from pydantic import BaseModel, Field


class RawSource(StrEnum):
    SYNTHFLOW = "synthflow"
    STAYAI = "stayai"
    SHOPIFY = "shopify"
    PORTAL = "portal"
    LIVE_AGENT = "live_agent"


class RawEvent(BaseModel):
    source: RawSource
    external_id: str
    event_type: str
    occurred_at: str
    payload: dict[str, Any] = Field(default_factory=dict)
    cursor: str | None = None
