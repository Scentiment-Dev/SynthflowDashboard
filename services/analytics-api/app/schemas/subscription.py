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


class SourceSystem(StrEnum):
    STAY_AI = "stay_ai"
    SYNTHFLOW = "synthflow"
    SHOPIFY = "shopify"
    PORTAL = "portal"


class SourceAuthorityLevel(StrEnum):
    AUTHORITATIVE_FINAL_STATE = "authoritative_final_state"
    JOURNEY_EVENT_AUTHORITATIVE = "journey_event_authoritative"
    CONTEXT_ONLY = "context_only"
    COMPLETION_SIGNAL = "completion_signal"


class FreshnessStatus(StrEnum):
    FRESH = "fresh"
    STALE = "stale"
    UNKNOWN = "unknown"


class DataQualityStatus(StrEnum):
    PASSING = "passing"
    WARNING = "warning"
    FAILING = "failing"


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


class SubscriptionOutcomeActionType(StrEnum):
    CANCEL = "cancel"
    SAVE = "save"
    PAUSE = "pause"
    SKIP = "skip"
    FREQUENCY_CHANGE = "frequency_change"
    ADDRESS_CHANGE = "address_change"
    PAYMENT_UPDATE = "payment_update"
    OTHER = "other"


class SubscriptionOutcomeMetricMetadata(BaseModel):
    metric_id: str
    filters: dict[str, object]
    metric_definitions: list[str]
    trust_label: TrustLabel
    freshness_status: FreshnessStatus
    formula_version: str
    owner: str
    timestamp: str
    fingerprint: str
    audit_reference: str
    source_confirmation_status: SourceConfirmationStatus


class SubscriptionOutcomeMetrics(BaseModel):
    subscription_contacts_total: int
    subscription_action_requests_total: int
    cancellation_requests_total: int
    confirmed_cancellations_total: int
    save_or_retention_attempts_total: int
    confirmed_retained_total: int
    non_cancellation_actions_total: int
    pending_stayai_confirmation_total: int
    missing_stayai_final_state_total: int
    portal_link_sent_total: int
    portal_completion_confirmed_total: int
    shopify_context_available_total: int
    synthflow_subscription_journeys_total: int
    subscription_outcome_unknown_total: int
    retention_rate: float
    cancellation_confirmation_rate: float
    portal_completion_rate: float


class SubscriptionOutcomesResponse(BaseModel):
    module: str = "subscriptions"
    generated_from_fixture: bool = True
    source_of_truth_system: str = "stayai"
    source_confirmation_status: SourceConfirmationStatus
    scenario: str
    metrics: SubscriptionOutcomeMetrics
    metadata: SubscriptionOutcomeMetricMetadata


class SubscriptionSourceHealthSource(BaseModel):
    source_system: SourceSystem
    source_authority_level: SourceAuthorityLevel
    record_count: int
    last_seen_at: str
    freshness_status: FreshnessStatus
    freshness_minutes: int
    source_confirmation_status: SourceConfirmationStatus
    data_quality_status: DataQualityStatus
    conflict_count: int
    missing_required_fields: list[str] = Field(default_factory=list)
    lineage_reference: str
    owner: str
    formula_version: str
    audit_reference: str
    trust_label: TrustLabel


class SubscriptionSourceHealthMetadata(BaseModel):
    timestamp: str
    fingerprint: str
    formula_version: str
    owner: str
    audit_reference: str


class SubscriptionSourceHealthResponse(BaseModel):
    module: str = "subscriptions"
    generated_from_fixture: bool = True
    overall_source_health: str
    conflict_status: str
    pending_or_unknown_final_outcome: bool
    missing_stay_ai_final_state_warning: str | None = None
    portal_completion_warning: str | None = None
    shopify_context_warning: str
    sources: list[SubscriptionSourceHealthSource]
    metadata: SubscriptionSourceHealthMetadata
