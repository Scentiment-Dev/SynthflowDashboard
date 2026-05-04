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
                value="starter",
                trust_label=TrustLabel.MEDIUM,
                description="Stay.ai-confirmed subscription actions divided by eligible attempts.",
                source_of_truth="Stay.ai",
            ),
            MetricCard(
                key="portal_completion_rate",
                label="Portal Completion Rate",
                value="starter",
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


def get_subscription_source_health(
    scenario: str = "baseline",
    source_systems: list[SourceSystem] | None = None,
) -> SubscriptionSourceHealthResponse:
    effective_scenario = (
        scenario if scenario in SUBSCRIPTION_SOURCE_HEALTH_FIXTURES else "baseline"
    )
    fixture = SUBSCRIPTION_SOURCE_HEALTH_FIXTURES[effective_scenario]
    all_sources = [
        SubscriptionSourceHealthSource(**source_fixture)
        for source_fixture in fixture["sources"]
    ]
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
