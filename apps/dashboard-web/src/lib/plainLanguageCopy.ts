/**
 * Cycle 008 — Plain-language copy library.
 *
 * Central source of truth for support-friendly labels, technical-to-plain
 * mappings, empty / error / blocked-state copy, trust + source-authority
 * explanations, and "what to do next" guidance referenced from the IA v2
 * acceptance criteria and `subscription_plain_language_copy_system.md`.
 *
 * This module is deliberately separate from the page-level
 * `components/subscription-v2/copy.ts` chip-label catalog so it can be
 * imported by reusable filter drawer / export drawer / help components
 * without pulling page-only dependencies. The chip-label catalog re-exports
 * from this module for trust + source-confirmation copy so there is a
 * single seam.
 */
import type { TrustLabel } from '../types/metrics';
import type {
  BusinessValueState,
  SubscriptionFreshnessStatus,
  SubscriptionSourceConfirmation,
} from '../types/subscriptionBusinessValue';

/* ---------------------------------------------------------------------- */
/* Trust labels (anchor: "How reliable this metric is right now.")         */
/* ---------------------------------------------------------------------- */

/** Locked first-line anchor used on every trust tooltip. */
export const TRUST_ANCHOR_SENTENCE = 'How reliable this metric is right now.';

export const TRUST_LEVEL_DETAIL: Record<TrustLabel, string> = {
  high: 'We have official confirmation from Stay.ai and the source is fresh.',
  medium:
    'We have most of the data we need. A few records are still pending or partly estimated.',
  low: 'Some of this data is missing or out of date. Treat the number as a rough guide.',
  untrusted:
    'We cannot trust this number right now. Open the data quality page for details.',
};

export const TRUST_NEXT_STEP: Record<TrustLabel, string> = {
  high: 'Numbers can be quoted directly to your manager.',
  medium: 'Quote the number, but flag that a few records are still pending.',
  low: 'Use as a rough guide only. Confirm the underlying records before quoting.',
  untrusted: 'Open data quality before quoting any of these numbers.',
};

/* ---------------------------------------------------------------------- */
/* Source-authority explanations                                          */
/* ---------------------------------------------------------------------- */

export type SubscriptionSourceRole =
  | 'stayai_final'
  | 'stayai_pending'
  | 'synthflow_journey'
  | 'shopify_context'
  | 'portal_link_sent'
  | 'portal_completion';

export const SOURCE_AUTHORITY_LABEL: Record<SubscriptionSourceRole, string> = {
  stayai_final: 'Stay.ai · official',
  stayai_pending: 'Stay.ai · pending',
  synthflow_journey: 'Synthflow · journey only',
  shopify_context: 'Shopify · context only',
  portal_link_sent: 'Portal · link sent',
  portal_completion: 'Portal · completion confirmed',
};

export const SOURCE_AUTHORITY_EXPLANATION: Record<SubscriptionSourceRole, string> = {
  stayai_final:
    'Stay.ai is the system that owns the official subscription record. Numbers tagged Stay.ai · official are confirmed.',
  stayai_pending:
    'We are waiting for Stay.ai to send the final outcome. The number may change once Stay.ai confirms.',
  synthflow_journey:
    'Synthflow events are the call-flow steps the customer went through. They do not finalize subscription outcome truth.',
  shopify_context:
    'Shopify provides order context only. It never finalizes subscription save, cancel, or pending outcomes.',
  portal_link_sent:
    'The customer received the link, but we have not confirmed they finished the action.',
  portal_completion:
    'The customer finished the portal action. This is the only state that counts as portal completion.',
};

/* ---------------------------------------------------------------------- */
/* "What to do next" copy keyed by failure / blocked / pending state       */
/* ---------------------------------------------------------------------- */

export type WhatToDoNextKey =
  | 'permission_denied'
  | 'fixture_unreachable'
  | 'fixture_malformed'
  | 'stayai_missing'
  | 'stayai_pending'
  | 'manifest_mismatch'
  | 'low_trust'
  | 'untrusted'
  | 'empty_window'
  | 'blocked_by_data'
  | 'no_rows_selected'
  | 'export_pending';

