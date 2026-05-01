from enum import StrEnum
from pydantic import BaseModel, Field

from app.schemas.common import AnalyticsFilters
from app.schemas.metric import MetricCard, TrustLabel
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


class SubscriptionTruthState(StrEnum):
    ACTIVE = "active"
    RETAINED = "retained"
    SAVED = "saved"
    CANCELLED = "cancelled"
    PENDING = "pending"
    UNKNOWN = "unknown"


class SourceConfirmationStatus(StrEnum):
    CONFIRMED = "confirmed"
    PENDING = "pending"
    MISSING = "missing"


class SubscriptionOverviewMetrics(BaseModel):
    subscription_overview_count: int
    cancellation_requests_count: int
    confirmed_cancellations_count: int
    save_retention_attempts_count: int
    confirmed_retained_subscriptions_count: int
    pending_stayai_confirmation_count: int


class PortalJourneyMetrics(BaseModel):
    portal_link_sent_count: int
    confirmed_portal_completion_count: int


class ShopifyContextMetrics(BaseModel):
    context_records_available_count: int
    context_role: str = "context_only"
    finalization_allowed: bool = False


class SynthflowJourneyMetrics(BaseModel):
    journey_event_count: int
    status_breakdown: dict[str, int] = Field(default_factory=dict)


class SourceConfirmationMetrics(BaseModel):
    source_of_truth_system: str = "stayai"
    source_confirmation_status: SourceConfirmationStatus
    confirmed_records_count: int
    pending_records_count: int
    missing_records_count: int


class SubscriptionAnalyticsMetricMetadata(BaseModel):
    metric_id: str
    metric_definitions: list[str]
    filters: dict[str, object]
    formula_version: str
    freshness: str
    trust_label: TrustLabel
    owner: str
    timestamp: str
    fingerprint: str
    audit_reference: str
    source_system: str
    source_confirmation_status: SourceConfirmationStatus


class SubscriptionAnalyticsResponse(BaseModel):
    module: str = "subscriptions"
    generated_from_fixture: bool = True
    final_subscription_state: SubscriptionTruthState
    source_of_truth_system: str = "stayai"
    source_confirmation_status: SourceConfirmationStatus
    subscription_overview: SubscriptionOverviewMetrics
    portal_journey: PortalJourneyMetrics
    shopify_context: ShopifyContextMetrics
    synthflow_journey: SynthflowJourneyMetrics
    source_confirmation: SourceConfirmationMetrics
    metric_metadata: SubscriptionAnalyticsMetricMetadata
