from hashlib import sha256
from json import dumps
from typing import TypedDict
from uuid import uuid4

from app.core.security import Role
from app.schemas.metric import MetricCard, TrustLabel
from app.schemas.source_truth import (
    PortalSuccessValidationRequest,
    SourceTruthDecision,
    SubscriptionOutcomeValidationRequest,
)
from app.schemas.subscription import (
    SubscriptionAdvancedFilterResponse,
    BusinessValueState,
    DataQualityStatus,
    FreshnessStatus,
    MetricSeverity,
    PresentationMetadata,
    SubscriptionOutcomeActionType,
    SubscriptionOutcomeMetricMetadata,
    SubscriptionOutcomeMetrics,
    SubscriptionOutcomesResponse,
    SourceAuthorityLevel,
    SourceConfirmationMetrics,
    SourceConfirmationStatus,
    SourceSystem,
    SubscriptionActionConfirmationRequest,
    SubscriptionActionConfirmationResponse,
    SubscriptionAnalyticsMetricMetadata,
    SubscriptionAnalyticsResponse,
    SubscriptionBusinessValueMetadata,
    SubscriptionBusinessValueMetric,
    SubscriptionBusinessValueResponse,
    SubscriptionExportPreflightRequest,
    SubscriptionExportPreflightResponse,
    SubscriptionExportScope,
    SubscriptionFilterOption,
    SubscriptionFollowUpRecord,
    SubscriptionFollowUpResponse,
    SubscriptionOverviewMetrics,
    SubscriptionSourceHealthMetadata,
    SubscriptionSourceHealthResponse,
    SubscriptionSourceHealthSource,
    SubscriptionTruthState,
    TrendDirection,
    VisualTone,
    SubscriptionSummary,
    PortalJourneyMetrics,
    ShopifyContextMetrics,
    SynthflowJourneyMetrics,
)
from app.services.source_truth_service import SourceTruthService


class SubscriptionOverviewFixture(TypedDict):
    subscription_overview_count: int
    cancellation_requests_count: int
    confirmed_cancellations_count: int
    save_retention_attempts_count: int
    confirmed_retained_subscriptions_count: int
    pending_stayai_confirmation_count: int


class PortalJourneyFixture(TypedDict):
    portal_link_sent_count: int
    confirmed_portal_completion_count: int


class ShopifyContextFixture(TypedDict):
    context_records_available_count: int


class SynthflowJourneyFixture(TypedDict):
    journey_event_count: int
    status_breakdown: dict[str, int]


class SourceConfirmationFixture(TypedDict):
    confirmed_records_count: int
    pending_records_count: int
    missing_records_count: int


class SubscriptionAnalyticsFixture(TypedDict):
    final_subscription_state: SubscriptionTruthState
    source_confirmation_status: SourceConfirmationStatus
    subscription_overview: SubscriptionOverviewFixture
    portal_journey: PortalJourneyFixture
    shopify_context: ShopifyContextFixture
    synthflow_journey: SynthflowJourneyFixture
    source_confirmation: SourceConfirmationFixture
    freshness: str
    timestamp: str
    filters: dict[str, object]


class SourceHealthSourceFixture(TypedDict):
    source_system: SourceSystem
    source_authority_level: SourceAuthorityLevel
    record_count: int
    last_seen_at: str
    freshness_status: FreshnessStatus
    freshness_minutes: int
    source_confirmation_status: SourceConfirmationStatus
    data_quality_status: DataQualityStatus
    conflict_count: int
    missing_required_fields: list[str]
    lineage_reference: str
    owner: str
    formula_version: str
    audit_reference: str
    trust_label: TrustLabel


class SourceHealthFixture(TypedDict):
    sources: list[SourceHealthSourceFixture]
    timestamp: str
    formula_version: str
    owner: str
    audit_reference: str


class SubscriptionOutcomeRecordFixture(TypedDict):
    contact_id: str
    action_requested: bool
    action_type: SubscriptionOutcomeActionType
    stayai_final_state: SubscriptionTruthState | None
    stayai_confirmation_status: SourceConfirmationStatus
    approved_official_completion_path: bool
    portal_link_sent: bool
    portal_completion_confirmed: bool
    shopify_context_available: bool
    synthflow_journey_present: bool
    synthflow_journey_status: str
    non_cancellation_action_completed: bool


class SubscriptionOutcomeScenarioFixture(TypedDict):
    records: list[SubscriptionOutcomeRecordFixture]
    freshness_status: FreshnessStatus
    timestamp: str
    filters: dict[str, object]
    formula_version: str
    owner: str
    audit_reference: str


class SubscriptionBusinessValueMetricFixture(TypedDict):
    metric_key: str
    display_name: str
    value: float | int | None
    unit: str
    state: BusinessValueState
    formula: str
    source_of_truth: str
    data_dependencies: list[str]
    notes: str | None


class SubscriptionBusinessValueScenarioFixture(TypedDict):
    source_confirmation_status: SourceConfirmationStatus
    metrics: list[SubscriptionBusinessValueMetricFixture]
    freshness_status: FreshnessStatus
    timestamp: str
    filters: dict[str, object]
    formula_version: str
    owner: str
    audit_reference: str


class SubscriptionFilterOptionFixture(TypedDict):
    filter_id: str
    label: str
    plain_language_help: str
    allowed_values: list[str]
    is_enabled: bool
    is_disabled_reason: str | None
    data_dependency: str
    source_system: str
    trust_impact: str
    applies_to_pages: list[str]


class SubscriptionFollowUpRecordFixture(TypedDict):
    customer_or_case_id: str
    recommended_action: str
    reason: str
    priority: str
    status: str
    source_system: str
    blocking_data_gap: str | None
    stayai_confirmation_status: SourceConfirmationStatus
    portal_completion_status: str
    estimated_value_at_risk: float | None
    last_event_at: str
    owner_queue: str
    sla_status: str
    audit_reference: str
    support_label: str
    support_summary: str
    why_it_matters: str
    what_to_do_next: str
    blocked_reason_plain_language: str | None


SUBSCRIPTION_ANALYTICS_FIXTURES: dict[str, SubscriptionAnalyticsFixture] = {
    "baseline": {
        "final_subscription_state": SubscriptionTruthState.RETAINED,
        "source_confirmation_status": SourceConfirmationStatus.CONFIRMED,
        "subscription_overview": {
            "subscription_overview_count": 120,
            "cancellation_requests_count": 34,
            "confirmed_cancellations_count": 11,
            "save_retention_attempts_count": 23,
            "confirmed_retained_subscriptions_count": 18,
            "pending_stayai_confirmation_count": 5,
        },
        "portal_journey": {
            "portal_link_sent_count": 16,
            "confirmed_portal_completion_count": 10,
        },
        "shopify_context": {
            "context_records_available_count": 116,
        },
        "synthflow_journey": {
            "journey_event_count": 148,
            "status_breakdown": {
                "completed": 92,
                "unresolved": 18,
                "transferred": 21,
                "abandoned": 17,
            },
        },
        "source_confirmation": {
            "confirmed_records_count": 115,
            "pending_records_count": 5,
            "missing_records_count": 0,
        },
        "freshness": "fresh",
        "timestamp": "2026-05-01T00:00:00Z",
        "filters": {"date_range": "last_7_days", "platforms": ["stayai", "synthflow", "shopify"]},
    },
    "missing_stayai_confirmation": {
        "final_subscription_state": SubscriptionTruthState.UNKNOWN,
        "source_confirmation_status": SourceConfirmationStatus.MISSING,
        "subscription_overview": {
            "subscription_overview_count": 120,
            "cancellation_requests_count": 34,
            "confirmed_cancellations_count": 0,
            "save_retention_attempts_count": 23,
            "confirmed_retained_subscriptions_count": 0,
            "pending_stayai_confirmation_count": 34,
        },
        "portal_journey": {
            "portal_link_sent_count": 16,
            "confirmed_portal_completion_count": 0,
        },
        "shopify_context": {
            "context_records_available_count": 116,
        },
        "synthflow_journey": {
            "journey_event_count": 148,
            "status_breakdown": {
                "completed": 0,
                "unresolved": 63,
                "transferred": 47,
                "abandoned": 38,
            },
        },
        "source_confirmation": {
            "confirmed_records_count": 0,
            "pending_records_count": 34,
            "missing_records_count": 86,
        },
        "freshness": "stale",
        "timestamp": "2026-05-01T00:00:00Z",
        "filters": {"date_range": "last_7_days", "platforms": ["synthflow", "shopify"]},
    },
}