export const WHAT_TO_DO_NEXT: Record<WhatToDoNextKey, string> = {
  permission_denied: 'Ask your manager for access. Showing the last reviewed snapshot for now.',
  fixture_unreachable:
    'Live data is temporarily unavailable. Refresh in a moment or use the last reviewed snapshot.',
  fixture_malformed:
    'The live response did not match what we expect. Refresh in a few minutes; the team is alerted.',
  stayai_missing:
    'Open data quality. The numbers below cannot be trusted until Stay.ai delivery is restored.',
  stayai_pending: 'Open the follow-up queue. We are waiting on Stay.ai for the final outcomes.',
  manifest_mismatch:
    'A metric definition changed since this view was rendered. Refresh and try again.',
  low_trust:
    'Treat the number as a rough guide. Confirm in Stay.ai before sharing it externally.',
  untrusted: 'Open data quality. Do not quote this number until the source is restored.',
  empty_window: 'Try widening the date range or clearing filters.',
  blocked_by_data:
    'A required join is not yet built. The team is tracking it in the next-cycle plan.',
  no_rows_selected: 'Tick at least one row in the table, then open the export drawer again.',
  export_pending: 'Generating the export. The audit reference will appear once the manifest finishes.',
};

/* ---------------------------------------------------------------------- */
/* Empty / error / blocked-state copy                                     */
/* ---------------------------------------------------------------------- */

export type StateCopy = {
  headline: string;
  detail: string;
  cta: string;
};

export const EMPTY_STATE_COPY: StateCopy = {
  headline: 'No subscription calls in this view yet.',
  detail: 'Try widening the date range or clearing filters.',
  cta: 'Reset filters',
};

export const PERMISSION_DENIED_COPY: StateCopy = {
  headline: "We don't have permission to load live data here.",
  detail: 'Showing the last reviewed snapshot.',
  cta: 'Ask my manager for access',
};

export const STAYAI_MISSING_COPY: StateCopy = {
  headline: "We're not getting Stay.ai final results right now.",
  detail: 'The numbers below cannot be trusted until this is fixed.',
  cta: 'Open data quality',
};

export const STAYAI_PENDING_COPY: StateCopy = {
  headline: 'Stay.ai has not yet confirmed every record in this period.',
  detail: 'We are showing provisional numbers — they may change.',
  cta: 'Open follow-up queue',
};

export const FIXTURE_UNREACHABLE_COPY: StateCopy = {
  headline: 'Live data is temporarily unavailable.',
  detail: 'Showing the last reviewed snapshot.',
  cta: 'Refresh',
};

export const MANIFEST_MISMATCH_COPY: StateCopy = {
  headline: 'Export blocked: a metric definition has changed since this view was rendered.',
  detail: 'Refresh and try again.',
  cta: 'Refresh and retry',
};

/* ---------------------------------------------------------------------- */
/* Technical-to-plain mappings (engineering → support copy)                */
/* ---------------------------------------------------------------------- */

/**
 * Technical / engineering tokens that engineers naturally type and the
 * support-friendly replacements every Level 1 surface must use instead.
 *
 * Used by the banned-string scanner and by `toPlainLanguage` so support
 * users never see internal vocabulary.
 */
export const TECHNICAL_TO_PLAIN: Record<string, string> = {
  pending_stayai_match: 'Stay.ai · pending',
  confirmed_stayai_match: 'Stay.ai · official',
  missing_stayai_final_state: 'Stay.ai · not received',
  shape_mismatch: 'Live data is temporarily unavailable',
  'analytics-api unreachable': 'Live data is temporarily unavailable',
  'analytics-api': 'live data',
  contract_fixture: 'last reviewed snapshot',
  'contract fixture': 'last reviewed snapshot',
  fixture: 'last reviewed snapshot',
  starter_baseline: 'No data yet',
  'starter baseline': 'No data yet',
  module_shell: 'page surface',
  'module shell': 'page surface',
  regression_coverage: '',
  'regression coverage': '',
  ia_v2_prototype: 'subscription analytics',
  'IA v2 prototype': 'subscription analytics',
};

