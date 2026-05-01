export type TrustLabel = 'high' | 'medium' | 'low' | 'untrusted';

export type DashboardModule =
  | 'overview'
  | 'subscriptions'
  | 'cancellations'
  | 'retention'
  | 'order_status'
  | 'escalations'
  | 'data_quality'
  | 'governance';

export type FreshnessMetadata = {
  source: string;
  last_synced_at?: string | null;
  warning_after_minutes?: number;
  hard_fail_after_minutes?: number;
  status?: string;
};

export type AuditMetadata = {
  owner: string;
  formula_version: string;
  generated_at: string;
  audit_reference?: string | null;
};

export type MetricCardData = {
  key: string;
  label: string;
  value: string | number;
  delta?: string | null;
  trust_label: TrustLabel;
  description: string;
  source_of_truth: string;
  freshness?: FreshnessMetadata | null;
};

export type MetricDefinition = {
  metric_key: string;
  display_name: string;
  module: DashboardModule;
  formula: string;
  source_of_truth: string;
  trust_rule: string;
  owner?: string;
  formula_version?: string;
  launch_scope?: string;
  description?: string;
};

export type MetricSeriesPoint = {
  period: string;
  value: number;
  numerator?: number | null;
  denominator?: number | null;
  trust_label: TrustLabel;
};

export type DashboardSummary = {
  module: DashboardModule;
  cards: MetricCardData[];
  definitions: MetricDefinition[];
  recent_events: Record<string, unknown>[];
  audit?: AuditMetadata;
};

export type FunnelStep = {
  id: string;
  label: string;
  count: number;
  rate: number;
  source_of_truth: string;
  trust_label: TrustLabel;
  rule?: string;
};

export type JourneyNode = {
  id: string;
  label: string;
  description: string;
  status: 'success' | 'warning' | 'failure' | 'neutral';
  source: string;
  lockedRule?: string;
};

export type ModuleFixture = {
  module: DashboardModule;
  title: string;
  eyebrow: string;
  description: string;
  sourcePriority: string[];
  lockedRules: string[];
  summary: DashboardSummary;
  trend: MetricSeriesPoint[];
  funnel: FunnelStep[];
  journey: JourneyNode[];
};
