import type { TrustLabel } from './metrics';

export type SourceHealthSystem = 'stay_ai' | 'synthflow' | 'shopify' | 'portal';

export type SourceAuthorityLevel =
  | 'authoritative_final_state'
  | 'journey_event_authoritative'
  | 'context_only'
  | 'completion_signal';

export type FreshnessStatus = 'fresh' | 'stale' | 'unknown';

export type DataQualityStatus = 'passing' | 'warning' | 'failing';

export type SourceConfirmationLevel = 'confirmed' | 'pending' | 'missing';

export type OverallSourceHealth = 'healthy' | 'warning' | 'degraded' | 'unknown';

export type ConflictStatus = 'none' | 'pending' | 'conflict_detected' | 'unknown';

export type SourceHealthEntry = {
  source_system: SourceHealthSystem;
  source_authority_level: SourceAuthorityLevel;
  record_count: number;
  last_seen_at: string;
  freshness_status: FreshnessStatus;
  freshness_minutes: number;
  source_confirmation_status: SourceConfirmationLevel;
  data_quality_status: DataQualityStatus;
  conflict_count: number;
  missing_required_fields: string[];
  lineage_reference: string;
  owner: string;
  formula_version: string;
  audit_reference: string;
  trust_label: TrustLabel;
};

export type SourceHealthMetadata = {
  timestamp: string;
  fingerprint: string;
  formula_version: string;
  owner: string;
  audit_reference: string;
};

export type SubscriptionSourceHealthResponse = {
  module: 'subscriptions';
  generated_from_fixture: boolean;
  overall_source_health: OverallSourceHealth;
  conflict_status: ConflictStatus;
  pending_or_unknown_final_outcome: boolean;
  missing_stay_ai_final_state_warning: string | null;
  portal_completion_warning: string | null;
  shopify_context_warning: string;
  sources: SourceHealthEntry[];
  metadata: SourceHealthMetadata;
};

export type SourceHealthScenario =
  | 'baseline'
  | 'missing_stayai_final_state'
  | 'failing_quality_with_missing_stayai'
  | 'conflicting_sources';

export type SourceHealthApiState = {
  data: SubscriptionSourceHealthResponse;
  loading: boolean;
  error: string | null;
  source: 'api' | 'fixture';
  permissionDenied: boolean;
  scenario: SourceHealthScenario;
};