/**
 * Convert one engineering string into the support-user equivalent. Returns
 * the original input if no mapping exists so callers can render it
 * verbatim in Level 3 (governance) views.
 */
export function toPlainLanguage(value: string | null | undefined): string {
  if (value === null || value === undefined) return '';
  const trimmed = String(value).trim();
  if (!trimmed) return '';
  const lower = trimmed.toLowerCase();
  for (const [token, replacement] of Object.entries(TECHNICAL_TO_PLAIN)) {
    if (lower === token.toLowerCase()) return replacement;
  }
  return trimmed;
}

/* ---------------------------------------------------------------------- */
/* Banned strings scanner                                                 */
/* ---------------------------------------------------------------------- */

/**
 * Tokens banned from production-visible UI per copy guide §2.13. The scanner
 * is deliberately case-insensitive and matches whole words / phrases. Keep
 * this list in sync with the copy guide.
 *
 * NOTE: the strings here are matched as literal substrings in the visible
 * text of components, NOT in source code. So component authors can still
 * write `import fixture` — only `fixture` appearing in rendered text fails.
 */
export const BANNED_USER_FACING_STRINGS: ReadonlyArray<string> = [
  'shape mismatch',
  'analytics-api unreachable',
  'analytics-api',
  'contract fixture',
  'cycle 00',
  'wave 00',
  'regression coverage',
  'contract-wired',
  'module shell',
  'starter baseline',
  'ia v2 prototype',
  'no-drift enforced',
  'rbac',
  'metadatadisclosure',
  'governancedrawer',
  'businessvaluestate',
];

export type BannedStringHit = {
  token: string;
  matchedAt: number;
  context: string;
};

const CONTEXT_RADIUS = 24;

/**
 * Scan a string for banned vocabulary. Returns one hit per banned token
 * detected, with a short context window for debugging. The scanner is
 * case-insensitive and matches substrings (so "RBAC denied" → hit).
 */
export function scanForBannedStrings(input: string): BannedStringHit[] {
  if (!input) return [];
  const lower = input.toLowerCase();
  const hits: BannedStringHit[] = [];
  for (const token of BANNED_USER_FACING_STRINGS) {
    const idx = lower.indexOf(token);
    if (idx === -1) continue;
    const start = Math.max(0, idx - CONTEXT_RADIUS);
    const end = Math.min(input.length, idx + token.length + CONTEXT_RADIUS);
    hits.push({
      token,
      matchedAt: idx,
      context: input.slice(start, end),
    });
  }
  return hits;
}

/** Fast pass/fail variant for assertion-style use in tests. */
export function isBannedStringFree(input: string): boolean {
  return scanForBannedStrings(input).length === 0;
}

/* ---------------------------------------------------------------------- */
/* Plain-language helpers for filter / export drawers                     */
/* ---------------------------------------------------------------------- */

export const FILTER_GROUP_LABELS = {
  date_and_comparison: 'Date and comparison',
  outcome: 'Outcome',
  cancellation_and_retention: 'Cancellation and retention',
  customer_subscription: 'Customer / subscription',
  product_sku: 'Product / SKU',
  value_and_risk: 'Value and risk',
  source_and_trust: 'Source and trust',
  flow_version: 'Flow / version',
  portal_handoff: 'Portal / handoff',
  saved_views: 'Saved views',
} as const;

export type FilterGroupKey = keyof typeof FILTER_GROUP_LABELS;

export const FILTER_GROUP_ORDER: ReadonlyArray<FilterGroupKey> = [
  'date_and_comparison',
  'outcome',
  'cancellation_and_retention',
  'customer_subscription',
  'product_sku',
  'value_and_risk',
  'source_and_trust',
  'flow_version',
  'portal_handoff',
  'saved_views',
];

/**
 * Map every advanced filter `filter_id` to the IA group it belongs in.
 * Filter IDs not in the map default to `customer_subscription`.
 */
