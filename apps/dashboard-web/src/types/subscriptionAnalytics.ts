import type { TrustLabel } from './metrics';

export type SubscriptionTruthState =
  | 'active'
  | 'retained'
  | 'saved'
  | 'cancelled'
  | 'pending'
  | 'unknown';

export type SourceConfirmationStatus = 'confirmed' | 'pending' | 'missing';

export type SourceSystem =
  | 'stayai'
  | 'synthflow'
  | 'portal'
  | 'shopify'
  | 'warehouse'
  | 'analytics_api';

export type SubscriptionOverviewMetrics = {
  subscription_overview_count: number;
  cancellation_requests_count: number;
  confirmed_cancellations_count: number;
  save_retention_attempts_count: number;
  confirmed_retained_subscriptions_count: number;
  pending_stayai_confirmation_count: number;
};

export type PortalJourneyMetrics = {
  portal_link_sent_count: number;
  confirmed_portal_completion_count: number;
};

export type ShopifyContextMetrics = {
  context_records_available_count: number;
  context_role: 'context_only';
  finalization_allowed: false;
};

export type SynthflowJourneyMetrics = {
  journey_event_count: number;
  status_breakdown: Record<string, number>;
};

export type SourceConfirmationMetrics = {
  source_of_truth_system: 'stayai';
  source_confirmation_status: SourceConfirmationStatus;
  confirmed_records_count: number;
  pending_records_count: number;
  missing_records_count: number;
};

export type SubscriptionAnalyticsMetricMetadata = {
  metric_id: string;
  metric_definitions: string[];
  filters: Record<string, unknown>;
  formula_version: string;
  freshness: string;
  trust_label: TrustLabel;
  owner: string;
  timestamp: string;
  fingerprint: string;
  audit_reference: string;
  source_system: SourceSystem;
  source_confirmation_status: SourceConfirmationStatus;
};

export type SubscriptionAnalyticsResponse = {
  module: 'subscriptions';
  generated_from_fixture: boolean;
  final_subscription_state: SubscriptionTruthState;
  source_of_truth_system: 'stayai';
  source_confirmation_status: SourceConfirmationStatus;
  subscription_overview: SubscriptionOverviewMetrics;
  portal_journey: PortalJourneyMetrics;
  shopify_context: ShopifyContextMetrics;
  synthflow_journey: SynthflowJourneyMetrics;
  source_confirmation: SourceConfirmationMetrics;
  metric_metadata: SubscriptionAnalyticsMetricMetadata;
};

export type SubscriptionAnalyticsScenario = 'baseline' | 'missing_stayai_confirmation';

export type SubscriptionAnalyticsApiState = {
  data: SubscriptionAnalyticsResponse;
  loading: boolean;
  error: string | null;
  source: 'api' | 'fixture';
  permissionDenied: boolean;
  scenario: SubscriptionAnalyticsScenario;
};
