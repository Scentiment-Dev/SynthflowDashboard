from enum import StrEnum
from pydantic import BaseModel, Field

from app.schemas.common import AnalyticsFilters
from app.schemas.metric import MetricCard, TrustLabel
from app.schemas.source_truth import OutcomeEvidence, SourceTruthDecision


class SubscriptionExportScope(StrEnum):
    EXPORT_CURRENT_PAGE = "export_current_page"
    EXPORT_WIDGET = "export_widget"
    EXPORT_TABLE_ROWS = "export_table_rows"
    EXPORT_FILTERED_CSV = "export_filtered_csv"
    EXPORT_PDF_SNAPSHOT = "export_pdf_snapshot"
    EXPORT_AUDIT_MANIFEST = "export_audit_manifest"


class SubscriptionExportFormat(StrEnum):
    CSV = "csv"
    PDF = "pdf"
    MANIFEST = "manifest"
    CSV_PDF_BUNDLE = "csv_pdf_bundle"
    JSON = "json"


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


class TrendDirection(StrEnum):
    UP = "up"
    DOWN = "down"
    FLAT = "flat"
    UNKNOWN = "unknown"


class MetricSeverity(StrEnum):
    INFO = "info"
    SUCCESS = "success"
    WARNING = "warning"
    CRITICAL = "critical"


class VisualTone(StrEnum):
    NEUTRAL = "neutral"
    POSITIVE = "positive"
    CAUTION = "caution"
    CRITICAL = "critical"


class PresentationMetadata(BaseModel):
    display_label: str
    short_label: str
    executive_summary: str
    format_type: str
    unit: str
    trend_direction: TrendDirection
    comparison_label: str
    comparison_value: float | None = None
    severity: MetricSeverity
    visual_tone: VisualTone
    source_authority_explanation: str
    trust_explanation: str
    freshness_explanation: str
    drilldown_hint: str
    empty_state_copy: str
    blocked_state_copy: str


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
    presentation: PresentationMetadata


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


class BusinessValueState(StrEnum):
    CONFIRMED = "confirmed"
    ESTIMATED = "estimated"
    UNKNOWN = "unknown"
    PENDING = "pending"
    BLOCKED_BY_DATA = "blocked_by_data"


class SubscriptionBusinessValueMetric(BaseModel):
    metric_id: str
    display_label: str
    plain_language_summary: str
    value_state: BusinessValueState
    format: str
    formula_version: str
    source_confirmation_status: SourceConfirmationStatus
    trust_label: TrustLabel
    freshness_status: FreshnessStatus
    owner: str
    timestamp: str
    fingerprint: str
    audit_reference: str
    missing_data_reason: str | None = None
    next_action_hint: str
    support_label: str
    support_summary: str
    why_it_matters: str
    what_to_do_next: str
    blocked_reason_plain_language: str | None = None
    metric_key: str
    display_name: str
    value: float | int | None
    unit: str
    state: BusinessValueState
    formula: str
    source_of_truth: str
    data_dependencies: list[str] = Field(default_factory=list)
    notes: str | None = None


class SubscriptionBusinessValueMetadata(BaseModel):
    metric_id: str
    filters: dict[str, object]
    trust_label: TrustLabel
    freshness_status: FreshnessStatus
    formula_version: str
    owner: str
    timestamp: str
    fingerprint: str
    audit_reference: str
    blocked_metrics_count: int
    source_confirmation_status: SourceConfirmationStatus
    presentation: PresentationMetadata


class SubscriptionBusinessValueResponse(BaseModel):
    module: str = "subscriptions"
    generated_from_fixture: bool = True
    source_of_truth_system: str = "stayai"
    source_confirmation_status: SourceConfirmationStatus
    scenario: str
    metrics: list[SubscriptionBusinessValueMetric]
    metadata: SubscriptionBusinessValueMetadata


class SubscriptionFilterOption(BaseModel):
    filter_id: str
    label: str
    plain_language_help: str
    allowed_values: list[str] = Field(default_factory=list)
    is_enabled: bool
    is_disabled_reason: str | None = None
    data_dependency: str
    source_system: str
    trust_impact: str
    applies_to_pages: list[str] = Field(default_factory=list)


class SubscriptionAdvancedFilterResponse(BaseModel):
    module: str = "subscriptions"
    generated_from_fixture: bool = True
    scenario: str
    options: list[SubscriptionFilterOption]
    applied_filters: dict[str, object]
    metadata: "SubscriptionOutcomeMetricMetadata"


class SubscriptionExportPreflightRequest(BaseModel):
    requested_scope: SubscriptionExportScope
    requested_format: SubscriptionExportFormat
    requester_role: str | None = None
    filters: dict[str, object] = Field(default_factory=dict)
    comparison_period: str = "none"
    included_widgets: list[str] = Field(default_factory=list)


class SubscriptionExportPreflightResponse(BaseModel):
    module: str = "subscriptions"
    export_allowed: bool
    blocked_reason: str | None = None
    requested_scope: SubscriptionExportScope
    requested_format: SubscriptionExportFormat
    filters: dict[str, object]
    comparison_period: str
    metric_definitions: list[str]
    trust_labels: list[str]
    freshness: str
    formula_versions: list[str]
    owner: str
    timestamp: str
    fingerprint: str
    audit_reference: str
    requester_role: str
    permission_decision: str
    source_confirmation_status: SourceConfirmationStatus
    included_widgets: list[str]
    excluded_widgets: list[str]
    missing_required_metadata: list[str]


class SubscriptionFollowUpRecord(BaseModel):
    customer_or_case_id: str
    recommended_action: str
    reason: str
    priority: str
    status: str
    source_system: str
    blocking_data_gap: str | None = None
    stayai_confirmation_status: SourceConfirmationStatus
    portal_completion_status: str
    estimated_value_at_risk: float | None = None
    last_event_at: str
    owner_queue: str
    sla_status: str
    audit_reference: str
    support_label: str
    support_summary: str
    why_it_matters: str
    what_to_do_next: str
    blocked_reason_plain_language: str | None = None


class SubscriptionFollowUpResponse(BaseModel):
    module: str = "subscriptions"
    generated_from_fixture: bool = True
    scenario: str
    records: list[SubscriptionFollowUpRecord]
    metadata: "SubscriptionOutcomeMetricMetadata"


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
    presentation: PresentationMetadata


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
    presentation: PresentationMetadata


class SubscriptionSourceHealthMetadata(BaseModel):
    timestamp: str
    fingerprint: str
    formula_version: str
    owner: str
    audit_reference: str
    presentation: PresentationMetadata


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