export const FILTER_ID_TO_GROUP: Record<string, FilterGroupKey> = {
  date_preset: 'date_and_comparison',
  custom_date_range: 'date_and_comparison',
  comparison_period: 'date_and_comparison',
  cancellation_reason: 'cancellation_and_retention',
  offer_type: 'cancellation_and_retention',
  offer_version: 'cancellation_and_retention',
  subscription_status: 'customer_subscription',
  product_sku: 'product_sku',
  match_confidence: 'source_and_trust',
  portal_state: 'portal_handoff',
  save_or_cancel_or_pending: 'outcome',
  escalation_state: 'outcome',
  repeat_contact: 'outcome',
  value_range: 'value_and_risk',
  trust_label: 'source_and_trust',
  synthflow_flow_version: 'flow_version',
  stayai_action_type: 'flow_version',
  stayai_offer_version: 'flow_version',
  stayai_freshness_state: 'flow_version',
  current_vs_future_flow_state: 'flow_version',
  saved_view: 'saved_views',
};

export function groupForFilterId(filterId: string): FilterGroupKey {
  return FILTER_ID_TO_GROUP[filterId] ?? 'customer_subscription';
}

/**
 * Map allowed-value enums to support-friendly labels for known filter
 * dimensions. Unknown values fall back to a humanised version of the
 * snake_case enum.
 */
export const FILTER_VALUE_LABEL: Record<string, Record<string, string>> = {
  date_preset: {
    today: 'Today',
    last_7_days: 'Last 7 days',
    last_30_days: 'Last 30 days',
    last_90_days: 'Last 90 days',
    custom: 'Custom range',
  },
  comparison_period: {
    none: 'No comparison',
    previous_period: 'Previous period',
    previous_year: 'Previous year',
  },
  cancellation_reason: {
    cost_too_high: 'Cost too high',
    dont_need_now: "Don't need it now",
    product_issue: 'Product issue',
    switching_brand: 'Switching to another brand',
    service_issue: 'Service issue',
    other: 'Other reason',
    unknown: 'Reason not captured',
  },
  trust_label: {
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    untrusted: 'Untrusted',
  },
  portal_state: {
    link_sent: 'Link sent',
    link_opened: 'Link opened',
    portal_started: 'Portal started',
    portal_completed: 'Completion confirmed',
    completion_unknown: 'Completion unknown',
  },
  repeat_contact: {
    within_1_day: 'Within 1 day',
    within_7_days: 'Within 7 days',
    within_30_days: 'Within 30 days',
  },
  current_vs_future_flow_state: {
    current: 'Current production flow',
    future: 'Planned future flow',
    compare: 'Compare current and future',
  },
  offer_type: {
    discount: 'Discount path',
    pause: 'Pause path',
    swap: 'Swap path',
    skip: 'Skip shipment',
  },
  subscription_status: {
    active: 'Active',
    paused: 'Paused',
    cancelled: 'Cancelled',
    pending_change: 'Pending change',
  },
  product_sku: {
    sku_core: 'Core SKU',
    sku_plus: 'Plus SKU',
    sku_bundle: 'Bundle SKU',
  },
  match_confidence: {
    high: 'High confidence',
    medium: 'Medium confidence',
    low: 'Low confidence',
  },
  save_or_cancel_or_pending: {
    save: 'Save outcome',
    cancel: 'Cancel outcome',
    pending: 'Still pending',
  },
  escalation_state: {
    none: 'No escalation',
    tier1: 'Tier 1',
    tier2: 'Tier 2',
    leadership: 'Leadership',
  },
  value_range: {
    under_1k: 'Under $1k',
    '1k_10k': '$1k–$10k',
    '10k_plus': '$10k+',
  },
  synthflow_flow_version: {
    v2025_04: 'April 2025 flow',
    v2025_05: 'May 2025 flow',
  },
  stayai_action_type: {
    retention_offer: 'Retention offer',
    save_winback: 'Save / win-back',
    portal_handoff: 'Portal handoff',
  },
  stayai_offer_version: {
    offer_a: 'Offer set A',
    offer_b: 'Offer set B',
  },
  stayai_freshness_state: {
    fresh: 'Fresh confirmations',
    stale: 'Stale confirmations',
    unknown: 'Unknown freshness',
  },
  saved_view: {
    default: 'Default view',
    exec_review: 'Executive review',
    follow_up_focus: 'Follow-up focus',
  },
  custom_date_range: {
    needs_calendar: 'Pick start and end (calendar next)',
  },
};

