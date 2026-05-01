import { apiGet, apiPost } from './apiClient';
import type { DashboardModule, DashboardSummary, MetricDefinition, MetricSeriesPoint } from '../types/metrics';
import type {
  SubscriptionAnalyticsResponse,
  SubscriptionAnalyticsScenario,
} from '../types/subscriptionAnalytics';

export type ExportAuditRequest = {
  requested_by: string;
  module: DashboardModule;
  metric_keys: string[];
  include_definitions: boolean;
  include_trust_labels: boolean;
  include_freshness: boolean;
  include_formula_versions: boolean;
  reason?: string;
};

export type ExportAuditRecord = {
  export_id: string;
  requested_by: string;
  module: string;
  created_at: string;
  metric_keys: string[];
  definitions_included: boolean;
  trust_labels_included: boolean;
  freshness_included: boolean;
  formula_versions_included: boolean;
  owner: string;
  fingerprint: string;
  audit_reference: string;
  trust_label: string;
};

export const buildModuleSummaryUrl = (module: DashboardModule) => `/metrics/modules/${module}/summary`;
export const buildSubscriptionAnalyticsUrl = (scenario: SubscriptionAnalyticsScenario = 'baseline') =>
  `/subscriptions/analytics?scenario=${encodeURIComponent(scenario)}`;
export const getDashboardModules = () => apiGet<DashboardModule[]>('/metrics/modules');
export const getDashboardSummary = (module: DashboardModule) => apiGet<DashboardSummary>(buildModuleSummaryUrl(module));
export const getMetricDefinitions = () => apiGet<MetricDefinition[]>('/metrics/definitions');
export const getMetricSeries = (metricKey: string) => apiGet<MetricSeriesPoint[]>(`/metrics/${metricKey}/series`);
export const getNoDriftRules = () => apiGet<{ rules: string[] }>('/governance/no-drift-rules');
export const createExportAudit = (request: ExportAuditRequest) => apiPost<ExportAuditRecord, ExportAuditRequest>('/exports/audit', request);
export const getSubscriptionAnalytics = (scenario: SubscriptionAnalyticsScenario = 'baseline') =>
  apiGet<SubscriptionAnalyticsResponse>(buildSubscriptionAnalyticsUrl(scenario));
