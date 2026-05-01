from enum import StrEnum
from pydantic import BaseModel, Field

from app.schemas.common import AuditMetadata, FreshnessMetadata


class TrustLabel(StrEnum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    UNTRUSTED = "untrusted"


class DashboardModule(StrEnum):
    OVERVIEW = "overview"
    SUBSCRIPTIONS = "subscriptions"
    CANCELLATIONS = "cancellations"
    RETENTION = "retention"
    ORDER_STATUS = "order_status"
    ESCALATIONS = "escalations"
    DATA_QUALITY = "data_quality"
    GOVERNANCE = "governance"


class MetricDefinition(BaseModel):
    metric_key: str
    display_name: str
    module: DashboardModule
    formula: str
    source_of_truth: str
    trust_rule: str
    owner: str = "analytics"
    formula_version: str = "v0.3.0"
    launch_scope: str = "base_launch"
    description: str = ""


class MetricCard(BaseModel):
    key: str
    label: str
    value: str | int | float
    delta: str | None = None
    trust_label: TrustLabel = TrustLabel.MEDIUM
    description: str
    source_of_truth: str
    freshness: FreshnessMetadata | None = None


class MetricSeriesPoint(BaseModel):
    period: str
    value: float
    numerator: float | None = None
    denominator: float | None = None
    trust_label: TrustLabel = TrustLabel.MEDIUM


class DashboardSummary(BaseModel):
    module: DashboardModule
    cards: list[MetricCard]
    metrics: list[MetricCard] = Field(default_factory=list)
    definitions: list[MetricDefinition]
    recent_events: list[dict[str, object]] = Field(default_factory=list)
    audit: AuditMetadata = Field(default_factory=AuditMetadata)


class MetricSnapshot(BaseModel):
    metric_key: str
    value: float
    trust_label: TrustLabel
    source_of_truth: str
    formula_version: str
    period_start: str
    period_end: str
