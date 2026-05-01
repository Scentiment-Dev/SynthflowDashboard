from enum import StrEnum
from pydantic import BaseModel, Field

from app.schemas.common import AnalyticsFilters
from app.schemas.metric import MetricCard
from app.schemas.source_truth import OutcomeEvidence, SourceTruthDecision


class SubscriptionAction(StrEnum):
    SKIP = "skip"
    PAUSE = "pause"
    FREQUENCY_CHANGE = "frequency_change"
    ADDRESS_CHANGE = "address_change"
    PAYMENT_UPDATE = "payment_update"
    CANCEL = "cancel"
    SAVE = "save"


class SubscriptionAnalyticsRequest(BaseModel):
    filters: AnalyticsFilters = Field(default_factory=AnalyticsFilters)


class SubscriptionSummary(BaseModel):
    module: str = "subscriptions"
    cards: list[MetricCard]
    source_of_truth: str = "Stay.ai"
    required_confirmation: str = "Stay.ai confirmed state/action outcome"


class SubscriptionActionConfirmationRequest(BaseModel):
    action: SubscriptionAction
    evidence: OutcomeEvidence | None = None


class SubscriptionActionConfirmationResponse(BaseModel):
    action: SubscriptionAction
    decision: SourceTruthDecision