SUBSCRIPTION_SOURCE_HEALTH_FIXTURES: dict[str, SourceHealthFixture] = {
    "baseline": {
        "sources": [
            {
                "source_system": SourceSystem.STAY_AI,
                "source_authority_level": SourceAuthorityLevel.AUTHORITATIVE_FINAL_STATE,
                "record_count": 120,
                "last_seen_at": "2026-05-04T09:55:00Z",
                "freshness_status": FreshnessStatus.FRESH,
                "freshness_minutes": 5,
                "source_confirmation_status": SourceConfirmationStatus.CONFIRMED,
                "data_quality_status": DataQualityStatus.PASSING,
                "conflict_count": 0,
                "missing_required_fields": [],
                "lineage_reference": "ingestion.stayai.subscription_state.v1",
                "owner": "analytics",
                "formula_version": "v0.5.0",
                "audit_reference": "audit-source-health-baseline-20260504",
                "trust_label": TrustLabel.HIGH,
            },
            {
                "source_system": SourceSystem.SYNTHFLOW,
                "source_authority_level": SourceAuthorityLevel.JOURNEY_EVENT_AUTHORITATIVE,
                "record_count": 148,
                "last_seen_at": "2026-05-04T09:53:00Z",
                "freshness_status": FreshnessStatus.FRESH,
                "freshness_minutes": 7,
                "source_confirmation_status": SourceConfirmationStatus.CONFIRMED,
                "data_quality_status": DataQualityStatus.PASSING,
                "conflict_count": 0,
                "missing_required_fields": [],
                "lineage_reference": "ingestion.synthflow.call_journey.v1",
                "owner": "analytics",
                "formula_version": "v0.5.0",
                "audit_reference": "audit-source-health-baseline-20260504",
                "trust_label": TrustLabel.HIGH,
            },
            {
                "source_system": SourceSystem.SHOPIFY,
                "source_authority_level": SourceAuthorityLevel.CONTEXT_ONLY,
                "record_count": 116,
                "last_seen_at": "2026-05-04T09:51:00Z",
                "freshness_status": FreshnessStatus.FRESH,
                "freshness_minutes": 9,
                "source_confirmation_status": SourceConfirmationStatus.CONFIRMED,
                "data_quality_status": DataQualityStatus.PASSING,
                "conflict_count": 0,
                "missing_required_fields": [],
                "lineage_reference": "ingestion.shopify.order_context.v1",
                "owner": "analytics",
                "formula_version": "v0.5.0",
                "audit_reference": "audit-source-health-baseline-20260504",
                "trust_label": TrustLabel.MEDIUM,
            },
            {
                "source_system": SourceSystem.PORTAL,
                "source_authority_level": SourceAuthorityLevel.COMPLETION_SIGNAL,
                "record_count": 16,
                "last_seen_at": "2026-05-04T09:48:00Z",
                "freshness_status": FreshnessStatus.FRESH,
                "freshness_minutes": 12,
                "source_confirmation_status": SourceConfirmationStatus.PENDING,
                "data_quality_status": DataQualityStatus.WARNING,
                "conflict_count": 0,
                "missing_required_fields": ["confirmed_completion_event_id"],
                "lineage_reference": "ingestion.portal.completion_signal.v1",
                "owner": "analytics",
                "formula_version": "v0.5.0",
                "audit_reference": "audit-source-health-baseline-20260504",
                "trust_label": TrustLabel.MEDIUM,
            },
        ],
        "timestamp": "2026-05-04T10:00:00Z",
        "formula_version": "v0.5.0",
        "owner": "analytics",
        "audit_reference": "audit-source-health-baseline-20260504",
    },
    "missing_stayai_final_state": {
        "sources": [
            {
                "source_system": SourceSystem.STAY_AI,
                "source_authority_level": SourceAuthorityLevel.AUTHORITATIVE_FINAL_STATE,
                "record_count": 120,
                "last_seen_at": "2026-05-04T06:15:00Z",
                "freshness_status": FreshnessStatus.STALE,
                "freshness_minutes": 225,
                "source_confirmation_status": SourceConfirmationStatus.MISSING,
                "data_quality_status": DataQualityStatus.WARNING,
                "conflict_count": 0,
                "missing_required_fields": ["final_subscription_state"],
                "lineage_reference": "ingestion.stayai.subscription_state.v1",
                "owner": "analytics",
                "formula_version": "v0.5.0",
                "audit_reference": "audit-source-health-missing-stayai-20260504",
                "trust_label": TrustLabel.LOW,
            },
            {
                "source_system": SourceSystem.SYNTHFLOW,
                "source_authority_level": SourceAuthorityLevel.JOURNEY_EVENT_AUTHORITATIVE,
                "record_count": 148,
                "last_seen_at": "2026-05-04T09:53:00Z",
                "freshness_status": FreshnessStatus.FRESH,
                "freshness_minutes": 7,
                "source_confirmation_status": SourceConfirmationStatus.CONFIRMED,
                "data_quality_status": DataQualityStatus.PASSING,
                "conflict_count": 0,
                "missing_required_fields": [],
                "lineage_reference": "ingestion.synthflow.call_journey.v1",
                "owner": "analytics",
                "formula_version": "v0.5.0",
                "audit_reference": "audit-source-health-missing-stayai-20260504",
                "trust_label": TrustLabel.HIGH,
            },
            {
                "source_system": SourceSystem.SHOPIFY,
                "source_authority_level": SourceAuthorityLevel.CONTEXT_ONLY,
                "record_count": 116,
                "last_seen_at": "2026-05-04T09:51:00Z",
                "freshness_status": FreshnessStatus.FRESH,
                "freshness_minutes": 9,
                "source_confirmation_status": SourceConfirmationStatus.CONFIRMED,
                "data_quality_status": DataQualityStatus.PASSING,
                "conflict_count": 0,
                "missing_required_fields": [],
                "lineage_reference": "ingestion.shopify.order_context.v1",
                "owner": "analytics",
                "formula_version": "v0.5.0",
                "audit_reference": "audit-source-health-missing-stayai-20260504",
                "trust_label": TrustLabel.MEDIUM,
            },
            {
                "source_system": SourceSystem.PORTAL,
                "source_authority_level": SourceAuthorityLevel.COMPLETION_SIGNAL,
                "record_count": 16,
                "last_seen_at": "2026-05-04T09:48:00Z",
                "freshness_status": FreshnessStatus.FRESH,
                "freshness_minutes": 12,
                "source_confirmation_status": SourceConfirmationStatus.PENDING,
                "data_quality_status": DataQualityStatus.WARNING,
                "conflict_count": 0,
                "missing_required_fields": ["confirmed_completion_event_id"],
                "lineage_reference": "ingestion.portal.completion_signal.v1",
                "owner": "analytics",
                "formula_version": "v0.5.0",
                "audit_reference": "audit-source-health-missing-stayai-20260504",
                "trust_label": TrustLabel.MEDIUM,
            },
        ],
        "timestamp": "2026-05-04T10:00:00Z",
        "formula_version": "v0.5.0",
        "owner": "analytics",
        "audit_reference": "audit-source-health-missing-stayai-20260504",
    },
    "failing_quality_with_missing_stayai": {
        "sources": [
            {
                "source_system": SourceSystem.STAY_AI,
                "source_authority_level": SourceAuthorityLevel.AUTHORITATIVE_FINAL_STATE,
                "record_count": 120,
                "last_seen_at": "2026-05-04T06:15:00Z",
                "freshness_status": FreshnessStatus.STALE,
                "freshness_minutes": 225,
                "source_confirmation_status": SourceConfirmationStatus.MISSING,
                "data_quality_status": DataQualityStatus.WARNING,
                "conflict_count": 0,
                "missing_required_fields": ["final_subscription_state"],
                "lineage_reference": "ingestion.stayai.subscription_state.v1",
                "owner": "analytics",
                "formula_version": "v0.5.0",
                "audit_reference": "audit-source-health-failing-quality-20260504",
                "trust_label": TrustLabel.LOW,
            },
            {
                "source_system": SourceSystem.SYNTHFLOW,
                "source_authority_level": SourceAuthorityLevel.JOURNEY_EVENT_AUTHORITATIVE,
                "record_count": 148,
                "last_seen_at": "2026-05-04T09:53:00Z",
                "freshness_status": FreshnessStatus.FRESH,
                "freshness_minutes": 7,
                "source_confirmation_status": SourceConfirmationStatus.CONFIRMED,
                "data_quality_status": DataQualityStatus.FAILING,
                "conflict_count": 0,
                "missing_required_fields": ["journey_disposition"],
                "lineage_reference": "ingestion.synthflow.call_journey.v1",
                "owner": "analytics",
                "formula_version": "v0.5.0",
                "audit_reference": "audit-source-health-failing-quality-20260504",
                "trust_label": TrustLabel.LOW,
            },
            {
                "source_system": SourceSystem.SHOPIFY,
                "source_authority_level": SourceAuthorityLevel.CONTEXT_ONLY,
                "record_count": 116,
                "last_seen_at": "2026-05-04T09:51:00Z",
                "freshness_status": FreshnessStatus.FRESH,
                "freshness_minutes": 9,
                "source_confirmation_status": SourceConfirmationStatus.CONFIRMED,
                "data_quality_status": DataQualityStatus.PASSING,
                "conflict_count": 0,
                "missing_required_fields": [],
                "lineage_reference": "ingestion.shopify.order_context.v1",
                "owner": "analytics",
                "formula_version": "v0.5.0",
                "audit_reference": "audit-source-health-failing-quality-20260504",
                "trust_label": TrustLabel.MEDIUM,
            },
            {
                "source_system": SourceSystem.PORTAL,
                "source_authority_level": SourceAuthorityLevel.COMPLETION_SIGNAL,
                "record_count": 16,
                "last_seen_at": "2026-05-04T09:48:00Z",
                "freshness_status": FreshnessStatus.FRESH,
                "freshness_minutes": 12,
                "source_confirmation_status": SourceConfirmationStatus.PENDING,
                "data_quality_status": DataQualityStatus.WARNING,
                "conflict_count": 0,
                "missing_required_fields": ["confirmed_completion_event_id"],
                "lineage_reference": "ingestion.portal.completion_signal.v1",
                "owner": "analytics",
                "formula_version": "v0.5.0",
                "audit_reference": "audit-source-health-failing-quality-20260504",
                "trust_label": TrustLabel.MEDIUM,
            },
        ],
        "timestamp": "2026-05-04T10:00:00Z",
        "formula_version": "v0.5.0",
        "owner": "analytics",
        "audit_reference": "audit-source-health-failing-quality-20260504",
    },
    "conflicting_sources": {
        "sources": [
            {
                "source_system": SourceSystem.STAY_AI,
                "source_authority_level": SourceAuthorityLevel.AUTHORITATIVE_FINAL_STATE,
                "record_count": 120,
                "last_seen_at": "2026-05-04T09:55:00Z",
                "freshness_status": FreshnessStatus.FRESH,
                "freshness_minutes": 5,
                "source_confirmation_status": SourceConfirmationStatus.CONFIRMED,
                "data_quality_status": DataQualityStatus.PASSING,
                "conflict_count": 2,
                "missing_required_fields": [],
                "lineage_reference": "ingestion.stayai.subscription_state.v1",
                "owner": "analytics",
                "formula_version": "v0.5.0",
                "audit_reference": "audit-source-health-conflicts-20260504",
                "trust_label": TrustLabel.HIGH,
            },
            {
                "source_system": SourceSystem.SYNTHFLOW,
                "source_authority_level": SourceAuthorityLevel.JOURNEY_EVENT_AUTHORITATIVE,
                "record_count": 148,
                "last_seen_at": "2026-05-04T09:53:00Z",
                "freshness_status": FreshnessStatus.FRESH,
                "freshness_minutes": 7,
                "source_confirmation_status": SourceConfirmationStatus.PENDING,
                "data_quality_status": DataQualityStatus.WARNING,
                "conflict_count": 2,
                "missing_required_fields": ["journey_final_outcome"],
                "lineage_reference": "ingestion.synthflow.call_journey.v1",
                "owner": "analytics",
                "formula_version": "v0.5.0",
                "audit_reference": "audit-source-health-conflicts-20260504",
                "trust_label": TrustLabel.MEDIUM,
            },
            {
                "source_system": SourceSystem.SHOPIFY,
                "source_authority_level": SourceAuthorityLevel.CONTEXT_ONLY,
                "record_count": 116,
                "last_seen_at": "2026-05-04T09:51:00Z",
                "freshness_status": FreshnessStatus.FRESH,
                "freshness_minutes": 9,
                "source_confirmation_status": SourceConfirmationStatus.CONFIRMED,
                "data_quality_status": DataQualityStatus.PASSING,
                "conflict_count": 1,
                "missing_required_fields": [],
                "lineage_reference": "ingestion.shopify.order_context.v1",
                "owner": "analytics",
                "formula_version": "v0.5.0",
                "audit_reference": "audit-source-health-conflicts-20260504",
                "trust_label": TrustLabel.MEDIUM,
            },
            {
                "source_system": SourceSystem.PORTAL,
                "source_authority_level": SourceAuthorityLevel.COMPLETION_SIGNAL,
                "record_count": 16,
                "last_seen_at": "2026-05-04T09:48:00Z",
                "freshness_status": FreshnessStatus.FRESH,
                "freshness_minutes": 12,
                "source_confirmation_status": SourceConfirmationStatus.PENDING,
                "data_quality_status": DataQualityStatus.WARNING,
                "conflict_count": 0,
                "missing_required_fields": ["confirmed_completion_event_id"],
                "lineage_reference": "ingestion.portal.completion_signal.v1",
                "owner": "analytics",
                "formula_version": "v0.5.0",
                "audit_reference": "audit-source-health-conflicts-20260504",
                "trust_label": TrustLabel.MEDIUM,
            },
        ],
        "timestamp": "2026-05-04T10:00:00Z",
        "formula_version": "v0.5.0",
        "owner": "analytics",
        "audit_reference": "audit-source-health-conflicts-20260504",
    },
}


