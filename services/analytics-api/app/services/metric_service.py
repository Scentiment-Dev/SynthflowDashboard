from app.schemas.common import FreshnessMetadata, Platform
from app.schemas.metric import (
    DashboardModule,
    DashboardSummary,
    MetricCard,
    MetricDefinition,
    MetricSeriesPoint,
    TrustLabel,
)


METRIC_DEFINITIONS: list[MetricDefinition] = [
    MetricDefinition(
        metric_key="subscription_action_completion_rate",
        display_name="Subscription Action Completion Rate",
        module=DashboardModule.SUBSCRIPTIONS,
        formula="stayai_confirmed_actions / eligible_subscription_action_attempts",
        source_of_truth="Stay.ai",
        trust_rule="Stay.ai confirmed state/action outcome required.",
        description="Measures completed subscription actions handled by automation or portal handoff.",
    ),
    MetricDefinition(
        metric_key="subscription_save_rate",
        display_name="Subscription Save Rate",
        module=DashboardModule.RETENTION,
        formula="confirmed_saved / eligible_cancellation_attempts",
        source_of_truth="Stay.ai",
        trust_rule="Confirmed retained subscription outcome required.",
        description="Shows how often cancellation attempts are saved with verified Stay.ai retained state.",
    ),
    MetricDefinition(
        metric_key="confirmed_cancellation_rate",
        display_name="Confirmed Cancellation Rate",
        module=DashboardModule.CANCELLATIONS,
        formula="confirmed_cancelled / eligible_cancellation_attempts",
        source_of_truth="Stay.ai",
        trust_rule="Request alone is not cancellation.",
        description="Counts cancellations only when official state confirms cancellation.",
    ),
    MetricDefinition(
        metric_key="cost_too_high_offer_progression",
        display_name="Cost Too High Offer Progression",
        module=DashboardModule.RETENTION,
        formula="frequency_change -> 25_percent_offer -> cancellation_if_declined",
        source_of_truth="Synthflow + Stay.ai",
        trust_rule="Offer sequence is locked.",
        description="Tracks whether Cost Too High journeys follow the required retention sequence.",
    ),
    MetricDefinition(
        metric_key="portal_completion_rate",
        display_name="Portal Completion Rate",
        module=DashboardModule.SUBSCRIPTIONS,
        formula="confirmed_portal_completed / portal_started",
        source_of_truth="Portal/Stay.ai",
        trust_rule="Link sent is diagnostic only.",
        description="Measures confirmed portal completion, not merely portal link delivery.",
    ),
    MetricDefinition(
        metric_key="automation_containment_rate",
        display_name="Automation Containment Rate",
        module=DashboardModule.OVERVIEW,
        formula="resolved_or_portal_completed / eligible_calls",
        source_of_truth="Synthflow + Warehouse",
        trust_rule="Abandoned/drop-off/unresolved calls excluded from success.",
        description="Tracks successful containment without inflating success with abandoned or unresolved calls.",
    ),
    MetricDefinition(
        metric_key="order_status_resolution_rate",
        display_name="Order Status Resolution Rate",
        module=DashboardModule.ORDER_STATUS,
        formula="resolved_order_status_calls / eligible_order_status_calls",
        source_of_truth="Synthflow + Shopify",
        trust_rule="Shopify provides official order context.",
        description="Measures order-status calls resolved using confirmed Shopify order context.",
    ),
    MetricDefinition(
        metric_key="escalation_rate",
        display_name="Escalation Rate",
        module=DashboardModule.ESCALATIONS,
        formula="human_escalations / eligible_calls",
        source_of_truth="Synthflow + RingCX/support case system",
        trust_rule="Transfers are not containment success.",
        description="Measures handoffs to live agents or support systems.",
    ),
    MetricDefinition(
        metric_key="high_trust_metric_rate",
        display_name="High Trust Metric Rate",
        module=DashboardModule.DATA_QUALITY,
        formula="high_trust_metrics / major_metrics",
        source_of_truth="Warehouse",
        trust_rule="Trust labels are calculated only.",
        description="Shows how much of the dashboard is backed by high-confidence source data.",
    ),
    MetricDefinition(
        metric_key="export_audit_compliance_rate",
        display_name="Export Audit Compliance Rate",
        module=DashboardModule.GOVERNANCE,
        formula="compliant_exports / all_exports",
        source_of_truth="Analytics API",
        trust_rule="Fingerprint and audit reference required.",
        description="Tracks whether exports include required governance metadata.",
    ),
]


def list_metric_definitions() -> list[MetricDefinition]:
    return METRIC_DEFINITIONS


def list_dashboard_modules() -> list[DashboardModule]:
    return list(DashboardModule)


def module_definitions(module: DashboardModule) -> list[MetricDefinition]:
    return [definition for definition in METRIC_DEFINITIONS if definition.module == module]


def module_summary(module: DashboardModule) -> DashboardSummary:
    definitions = module_definitions(module) or METRIC_DEFINITIONS[:3]
    cards = [
        MetricCard(
            key=definition.metric_key,
            label=definition.display_name,
            value="starter",
            trust_label=TrustLabel.MEDIUM,
            description=definition.description or definition.trust_rule,
            source_of_truth=definition.source_of_truth,
            freshness=FreshnessMetadata(source=Platform.WAREHOUSE),
        )
        for definition in definitions
    ]
    return DashboardSummary(module=module, cards=cards, definitions=definitions, recent_events=[])


def metric_series(metric_key: str) -> list[MetricSeriesPoint]:
    return [
        MetricSeriesPoint(period="2026-04-27", value=0.0, trust_label=TrustLabel.MEDIUM),
        MetricSeriesPoint(period="2026-04-28", value=0.0, trust_label=TrustLabel.MEDIUM),
        MetricSeriesPoint(period="2026-04-29", value=0.0, trust_label=TrustLabel.MEDIUM),
    ]
