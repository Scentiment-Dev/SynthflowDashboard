import type {
  SubscriptionAnalyticsResponse,
  SubscriptionAnalyticsScenario,
} from '../types/subscriptionAnalytics';

export const SUBSCRIPTION_ANALYTICS_FIXTURES: Record<
  SubscriptionAnalyticsScenario,
  SubscriptionAnalyticsResponse
> = {
  baseline: {
    module: 'subscriptions',
    generated_from_fixture: true,
    final_subscription_state: 'retained',
    source_of_truth_system: 'stayai',
    source_confirmation_status: 'confirmed',
    subscription_overview: {
      subscription_overview_count: 120,
      cancellation_requests_count: 34,
      confirmed_cancellations_count: 11,
      save_retention_attempts_count: 23,
      confirmed_retained_subscriptions_count: 18,
      pending_stayai_confirmation_count: 5,
    },
    portal_journey: {
      portal_link_sent_count: 16,
      confirmed_portal_completion_count: 10,
    },
    shopify_context: {
      context_records_available_count: 116,
      context_role: 'context_only',
      finalization_allowed: false,
    },
    synthflow_journey: {
      journey_event_count: 148,
      status_breakdown: {
        completed: 92,
        unresolved: 18,
        transferred: 21,
        abandoned: 17,
      },
    },
    source_confirmation: {
      source_of_truth_system: 'stayai',
      source_confirmation_status: 'confirmed',
      confirmed_records_count: 115,
      pending_records_count: 5,
      missing_records_count: 0,
    },
    metric_metadata: {
      metric_id: 'subscription_analytics_overview',
      metric_definitions: [
        'subscription_action_completion_rate',
        'confirmed_cancellation_rate',
        'subscription_save_rate',
        'portal_completion_rate',
      ],
      filters: {
        date_range: 'last_7_days',
        platforms: ['stayai', 'synthflow', 'shopify'],
      },
      formula_version: 'v0.4.0',
      freshness: 'fresh',
      trust_label: 'medium',
      owner: 'analytics',
      timestamp: '2026-05-01T00:00:00Z',
      fingerprint: 'fixture-baseline-fingerprint-pending-api',
      audit_reference: 'audit-subscriptions-baseline-fixture-preview',
      source_system: 'analytics_api',
      source_confirmation_status: 'confirmed',
    },
  },
  missing_stayai_confirmation: {
    module: 'subscriptions',
    generated_from_fixture: true,
    final_subscription_state: 'unknown',
    source_of_truth_system: 'stayai',
    source_confirmation_status: 'missing',
    subscription_overview: {
      subscription_overview_count: 120,
      cancellation_requests_count: 34,
      confirmed_cancellations_count: 0,
      save_retention_attempts_count: 23,
      confirmed_retained_subscriptions_count: 0,
      pending_stayai_confirmation_count: 34,
    },
    portal_journey: {
      portal_link_sent_count: 16,
      confirmed_portal_completion_count: 0,
    },
    shopify_context: {
      context_records_available_count: 116,
      context_role: 'context_only',
      finalization_allowed: false,
    },
    synthflow_journey: {
      journey_event_count: 148,
      status_breakdown: {
        completed: 0,
        unresolved: 63,
        transferred: 47,
        abandoned: 38,
      },
    },
    source_confirmation: {
      source_of_truth_system: 'stayai',
      source_confirmation_status: 'missing',
      confirmed_records_count: 0,
      pending_records_count: 34,
      missing_records_count: 86,
    },
    metric_metadata: {
      metric_id: 'subscription_analytics_overview',
      metric_definitions: [
        'subscription_action_completion_rate',
        'confirmed_cancellation_rate',
        'subscription_save_rate',
        'portal_completion_rate',
      ],
      filters: {
        date_range: 'last_7_days',
        platforms: ['synthflow', 'shopify'],
      },
      formula_version: 'v0.4.0',
      freshness: 'stale',
      trust_label: 'low',
      owner: 'analytics',
      timestamp: '2026-05-01T00:00:00Z',
      fingerprint: 'fixture-missing-fingerprint-pending-api',
      audit_reference: 'audit-subscriptions-missing-fixture-preview',
      source_system: 'analytics_api',
      source_confirmation_status: 'missing',
    },
  },
};
