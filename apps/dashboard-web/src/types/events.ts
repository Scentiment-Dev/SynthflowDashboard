export type PlatformSource = 'synthflow' | 'stayai' | 'shopify' | 'portal' | 'live_agent' | 'warehouse' | 'analytics_api';

export type NormalizedEvent = {
  event_id: string;
  source: PlatformSource;
  event_type: string;
  occurred_at: string;
  customer_id?: string;
  call_id?: string;
  subscription_id?: string;
  order_id?: string;
  payload: Record<string, unknown>;
  normalized?: boolean;
  source_reference_id?: string | null;
};

export type EventTableRow = {
  id: string;
  occurred_at: string;
  source: PlatformSource;
  event_type: string;
  outcome: string;
  trust_label: 'high' | 'medium' | 'low' | 'untrusted';
};