SUBSCRIPTION_OUTCOME_FIXTURES: dict[str, SubscriptionOutcomeScenarioFixture] = {
    "baseline": {
        "records": [
            {
                "contact_id": "sub-001",
                "action_requested": True,
                "action_type": SubscriptionOutcomeActionType.CANCEL,
                "stayai_final_state": SubscriptionTruthState.CANCELLED,
                "stayai_confirmation_status": SourceConfirmationStatus.CONFIRMED,
                "approved_official_completion_path": False,
                "portal_link_sent": True,
                "portal_completion_confirmed": True,
                "shopify_context_available": True,
                "synthflow_journey_present": True,
                "synthflow_journey_status": "completed",
                "non_cancellation_action_completed": False,
            },
            {
                "contact_id": "sub-002",
                "action_requested": True,
                "action_type": SubscriptionOutcomeActionType.SAVE,
                "stayai_final_state": SubscriptionTruthState.RETAINED,
                "stayai_confirmation_status": SourceConfirmationStatus.CONFIRMED,
                "approved_official_completion_path": False,
                "portal_link_sent": False,
                "portal_completion_confirmed": False,
                "shopify_context_available": True,
                "synthflow_journey_present": True,
                "synthflow_journey_status": "completed",
                "non_cancellation_action_completed": False,
            },
            {
                "contact_id": "sub-003",
                "action_requested": True,
                "action_type": SubscriptionOutcomeActionType.PAUSE,
                "stayai_final_state": SubscriptionTruthState.ACTIVE,
                "stayai_confirmation_status": SourceConfirmationStatus.CONFIRMED,
                "approved_official_completion_path": False,
                "portal_link_sent": False,
                "portal_completion_confirmed": False,
                "shopify_context_available": True,
                "synthflow_journey_present": True,
                "synthflow_journey_status": "completed",
                "non_cancellation_action_completed": True,
            },
            {
                "contact_id": "sub-004",
                "action_requested": True,
                "action_type": SubscriptionOutcomeActionType.CANCEL,
                "stayai_final_state": None,
                "stayai_confirmation_status": SourceConfirmationStatus.PENDING,
                "approved_official_completion_path": False,
                "portal_link_sent": True,
                "portal_completion_confirmed": False,
                "shopify_context_available": True,
                "synthflow_journey_present": True,
                "synthflow_journey_status": "unresolved",
                "non_cancellation_action_completed": False,
            },
        ],
        "freshness_status": FreshnessStatus.FRESH,
        "timestamp": "2026-05-04T00:00:00Z",
        "filters": {"date_range": "last_7_days", "module": "subscriptions"},
        "formula_version": "v0.5.0",
        "owner": "analytics",
        "audit_reference": "audit-subscription-outcomes-baseline-20260504",
    },
    "confirmed_cancellation": {
        "records": [
            {
                "contact_id": "sub-cancel-001",
                "action_requested": True,
                "action_type": SubscriptionOutcomeActionType.CANCEL,
                "stayai_final_state": SubscriptionTruthState.CANCELLED,
                "stayai_confirmation_status": SourceConfirmationStatus.CONFIRMED,
                "approved_official_completion_path": False,
                "portal_link_sent": True,
                "portal_completion_confirmed": True,
                "shopify_context_available": True,
                "synthflow_journey_present": True,
                "synthflow_journey_status": "completed",
                "non_cancellation_action_completed": False,
            }
        ],
        "freshness_status": FreshnessStatus.FRESH,
        "timestamp": "2026-05-04T00:00:00Z",
        "filters": {"scenario": "confirmed_cancellation"},
        "formula_version": "v0.5.0",
        "owner": "analytics",
        "audit_reference": "audit-subscription-outcomes-confirmed-cancellation-20260504",
    },
    "pending_cancellation_confirmation": {
        "records": [
            {
                "contact_id": "sub-pending-cancel-001",
                "action_requested": True,
                "action_type": SubscriptionOutcomeActionType.CANCEL,
                "stayai_final_state": SubscriptionTruthState.PENDING,
                "stayai_confirmation_status": SourceConfirmationStatus.PENDING,
                "approved_official_completion_path": False,
                "portal_link_sent": True,
                "portal_completion_confirmed": False,
                "shopify_context_available": True,
                "synthflow_journey_present": True,
                "synthflow_journey_status": "completed",
                "non_cancellation_action_completed": False,
            }
        ],
        "freshness_status": FreshnessStatus.STALE,
        "timestamp": "2026-05-04T00:00:00Z",
        "filters": {"scenario": "pending_cancellation_confirmation"},
        "formula_version": "v0.5.0",
        "owner": "analytics",
        "audit_reference": "audit-subscription-outcomes-pending-cancellation-20260504",
    },
    "save_confirmed_retained": {
        "records": [
            {
                "contact_id": "sub-save-001",
                "action_requested": True,
                "action_type": SubscriptionOutcomeActionType.SAVE,
                "stayai_final_state": SubscriptionTruthState.RETAINED,
                "stayai_confirmation_status": SourceConfirmationStatus.CONFIRMED,
                "approved_official_completion_path": False,
                "portal_link_sent": False,
                "portal_completion_confirmed": False,
                "shopify_context_available": True,
                "synthflow_journey_present": True,
                "synthflow_journey_status": "completed",
                "non_cancellation_action_completed": False,
            }
        ],
        "freshness_status": FreshnessStatus.FRESH,
        "timestamp": "2026-05-04T00:00:00Z",
        "filters": {"scenario": "save_confirmed_retained"},
        "formula_version": "v0.5.0",
        "owner": "analytics",
        "audit_reference": "audit-subscription-outcomes-save-confirmed-20260504",
    },
    "save_missing_confirmation": {
        "records": [
            {
                "contact_id": "sub-save-missing-001",
                "action_requested": True,
                "action_type": SubscriptionOutcomeActionType.SAVE,
                "stayai_final_state": None,
                "stayai_confirmation_status": SourceConfirmationStatus.MISSING,
                "approved_official_completion_path": False,
                "portal_link_sent": False,
                "portal_completion_confirmed": False,
                "shopify_context_available": True,
                "synthflow_journey_present": True,
                "synthflow_journey_status": "completed",
                "non_cancellation_action_completed": False,
            }
        ],
        "freshness_status": FreshnessStatus.STALE,
        "timestamp": "2026-05-04T00:00:00Z",
        "filters": {"scenario": "save_missing_confirmation"},
        "formula_version": "v0.5.0",
        "owner": "analytics",
        "audit_reference": "audit-subscription-outcomes-save-missing-20260504",
    },
    "non_cancellation_action_completed": {
        "records": [
            {
                "contact_id": "sub-non-cancel-001",
                "action_requested": True,
                "action_type": SubscriptionOutcomeActionType.FREQUENCY_CHANGE,
                "stayai_final_state": SubscriptionTruthState.ACTIVE,
                "stayai_confirmation_status": SourceConfirmationStatus.CONFIRMED,
                "approved_official_completion_path": False,
                "portal_link_sent": False,
                "portal_completion_confirmed": False,
                "shopify_context_available": True,
                "synthflow_journey_present": True,
                "synthflow_journey_status": "completed",
                "non_cancellation_action_completed": True,
            }
        ],
        "freshness_status": FreshnessStatus.FRESH,
        "timestamp": "2026-05-04T00:00:00Z",
        "filters": {"scenario": "non_cancellation_action_completed"},
        "formula_version": "v0.5.0",
        "owner": "analytics",
        "audit_reference": "audit-subscription-outcomes-non-cancel-20260504",
    },
    "portal_link_without_completion": {
        "records": [
            {
                "contact_id": "sub-portal-001",
                "action_requested": True,
                "action_type": SubscriptionOutcomeActionType.CANCEL,
                "stayai_final_state": None,
                "stayai_confirmation_status": SourceConfirmationStatus.PENDING,
                "approved_official_completion_path": False,
                "portal_link_sent": True,
                "portal_completion_confirmed": False,
                "shopify_context_available": True,
                "synthflow_journey_present": True,
                "synthflow_journey_status": "completed",
                "non_cancellation_action_completed": False,
            }
        ],
        "freshness_status": FreshnessStatus.FRESH,
        "timestamp": "2026-05-04T00:00:00Z",
        "filters": {"scenario": "portal_link_without_completion"},
        "formula_version": "v0.5.0",
        "owner": "analytics",
        "audit_reference": "audit-subscription-outcomes-portal-link-20260504",
    },
    "shopify_context_missing_final_state": {
        "records": [
            {
                "contact_id": "sub-shopify-001",
                "action_requested": True,
                "action_type": SubscriptionOutcomeActionType.CANCEL,
                "stayai_final_state": None,
                "stayai_confirmation_status": SourceConfirmationStatus.MISSING,
                "approved_official_completion_path": False,
                "portal_link_sent": False,
                "portal_completion_confirmed": False,
                "shopify_context_available": True,
                "synthflow_journey_present": False,
                "synthflow_journey_status": "unknown",
                "non_cancellation_action_completed": False,
            }
        ],
        "freshness_status": FreshnessStatus.STALE,
        "timestamp": "2026-05-04T00:00:00Z",
        "filters": {"scenario": "shopify_context_missing_final_state"},
        "formula_version": "v0.5.0",
        "owner": "analytics",
        "audit_reference": "audit-subscription-outcomes-shopify-context-20260504",
    },
    "synthflow_journey_incomplete": {
        "records": [
            {
                "contact_id": "sub-synthflow-001",
                "action_requested": True,
                "action_type": SubscriptionOutcomeActionType.CANCEL,
                "stayai_final_state": None,
                "stayai_confirmation_status": SourceConfirmationStatus.PENDING,
                "approved_official_completion_path": False,
                "portal_link_sent": False,
                "portal_completion_confirmed": False,
                "shopify_context_available": True,
                "synthflow_journey_present": True,
                "synthflow_journey_status": "transferred",
                "non_cancellation_action_completed": False,
            }
        ],
        "freshness_status": FreshnessStatus.FRESH,
        "timestamp": "2026-05-04T00:00:00Z",
        "filters": {"scenario": "synthflow_journey_incomplete"},
        "formula_version": "v0.5.0",
        "owner": "analytics",
        "audit_reference": "audit-subscription-outcomes-synthflow-incomplete-20260504",
    },
    "unknown_outcome": {
        "records": [
            {
                "contact_id": "sub-unknown-001",
                "action_requested": True,
                "action_type": SubscriptionOutcomeActionType.OTHER,
                "stayai_final_state": None,
                "stayai_confirmation_status": SourceConfirmationStatus.MISSING,
                "approved_official_completion_path": False,
                "portal_link_sent": False,
                "portal_completion_confirmed": False,
                "shopify_context_available": False,
                "synthflow_journey_present": False,
                "synthflow_journey_status": "unknown",
                "non_cancellation_action_completed": False,
            }
        ],
        "freshness_status": FreshnessStatus.UNKNOWN,
        "timestamp": "2026-05-04T00:00:00Z",
        "filters": {"scenario": "unknown_outcome"},
        "formula_version": "v0.5.0",
        "owner": "analytics",
        "audit_reference": "audit-subscription-outcomes-unknown-20260504",
    },
    "duplicate_contact_records": {
        "records": [
            {
                "contact_id": "sub-dup-001",
                "action_requested": True,
                "action_type": SubscriptionOutcomeActionType.CANCEL,
                "stayai_final_state": SubscriptionTruthState.CANCELLED,
                "stayai_confirmation_status": SourceConfirmationStatus.CONFIRMED,
                "approved_official_completion_path": False,
                "portal_link_sent": True,
                "portal_completion_confirmed": True,
                "shopify_context_available": True,
                "synthflow_journey_present": True,
                "synthflow_journey_status": "completed",
                "non_cancellation_action_completed": False,
            },
            {
                "contact_id": "sub-dup-001",
                "action_requested": True,
                "action_type": SubscriptionOutcomeActionType.PAUSE,
                "stayai_final_state": SubscriptionTruthState.ACTIVE,
                "stayai_confirmation_status": SourceConfirmationStatus.CONFIRMED,
                "approved_official_completion_path": False,
                "portal_link_sent": False,
                "portal_completion_confirmed": False,
                "shopify_context_available": True,
                "synthflow_journey_present": True,
                "synthflow_journey_status": "completed",
                "non_cancellation_action_completed": True,
            },
        ],
        "freshness_status": FreshnessStatus.FRESH,
        "timestamp": "2026-05-04T00:00:00Z",
        "filters": {"scenario": "duplicate_contact_records"},
        "formula_version": "v0.5.0",
        "owner": "analytics",
        "audit_reference": "audit-subscription-outcomes-duplicate-contact-20260504",
    },
    "save_not_requested": {
        "records": [
            {
                "contact_id": "sub-save-not-requested-001",
                "action_requested": False,
                "action_type": SubscriptionOutcomeActionType.SAVE,
                "stayai_final_state": SubscriptionTruthState.RETAINED,
                "stayai_confirmation_status": SourceConfirmationStatus.CONFIRMED,
                "approved_official_completion_path": False,
                "portal_link_sent": False,
                "portal_completion_confirmed": False,
                "shopify_context_available": True,
                "synthflow_journey_present": True,
                "synthflow_journey_status": "completed",
                "non_cancellation_action_completed": False,
            }
        ],
        "freshness_status": FreshnessStatus.FRESH,
        "timestamp": "2026-05-04T00:00:00Z",
        "filters": {"scenario": "save_not_requested"},
        "formula_version": "v0.5.0",
        "owner": "analytics",
        "audit_reference": "audit-subscription-outcomes-save-not-requested-20260504",
    },
    "cancellation_not_requested_official_path": {
        "records": [
            {
                "contact_id": "sub-cancel-not-requested-001",
                "action_requested": False,
                "action_type": SubscriptionOutcomeActionType.CANCEL,
                "stayai_final_state": SubscriptionTruthState.CANCELLED,
                "stayai_confirmation_status": SourceConfirmationStatus.CONFIRMED,
                "approved_official_completion_path": True,
                "portal_link_sent": False,
                "portal_completion_confirmed": False,
                "shopify_context_available": True,
                "synthflow_journey_present": True,
                "synthflow_journey_status": "completed",
                "non_cancellation_action_completed": False,
            }
        ],
        "freshness_status": FreshnessStatus.FRESH,
        "timestamp": "2026-05-04T00:00:00Z",
        "filters": {"scenario": "cancellation_not_requested_official_path"},
        "formula_version": "v0.5.0",
        "owner": "analytics",
        "audit_reference": "audit-subscription-outcomes-cancel-not-requested-20260504",
    },
}


