import type { TrustLabel } from './metrics';

export type SubscriptionOutcomeFreshnessStatus = 'fresh' | 'stale' | 'unknown';

export type SubscriptionOutcomeSourceConfirmation = 'confirmed' | 'pending' | 'missing';

export type SubscriptionOutcomesScenario =
  | 'baseline'
  | 'pending_stayai_confirmation'
  | 'missing_stayai_final_state'
  | 'empty';

export type SubscriptionOutcomeMetrics = {
  subscription_contacts_total: number;
  subscription_action_requests_total: number;
  cancellation_requests_total: number;
  confirmed_cancellations_total: number;
  save_or_retention_attempts_total: number;
  confirmed_retained_total: number;
  non_cancellation_actions_total: number;
  pending_stayai_confirmation_total: number;
  missing_stayai_final_state_total: number;
  portal_link_sent_total: number;
  portal_completion_confirmed_total: number;
  shopify_context_available_total: number;
  synthflow_subscription_journeys_total: number;
  subscription_outcome_unknown_total: number;
  retention_rate: number;
  cancellation_confirmation_rate: number;
  portal_completion_rate: number;
};

export type SubscriptionOutcomeMetadata = {
  metric_id: string;
  filters: Record<string, unknown>;
  metric_definitions: string[];
  trust_label: TrustLabel;
  freshness_status: SubscriptionOutcomeFreshnessStatus;
  formula_version: string;
  owner: string;
  timestamp: string;
  fingerprint: string;
  audit_reference: string;
  source_confirmation_status: SubscriptionOutcomeSourceConfirmation;
};

export type SubscriptionOutcomesResponse = {
  module: 'subscriptions';
  generated_from_fixture: boolean;
  source_of_truth_system: 'stayai';
  source_confirmation_status: SubscriptionOutcomeSourceConfirmation;
  scenario: string;
  metrics: SubscriptionOutcomeMetrics;
  metadata: SubscriptionOutcomeMetadata;
};

export type SubscriptionOutcomesApiState = {
  data: SubscriptionOutcomesResponse;
  loading: boolean;
  error: string | null;
  source: 'api' | 'fixture';
  permissionDenied: boolean;
  scenario: SubscriptionOutcomesScenario;
};
