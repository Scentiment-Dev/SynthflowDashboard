import type {
  SubscriptionBusinessValueMetric,
  SubscriptionBusinessValueResponse,
  SubscriptionBusinessValueScenario,
} from '../types/subscriptionBusinessValue';

const TIMESTAMP = '2026-05-06T12:00:00Z';
const OWNER = 'analytics';
const FORMULA_VERSION = 'v0.7.0';

const COMMON_PRESENTATION = {
  display_label: 'Subscription Business Value',
  short_label: 'Business Value',
  executive_summary:
    'Business-value metrics separate confirmed, estimated, pending, unknown, and blocked states to avoid overstating financial impact.',
  format_type: 'metric_list',
  unit: 'mixed',
  trend_direction: 'unknown',
  comparison_label: 'Comparison baseline unavailable in fixture preview',
  comparison_value: null,
  severity: 'warning',
  visual_tone: 'caution',
  source_authority_explanation:
    'Stay.ai is the source of truth for final subscription state and outcome confirmation.',
  trust_explanation:
    'Trust is medium because some records are still pending Stay.ai confirmation.',
  freshness_explanation:
    'Data is fresh for live runs; the fixture preview reflects a recent reviewed snapshot.',
  drilldown_hint:
    'Review metric states and notes before aggregating into executive ROI claims.',
  empty_state_copy: 'No eligible records were available for this calculation window.',
  blocked_state_copy:
    'This metric is blocked until Stay.ai confirmation records are available.',
};

function buildMetric(
  partial: Partial<SubscriptionBusinessValueMetric> &
    Pick<
      SubscriptionBusinessValueMetric,
      'metric_id' | 'display_label' | 'value_state' | 'value' | 'unit'
    >,
): SubscriptionBusinessValueMetric {
  return {
    plain_language_summary: partial.plain_language_summary ?? '',
    format: partial.format ?? 'currency',
    formula_version: partial.formula_version ?? FORMULA_VERSION,
    source_confirmation_status:
      partial.source_confirmation_status ??
      (partial.value_state === 'confirmed' ? 'confirmed' : 'pending'),
    trust_label:
      partial.trust_label ?? (partial.value_state === 'confirmed' ? 'high' : 'medium'),
    freshness_status: partial.freshness_status ?? 'fresh',
    owner: partial.owner ?? OWNER,
    timestamp: partial.timestamp ?? TIMESTAMP,
    fingerprint: partial.fingerprint ?? `metric-${partial.metric_id}-fixture`,
    audit_reference: partial.audit_reference ?? `audit-${partial.metric_id}-fixture`,
    missing_data_reason: partial.missing_data_reason ?? null,
    next_action_hint: partial.next_action_hint ?? '',
    support_label: partial.support_label ?? partial.display_label,
    support_summary: partial.support_summary ?? '',
    why_it_matters: partial.why_it_matters ?? '',
    what_to_do_next: partial.what_to_do_next ?? '',
    blocked_reason_plain_language: partial.blocked_reason_plain_language ?? null,
    metric_key: partial.metric_key ?? partial.metric_id,
    display_name: partial.display_name ?? partial.display_label,
    formula: partial.formula ?? '',
    source_of_truth: partial.source_of_truth ?? 'stayai_plus_finance_join',
    data_dependencies: partial.data_dependencies ?? [],
    notes: partial.notes ?? null,
    state: partial.value_state,
    metric_id: partial.metric_id,
    display_label: partial.display_label,
    value_state: partial.value_state,
    value: partial.value,
    unit: partial.unit,
  };
}