SUBSCRIPTION_BUSINESS_VALUE_FIXTURES: dict[str, SubscriptionBusinessValueScenarioFixture] = {
    "baseline": {
        "source_confirmation_status": SourceConfirmationStatus.PENDING,
        "metrics": [
            {
                "metric_key": "net_business_value_impact",
                "display_name": "Net Business Value Impact",
                "value": 86540.0,
                "unit": "usd",
                "state": BusinessValueState.ESTIMATED,
                "formula": "gross_value_protected - offer_cost + support_cost_avoided",
                "source_of_truth": "warehouse_analytics",
                "data_dependencies": ["stayai_final_state", "shopify_order_value", "offer_costs"],
                "notes": "Estimated until closed-loop finance attribution is complete.",
            },
            {
                "metric_key": "gross_value_protected",
                "display_name": "Gross Value Protected",
                "value": 124300.0,
                "unit": "usd",
                "state": BusinessValueState.ESTIMATED,
                "formula": "sum(expected_revenue_saved_before_costs)",
                "source_of_truth": "warehouse_analytics",
                "data_dependencies": ["subscription_ltv_model", "stayai_confirmation"],
                "notes": None,
            },
            {
                "metric_key": "net_retained_recovered_value",
                "display_name": "Net Retained / Recovered Value",
                "value": 80120.0,
                "unit": "usd",
                "state": BusinessValueState.ESTIMATED,
                "formula": "confirmed_saved_revenue + estimated_saved_revenue - revenue_leakage_after_save - total_offer_cost",
                "source_of_truth": "warehouse_analytics",
                "data_dependencies": ["retained_subscriptions", "offer_costs", "post_save_churn_window"],
                "notes": None,
            },
            {
                "metric_key": "confirmed_business_value_impact",
                "display_name": "Confirmed Business Value Impact",
                "value": 31890.0,
                "unit": "usd",
                "state": BusinessValueState.CONFIRMED,
                "formula": "confirmed_saved_revenue - confirmed_offer_cost + confirmed_support_cost_avoided",
                "source_of_truth": "stayai_plus_finance_join",
                "data_dependencies": ["stayai_final_state", "posted_credit_memo", "support_cost_model"],
                "notes": None,
            },
            {
                "metric_key": "estimated_business_value_impact",
                "display_name": "Estimated Business Value Impact",
                "value": 54650.0,
                "unit": "usd",
                "state": BusinessValueState.ESTIMATED,
                "formula": "estimated_saved_revenue - estimated_offer_cost + estimated_support_cost_avoided",
                "source_of_truth": "warehouse_analytics",
                "data_dependencies": ["pending_stayai_confirmation", "ltv_model"],
                "notes": None,
            },
            {
                "metric_key": "revenue_saved_estimate",
                "display_name": "Revenue Saved Estimate",
                "value": 97850.0,
                "unit": "usd",
                "state": BusinessValueState.ESTIMATED,
                "formula": "sum(estimated_retained_revenue)",
                "source_of_truth": "warehouse_analytics",
                "data_dependencies": ["retention_model", "subscription_term_projection"],
                "notes": None,
            },
            {
                "metric_key": "gross_saved_value",
                "display_name": "Gross Saved Value",
                "value": 103200.0,
                "unit": "usd",
                "state": BusinessValueState.ESTIMATED,
                "formula": "confirmed_saved_revenue + estimated_saved_revenue",
                "source_of_truth": "warehouse_analytics",
                "data_dependencies": ["stayai_final_state", "pending_stayai_confirmation"],
                "notes": None,
            },
            {
                "metric_key": "confirmed_saved_revenue",
                "display_name": "Confirmed Saved Revenue",
                "value": 38950.0,
                "unit": "usd",
                "state": BusinessValueState.CONFIRMED,
                "formula": "sum(saved_revenue where stayai_confirmation_status='confirmed')",
                "source_of_truth": "stayai_plus_finance_join",
                "data_dependencies": ["stayai_final_state", "invoice_revenue"],
                "notes": None,
            },
            {
                "metric_key": "net_saved_revenue",
                "display_name": "Net Saved Revenue",
                "value": 74210.0,
                "unit": "usd",
                "state": BusinessValueState.ESTIMATED,
                "formula": "gross_saved_value - offer_cost - discount_cost - free_shipping_cost",
                "source_of_truth": "warehouse_analytics",
                "data_dependencies": ["offer_costs"],
                "notes": None,
            },
            {
                "metric_key": "offer_cost",
                "display_name": "Offer Cost",
                "value": 18840.0,
                "unit": "usd",
                "state": BusinessValueState.ESTIMATED,
                "formula": "discount_cost + free_shipping_cost + incentive_cost",
                "source_of_truth": "offer_redemption_ledger",
                "data_dependencies": ["offer_type", "offer_version", "redemption_events"],
                "notes": None,
            },
            {
                "metric_key": "discount_cost",
                "display_name": "Discount Cost",
                "value": 14600.0,
                "unit": "usd",
                "state": BusinessValueState.ESTIMATED,
                "formula": "sum(discount_value_applied)",
                "source_of_truth": "offer_redemption_ledger",
                "data_dependencies": ["offer_code_redemption"],
                "notes": None,
            },
            {
                "metric_key": "free_shipping_cost",
                "display_name": "Free Shipping Cost",
                "value": 4240.0,
                "unit": "usd",
                "state": BusinessValueState.ESTIMATED,
                "formula": "sum(shipping_subsidy)",
                "source_of_truth": "shopify_shipping_ledger",
                "data_dependencies": ["shipping_method", "shipping_charge_override"],
                "notes": None,
            },
            {
                "metric_key": "revenue_at_risk",
                "display_name": "Revenue At Risk",
                "value": 59230.0,
                "unit": "usd",
                "state": BusinessValueState.ESTIMATED,
                "formula": "sum(predicted_revenue_for_high_churn_probability)",
                "source_of_truth": "warehouse_analytics",
                "data_dependencies": ["churn_risk_score", "subscription_mrr"],
                "notes": None,
            },
            {
                "metric_key": "support_cost_avoided",
                "display_name": "Support Cost Avoided",
                "value": 12180.0,
                "unit": "usd",
                "state": BusinessValueState.ESTIMATED,
                "formula": "contained_calls * cost_per_contained_call",
                "source_of_truth": "warehouse_analytics",
                "data_dependencies": ["containment_events", "cost_model_version"],
                "notes": None,
            },
            {
                "metric_key": "cost_per_contained_call",
                "display_name": "Cost per Contained Call",
                "value": 4.6,
                "unit": "usd",
                "state": BusinessValueState.CONFIRMED,
                "formula": "support_cost_avoided / contained_call_count",
                "source_of_truth": "finance_ops_model",
                "data_dependencies": ["contained_call_count", "agent_cost_baseline"],
                "notes": None,
            },
            {
                "metric_key": "net_value_per_contained_call",
                "display_name": "Net Value per Contained Call",
                "value": 27.2,
                "unit": "usd",
                "state": BusinessValueState.ESTIMATED,
                "formula": "(net_saved_revenue + support_cost_avoided) / contained_call_count",
                "source_of_truth": "warehouse_analytics",
                "data_dependencies": ["contained_call_count", "offer_costs"],
                "notes": None,
            },
            {
                "metric_key": "automation_roi",
                "display_name": "Automation ROI",
                "value": 2.14,
                "unit": "ratio",
                "state": BusinessValueState.ESTIMATED,
                "formula": "(net_saved_revenue + support_cost_avoided) / automation_operating_cost",
                "source_of_truth": "warehouse_analytics",
                "data_dependencies": ["operating_cost", "saved_revenue", "support_cost_avoided"],
                "notes": None,
            },
            {
                "metric_key": "retention_roi_estimate",
                "display_name": "Retention ROI Estimate",
                "value": 1.73,
                "unit": "ratio",
                "state": BusinessValueState.ESTIMATED,
                "formula": "net_retained_recovered_value / total_retention_program_cost",
                "source_of_truth": "warehouse_analytics",
                "data_dependencies": ["retention_program_cost", "net_retained_recovered_value"],
                "notes": None,
            },
            {
                "metric_key": "estimated_churn_prevented_count",
                "display_name": "Estimated Churn Prevented Count",
                "value": 372,
                "unit": "count",
                "state": BusinessValueState.ESTIMATED,
                "formula": "sum(predicted_saved_subscriptions)",
                "source_of_truth": "warehouse_analytics",
                "data_dependencies": ["churn_model", "save_attempts"],
                "notes": None,
            },
            {
                "metric_key": "confirmed_churn_prevented_count",
                "display_name": "Confirmed Churn Prevented Count",
                "value": 149,
                "unit": "count",
                "state": BusinessValueState.CONFIRMED,
                "formula": "count(stayai_final_state in ['retained','saved','active'])",
                "source_of_truth": "stayai",
                "data_dependencies": ["stayai_final_state", "stayai_confirmation_status"],
                "notes": None,
            },
            {
                "metric_key": "revenue_leakage_after_save",
                "display_name": "Revenue Leakage After Save",
                "value": 7620.0,
                "unit": "usd",
                "state": BusinessValueState.PENDING,
                "formula": "sum(saved_then_cancelled_within_window_revenue_loss)",
                "source_of_truth": "stayai_plus_billing_join",
                "data_dependencies": ["post_save_window", "billing_events"],
                "notes": "Pending because the full post-save churn window has not closed.",
            },
            {
                "metric_key": "high_value_churn_risk",
                "display_name": "High-Value Churn Risk",
                "value": 67,
                "unit": "count",
                "state": BusinessValueState.ESTIMATED,
                "formula": "count(subscriptions where churn_risk_score >= threshold and mrr >= high_value_cutoff)",
                "source_of_truth": "warehouse_analytics",
                "data_dependencies": ["churn_risk_score", "subscription_mrr"],
                "notes": None,
            },
            {
                "metric_key": "cost_too_high_funnel_sequence_metrics",
                "display_name": "Cost Too High Funnel Sequence Metrics",
                "value": None,
                "unit": "json_bundle",
                "state": BusinessValueState.BLOCKED_BY_DATA,
                "formula": "requires ordered frequency_change -> discount_offer -> final_outcome sequence",
                "source_of_truth": "synthflow_plus_stayai_sequence_join",
                "data_dependencies": ["offer_type", "offer_version", "sequence_event_order"],
                "notes": "Bundle metric blocked until offer version joins are complete.",
            },
            {
                "metric_key": "frequency_change_completion_rate",
                "display_name": "Frequency Change Completion Rate",
                "value": 0.42,
                "unit": "rate",
                "state": BusinessValueState.PENDING,
                "formula": "completed_frequency_change / requested_frequency_change",
                "source_of_truth": "stayai",
                "data_dependencies": ["action_type=frequency_change", "stayai_confirmation_status"],
                "notes": "Pending while confirmation coverage is below policy threshold.",
            },
            {
                "metric_key": "skip_completion_rate",
                "display_name": "Skip Completion Rate",
                "value": 0.47,
                "unit": "rate",
                "state": BusinessValueState.PENDING,
                "formula": "completed_skip / requested_skip",
                "source_of_truth": "stayai",
                "data_dependencies": ["action_type=skip", "stayai_confirmation_status"],
                "notes": None,
            },
            {
                "metric_key": "pause_completion_rate",
                "display_name": "Pause Completion Rate",
                "value": 0.38,
                "unit": "rate",
                "state": BusinessValueState.PENDING,
                "formula": "completed_pause / requested_pause",
                "source_of_truth": "stayai",
                "data_dependencies": ["action_type=pause", "stayai_confirmation_status"],
                "notes": None,
            },
            {
                "metric_key": "portal_completion_rate",
                "display_name": "Portal Completion Rate",
                "value": 0.61,
                "unit": "rate",
                "state": BusinessValueState.PENDING,
                "formula": "portal_completion_confirmed_total / portal_link_sent_total",
                "source_of_truth": "portal_and_stayai",
                "data_dependencies": ["portal_completion_event", "confirmed_completion_event_id"],
                "notes": None,
            },
            {
                "metric_key": "true_subscription_containment_rate",
                "display_name": "True Subscription Containment Rate",
                "value": 0.58,
                "unit": "rate",
                "state": BusinessValueState.ESTIMATED,
                "formula": "contained_without_repeat_contact / eligible_subscription_contacts",
                "source_of_truth": "warehouse_analytics",
                "data_dependencies": ["repeat_contact_flag", "final_outcome_confirmation"],
                "notes": None,
            },
            {
                "metric_key": "stay_ai_confirmation_coverage",
                "display_name": "Stay.ai Confirmation Coverage",
                "value": 0.71,
                "unit": "rate",
                "state": BusinessValueState.CONFIRMED,
                "formula": "confirmed_records / records_requiring_confirmation",
                "source_of_truth": "stayai",
                "data_dependencies": ["stayai_confirmation_status"],
                "notes": None,
            },
        ],
        "freshness_status": FreshnessStatus.STALE,
        "timestamp": "2026-05-05T21:00:00Z",
        "filters": {"date_range": "last_30_days", "module": "subscriptions"},
        "formula_version": "v0.7.0",
        "owner": "analytics",
        "audit_reference": "audit-subscription-business-value-baseline-20260505",
    },
    "missing_source_confirmations": {
        "source_confirmation_status": SourceConfirmationStatus.MISSING,
        "metrics": [
            {
                "metric_key": "net_business_value_impact",
                "display_name": "Net Business Value Impact",
                "value": None,
                "unit": "usd",
                "state": BusinessValueState.BLOCKED_BY_DATA,
                "formula": "gross_value_protected - total_offer_cost + support_cost_avoided",
                "source_of_truth": "warehouse_analytics",
                "data_dependencies": ["stayai_final_state", "offer_costs"],
                "notes": "Blocked because Stay.ai final-state confirmations are missing.",
            },
            {
                "metric_key": "stay_ai_confirmation_coverage",
                "display_name": "Stay.ai Confirmation Coverage",
                "value": 0.0,
                "unit": "rate",
                "state": BusinessValueState.UNKNOWN,
                "formula": "confirmed_records / records_requiring_confirmation",
                "source_of_truth": "stayai",
                "data_dependencies": ["stayai_confirmation_status"],
                "notes": "Coverage collapsed in this fixture to exercise blocked reporting paths.",
            },
        ],
        "freshness_status": FreshnessStatus.STALE,
        "timestamp": "2026-05-05T21:00:00Z",
        "filters": {"date_range": "last_30_days", "module": "subscriptions"},
        "formula_version": "v0.7.0",
        "owner": "analytics",
        "audit_reference": "audit-subscription-business-value-missing-confirmation-20260505",
    },
}


