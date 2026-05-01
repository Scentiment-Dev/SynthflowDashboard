from enum import StrEnum
from pydantic import BaseModel, Field

from app.schemas.common import AnalyticsFilters
from app.schemas.metric import MetricCard
from app.schemas.source_truth import SourceTruthDecision


class CancellationReason(StrEnum):
    COST_TOO_HIGH = "cost_too_high"
    TOO_MUCH_PRODUCT = "too_much_product"
    PRODUCT_NOT_WORKING = "product_not_working"
    SHIPPING_ISSUE = "shipping_issue"
    OTHER = "other"


class CancellationSummaryRequest(BaseModel):
    filters: AnalyticsFilters = Field(default_factory=AnalyticsFilters)


class CancellationSummary(BaseModel):
    module: str = "cancellations"
    cards: list[MetricCard]
    source_of_truth: str = "Stay.ai"
    confirmed_cancellation_rule: str = "Stay.ai cancelled state or approved official completion path required"


class CostTooHighValidationResponse(BaseModel):
    sequence_valid: bool
    decision: SourceTruthDecision
    required_sequence: list[str] = Field(
        default_factory=lambda: ["frequency_change", "discount_25_percent"]
    )
