import type { TrustLabel } from './metrics';
import type {
  SubscriptionBusinessValuePresentation,
  SubscriptionFreshnessStatus,
  SubscriptionSourceConfirmation,
} from './subscriptionBusinessValue';

export type SubscriptionFollowUpScenario =
  | 'baseline'
  | 'pending_stayai_confirmation'
  | 'missing_stayai_final_state'
  | 'empty';

export type SubscriptionFollowUpRecord = {
  customer_or_case_id: string;
  recommended_action: string;
  reason: string;
  priority: string;
  status: string;
  source_system: string;
  blocking_data_gap?: string | null;
  stayai_confirmation_status: SubscriptionSourceConfirmation;
  portal_completion_status: string;
  estimated_value_at_risk?: number | null;
  last_event_at: string;
  owner_queue: string;
  sla_status: string;
  audit_reference: string;
  support_label: string;
  support_summary: string;
  why_it_matters: string;
  what_to_do_next: string;
  blocked_reason_plain_language?: string | null;
};

export type SubscriptionFollowUpMetadata = {
  metric_id: string;
  filters: Record<string, unknown>;
  metric_definitions: string[];
  trust_label: TrustLabel;
  freshness_status: SubscriptionFreshnessStatus;
  formula_version: string;
  owner: string;
  timestamp: string;
  fingerprint: string;
  audit_reference: string;
  source_confirmation_status: SubscriptionSourceConfirmation;
  presentation: SubscriptionBusinessValuePresentation;
};

export type SubscriptionFollowUpResponse = {
  module: 'subscriptions';
  generated_from_fixture: boolean;
  scenario: string;
  records: SubscriptionFollowUpRecord[];
  metadata: SubscriptionFollowUpMetadata;
};

export type SubscriptionFollowUpApiState = {
  data: SubscriptionFollowUpResponse;
  loading: boolean;
  error: string | null;
  source: 'api' | 'fixture';
  permissionDenied: boolean;
  scenario: SubscriptionFollowUpScenario;
};