SUBSCRIPTION_ADVANCED_FILTER_OPTIONS: list[SubscriptionFilterOptionFixture] = [
    # Keep fixture IDs stable for deterministic export audits.
    {
        "filter_id": "date_preset",
        "label": "Date preset",
        "plain_language_help": "Quickly switch to common date windows like last 7 or last 30 days.",
        "allowed_values": ["today", "last_7_days", "last_30_days", "last_90_days", "custom"],
        "is_enabled": True,
        "is_disabled_reason": None,
        "data_dependency": "event_timestamp",
        "source_system": "analytics_api",
        "trust_impact": "Changes denominator and comparison context for all subscription metrics.",
        "applies_to_pages": ["all_subscription_pages"],
    },
    {
        "filter_id": "custom_date_range",
        "label": "Custom date range",
        "plain_language_help": "Set an explicit start and end date for detailed analysis.",
        "allowed_values": ["from_date", "to_date"],
        "is_enabled": True,
        "is_disabled_reason": None,
        "data_dependency": "event_timestamp",
        "source_system": "analytics_api",
        "trust_impact": "Narrow custom windows can increase volatility and pending-state density.",
        "applies_to_pages": ["all_subscription_pages"],
    },
    {
        "filter_id": "comparison_period",
        "label": "Comparison period",
        "plain_language_help": "Compare current period against previous period or previous year.",
        "allowed_values": ["none", "previous_period", "previous_year"],
        "is_enabled": True,
        "is_disabled_reason": None,
        "data_dependency": "time_series_aggregates",
        "source_system": "analytics_api",
        "trust_impact": "Comparison rows are estimated when source freshness is stale.",
        "applies_to_pages": ["all_subscription_pages"],
    },
    {
        "filter_id": "cancellation_reason",
        "label": "Cancellation reason",
        "plain_language_help": "Filter to a specific cancellation reason like Cost too high.",
        "allowed_values": ["cost_too_high", "dont_need_now", "product_issue", "switching_brand", "service_issue", "other", "unknown"],
        "is_enabled": True,
        "is_disabled_reason": None,
        "data_dependency": "stayai_cancel_reason",
        "source_system": "stayai",
        "trust_impact": "Unknown reasons lower trust on reason-based rates.",
        "applies_to_pages": ["outcomes", "cancellation_intake", "cost_too_high", "follow_up"],
    },
    {
        "filter_id": "offer_type",
        "label": "Offer type",
        "plain_language_help": "Slice by offer category like frequency-change or discount.",
        "allowed_values": ["frequency_change", "discount", "free_shipping", "bundle", "none"],
        "is_enabled": True,
        "is_disabled_reason": None,
        "data_dependency": "offer_redemption_ledger",
        "source_system": "stayai",
        "trust_impact": "Missing offer mappings mark related metrics estimated.",
        "applies_to_pages": ["business_value", "cost_too_high"],
    },
    {
        "filter_id": "offer_version",
        "label": "Offer version",
        "plain_language_help": "Compare different offer versions for retention performance.",
        "allowed_values": ["v3.3", "v3.4", "v3.5", "unknown"],
        "is_enabled": True,
        "is_disabled_reason": None,
        "data_dependency": "offer_version_join",
        "source_system": "stayai",
        "trust_impact": "Unknown versions can block sequence metrics.",
        "applies_to_pages": ["cost_too_high", "business_value"],
    },
    {
        "filter_id": "subscription_status",
        "label": "Subscription status",
        "plain_language_help": "Filter to retained, cancelled, pending, or active outcomes.",
        "allowed_values": ["retained", "saved", "cancelled", "active", "pending", "unknown"],
        "is_enabled": True,
        "is_disabled_reason": None,
        "data_dependency": "stayai_final_state",
        "source_system": "stayai",
        "trust_impact": "Pending and unknown states reduce trust confidence.",
        "applies_to_pages": ["outcomes", "follow_up", "business_value"],
    },
    {
        "filter_id": "product_sku",
        "label": "Product / SKU",
        "plain_language_help": "Filter by subscription SKU for product-level trends.",
        "allowed_values": ["sku_a", "sku_b", "sku_c", "unknown"],
        "is_enabled": True,
        "is_disabled_reason": None,
        "data_dependency": "shopify_context_sku",
        "source_system": "shopify",
        "trust_impact": "Shopify is context-only; SKU filters never finalize outcomes.",
        "applies_to_pages": ["business_value", "outcomes", "follow_up"],
    },
    {
        "filter_id": "match_confidence",
        "label": "Match confidence",
        "plain_language_help": "Focus on low-confidence record matches that need review.",
        "allowed_values": ["high", "medium", "low"],
        "is_enabled": True,
        "is_disabled_reason": None,
        "data_dependency": "identity_match_score",
        "source_system": "analytics_api",
        "trust_impact": "Low confidence rows can downgrade trust labels.",
        "applies_to_pages": ["follow_up", "outcomes"],
    },
    {
        "filter_id": "portal_state",
        "label": "Portal state",
        "plain_language_help": "Separate link sent from confirmed completion to avoid overcounting.",
        "allowed_values": ["link_sent", "link_opened", "portal_started", "portal_completed", "completion_unknown"],
        "is_enabled": True,
        "is_disabled_reason": None,
        "data_dependency": "portal_events",
        "source_system": "portal",
        "trust_impact": "Completion unknown rows stay pending until confirmed.",
        "applies_to_pages": ["portal_handoff", "follow_up", "outcomes"],
    },
    {
        "filter_id": "outcome",
        "label": "Outcome",
        "plain_language_help": "Filter by save, cancel, pending, non-cancel, or unknown outcomes.",
        "allowed_values": ["save", "cancel", "pending", "non_cancel", "unknown"],
        "is_enabled": True,
        "is_disabled_reason": None,
        "data_dependency": "stayai_final_state",
        "source_system": "stayai",
        "trust_impact": "Pending and unknown outcomes lower confidence for final metrics.",
        "applies_to_pages": ["outcomes", "follow_up", "business_value"],
    },
    {
        "filter_id": "escalation_state",
        "label": "Escalation state",
        "plain_language_help": "Show only escalated, open, or resolved follow-up items.",
        "allowed_values": ["none", "open", "escalated", "resolved"],
        "is_enabled": True,
        "is_disabled_reason": None,
        "data_dependency": "escalation_events",
        "source_system": "synthflow",
        "trust_impact": "Open escalations highlight unresolved customer risk.",
        "applies_to_pages": ["follow_up"],
    },
    {
        "filter_id": "repeat_contact",
        "label": "Repeat contact",
        "plain_language_help": "Filter customers who contacted support repeatedly.",
        "allowed_values": ["none", "within_1_day", "within_7_days", "within_30_days"],
        "is_enabled": True,
        "is_disabled_reason": None,
        "data_dependency": "repeat_contact_join",
        "source_system": "warehouse",
        "trust_impact": "Required for true containment and follow-up prioritization.",
        "applies_to_pages": ["containment", "follow_up", "business_value"],
    },
    {
        "filter_id": "value_range",
        "label": "Value range",
        "plain_language_help": "Limit to a saved-revenue range for high-value triage.",
        "allowed_values": ["0_100", "100_500", "500_1000", "1000_plus"],
        "is_enabled": True,
        "is_disabled_reason": None,
        "data_dependency": "revenue_value_bucket",
        "source_system": "warehouse",
        "trust_impact": "Estimated revenue buckets are marked with medium trust.",
        "applies_to_pages": ["business_value", "follow_up"],
    },
    {
        "filter_id": "trust_label",
        "label": "Trust label",
        "plain_language_help": "Filter metrics or rows by high, medium, low, or untrusted labels.",
        "allowed_values": ["high", "medium", "low", "untrusted"],
        "is_enabled": True,
        "is_disabled_reason": None,
        "data_dependency": "system_calculated_trust_label",
        "source_system": "analytics_api",
        "trust_impact": "Directly controls which confidence strata are included.",
        "applies_to_pages": ["all_subscription_pages"],
    },
    {
        "filter_id": "synthflow_flow_version",
        "label": "Synthflow flow version",
        "plain_language_help": "Compare results across Synthflow flow versions.",
        "allowed_values": ["v3.3", "v3.4", "v3.5"],
        "is_enabled": True,
        "is_disabled_reason": None,
        "data_dependency": "synthflow_flow_version",
        "source_system": "synthflow",
        "trust_impact": "Flow migrations can shift request mix and completion rates.",
        "applies_to_pages": ["outcomes", "follow_up", "business_value"],
    },
    {
        "filter_id": "stayai_action_type",
        "label": "Stay.ai action type",
        "plain_language_help": "Filter by Stay.ai action type such as cancel or save.",
        "allowed_values": ["cancel", "save", "pause", "skip", "frequency_change", "other"],
        "is_enabled": True,
        "is_disabled_reason": None,
        "data_dependency": "stayai_action_type",
        "source_system": "stayai",
        "trust_impact": "Action type controls final-state denominator composition.",
        "applies_to_pages": ["outcomes", "follow_up", "business_value"],
    },
    {
        "filter_id": "stayai_offer_version",
        "label": "Stay.ai offer version",
        "plain_language_help": "Filter by Stay.ai offer version to compare save performance.",
        "allowed_values": ["v1", "v2", "v3", "unknown"],
        "is_enabled": True,
        "is_disabled_reason": None,
        "data_dependency": "stayai_offer_version",
        "source_system": "stayai",
        "trust_impact": "Unknown versions can block ROI-attribution metrics.",
        "applies_to_pages": ["business_value", "cost_too_high"],
    },
    {
        "filter_id": "stayai_freshness_api_state",
        "label": "Stay.ai freshness / API state",
        "plain_language_help": "Filter by source freshness and API health from Stay.ai.",
        "allowed_values": ["fresh", "stale", "unknown", "degraded_api"],
        "is_enabled": True,
        "is_disabled_reason": None,
        "data_dependency": "stayai_source_health",
        "source_system": "stayai",
        "trust_impact": "Stale data automatically lowers confidence.",
        "applies_to_pages": ["all_subscription_pages"],
    },
    {
        "filter_id": "current_vs_future_flow_state",
        "label": "Current vs future flow state",
        "plain_language_help": "Compare production flow with planned future flow behavior.",
        "allowed_values": ["current", "future", "compare"],
        "is_enabled": False,
        "is_disabled_reason": "Future-flow simulation feed is not available in fixture mode.",
        "data_dependency": "future_flow_simulation_dataset",
        "source_system": "analytics_api",
        "trust_impact": "Disabled dimensions are excluded from export manifest filters.",
        "applies_to_pages": ["outcomes", "business_value"],
    },
    {
        "filter_id": "saved_view_id",
        "label": "Saved view ID",
        "plain_language_help": "Apply a saved view by identifier.",
        "allowed_values": ["view_default", "view_triage_pending", "view_cost_too_high_watch"],
        "is_enabled": True,
        "is_disabled_reason": None,
        "data_dependency": "saved_view_store",
        "source_system": "analytics_api",
        "trust_impact": "Saved views are replayed exactly into the manifest filter set.",
        "applies_to_pages": ["all_subscription_pages"],
    },
    {
        "filter_id": "saved_view_name",
        "label": "Saved view name",
        "plain_language_help": "Apply a saved view by display name.",
        "allowed_values": ["default", "triage_pending", "cost_too_high_watch"],
        "is_enabled": True,
        "is_disabled_reason": None,
        "data_dependency": "saved_view_store",
        "source_system": "analytics_api",
        "trust_impact": "Saved views are replayed exactly into the manifest filter set.",
        "applies_to_pages": ["all_subscription_pages"],
    },
]