/** Humanise an enum value if no explicit translation exists. */
export function humaniseEnumValue(value: string): string {
  if (!value) return '';
  const replaced = value.replace(/[_-]+/g, ' ').trim();
  return replaced.charAt(0).toUpperCase() + replaced.slice(1);
}

export function labelForFilterValue(filterId: string, value: string): string {
  const map = FILTER_VALUE_LABEL[filterId];
  if (map && value in map) return map[value];
  return humaniseEnumValue(value);
}

/**
 * Maps engineering `data_dependency` keys from the filter catalog to short,
 * support-readable explanations shown under each filter dimension.
 */
export function plainLanguageDataDependency(key: string): string {
  const map: Record<string, string> = {
    event_timestamp: 'Accurate call timestamps in analytics',
    historical_window: 'Prior-period comparison history',
    cancellation_reason_taxonomy: 'Official Stay.ai cancellation taxonomy',
    trust_classifier: 'Trust scoring output',
    portal_event_state: 'Portal event stream',
    offer_version_join: 'Stay.ai offer-version join',
    repeat_contact_window: 'Repeat-contact calculations',
    future_flow_simulation_dataset: 'Flow simulation dataset',
    sku_catalog_join: 'Product catalog join',
    escalation_feed: 'Escalation tagging feed',
    stayai_offer_sync: 'Stay.ai offer-version sync',
    analytics_api: 'Live analytics API',
    stayai: 'Stay.ai subscription records',
    portal: 'Customer portal events',
    synthflow_journey: 'Synthflow journey events',
  };
  const normalized = key.trim();
  if (map[normalized]) return map[normalized];
  return humaniseEnumValue(normalized.replace(/_/g, ' '));
}

/* ---------------------------------------------------------------------- */
/* Export drawer copy                                                     */
/* ---------------------------------------------------------------------- */

export type ExportScopeKey =
  | 'current_page'
  | 'selected_widget'
  | 'selected_rows'
  | 'filtered_csv'
  | 'pdf_snapshot'
  | 'audit_manifest';

export const EXPORT_SCOPE_LABEL: Record<ExportScopeKey, string> = {
  current_page: 'Export current page',
  selected_widget: 'Export selected widget',
  selected_rows: 'Export table rows',
  filtered_csv: 'Export filtered CSV',
  pdf_snapshot: 'Export PDF snapshot',
  audit_manifest: 'Export audit manifest',
};

export const EXPORT_SCOPE_DESCRIPTION: Record<ExportScopeKey, string> = {
  current_page:
    'Bundle every metric on the current page with the active filters and trust labels.',
  selected_widget:
    'Export a single chart, KPI, or panel. Useful for embedding into a slide.',
  selected_rows:
    'Export only the rows you have ticked in the table. Bulk-select first, then export.',
  filtered_csv: 'Export the filtered table as a CSV with one row per record.',
  pdf_snapshot:
    'Generate a PDF snapshot of the current view, including chips and trust labels.',
  audit_manifest:
    'Export the manifest only — no data — so you can verify the export pipeline.',
};

export type ExportBlockedReasonKey =
  | 'allowed'
  | 'permission'
  | 'missing_metadata'
  | 'low_trust'
  | 'backend_not_connected'
  | 'no_rows_selected'
  | 'pending_audit_reference'
  | 'manifest_mismatch'
  | 'request_failed';

