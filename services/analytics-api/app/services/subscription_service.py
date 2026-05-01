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
    SourceConfirmationMetrics,
    SourceConfirmationStatus,
    SubscriptionActionConfirmationRequest,
    SubscriptionActionConfirmationResponse,
    SubscriptionAnalyticsMetricMetadata,
    SubscriptionAnalyticsResponse,
    SubscriptionOverviewMetrics,
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