SUBSCRIPTION_FOLLOW_UP_FIXTURES: dict[str, list[SubscriptionFollowUpRecordFixture]] = {
    "baseline": [
        {
            "customer_or_case_id": "case-1001",
            "recommended_action": "Confirm in Stay.ai",
            "reason": "Missing Stay.ai final state for cancel request",
            "priority": "high",
            "status": "open",
            "source_system": "stayai",
            "blocking_data_gap": "stayai_final_state",
            "stayai_confirmation_status": SourceConfirmationStatus.PENDING,
            "portal_completion_status": "completion_unknown",
            "estimated_value_at_risk": 540.0,
            "last_event_at": "2026-05-05T20:30:00Z",
            "owner_queue": "support_lead",
            "sla_status": "due_soon",
            "audit_reference": "audit-follow-up-case-1001-20260505",
            "support_label": "Awaiting official confirmation",
            "support_summary": "This case still needs Stay.ai final state confirmation.",
            "why_it_matters": "Final save/cancel reporting is blocked until official confirmation arrives.",
            "what_to_do_next": "Open Stay.ai and verify the final subscription outcome.",
            "blocked_reason_plain_language": "We cannot finalize this outcome without Stay.ai confirmation.",
        },
        {
            "customer_or_case_id": "case-1002",
            "recommended_action": "Resend portal link",
            "reason": "Portal link sent but completion not confirmed",
            "priority": "medium",
            "status": "open",
            "source_system": "portal",
            "blocking_data_gap": "confirmed_completion_event_id",
            "stayai_confirmation_status": SourceConfirmationStatus.CONFIRMED,
            "portal_completion_status": "completion_unknown",
            "estimated_value_at_risk": 220.0,
            "last_event_at": "2026-05-05T19:10:00Z",
            "owner_queue": "support_agent",
            "sla_status": "within_sla",
            "audit_reference": "audit-follow-up-case-1002-20260505",
            "support_label": "Portal completion unconfirmed",
            "support_summary": "The customer received a portal link but completion is unknown.",
            "why_it_matters": "Portal link sent does not count as a completed subscription action.",
            "what_to_do_next": "Reach out to the customer and resend the portal link if needed.",
            "blocked_reason_plain_language": "Completion is not confirmed yet.",
        },
        {
            "customer_or_case_id": "case-1003",
            "recommended_action": "Review low-confidence match",
            "reason": "Low match confidence on customer-to-subscription join",
            "priority": "high",
            "status": "open",
            "source_system": "synthflow",
            "blocking_data_gap": "identity_match_score",
            "stayai_confirmation_status": SourceConfirmationStatus.PENDING,
            "portal_completion_status": "link_sent",
            "estimated_value_at_risk": 910.0,
            "last_event_at": "2026-05-05T18:05:00Z",
            "owner_queue": "support_lead",
            "sla_status": "breached",
            "audit_reference": "audit-follow-up-case-1003-20260505",
            "support_label": "Low-confidence match",
            "support_summary": "The system could not confidently match this call to a subscription.",
            "why_it_matters": "Low-confidence joins can misstate save and cancellation metrics.",
            "what_to_do_next": "Manually verify identity before using this case in reporting.",
            "blocked_reason_plain_language": "Identity confirmation is required before final analytics inclusion.",
        },
    ],
}


def _calculate_trust_label(source_confirmation: SourceConfirmationMetrics) -> TrustLabel:
    if (
        source_confirmation.source_confirmation_status == SourceConfirmationStatus.MISSING
        or source_confirmation.missing_records_count > 0
    ):
        return TrustLabel.LOW
    if (
        source_confirmation.source_confirmation_status == SourceConfirmationStatus.PENDING
        or source_confirmation.pending_records_count > 0
    ):
        return TrustLabel.MEDIUM
    return TrustLabel.HIGH


def _safe_rate(numerator: int, denominator: int) -> float:
    if denominator <= 0:
        return 0.0
    return round(numerator / denominator, 4)


def _freshness_explanation(freshness_status: FreshnessStatus | str) -> str:
    if freshness_status == FreshnessStatus.FRESH:
        return "Data freshness is within the expected update window."
    if freshness_status == FreshnessStatus.STALE:
        return "Data is stale and may lag behind recent subscription changes."
    return "Freshness is unknown until source update timing is confirmed."


def _trust_explanation(
    trust_label: TrustLabel,
    *,
    source_confirmation_status: SourceConfirmationStatus | None = None,
) -> str:
    if trust_label == TrustLabel.HIGH:
        return "Trust is high because confirmation and data-quality evidence are currently strong."
    if trust_label == TrustLabel.MEDIUM:
        if source_confirmation_status == SourceConfirmationStatus.CONFIRMED:
            return (
                "Trust is medium because unresolved or unknown outcomes still require caution "
                "even with confirmed primary source records."
            )
        return "Trust is medium because some records are still pending Stay.ai confirmation."
    if trust_label == TrustLabel.LOW:
        return "Trust is low because Stay.ai final state confirmation is missing for one or more records."
    return "Trust is untrusted because source confirmation and quality evidence are insufficient."


def _source_authority_explanation(source_system: SourceSystem | str) -> str:
    if source_system in {SourceSystem.STAY_AI, "stayai"}:
        return "Stay.ai is the source of truth for final subscription state and outcome confirmation."
    if source_system == SourceSystem.SYNTHFLOW:
        return "Synthflow is authoritative for support journey events, not final subscription status."
    if source_system == SourceSystem.SHOPIFY:
        return "Shopify provides context only and never overrides Stay.ai outcome decisions."
    return "Portal events indicate completion signals; link sent does not imply completion."


def _comparison_label() -> str:
    return "Comparison baseline unavailable in fixture preview"


def _metric_presentation(
    *,
    display_label: str,
    short_label: str,
    executive_summary: str,
    format_type: str,
    unit: str,
    metric_trust_label: TrustLabel,
    source_confirmation_status: SourceConfirmationStatus,
    freshness_status: FreshnessStatus | str,
    drilldown_hint: str,
) -> PresentationMetadata:
    if metric_trust_label == TrustLabel.HIGH:
        severity = MetricSeverity.SUCCESS
        visual_tone = VisualTone.POSITIVE
    elif metric_trust_label == TrustLabel.MEDIUM:
        severity = MetricSeverity.WARNING
        visual_tone = VisualTone.CAUTION
    else:
        severity = MetricSeverity.CRITICAL
        visual_tone = VisualTone.CRITICAL

    return PresentationMetadata(
        display_label=display_label,
        short_label=short_label,
        executive_summary=executive_summary,
        format_type=format_type,
        unit=unit,
        trend_direction=TrendDirection.UNKNOWN,
        comparison_label=_comparison_label(),
        comparison_value=None,
        severity=severity,
        visual_tone=visual_tone,
        source_authority_explanation=_source_authority_explanation("stayai"),
        trust_explanation=_trust_explanation(
            metric_trust_label,
            source_confirmation_status=source_confirmation_status,
        ),
        freshness_explanation=_freshness_explanation(freshness_status),
        drilldown_hint=drilldown_hint,
        empty_state_copy="No eligible records were available for this calculation window.",
        blocked_state_copy="This metric is blocked until Stay.ai confirmation records are available.",
    )


def _is_confirmed_cancellation(record: SubscriptionOutcomeRecordFixture) -> bool:
    if (
        not record["action_requested"]
        or record["action_type"] != SubscriptionOutcomeActionType.CANCEL
    ):
        return False
    if record["approved_official_completion_path"]:
        return True
    return bool(
        record["stayai_confirmation_status"] == SourceConfirmationStatus.CONFIRMED
        and record["stayai_final_state"] == SubscriptionTruthState.CANCELLED
    )


def _is_confirmed_retained(record: SubscriptionOutcomeRecordFixture) -> bool:
    return bool(
        record["action_requested"]
        and record["action_type"] == SubscriptionOutcomeActionType.SAVE
        and record["stayai_confirmation_status"] == SourceConfirmationStatus.CONFIRMED
        and record["stayai_final_state"]
        in {
            SubscriptionTruthState.RETAINED,
            SubscriptionTruthState.SAVED,
            SubscriptionTruthState.ACTIVE,
        }
    )


def _is_non_cancellation_action_completed(record: SubscriptionOutcomeRecordFixture) -> bool:
    return bool(
        record["action_requested"]
        and record["action_type"]
        not in {SubscriptionOutcomeActionType.CANCEL, SubscriptionOutcomeActionType.SAVE}
        and record["non_cancellation_action_completed"]
    )


def _is_unknown_outcome(
    record: SubscriptionOutcomeRecordFixture,
    *,
    confirmed_cancellation: bool,
    confirmed_retained: bool,
    non_cancellation_action_completed: bool,
) -> bool:
    if not record["action_requested"]:
        return False
    return not (
        confirmed_cancellation
        or confirmed_retained
        or non_cancellation_action_completed
    )


def _outcomes_fingerprint(
    *,
    scenario: str,
    metrics: SubscriptionOutcomeMetrics,
    formula_version: str,
) -> str:
    payload = {
        "scenario": scenario,
        "formula_version": formula_version,
        "metrics": metrics.model_dump(mode="json"),
    }
    return sha256(dumps(payload, sort_keys=True).encode("utf-8")).hexdigest()


def _analytics_fingerprint(
    *,
    scenario: str,
    overview: SubscriptionOverviewMetrics,
    portal: PortalJourneyMetrics,
    source_confirmation: SourceConfirmationMetrics,
) -> str:
    payload = {
        "scenario": scenario,
        "overview": overview.model_dump(mode="json"),
        "portal": portal.model_dump(mode="json"),
        "source_confirmation": source_confirmation.model_dump(mode="json"),
    }
    return sha256(dumps(payload, sort_keys=True).encode("utf-8")).hexdigest()


def _source_health_fingerprint(
    *,
    scenario: str,
    sources: list[SubscriptionSourceHealthSource],
    formula_version: str,
) -> str:
    payload = {
        "scenario": scenario,
        "formula_version": formula_version,
        "sources": [
            source.model_dump(mode="json", exclude={"presentation"})
            for source in sources
        ],
    }
    return sha256(dumps(payload, sort_keys=True).encode("utf-8")).hexdigest()


def _business_value_fingerprint(
    *,
    scenario: str,
    metrics: list[SubscriptionBusinessValueMetric],
    formula_version: str,
) -> str:
    payload = {
        "scenario": scenario,
        "formula_version": formula_version,
        "metrics": [metric.model_dump(mode="json") for metric in metrics],
    }
    return sha256(dumps(payload, sort_keys=True).encode("utf-8")).hexdigest()


def _overall_source_health(
    *,
    sources: list[SubscriptionSourceHealthSource],
    pending_or_unknown_final_outcome: bool,
) -> str:
    if any(source.data_quality_status == DataQualityStatus.FAILING for source in sources):
        return "degraded"
    if pending_or_unknown_final_outcome:
        return "warning"
    if any(source.freshness_status == FreshnessStatus.STALE for source in sources):
        return "warning"
    if any(source.conflict_count > 0 for source in sources):
        return "warning"
    return "healthy"


def get_subscription_summary() -> SubscriptionSummary:
    return SubscriptionSummary(
        cards=[
            MetricCard(
                key="subscription_action_completion_rate",
                label="Subscription Action Completion Rate",
                value="Preview baseline",
                trust_label=TrustLabel.MEDIUM,
                description="Stay.ai-confirmed subscription actions divided by eligible attempts.",
                source_of_truth="Stay.ai",
            ),
            MetricCard(
                key="portal_completion_rate",
                label="Portal Completion Rate",
                value="Awaiting live source connection",
                trust_label=TrustLabel.MEDIUM,
                description="Confirmed portal completions only; sent links do not count as success.",
                source_of_truth="Portal/Stay.ai",
            ),
        ]
    )


def confirm_subscription_action(
    request: SubscriptionActionConfirmationRequest,
) -> SubscriptionActionConfirmationResponse:
    decision = SourceTruthService().subscription_save_confirmed(
        SubscriptionOutcomeValidationRequest(evidence=request.evidence)
    )
    return SubscriptionActionConfirmationResponse(action=request.action, decision=decision)


def validate_portal_success(request: PortalSuccessValidationRequest) -> SourceTruthDecision:
    return SourceTruthService().portal_success(request)


def get_subscription_analytics(scenario: str = "baseline") -> SubscriptionAnalyticsResponse:
    effective_scenario = (
        scenario if scenario in SUBSCRIPTION_ANALYTICS_FIXTURES else "baseline"
    )
    fixture = SUBSCRIPTION_ANALYTICS_FIXTURES[effective_scenario]
    source_confirmation_status = fixture["source_confirmation_status"]
    overview = SubscriptionOverviewMetrics(**fixture["subscription_overview"])
    portal = PortalJourneyMetrics(**fixture["portal_journey"])
    shopify = ShopifyContextMetrics(**fixture["shopify_context"])
    synthflow = SynthflowJourneyMetrics(**fixture["synthflow_journey"])
    source_confirmation = SourceConfirmationMetrics(
        source_confirmation_status=source_confirmation_status,
        **fixture["source_confirmation"],
    )
    trust_label = _calculate_trust_label(source_confirmation)
    fingerprint = _analytics_fingerprint(
        scenario=effective_scenario,
        overview=overview,
        portal=portal,
        source_confirmation=source_confirmation,
    )
    metric_metadata = SubscriptionAnalyticsMetricMetadata(
        metric_id="subscription_analytics_overview",
        metric_definitions=[
            "subscription_action_completion_rate",
            "confirmed_cancellation_rate",
            "subscription_save_rate",
            "portal_completion_rate",
        ],
        filters=fixture["filters"],
        formula_version="v0.4.0",
        freshness=fixture["freshness"],
        trust_label=trust_label,
        owner="analytics",
        timestamp=fixture["timestamp"],
        fingerprint=fingerprint,
        audit_reference=f"audit-subscriptions-{effective_scenario}-20260501",
        source_system="analytics_api",
        source_confirmation_status=source_confirmation_status,
        presentation=_metric_presentation(
            display_label="Subscription Analytics Overview",
            short_label="Overview",
            executive_summary=(
                "Subscription outcome performance is shown with Stay.ai confirmation controls and "
                "context-only Shopify attribution."
            ),
            format_type="count_and_rate_bundle",
            unit="mixed",
            metric_trust_label=trust_label,
            source_confirmation_status=source_confirmation_status,
            freshness_status=fixture["freshness"],
            drilldown_hint="Open subscription outcomes to inspect confirmation gaps and portal completion states.",
        ),
    )
    return SubscriptionAnalyticsResponse(
        final_subscription_state=fixture["final_subscription_state"],
        source_confirmation_status=source_confirmation_status,
        subscription_overview=overview,
        portal_journey=portal,
        shopify_context=shopify,
        synthflow_journey=synthflow,
        source_confirmation=source_confirmation,
        metric_metadata=metric_metadata,
    )


