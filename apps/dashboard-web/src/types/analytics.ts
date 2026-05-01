import type { DashboardModule, DashboardSummary, ModuleFixture } from './metrics';

export type { DashboardModule, DashboardSummary, ModuleFixture };

export type DashboardFilters = {
  dateRange: '7d' | '30d' | '90d';
  platform: 'all' | 'synthflow' | 'stayai' | 'shopify' | 'portal' | 'live_agent';
  segment: 'all' | 'subscriptions' | 'cancellations' | 'order_status' | 'escalations';
};

export type ApiState<T> = {
  data: T;
  loading: boolean;
  error: string | null;
  source: 'api' | 'fixture';
};
