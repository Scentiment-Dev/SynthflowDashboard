import { apiGet, apiPost } from './apiClient';
import type { DashboardModule, DashboardSummary, MetricDefinition, MetricSeriesPoint } from '../types/metrics';
import type {
  SubscriptionAnalyticsResponse,
  SubscriptionAnalyticsScenario,
} from '../types/subscriptionAnalytics';
import type {
  SubscriptionOutcomesResponse,
  SubscriptionOutcomesScenario,
} from '../types/subscriptionOutcomes';
import type {
  SourceHealthScenario,
  SourceHealthSystem,
  SubscriptionSourceHealthResponse,
} from '../types/sourceHealth';
import type {
  SubscriptionBusinessValueResponse,
  SubscriptionBusinessValueScenario,
} from '../types/subscriptionBusinessValue';
import type {
  SubscriptionFollowUpResponse,
  SubscriptionFollowUpScenario,
} from '../types/subscriptionFollowUp';
import type { SubscriptionAdvancedFilterResponse } from '../types/subscriptionFilters';

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

export const buildSubscriptionOutcomesUrl = (
  scenario: SubscriptionOutcomesScenario = 'baseline',
) => `/subscriptions/outcomes?scenario=${encodeURIComponent(scenario)}`;

export const getSubscriptionOutcomes = (
  scenario: SubscriptionOutcomesScenario = 'baseline',
) => apiGet<SubscriptionOutcomesResponse>(buildSubscriptionOutcomesUrl(scenario));

export const buildSubscriptionSourceHealthUrl = (
  scenario: SourceHealthScenario = 'baseline',
  sources?: SourceHealthSystem[],
) => {
  const params = new URLSearchParams({ scenario });
  if (sources && sources.length > 0) {
    sources.forEach((source) => params.append('sources', source));
  }
  return `/subscriptions/source-health?${params.toString()}`;
};

export const getSubscriptionSourceHealth = (
  scenario: SourceHealthScenario = 'baseline',
  sources?: SourceHealthSystem[],
) =>
  apiGet<SubscriptionSourceHealthResponse>(buildSubscriptionSourceHealthUrl(scenario, sources));

export const buildSubscriptionBusinessValueUrl = (
  scenario: SubscriptionBusinessValueScenario = 'baseline',
) => `/subscriptions/business-value?scenario=${encodeURIComponent(scenario)}`;

export const getSubscriptionBusinessValue = (
  scenario: SubscriptionBusinessValueScenario = 'baseline',
) => apiGet<SubscriptionBusinessValueResponse>(buildSubscriptionBusinessValueUrl(scenario));

export const buildSubscriptionFollowUpUrl = (
  scenario: SubscriptionFollowUpScenario = 'baseline',
) => `/subscriptions/follow-up?scenario=${encodeURIComponent(scenario)}`;

export const getSubscriptionFollowUp = (
  scenario: SubscriptionFollowUpScenario = 'baseline',
) => apiGet<SubscriptionFollowUpResponse>(buildSubscriptionFollowUpUrl(scenario));

export const buildSubscriptionAdvancedFiltersUrl = (scenario = 'baseline') =>
  `/subscriptions/advanced-filters?scenario=${encodeURIComponent(scenario)}`;

export const getSubscriptionAdvancedFilters = (scenario = 'baseline') =>
  apiGet<SubscriptionAdvancedFilterResponse>(buildSubscriptionAdvancedFiltersUrl(scenario));
