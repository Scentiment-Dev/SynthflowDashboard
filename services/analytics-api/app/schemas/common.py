from datetime import UTC, date, datetime
from enum import StrEnum
from pydantic import BaseModel, Field


class TimeGrain(StrEnum):
    HOUR = "hour"
    DAY = "day"
    WEEK = "week"
    MONTH = "month"


class Platform(StrEnum):
    SYNTHFLOW = "synthflow"
    STAYAI = "stayai"
    SHOPIFY = "shopify"
    PORTAL = "portal"
    LIVE_AGENT = "live_agent"
    WAREHOUSE = "warehouse"
    API = "analytics_api"


class DateRange(BaseModel):
    start_date: date | None = None
    end_date: date | None = None


class AnalyticsFilters(BaseModel):
    date_range: DateRange = Field(default_factory=DateRange)
    platforms: list[Platform] = Field(default_factory=list)
    segments: list[str] = Field(default_factory=list)
    time_grain: TimeGrain = TimeGrain.DAY


class ApiMessage(BaseModel):
    status: str
    message: str
    checked_at: datetime = Field(default_factory=lambda: datetime.now(UTC))


class FreshnessMetadata(BaseModel):
    source: Platform
    last_synced_at: datetime | None = None
    warning_after_minutes: int = 60
    hard_fail_after_minutes: int = 240
    status: str = "starter"


class AuditMetadata(BaseModel):
    owner: str = "analytics"
    formula_version: str = "v0.3.0"
    generated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    audit_reference: str | None = None