def get_subscription_outcomes(scenario: str = "baseline") -> SubscriptionOutcomesResponse:
    effective_scenario = (
        scenario if scenario in SUBSCRIPTION_OUTCOME_FIXTURES else "baseline"
    )
    fixture = SUBSCRIPTION_OUTCOME_FIXTURES[effective_scenario]
    records = fixture["records"]
    unique_contact_ids = {record["contact_id"] for record in records}
    cancellation_requests_total = sum(
        1
        for record in records
        if record["action_requested"]
        and record["action_type"] == SubscriptionOutcomeActionType.CANCEL
    )
    confirmed_cancellations_total = 0
    save_or_retention_attempts_total = 0
    confirmed_retained_total = 0
    non_cancellation_actions_total = 0
    pending_stayai_confirmation_total = 0
    missing_stayai_final_state_total = 0
    portal_link_sent_total = 0
    portal_completion_confirmed_total = 0
    shopify_context_available_total = 0
    synthflow_subscription_journeys_total = 0
    subscription_outcome_unknown_total = 0

    for record in records:
        confirmed_cancellation = _is_confirmed_cancellation(record)
        confirmed_retained = _is_confirmed_retained(record)
        non_cancellation_action_completed = _is_non_cancellation_action_completed(record)
        if confirmed_cancellation:
            confirmed_cancellations_total += 1
        if (
            record["action_requested"]
            and record["action_type"] == SubscriptionOutcomeActionType.SAVE
        ):
            save_or_retention_attempts_total += 1
        if confirmed_retained:
            confirmed_retained_total += 1
        if non_cancellation_action_completed:
            non_cancellation_actions_total += 1
        if (
            record["action_type"]
            in {SubscriptionOutcomeActionType.CANCEL, SubscriptionOutcomeActionType.SAVE}
            and record["stayai_confirmation_status"] == SourceConfirmationStatus.PENDING
        ):
            pending_stayai_confirmation_total += 1
        if (
            record["action_type"]
            in {SubscriptionOutcomeActionType.CANCEL, SubscriptionOutcomeActionType.SAVE}
            and record["stayai_final_state"] is None
        ):
            missing_stayai_final_state_total += 1
        if record["portal_link_sent"]:
            portal_link_sent_total += 1
        if record["portal_completion_confirmed"]:
            portal_completion_confirmed_total += 1
        if record["shopify_context_available"]:
            shopify_context_available_total += 1
        if record["synthflow_journey_present"]:
            synthflow_subscription_journeys_total += 1
        if _is_unknown_outcome(
            record,
            confirmed_cancellation=confirmed_cancellation,
            confirmed_retained=confirmed_retained,
            non_cancellation_action_completed=non_cancellation_action_completed,
        ):
            subscription_outcome_unknown_total += 1

    metrics = SubscriptionOutcomeMetrics(
        subscription_contacts_total=len(unique_contact_ids),
        subscription_action_requests_total=sum(
            1 for record in records if record["action_requested"]
        ),
        cancellation_requests_total=cancellation_requests_total,
        confirmed_cancellations_total=confirmed_cancellations_total,
        save_or_retention_attempts_total=save_or_retention_attempts_total,
        confirmed_retained_total=confirmed_retained_total,
        non_cancellation_actions_total=non_cancellation_actions_total,
        pending_stayai_confirmation_total=pending_stayai_confirmation_total,
        missing_stayai_final_state_total=missing_stayai_final_state_total,
        portal_link_sent_total=portal_link_sent_total,
        portal_completion_confirmed_total=portal_completion_confirmed_total,
        shopify_context_available_total=shopify_context_available_total,
        synthflow_subscription_journeys_total=synthflow_subscription_journeys_total,
        subscription_outcome_unknown_total=subscription_outcome_unknown_total,
        retention_rate=_safe_rate(
            confirmed_retained_total, save_or_retention_attempts_total
        ),
        cancellation_confirmation_rate=_safe_rate(
            confirmed_cancellations_total, cancellation_requests_total
        ),
        portal_completion_rate=_safe_rate(
            portal_completion_confirmed_total, portal_link_sent_total
        ),
    )
    source_confirmation_status = SourceConfirmationStatus.CONFIRMED
    if missing_stayai_final_state_total > 0:
        source_confirmation_status = SourceConfirmationStatus.MISSING
    elif pending_stayai_confirmation_total > 0:
        source_confirmation_status = SourceConfirmationStatus.PENDING

    trust_label = TrustLabel.HIGH
    if source_confirmation_status == SourceConfirmationStatus.MISSING:
        trust_label = TrustLabel.LOW
    elif (
        source_confirmation_status == SourceConfirmationStatus.PENDING
        or subscription_outcome_unknown_total > 0
    ):
        trust_label = TrustLabel.MEDIUM

    formula_version = fixture["formula_version"]
    metadata = SubscriptionOutcomeMetricMetadata(
        metric_id="subscription_outcome_metrics",
        filters=fixture["filters"],
        metric_definitions=[
            "retention_rate = confirmed_retained_total / save_or_retention_attempts_total",
            "cancellation_confirmation_rate = confirmed_cancellations_total / cancellation_requests_total",
            "portal_completion_rate = portal_completion_confirmed_total / portal_link_sent_total",
            "confirmed_cancellations_total requires Stay.ai cancelled final state or approved official completion path",
            "confirmed_retained_total requires Stay.ai retained/saved/active confirmed final state after a save attempt",
            "Shopify and Synthflow contribute context/journey metrics only and do not finalize subscription state",
        ],
        trust_label=trust_label,
        freshness_status=fixture["freshness_status"],
        formula_version=formula_version,
        owner=fixture["owner"],
        timestamp=fixture["timestamp"],
        fingerprint=_outcomes_fingerprint(
            scenario=effective_scenario,
            metrics=metrics,
            formula_version=formula_version,
        ),
        audit_reference=fixture["audit_reference"],
        source_confirmation_status=source_confirmation_status,
        presentation=_metric_presentation(
            display_label="Subscription Outcomes",
            short_label="Outcomes",
            executive_summary=(
                "Outcome totals reflect confirmed Stay.ai final states, with pending and missing states "
                "kept explicit for trust-safe reporting."
            ),
            format_type="count_and_rate_bundle",
            unit="mixed",
            metric_trust_label=trust_label,
            source_confirmation_status=source_confirmation_status,
            freshness_status=fixture["freshness_status"],
            drilldown_hint="Review source health and record-level confirmations before interpreting final-state trends.",
        ),
    )

    return SubscriptionOutcomesResponse(
        source_confirmation_status=source_confirmation_status,
        scenario=effective_scenario,
        metrics=metrics,
        metadata=metadata,
    )


def get_subscription_business_value(
    scenario: str = "baseline",
) -> SubscriptionBusinessValueResponse:
    effective_scenario = (
        scenario if scenario in SUBSCRIPTION_BUSINESS_VALUE_FIXTURES else "baseline"
    )
    fixture = SUBSCRIPTION_BUSINESS_VALUE_FIXTURES[effective_scenario]
    metric_models: list[SubscriptionBusinessValueMetric] = []
    for metric in fixture["metrics"]:
        metric_state = metric["state"]
        metric_id = metric["metric_key"]
        metric_display_label = metric["display_name"]
        missing_data_reason = metric["notes"] if metric_state != BusinessValueState.CONFIRMED else None
        blocked_reason_plain_language = (
            "Required source data is missing; this metric cannot be finalized yet."
            if metric_state == BusinessValueState.BLOCKED_BY_DATA
            else None
        )
        metric_trust_label = (
            TrustLabel.HIGH
            if metric_state == BusinessValueState.CONFIRMED
            else TrustLabel.LOW
            if metric_state in {BusinessValueState.UNKNOWN, BusinessValueState.BLOCKED_BY_DATA}
            else TrustLabel.MEDIUM
        )
        next_action_hint = (
            "Wait for Stay.ai confirmation and refresh this page."
            if metric_state in {BusinessValueState.PENDING, BusinessValueState.UNKNOWN}
            else "Use this metric in governed exports with manifest metadata."
        )
        metric_models.append(
            SubscriptionBusinessValueMetric(
                metric_id=metric_id,
                display_label=metric_display_label,
                plain_language_summary=(
                    f"{metric_display_label} is reported with explicit state labels so "
                    "confirmed and estimated values are never mixed."
                ),
                value_state=metric_state,
                format="currency" if metric["unit"] == "usd" else metric["unit"],
                formula_version=fixture["formula_version"],
                source_confirmation_status=fixture["source_confirmation_status"],
                trust_label=metric_trust_label,
                freshness_status=fixture["freshness_status"],
                owner=fixture["owner"],
                timestamp=fixture["timestamp"],
                fingerprint=sha256(
                    dumps(
                        {
                            "scenario": effective_scenario,
                            "metric_id": metric_id,
                            "formula_version": fixture["formula_version"],
                            "value": metric["value"],
                        },
                        sort_keys=True,
                    ).encode("utf-8")
                ).hexdigest(),
                audit_reference=fixture["audit_reference"],
                missing_data_reason=missing_data_reason,
                next_action_hint=next_action_hint,
                support_label=metric_display_label,
                support_summary=(
                    "This metric uses source-truth-safe rules and cannot finalize from Shopify context alone."
                ),
                why_it_matters=(
                    "Support and retention users need a reliable business-value signal to prioritize actions."
                ),
                what_to_do_next=next_action_hint,
                blocked_reason_plain_language=blocked_reason_plain_language,
                **metric,
            )
        )
    blocked_metrics_count = sum(
        1
        for metric in metric_models
        if metric.value_state == BusinessValueState.BLOCKED_BY_DATA
    )
    source_confirmation_status = fixture["source_confirmation_status"]
    if source_confirmation_status == SourceConfirmationStatus.MISSING:
        trust_label = TrustLabel.LOW
    elif blocked_metrics_count > 0 or source_confirmation_status == SourceConfirmationStatus.PENDING:
        trust_label = TrustLabel.MEDIUM
    else:
        trust_label = TrustLabel.HIGH
    metadata = SubscriptionBusinessValueMetadata(
        metric_id="subscription_business_value_summary",
        filters=fixture["filters"],
        trust_label=trust_label,
        freshness_status=fixture["freshness_status"],
        formula_version=fixture["formula_version"],
        owner=fixture["owner"],
        timestamp=fixture["timestamp"],
        fingerprint=_business_value_fingerprint(
            scenario=effective_scenario,
            metrics=metric_models,
            formula_version=fixture["formula_version"],
        ),
        audit_reference=fixture["audit_reference"],
        blocked_metrics_count=blocked_metrics_count,
        source_confirmation_status=source_confirmation_status,
        presentation=_metric_presentation(
            display_label="Subscription Business Value",
            short_label="Business Value",
            executive_summary=(
                "Business-value metrics separate confirmed, estimated, pending, unknown, and blocked states "
                "to avoid overstating financial impact."
            ),
            format_type="metric_list",
            unit="mixed",
            metric_trust_label=trust_label,
            source_confirmation_status=source_confirmation_status,
            freshness_status=fixture["freshness_status"],
            drilldown_hint="Review metric states and notes before aggregating into executive ROI claims.",
        ),
    )
    return SubscriptionBusinessValueResponse(
        source_confirmation_status=source_confirmation_status,
        scenario=effective_scenario,
        metrics=metric_models,
        metadata=metadata,
    )


