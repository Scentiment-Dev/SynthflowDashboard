import type { TrustLabel } from './metrics';
import type {
  SubscriptionBusinessValuePresentation,
  SubscriptionFreshnessStatus,
  SubscriptionSourceConfirmation,
} from './subscriptionBusinessValue';

export type SubscriptionFilterOption = {
  filter_id: string;
  label: string;
  plain_language_help: string;
  allowed_values: string[];
  is_enabled: boolean;
  is_disabled_reason?: string | null;
  data_dependency: string;
  source_system: string;
  trust_impact: string;
  applies_to_pages: string[];
};

export type SubscriptionAdvancedFilterMetadata = {
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

export type SubscriptionAdvancedFilterResponse = {
  module: 'subscriptions';
  generated_from_fixture: boolean;
  scenario: string;
  options: SubscriptionFilterOption[];
  applied_filters: Record<string, unknown>;
  metadata: SubscriptionAdvancedFilterMetadata;
};

export type SubscriptionAdvancedFilterApiState = {
  data: SubscriptionAdvancedFilterResponse;
  loading: boolean;
  error: string | null;
  source: 'api' | 'fixture';
  permissionDenied: boolean;
};
