from hashlib import sha256
from json import dumps
from typing import TypedDict

from app.schemas.metric import MetricCard, TrustLabel
from app.schemas.source_truth import (
    PortalSuccessValidationRequest,
    SourceTruthDecision,
    SubscriptionOutcomeValidationRequest,
)
from app.schemas.subscription import (
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


def _trust_explanation(source_confirmation_status: SourceConfirmationStatus) -> str:
    if source_confirmation_status == SourceConfirmationStatus.CONFIRMED:
        return "Trust is high because Stay.ai confirmation is present for final state-sensitive paths."
    if source_confirmation_status == SourceConfirmationStatus.PENDING:
        return "Trust is medium because some records are still pending Stay.ai confirmation."
    return "Trust is low because Stay.ai final state confirmation is missing for one or more records."


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
    source_confirmation_status: SourceConfirmationStatus,
    freshness_status: FreshnessStatus | str,
    drilldown_hint: str,
) -> PresentationMetadata:
    if source_confirmation_status == SourceConfirmationStatus.CONFIRMED:
        severity = MetricSeverity.SUCCESS
        visual_tone = VisualTone.POSITIVE
    elif source_confirmation_status == SourceConfirmationStatus.PENDING:
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
        trust_explanation=_trust_explanation(source_confirmation_status),
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
        "sources": [source.model_dump(mode="json") for source in sources],
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
            trust_explanation=_trust_explanation(source_confirmation_status),
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
            severity=MetricSeverity.INFO,
            visual_tone=VisualTone.NEUTRAL,
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
        overall_source_health=_overall_source_health(
            sources=all_sources,
            pending_or_unknown_final_outcome=pending_or_unknown_final_outcome,
        ),
        conflict_status=conflict_status,
        pending_or_unknown_final_outcome=pending_or_unknown_final_outcome,
        missing_stay_ai_final_state_warning=missing_stay_ai_final_state_warning,
        portal_completion_warning=portal_completion_warning,
        shopify_context_warning=shopify_context_warning,
        sources=filtered_sources,
        metadata=metadata,
    )