def get_subscription_filter_options(
    scenario: str = "baseline",
) -> SubscriptionAdvancedFilterResponse:
    options = [SubscriptionFilterOption(**option) for option in SUBSCRIPTION_ADVANCED_FILTER_OPTIONS]
    metadata = SubscriptionOutcomeMetricMetadata(
        metric_id="subscription_advanced_filter_contract",
        filters={"date_preset": "last_30_days", "saved_view": "default"},
        metric_definitions=[
            "Filter options are governed by source-of-truth and data-dependency rules.",
            "Disabled filters include explicit reasons and never silently disappear.",
            "Shopify is context-only and does not finalize subscription outcome truth.",
        ],
        trust_label=TrustLabel.HIGH,
        freshness_status=FreshnessStatus.FRESH,
        formula_version="v1.0.0",
        owner="analytics",
        timestamp="2026-05-06T12:00:00Z",
        fingerprint=sha256(
            dumps({"scenario": scenario, "options": [option.model_dump(mode="json") for option in options]}, sort_keys=True).encode(
                "utf-8"
            )
        ).hexdigest(),
        audit_reference=f"audit-subscription-advanced-filters-{scenario}-20260506",
        source_confirmation_status=SourceConfirmationStatus.CONFIRMED,
        presentation=_metric_presentation(
            display_label="Subscription Advanced Filters",
            short_label="Advanced Filters",
            executive_summary=(
                "Advanced filters expose required subscription dimensions and include disabled reasons "
                "where data dependencies are not yet available."
            ),
            format_type="filter_option_catalog",
            unit="n/a",
            metric_trust_label=TrustLabel.HIGH,
            source_confirmation_status=SourceConfirmationStatus.CONFIRMED,
            freshness_status=FreshnessStatus.FRESH,
            drilldown_hint="Use filter_id values to bind UI controls and export manifests.",
        ),
    )
    return SubscriptionAdvancedFilterResponse(
        scenario=scenario,
        options=options,
        applied_filters={"date_preset": "last_30_days", "comparison_period": "none", "saved_view": "default"},
        metadata=metadata,
    )


def get_subscription_export_preflight(
    request: SubscriptionExportPreflightRequest,
    authenticated_roles: list[Role] | None = None,
) -> SubscriptionExportPreflightResponse:
    role_precedence = [
        Role.ADMIN.value,
        Role.COMPLIANCE_MANAGER.value,
        Role.ANALYST.value,
        Role.SUPPORT_LEAD.value,
        Role.VIEWER.value,
    ]
    normalized_authenticated_roles = [
        role.value if isinstance(role, Role) else str(role).strip().lower()
        for role in (authenticated_roles or [])
    ]
    role = next(
        (
            role_name
            for role_name in role_precedence
            if role_name in normalized_authenticated_roles
        ),
        "unknown",
    )
    role_permissions: dict[str, set[SubscriptionExportScope]] = {
        "admin": set(SubscriptionExportScope),
        "analyst": set(SubscriptionExportScope),
        "compliance_manager": set(SubscriptionExportScope),
        "support_lead": {
            SubscriptionExportScope.EXPORT_TABLE_ROWS,
            SubscriptionExportScope.EXPORT_FILTERED_CSV,
            SubscriptionExportScope.EXPORT_AUDIT_MANIFEST,
        },
        "viewer": set(),
        "unknown": set(),
    }
    allowed_scopes = role_permissions.get(role, set())
    export_allowed = request.requested_scope in allowed_scopes
    blocked_reason = None
    permission_decision = "allow"
    if not export_allowed:
        blocked_reason = (
            "Export blocked: your role cannot export this scope. Audit reference logged."
        )
        permission_decision = "explicit_deny"

    metric_definitions = [
        "confirmed_cancellations_total requires Stay.ai cancelled final state or approved official path",
        "confirmed_retained_total requires Stay.ai retained/saved/active confirmed final state",
        "portal link sent is not portal completion",
    ]
    trust_labels = ["high", "medium", "low"]
    freshness = "stale"
    formula_versions = ["subscription_outcomes:v0.5.0", "business_value:v0.7.0"]
    included_widgets = (
        request.included_widgets
        if "included_widgets" in request.model_fields_set
        else ["outcome_funnel", "business_value_headline"]
    )
    excluded_widgets = [] if export_allowed else included_widgets
    missing_required_metadata: list[str] = []
    if not request.filters:
        missing_required_metadata.append("filters")
    if request.comparison_period == "":
        missing_required_metadata.append("comparison_period")

    payload = {
        "requested_scope": request.requested_scope,
        "requested_format": request.requested_format,
        "filters": request.filters,
        "comparison_period": request.comparison_period,
        "role": role,
    }
    return SubscriptionExportPreflightResponse(
        export_allowed=export_allowed,
        blocked_reason=blocked_reason,
        requested_scope=request.requested_scope,
        requested_format=request.requested_format,
        filters=request.filters,
        comparison_period=request.comparison_period,
        metric_definitions=metric_definitions,
        trust_labels=trust_labels,
        freshness=freshness,
        formula_versions=formula_versions,
        owner="analytics",
        timestamp="2026-05-06T12:00:00Z",
        fingerprint=sha256(dumps(payload, sort_keys=True).encode("utf-8")).hexdigest(),
        audit_reference=f"audit-subscription-export-preflight-{uuid4().hex[:10]}",
        requester_role=role,
        permission_decision=permission_decision,
        source_confirmation_status=SourceConfirmationStatus.PENDING,
        included_widgets=included_widgets if export_allowed else [],
        excluded_widgets=excluded_widgets,
        missing_required_metadata=missing_required_metadata,
    )


def get_subscription_follow_up(
    scenario: str = "baseline",
) -> SubscriptionFollowUpResponse:
    records = [
        SubscriptionFollowUpRecord(**record)
        for record in SUBSCRIPTION_FOLLOW_UP_FIXTURES.get(scenario, SUBSCRIPTION_FOLLOW_UP_FIXTURES["baseline"])
    ]
    metadata = SubscriptionOutcomeMetricMetadata(
        metric_id="subscription_follow_up_queue",
        filters={"queue": "open", "priority": "high_or_medium"},
        metric_definitions=[
            "Follow-up queue includes records with pending confirmation, portal completion unknown, or low trust.",
            "Stay.ai confirmation is required for final save/cancel truth.",
            "Portal link sent does not imply portal completion.",
        ],
        trust_label=TrustLabel.MEDIUM,
        freshness_status=FreshnessStatus.FRESH,
        formula_version="v1.0.0",
        owner="support_ops",
        timestamp="2026-05-06T12:00:00Z",
        fingerprint=sha256(
            dumps({"scenario": scenario, "records": [record.model_dump(mode="json") for record in records]}, sort_keys=True).encode(
                "utf-8"
            )
        ).hexdigest(),
        audit_reference=f"audit-subscription-follow-up-{scenario}-20260506",
        source_confirmation_status=SourceConfirmationStatus.PENDING,
        presentation=_metric_presentation(
            display_label="Subscription Follow-up Queue",
            short_label="Follow-up",
            executive_summary=(
                "Follow-up queue prioritizes cases needing human action with source-truth-safe status fields."
            ),
            format_type="action_queue",
            unit="count",
            metric_trust_label=TrustLabel.MEDIUM,
            source_confirmation_status=SourceConfirmationStatus.PENDING,
            freshness_status=FreshnessStatus.FRESH,
            drilldown_hint="Use recommended_action and blocking_data_gap to route work quickly.",
        ),
    )
    return SubscriptionFollowUpResponse(scenario=scenario, records=records, metadata=metadata)


def get_subscription_source_health(
    scenario: str = "baseline",
    source_systems: list[SourceSystem] | None = None,
) -> SubscriptionSourceHealthResponse:
    effective_scenario = (
        scenario if scenario in SUBSCRIPTION_SOURCE_HEALTH_FIXTURES else "baseline"
    )
    fixture = SUBSCRIPTION_SOURCE_HEALTH_FIXTURES[effective_scenario]
    all_sources = []
    for source_fixture in fixture["sources"]:
        source_system = source_fixture["source_system"]
        source_confirmation_status = source_fixture["source_confirmation_status"]
        freshness_status = source_fixture["freshness_status"]
        if source_confirmation_status == SourceConfirmationStatus.CONFIRMED:
            severity = MetricSeverity.SUCCESS
            visual_tone = VisualTone.POSITIVE
        elif source_confirmation_status == SourceConfirmationStatus.PENDING:
            severity = MetricSeverity.WARNING
            visual_tone = VisualTone.CAUTION
        else:
            severity = MetricSeverity.CRITICAL
            visual_tone = VisualTone.CRITICAL

        source_presentation = PresentationMetadata(
            display_label=f"{str(source_system).replace('_', ' ').title()} Source Health",
            short_label=str(source_system).replace("_", " ").title(),
            executive_summary=(
                f"{str(source_system).replace('_', ' ').title()} is monitored for freshness, "
                "quality, and confirmation status without overriding Stay.ai authority."
            ),
            format_type="status_badge",
            unit="status",
            trend_direction=TrendDirection.UNKNOWN,
            comparison_label=_comparison_label(),
            comparison_value=None,
            severity=severity,
            visual_tone=visual_tone,
            source_authority_explanation=_source_authority_explanation(source_system),
            trust_explanation=_trust_explanation(
                source_fixture["trust_label"],
                source_confirmation_status=source_confirmation_status,
            ),
            freshness_explanation=_freshness_explanation(freshness_status),
            drilldown_hint=f"Inspect lineage and missing fields for {source_system}.",
            empty_state_copy=f"No {source_system} records were present in this filtered view.",
            blocked_state_copy=(
                "Source health is blocked when source extraction or confirmation telemetry is unavailable."
            ),
        )
        all_sources.append(
            SubscriptionSourceHealthSource(**source_fixture, presentation=source_presentation)
        )
    filtered_sources = (
        [source for source in all_sources if source.source_system in source_systems]
        if source_systems
        else all_sources
    )
    stay_ai_source = next(
        (source for source in all_sources if source.source_system == SourceSystem.STAY_AI),
        None,
    )
    missing_stay_ai_final_state = (
        stay_ai_source is None
        or stay_ai_source.source_confirmation_status != SourceConfirmationStatus.CONFIRMED
    )
    pending_or_unknown_final_outcome = missing_stay_ai_final_state
    conflict_count = sum(source.conflict_count for source in all_sources)
    if stay_ai_source is None:
        conflict_status = "unknown"
    elif conflict_count > 0:
        conflict_status = "conflict_detected"
    elif pending_or_unknown_final_outcome:
        conflict_status = "pending"
    else:
        conflict_status = "none"
    portal_source = next(
        (source for source in all_sources if source.source_system == SourceSystem.PORTAL),
        None,
    )
    portal_completion_warning = None
    if (
        portal_source
        and portal_source.source_confirmation_status != SourceConfirmationStatus.CONFIRMED
    ):
        portal_completion_warning = (
            "Portal link sent without confirmed completion remains incomplete."
        )
    missing_stay_ai_final_state_warning = None
    if missing_stay_ai_final_state:
        missing_stay_ai_final_state_warning = (
            "Missing Stay.ai confirmed final state keeps final subscription outcome pending or unknown."
        )
    shopify_context_warning = (
        "Shopify data is context-only and cannot finalize cancellation or retention outcomes."
    )
    formula_version = fixture["formula_version"]
    fingerprint = _source_health_fingerprint(
        scenario=effective_scenario,
        sources=all_sources,
        formula_version=formula_version,
    )
    overall_source_health = _overall_source_health(
        sources=all_sources,
        pending_or_unknown_final_outcome=pending_or_unknown_final_outcome,
    )
    if overall_source_health == "degraded":
        metadata_severity = MetricSeverity.CRITICAL
        metadata_visual_tone = VisualTone.CRITICAL
    elif overall_source_health == "warning":
        metadata_severity = MetricSeverity.WARNING
        metadata_visual_tone = VisualTone.CAUTION
    elif overall_source_health == "healthy":
        metadata_severity = MetricSeverity.SUCCESS
        metadata_visual_tone = VisualTone.POSITIVE
    else:
        metadata_severity = MetricSeverity.INFO
        metadata_visual_tone = VisualTone.NEUTRAL
    metadata = SubscriptionSourceHealthMetadata(
        timestamp=fixture["timestamp"],
        fingerprint=fingerprint,
        formula_version=formula_version,
        owner=fixture["owner"],
        audit_reference=fixture["audit_reference"],
        presentation=PresentationMetadata(
            display_label="Subscription Source Health",
            short_label="Source Health",
            executive_summary=(
                "Source authority and quality posture are shown per system so dashboards can signal risk "
                "without inferring final outcomes from non-authoritative data."
            ),
            format_type="status_summary",
            unit="status",
            trend_direction=TrendDirection.UNKNOWN,
            comparison_label=_comparison_label(),
            comparison_value=None,
            severity=metadata_severity,
            visual_tone=metadata_visual_tone,
            source_authority_explanation=_source_authority_explanation("stayai"),
            trust_explanation=(
                "Trust labels are system-calculated from confirmation and data-quality status and are not manual."
            ),
            freshness_explanation="Source freshness is evaluated independently per source system.",
            drilldown_hint="Use the sources array to audit each upstream system before UI escalation.",
            empty_state_copy="No source-health records matched the selected filters.",
            blocked_state_copy="Source health is blocked while governed ingestion evidence is unavailable.",
        ),
    )
    return SubscriptionSourceHealthResponse(
        overall_source_health=overall_source_health,
        conflict_status=conflict_status,
        pending_or_unknown_final_outcome=pending_or_unknown_final_outcome,
        missing_stay_ai_final_state_warning=missing_stay_ai_final_state_warning,
        portal_completion_warning=portal_completion_warning,
        shopify_context_warning=shopify_context_warning,
        sources=filtered_sources,
        metadata=metadata,
    )