const BASELINE_METRICS: SubscriptionBusinessValueMetric[] = [
  buildMetric({
    metric_id: 'net_business_value_impact',
    display_label: 'Net Business Value Impact',
    plain_language_summary:
      'Net business value combines gross value protected, offer cost, and support cost avoided.',
    value_state: 'estimated',
    value: 86540,
    unit: 'usd',
    formula: 'gross_value_protected − offer_cost + support_cost_avoided',
    next_action_hint: 'Open follow-up queue for pending confirmation records.',
    support_summary: 'Top-line value impact for the selected filter set.',
    why_it_matters:
      'Helps support and retention teams prioritize high-impact interventions.',
    what_to_do_next: 'Open follow-up queue for pending confirmation records.',
  }),
  buildMetric({
    metric_id: 'gross_value_protected',
    display_label: 'Gross Value Protected',
    plain_language_summary:
      'Total dollar value protected by saves before offer or support costs.',
    value_state: 'estimated',
    value: 102340,
    unit: 'usd',
    formula: 'sum(save_value) for confirmed and estimated saves',
    support_summary: 'Headline retention value before any cost is netted.',
  }),
  buildMetric({
    metric_id: 'confirmed_saved_revenue',
    display_label: 'Confirmed Saved Revenue',
    plain_language_summary: 'Revenue from saves where Stay.ai has confirmed the outcome.',
    value_state: 'confirmed',
    value: 31890,
    unit: 'usd',
    formula: 'sum(save_value) where stayai_final_state = retained',
    support_summary: 'Use this for executive reporting; counts confirmed outcomes only.',
  }),
  buildMetric({
    metric_id: 'estimated_saved_revenue',
    display_label: 'Estimated Saved Revenue',
    plain_language_summary:
      'Revenue from saves not yet officially confirmed by Stay.ai.',
    value_state: 'estimated',
    value: 14210,
    unit: 'usd',
    formula: 'sum(save_value) where stayai_final_state pending or estimated',
  }),
  buildMetric({
    metric_id: 'net_saved_revenue',
    display_label: 'Net Saved Revenue',
    plain_language_summary: 'Saved revenue after offer and discount costs.',
    value_state: 'estimated',
    value: 27430,
    unit: 'usd',
    formula: 'confirmed_saved_revenue + estimated_saved_revenue − offer_cost',
  }),
  buildMetric({
    metric_id: 'offer_cost',
    display_label: 'Offer Cost',
    plain_language_summary:
      'Total cost of frequency-change, discount, and add-on incentives presented during retention calls.',
    value_state: 'estimated',
    value: 18720,
    unit: 'usd',
    formula: 'discount_cost + free_shipping_cost + incentive_cost',
  }),
  buildMetric({
    metric_id: 'discount_cost',
    display_label: 'Discount Cost',
    plain_language_summary: 'Sum of discount value applied to retention offers.',
    value_state: 'estimated',
    value: 11240,
    unit: 'usd',
    formula: 'sum(discount_value) by offer_version',
  }),
  buildMetric({
    metric_id: 'free_shipping_cost',
    display_label: 'Free Shipping Cost',
    plain_language_summary: 'Sum of free-shipping value applied to retention offers.',
    value_state: 'estimated',
    value: 4180,
    unit: 'usd',
    formula: 'sum(shipping_cost) for free-shipping offers',
  }),
  buildMetric({
    metric_id: 'revenue_at_risk',
    display_label: 'Revenue At Risk',
    plain_language_summary:
      'Revenue tied to subscriptions still pending Stay.ai confirmation.',
    value_state: 'pending',
    value: 22310,
    unit: 'usd',
    formula: 'sum(subscription_value) where stayai_final_state pending',
    why_it_matters:
      'Pending confirmation calls are the most time-sensitive risk to retention reporting.',
  }),
  buildMetric({
    metric_id: 'support_cost_avoided',
    display_label: 'Support Cost Avoided',
    plain_language_summary:
      'Estimated cost saved by automated containment vs a human-handled call.',
    value_state: 'estimated',
    value: 9120,
    unit: 'usd',
    formula: 'contained_calls × avg_human_call_cost',
  }),
  buildMetric({
    metric_id: 'automation_roi',
    display_label: 'Automation ROI',
    plain_language_summary:
      'Net business value divided by automation operating cost for the period.',
    value_state: 'estimated',
    value: 4.3,
    unit: 'ratio',
    formula: 'net_business_value_impact / automation_operating_cost',
  }),
  buildMetric({
    metric_id: 'retention_roi_estimate',
    display_label: 'Retention ROI Estimate',
    plain_language_summary:
      'Estimated payback ratio for retention offers and contact effort.',
    value_state: 'estimated',
    value: 3.1,
    unit: 'ratio',
    formula: 'net_saved_revenue / offer_cost',
  }),
  buildMetric({
    metric_id: 'estimated_churn_prevented',
    display_label: 'Estimated Churn Prevented',
    plain_language_summary:
      'Number of subscriptions estimated to have been retained vs lost in the period.',
    value_state: 'estimated',
    value: 142,
    unit: 'count',
    formula: 'estimated_saves − baseline_churn_rate × cancellation_requests',
  }),
  buildMetric({
    metric_id: 'confirmed_churn_prevented',
    display_label: 'Confirmed Churn Prevented',
    plain_language_summary:
      'Number of saves Stay.ai officially confirmed as retained.',
    value_state: 'confirmed',
    value: 91,
    unit: 'count',
    formula: 'count(stayai_final_state = retained)',
  }),
  buildMetric({
    metric_id: 'revenue_leakage_after_save',
    display_label: 'Revenue Leakage After Save',
    plain_language_summary:
      'Revenue lost when a confirmed save is followed by another cancellation within 30 days.',
    value_state: 'blocked_by_data',
    value: null,
    unit: 'usd',
    formula: 'sum(repeat_cancel_value within 30 days of save)',
    blocked_reason_plain_language:
      'Repeat-contact join is not yet built. Engineering is tracking it.',
  }),
];

