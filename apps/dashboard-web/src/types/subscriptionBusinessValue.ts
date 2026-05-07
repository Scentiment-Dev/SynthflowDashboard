import type { TrustLabel } from './metrics';

export type BusinessValueState =
  | 'confirmed'
  | 'estimated'
  | 'pending'
  | 'unknown'
  | 'blocked_by_data';

export type SubscriptionBusinessValueScenario =
  | 'baseline'
  | 'pending_stayai_confirmation'
  | 'missing_stayai_final_state'
  | 'empty';

export type SubscriptionFreshnessStatus = 'fresh' | 'stale' | 'unknown';

export type SubscriptionSourceConfirmation = 'confirmed' | 'pending' | 'missing';

export type SubscriptionBusinessValueMetric = {
  metric_id: string;
  display_label: string;
  plain_language_summary: string;
  value_state: BusinessValueState;
  format: string;
  formula_version: string;
  source_confirmation_status: SubscriptionSourceConfirmation;
  trust_label: TrustLabel;
  freshness_status: SubscriptionFreshnessStatus;
  owner: string;
  timestamp: string;
  fingerprint: string;
  audit_reference: string;
  missing_data_reason?: string | null;
  next_action_hint: string;
  support_label: string;
  support_summary: string;
  why_it_matters: string;
  what_to_do_next: string;
  blocked_reason_plain_language?: string | null;
  metric_key: string;
  display_name: string;
  value: number | null;
  unit: string;
  state: BusinessValueState;
  formula: string;
  source_of_truth: string;
  data_dependencies?: string[];
  notes?: string | null;
};

export type SubscriptionBusinessValuePresentation = {
  display_label: string;
  short_label: string;
  executive_summary: string;
  format_type: string;
  unit: string;
  trend_direction: string;
  comparison_label: string;
  comparison_value: number | null;
  severity: string;
  visual_tone: string;
  source_authority_explanation: string;
  trust_explanation: string;
  freshness_explanation: string;
  drilldown_hint: string;
  empty_state_copy: string;
  blocked_state_copy: string;
};

export type SubscriptionBusinessValueMetadata = {
  metric_id: string;
  filters: Record<string, unknown>;
  trust_label: TrustLabel;
  freshness_status: SubscriptionFreshnessStatus;
  formula_version: string;
  owner: string;
  timestamp: string;
  fingerprint: string;
  audit_reference: string;
  blocked_metrics_count: number;
  source_confirmation_status: SubscriptionSourceConfirmation;
  presentation: SubscriptionBusinessValuePresentation;
};

export type SubscriptionBusinessValueResponse = {
  module: 'subscriptions';
  generated_from_fixture: boolean;
  source_of_truth_system: 'stayai';
  source_confirmation_status: SubscriptionSourceConfirmation;
  scenario: string;
  metrics: SubscriptionBusinessValueMetric[];
  metadata: SubscriptionBusinessValueMetadata;
};

export type SubscriptionBusinessValueApiState = {
  data: SubscriptionBusinessValueResponse;
  loading: boolean;
  error: string | null;
  source: 'api' | 'fixture';
  permissionDenied: boolean;
  scenario: SubscriptionBusinessValueScenario;
};