export const EXPORT_BLOCKED_REASON: Record<ExportBlockedReasonKey, string> = {
  allowed: 'Allowed',
  permission:
    "Your role doesn't allow this export. Ask your manager for access.",
  missing_metadata:
    'Some required manifest fields are missing for this view. Refresh and try again.',
  low_trust:
    'Trust is too low to export this view. Open data quality before exporting.',
  backend_not_connected:
    'The export pipeline is not connected yet. We are tracking this in the next cycle plan.',
  no_rows_selected: 'Tick at least one row in the table, then open the export drawer again.',
  pending_audit_reference:
    'Your export is pending an audit reference. We will notify you when it lands.',
  manifest_mismatch:
    'Export blocked: a metric definition has changed since this view was rendered. Refresh and try again.',
  request_failed:
    'The export could not finish. Live data or the export service was unavailable. Wait a moment and try again.',
};

export const EXPORT_MANIFEST_FIELD_LABEL = {
  filters: 'Active filters',
  metric_definitions: 'Metric definitions',
  trust_labels: 'Trust labels',
  freshness: 'How fresh',
  formula_versions: 'Formula version',
  owner: 'Owner',
  timestamp: 'Time exported',
  fingerprint: 'Manifest fingerprint',
  audit_reference: 'Audit reference',
  requester_role: 'Requester role',
  permission_decision: 'Permission decision',
  source_confirmation_status: 'Source confirmation',
  included_widgets: 'Included widgets',
  excluded_widgets: 'Excluded widgets',
} as const;

export type ExportManifestFieldKey = keyof typeof EXPORT_MANIFEST_FIELD_LABEL;

/* ---------------------------------------------------------------------- */
/* Re-export of shared chip enum helpers (so callers only need this lib)   */
/* ---------------------------------------------------------------------- */

export const FRESHNESS_LABEL: Record<SubscriptionFreshnessStatus, string> = {
  fresh: 'On time',
  stale: 'Too old to trust',
  unknown: 'Status unknown',
};

export const FRESHNESS_DETAIL: Record<SubscriptionFreshnessStatus, string> = {
  fresh: 'Data refreshed within the expected window.',
  stale: 'Data is older than our trust threshold. Open data quality.',
  unknown: "We don't have a freshness reading yet. Check data quality.",
};

/**
 * Extended freshness states from the IA copy guide that the backend
 * contract has not (yet) modeled. The pure `SubscriptionFreshnessStatus`
 * enum is `fresh | stale | unknown`; the copy guide additionally describes
 * `warning` and `degraded` mid-states. Until the backend grows those
 * enums, expose the full plain-language map under a separate type so the
 * filter / export drawers can preview every documented state without
 * widening the contract type.
 */
export type ExtendedFreshnessStatus = SubscriptionFreshnessStatus | 'warning' | 'degraded';

export const EXTENDED_FRESHNESS_LABEL: Record<ExtendedFreshnessStatus, string> = {
  fresh: 'On time',
  warning: 'Slightly delayed',
  degraded: 'Behind schedule',
  stale: 'Too old to trust',
  unknown: 'Status unknown',
};

export const EXTENDED_FRESHNESS_DETAIL: Record<ExtendedFreshnessStatus, string> = {
  fresh: 'Data refreshed within the expected window.',
  warning: 'Refresh is a little behind schedule, but the data is still usable.',
  degraded: 'Refresh is meaningfully behind. Treat new numbers cautiously.',
  stale: 'Data is older than our trust threshold. Open data quality.',
  unknown: "We don't have a freshness reading yet. Check data quality.",
};

export const SOURCE_CONFIRMATION_DETAIL: Record<SubscriptionSourceConfirmation, string> = {
  confirmed: 'Stay.ai has confirmed this period · all official outcomes are in.',
  pending: 'Stay.ai has not yet confirmed every record in this period.',
  missing: 'Stay.ai has not sent any final outcomes for this period yet.',
};

export const BUSINESS_VALUE_NEXT_STEP: Record<BusinessValueState, string> = {
  confirmed: 'Quote in board reporting.',
  estimated: 'Use for trends only.',
  pending: 'Wait for Stay.ai. Open the follow-up queue if you need to act today.',
  unknown: 'Open data quality.',
  blocked_by_data: 'Tracked in the next-cycle plan; cannot publish yet.',
};