function emptyMetric(
  metric_id: string,
  display_label: string,
): SubscriptionBusinessValueMetric {
  return buildMetric({
    metric_id,
    display_label,
    value_state: 'unknown',
    value: null,
    unit: 'usd',
    plain_language_summary:
      'No subscription calls in this view yet. Try widening the date range or clearing filters.',
    formula: '',
  });
}

const EMPTY_METRICS: SubscriptionBusinessValueMetric[] = BASELINE_METRICS.map((m) =>
  emptyMetric(m.metric_id, m.display_label),
);

const PENDING_METRICS: SubscriptionBusinessValueMetric[] = BASELINE_METRICS.map((m) =>
  buildMetric({
    ...m,
    value_state: m.value_state === 'confirmed' ? 'pending' : m.value_state,
    value: m.value_state === 'confirmed' ? null : m.value,
    blocked_reason_plain_language:
      m.value_state === 'confirmed'
        ? 'Awaiting official Stay.ai confirmation for this period.'
        : m.blocked_reason_plain_language ?? null,
  }),
);

const MISSING_METRICS: SubscriptionBusinessValueMetric[] = BASELINE_METRICS.map((m) =>
  buildMetric({
    ...m,
    value_state: 'blocked_by_data',
    value: null,
    blocked_reason_plain_language:
      'Stay.ai has not sent any final outcomes for this period yet.',
    trust_label: 'untrusted',
    freshness_status: 'stale',
  }),
);

export const SUBSCRIPTION_BUSINESS_VALUE_FIXTURES: Record<
  SubscriptionBusinessValueScenario,
  SubscriptionBusinessValueResponse
> = {
  baseline: {
    module: 'subscriptions',
    generated_from_fixture: true,
    source_of_truth_system: 'stayai',
    source_confirmation_status: 'pending',
    scenario: 'baseline',
    metrics: BASELINE_METRICS,
    metadata: {
      metric_id: 'subscription_business_value_summary',
      filters: { date_range: 'last_30_days', module: 'subscriptions' },
      trust_label: 'medium',
      freshness_status: 'fresh',
      formula_version: FORMULA_VERSION,
      owner: OWNER,
      timestamp: TIMESTAMP,
      fingerprint: 'fixture-business-value-baseline',
      audit_reference: 'audit-business-value-baseline',
      blocked_metrics_count: 1,
      source_confirmation_status: 'pending',
      presentation: COMMON_PRESENTATION,
    },
  },
  pending_stayai_confirmation: {
    module: 'subscriptions',
    generated_from_fixture: true,
    source_of_truth_system: 'stayai',
    source_confirmation_status: 'pending',
    scenario: 'pending_stayai_confirmation',
    metrics: PENDING_METRICS,
    metadata: {
      metric_id: 'subscription_business_value_summary',
      filters: { date_range: 'last_30_days', module: 'subscriptions' },
      trust_label: 'low',
      freshness_status: 'fresh',
      formula_version: FORMULA_VERSION,
      owner: OWNER,
      timestamp: TIMESTAMP,
      fingerprint: 'fixture-business-value-pending',
      audit_reference: 'audit-business-value-pending',
      blocked_metrics_count: 1,
      source_confirmation_status: 'pending',
      presentation: COMMON_PRESENTATION,
    },
  },
  missing_stayai_final_state: {
    module: 'subscriptions',
    generated_from_fixture: true,
    source_of_truth_system: 'stayai',
    source_confirmation_status: 'missing',
    scenario: 'missing_stayai_final_state',
    metrics: MISSING_METRICS,
    metadata: {
      metric_id: 'subscription_business_value_summary',
      filters: { date_range: 'last_30_days', module: 'subscriptions' },
      trust_label: 'untrusted',
      freshness_status: 'stale',
      formula_version: FORMULA_VERSION,
      owner: OWNER,
      timestamp: TIMESTAMP,
      fingerprint: 'fixture-business-value-missing',
      audit_reference: 'audit-business-value-missing',
      blocked_metrics_count: BASELINE_METRICS.length,
      source_confirmation_status: 'missing',
      presentation: COMMON_PRESENTATION,
    },
  },
  empty: {
    module: 'subscriptions',
    generated_from_fixture: true,
    source_of_truth_system: 'stayai',
    source_confirmation_status: 'confirmed',
    scenario: 'empty',
    metrics: EMPTY_METRICS,
    metadata: {
      metric_id: 'subscription_business_value_summary',
      filters: { date_range: 'last_30_days', module: 'subscriptions' },
      trust_label: 'medium',
      freshness_status: 'fresh',
      formula_version: FORMULA_VERSION,
      owner: OWNER,
      timestamp: TIMESTAMP,
      fingerprint: 'fixture-business-value-empty',
      audit_reference: 'audit-business-value-empty',
      blocked_metrics_count: 0,
      source_confirmation_status: 'confirmed',
      presentation: COMMON_PRESENTATION,
    },
  },
};
