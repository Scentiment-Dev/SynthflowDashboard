from enum import StrEnum
from pydantic import BaseModel, Field

from app.schemas.common import AnalyticsFilters
from app.schemas.metric import MetricCard
from app.schemas.source_truth import SourceTruthDecision


class RetentionOffer(StrEnum):
    FREQUENCY_CHANGE = "frequency_change"
    DISCOUNT_25_PERCENT = "discount_25_percent"
    PORTAL_HANDOFF = "portal_handoff"
    HUMAN_ESCALATION = "human_escalation"


class RetentionSummaryRequest(BaseModel):
    filters: AnalyticsFilters = Field(default_factory=AnalyticsFilters)


class RetentionSummary(BaseModel):
    module: str = "retention"
    cards: list[MetricCard]
    cost_too_high_sequence: list[RetentionOffer]
    source_of_truth: str = "Stay.ai"


class SaveConfirmationResponse(BaseModel):
    save_confirmed: bool
    decision: SourceTruthDecision
