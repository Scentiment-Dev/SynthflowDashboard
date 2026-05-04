import type {
  SubscriptionOutcomeMetadata,
  SubscriptionOutcomeMetrics,
  SubscriptionOutcomesResponse,
} from '../types/subscriptionOutcomes';
import type { TrustLabel } from '../types/metrics';

export type OutcomeAlertLevel = 'info' | 'warning' | 'danger';

export type SubscriptionOutcomeAlert = {
  id: string;
  level: OutcomeAlertLevel;
  title: string;
  detail: string;
};

export type FunnelStageTone = 'primary' | 'cancellation' | 'retention' | 'context' | 'unknown';

export type SubscriptionOutcomeFunnelStage = {
  id: string;
  label: string;
  count: number;
  share: number;
  tone: FunnelStageTone;
  authority: string;
  rule: string;
  isFinalAuthority: boolean;
};

export type SubscriptionOutcomeKpiId =
  | 'subscription_contacts_total'
  | 'subscription_action_requests_total'
  | 'cancellation_requests_total'
  | 'confirmed_cancellations_total'
  | 'save_or_retention_attempts_total'
  | 'confirmed_retained_total'
  | 'non_cancellation_actions_total'
  | 'pending_stayai_confirmation_total'
  | 'missing_stayai_final_state_total'
  | 'portal_link_sent_total'
  | 'portal_completion_confirmed_total'
  | 'shopify_context_available_total'
  | 'synthflow_subscription_journeys_total'
  | 'subscription_outcome_unknown_total';

export type SubscriptionOutcomeKpiCard = {
  id: SubscriptionOutcomeKpiId;
  label: string;
  helper: string;
  authority: string;
  tone: FunnelStageTone | 'pending' | 'missing';
  isFinalAuthority: boolean;
  value: number;
};

export type SubscriptionOutcomeRateId =
  | 'retention_rate'
  | 'cancellation_confirmation_rate'
  | 'portal_completion_rate';

export type SubscriptionOutcomeRateCard = {
  id: SubscriptionOutcomeRateId;
  label: string;
  helper: string;
  authority: string;
  numeratorKey: SubscriptionOutcomeKpiId;
  denominatorKey: SubscriptionOutcomeKpiId;
  rate: number;
  numerator: number;
  denominator: number;
  formula: string;
  isFinalAuthority: boolean;
};

const STALE_FRESHNESS = new Set(['stale', 'expired', 'overdue']);
const PENDING_FRESHNESS = new Set(['pending', 'lagging', 'unknown']);

export function clampRatio(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

export function formatRatePercent(value: number): string {
  const safe = clampRatio(value) * 100;
  const rounded = Math.round(safe);
  const isWhole = Math.abs(safe - rounded) < 1e-9;
  return `${safe.toFixed(isWhole ? 0 : 1)}%`;
}

export function formatCount(value: number): string {
  if (!Number.isFinite(value)) return '0';
  return Math.round(value).toLocaleString();
}

export function safeRatio(numerator: number, denominator: number): {
  rate: number;
  display: string;
} {
  if (denominator <= 0) {
    return { rate: 0, display: 'n/a' };
  }
  const rate = clampRatio(numerator / denominator);
  return { rate, display: formatRatePercent(rate) };
}

export function trustToneClasses(trust: TrustLabel): string {
  switch (trust) {
    case 'high':
      return 'border-emerald-200 bg-emerald-50 text-emerald-900';
    case 'medium':
      return 'border-sky-200 bg-sky-50 text-sky-900';
    case 'low':
      return 'border-amber-200 bg-amber-50 text-amber-900';
    case 'untrusted':
    default:
      return 'border-rose-200 bg-rose-50 text-rose-900';
  }
}

export function freshnessToneClasses(freshness: string): string {
  const value = freshness.toLowerCase();
  if (STALE_FRESHNESS.has(value)) return 'border-rose-200 bg-rose-50 text-rose-900';
  if (PENDING_FRESHNESS.has(value)) return 'border-amber-200 bg-amber-50 text-amber-900';
  return 'border-emerald-200 bg-emerald-50 text-emerald-900';
}

export function sourceConfirmationToneClasses(status: string): string {
  switch (status) {
    case 'confirmed':
      return 'border-emerald-200 bg-emerald-50 text-emerald-900';
    case 'pending':
      return 'border-amber-200 bg-amber-50 text-amber-900';
    case 'missing':
    default:
      return 'border-rose-200 bg-rose-50 text-rose-900';
  }
}

export function funnelStageToneClasses(tone: FunnelStageTone): string {
  switch (tone) {
    case 'primary':
      return 'border-slate-300 bg-slate-100 text-slate-900';
    case 'cancellation':
      return 'border-rose-200 bg-rose-50 text-rose-900';
    case 'retention':
      return 'border-emerald-200 bg-emerald-50 text-emerald-900';
    case 'context':
      return 'border-sky-200 bg-sky-50 text-sky-900';
    case 'unknown':
    default:
      return 'border-amber-200 bg-amber-50 text-amber-900';
  }
}

export function funnelStageBarClasses(tone: FunnelStageTone): string {
  switch (tone) {
    case 'primary':
      return 'bg-slate-700';
    case 'cancellation':
      return 'bg-rose-500';
    case 'retention':
      return 'bg-emerald-500';
    case 'context':
      return 'bg-sky-500';
    case 'unknown':
    default:
      return 'bg-amber-500';
  }
}

export const SUBSCRIPTION_OUTCOME_KPI_CARDS: ReadonlyArray<
  Omit<SubscriptionOutcomeKpiCard, 'value'>
> = [
  {
    id: 'subscription_contacts_total',
    label: 'Subscription contacts',
    helper: 'Total subscription-related contacts in scope (Stay.ai-controlled).',
    authority: 'Stay.ai',
    tone: 'primary',
    isFinalAuthority: true,
  },
  {
    id: 'subscription_action_requests_total',
    label: 'Subscription action requests',
    helper: 'Customer-initiated subscription actions; requests, not outcomes.',
    authority: 'Stay.ai + Synthflow',
    tone: 'primary',
    isFinalAuthority: false,
  },
  {
    id: 'cancellation_requests_total',
    label: 'Cancellation requests',
    helper: 'Cancellation attempts logged (request only — not yet confirmed).',
    authority: 'Stay.ai + Synthflow',
    tone: 'cancellation',
    isFinalAuthority: false,
  },
  {
    id: 'confirmed_cancellations_total',
    label: 'Confirmed cancellations',
    helper: 'Stay.ai-confirmed cancelled state. Approved official path only.',
    authority: 'Stay.ai',
    tone: 'cancellation',
    isFinalAuthority: true,
  },
  {
    id: 'save_or_retention_attempts_total',
    label: 'Save / retention attempts',
    helper: 'Retention offer exposure logged in Stay.ai/Synthflow.',
    authority: 'Stay.ai + Synthflow',
    tone: 'retention',
    isFinalAuthority: false,
  },
  {
    id: 'confirmed_retained_total',
    label: 'Confirmed retained',
    helper: 'Save outcome counted only after Stay.ai confirms retained subscription.',
    authority: 'Stay.ai',
    tone: 'retention',
    isFinalAuthority: true,
  },
  {
    id: 'non_cancellation_actions_total',
    label: 'Non-cancellation actions',
    helper: 'Subscription actions other than cancellation (skip, swap, address change).',
    authority: 'Stay.ai',
    tone: 'primary',
    isFinalAuthority: true,
  },
  {
    id: 'pending_stayai_confirmation_total',
    label: 'Pending Stay.ai confirmation',
    helper: 'Awaiting Stay.ai final state. Not counted as success or cancellation.',
    authority: 'Stay.ai',
    tone: 'pending',
    isFinalAuthority: true,
  },
  {
    id: 'missing_stayai_final_state_total',
    label: 'Missing Stay.ai final state',
    helper: 'No Stay.ai final state available — outcome cannot be finalized.',
    authority: 'Stay.ai',
    tone: 'missing',
    isFinalAuthority: true,
  },
  {
    id: 'portal_link_sent_total',
    label: 'Portal link sent',
    helper: 'Diagnostic only — portal link delivery is NOT portal completion.',
    authority: 'Synthflow / Portal',
    tone: 'context',
    isFinalAuthority: false,
  },
  {
    id: 'portal_completion_confirmed_total',
    label: 'Portal completion confirmed',
    helper: 'Confirmed portal completion event (counted toward portal completion).',
    authority: 'Stay.ai / Portal',
    tone: 'retention',
    isFinalAuthority: true,
  },
  {
    id: 'shopify_context_available_total',
    label: 'Shopify context available',
    helper: 'Shopify context joined for display only — never finalizes subscription.',
    authority: 'Shopify (context only)',
    tone: 'context',
    isFinalAuthority: false,
  },
  {
    id: 'synthflow_subscription_journeys_total',
    label: 'Synthflow subscription journeys',
    helper: 'Automated phone support journeys observed for subscription contacts.',
    authority: 'Synthflow',
    tone: 'context',
    isFinalAuthority: false,
  },
  {
    id: 'subscription_outcome_unknown_total',
    label: 'Subscription outcome unknown',
    helper: 'Outcome unresolved — Stay.ai final state not yet established.',
    authority: 'Stay.ai',
    tone: 'unknown',
    isFinalAuthority: true,
  },
];

export const SUBSCRIPTION_OUTCOME_RATE_CARDS: ReadonlyArray<
  Omit<SubscriptionOutcomeRateCard, 'rate' | 'numerator' | 'denominator'>
> = [
  {
    id: 'retention_rate',
    label: 'Retention rate',
    helper: 'Confirmed retained outcomes per save/retention attempt (Stay.ai-confirmed).',
    authority: 'Stay.ai',
    numeratorKey: 'confirmed_retained_total',
    denominatorKey: 'save_or_retention_attempts_total',
    formula: 'confirmed_retained_total / save_or_retention_attempts_total',
    isFinalAuthority: true,
  },
  {
    id: 'cancellation_confirmation_rate',
    label: 'Cancellation confirmation rate',
    helper: 'Stay.ai-confirmed cancellations per cancellation request.',
    authority: 'Stay.ai',
    numeratorKey: 'confirmed_cancellations_total',
    denominatorKey: 'cancellation_requests_total',
    formula: 'confirmed_cancellations_total / cancellation_requests_total',
    isFinalAuthority: true,
  },
  {
    id: 'portal_completion_rate',
    label: 'Portal completion rate',
    helper: 'Confirmed portal completions per portal link sent.',
    authority: 'Stay.ai / Portal',
    numeratorKey: 'portal_completion_confirmed_total',
    denominatorKey: 'portal_link_sent_total',
    formula: 'portal_completion_confirmed_total / portal_link_sent_total',
    isFinalAuthority: true,
  },
];

export function buildSubscriptionOutcomeKpiCards(
  metrics: SubscriptionOutcomeMetrics,
): SubscriptionOutcomeKpiCard[] {
  return SUBSCRIPTION_OUTCOME_KPI_CARDS.map((card) => ({
    ...card,
    value: metrics[card.id],
  }));
}

export function buildSubscriptionOutcomeRateCards(
  metrics: SubscriptionOutcomeMetrics,
): SubscriptionOutcomeRateCard[] {
  return SUBSCRIPTION_OUTCOME_RATE_CARDS.map((card) => {
    const numerator = metrics[card.numeratorKey];
    const denominator = metrics[card.denominatorKey];
    const rate = denominator > 0 ? clampRatio(numerator / denominator) : 0;
    return {
      ...card,
      numerator,
      denominator,
      rate,
    };
  });
}

export function buildSubscriptionOutcomeFunnel(
  metrics: SubscriptionOutcomeMetrics,
): SubscriptionOutcomeFunnelStage[] {
  const totalContacts = metrics.subscription_contacts_total;
  const share = (count: number): number => {
    if (totalContacts <= 0) return 0;
    return clampRatio(count / totalContacts);
  };

  return [
    {
      id: 'subscription_contact',
      label: '1. Subscription contact / journey',
      count: metrics.subscription_contacts_total,
      share: share(metrics.subscription_contacts_total),
      tone: 'primary',
      authority: 'Stay.ai',
      rule: 'Total subscription-related contacts in scope.',
      isFinalAuthority: true,
    },
    {
      id: 'requested_action',
      label: '2. Requested action',
      count: metrics.subscription_action_requests_total,
      share: share(metrics.subscription_action_requests_total),
      tone: 'primary',
      authority: 'Stay.ai + Synthflow',
      rule: 'Action requested by customer (request, not outcome).',
      isFinalAuthority: false,
    },
    {
      id: 'cancellation_path',
      label: '3. Cancellation path',
      count: metrics.cancellation_requests_total,
      share: share(metrics.cancellation_requests_total),
      tone: 'cancellation',
      authority: 'Stay.ai + Synthflow',
      rule: 'Cancellation request initiated. Confirmation requires Stay.ai cancelled state.',
      isFinalAuthority: false,
    },
    {
      id: 'save_path',
      label: '4. Save / retention path',
      count: metrics.save_or_retention_attempts_total,
      share: share(metrics.save_or_retention_attempts_total),
      tone: 'retention',
      authority: 'Stay.ai + Synthflow',
      rule: 'Save offer exposed. Retained outcome requires Stay.ai retained state.',
      isFinalAuthority: false,
    },
    {
      id: 'non_cancellation_path',
      label: '5. Non-cancellation action path',
      count: metrics.non_cancellation_actions_total,
      share: share(metrics.non_cancellation_actions_total),
      tone: 'primary',
      authority: 'Stay.ai',
      rule: 'Non-cancellation actions resolved through Stay.ai.',
      isFinalAuthority: true,
    },
    {
      id: 'stayai_final_confirmation',
      label: '6. Stay.ai final confirmation',
      count: metrics.confirmed_cancellations_total + metrics.confirmed_retained_total,
      share: share(metrics.confirmed_cancellations_total + metrics.confirmed_retained_total),
      tone: 'retention',
      authority: 'Stay.ai',
      rule: 'Confirmed Stay.ai final state — only this counts as a finalized outcome.',
      isFinalAuthority: true,
    },
    {
      id: 'portal_completion',
      label: '7. Portal completion (where applicable)',
      count: metrics.portal_completion_confirmed_total,
      share: share(metrics.portal_completion_confirmed_total),
      tone: 'retention',
      authority: 'Stay.ai / Portal',
      rule: 'Portal completion confirmed. Portal link sent is NOT completion.',
      isFinalAuthority: true,
    },
    {
      id: 'unknown_pending',
      label: '8. Unknown / pending states',
      count:
        metrics.subscription_outcome_unknown_total +
        metrics.pending_stayai_confirmation_total +
        metrics.missing_stayai_final_state_total,
      share: share(
        metrics.subscription_outcome_unknown_total +
          metrics.pending_stayai_confirmation_total +
          metrics.missing_stayai_final_state_total,
      ),
      tone: 'unknown',
      authority: 'Stay.ai (pending / missing)',
      rule: 'Outcomes excluded from finalization until Stay.ai final state arrives.',
      isFinalAuthority: true,
    },
  ];
}

export type DeriveOptions = {
  loading: boolean;
  error: string | null;
  source: 'api' | 'fixture';
  permissionDenied: boolean;
};

export function deriveSubscriptionOutcomeAlerts(
  data: SubscriptionOutcomesResponse,
  options: DeriveOptions,
): SubscriptionOutcomeAlert[] {
  const alerts: SubscriptionOutcomeAlert[] = [];
  const { metrics, metadata } = data;

  if (options.loading) {
    alerts.push({
      id: 'loading',
      level: 'info',
      title: 'Loading subscription outcomes',
      detail: 'Awaiting Stay.ai-backed outcome contract from analytics-api.',
    });
  }

  if (options.permissionDenied) {
    alerts.push({
      id: 'permission_denied',
      level: 'danger',
      title: 'Permission denied (server)',
      detail:
        'Server-side explicit deny enforced. UI does not bypass authorization; only contract preview values shown.',
    });
  } else if (!options.permissionDenied && options.error && options.source === 'fixture') {
    alerts.push({
      id: 'rbac_unavailable',
      level: 'danger',
      title: 'RBAC server confirmation unavailable',
      detail: 'No live server confirmation; local checks are not production authorization.',
    });
  }

  if (
    options.source === 'fixture' &&
    !options.loading &&
    (options.error || data.generated_from_fixture)
  ) {
    alerts.push({
      id: 'fixture_preview',
      level: 'warning',
      title: 'Contract preview from fixture',
      detail:
        options.error ??
        'Backend not reachable; rendering shared-contract preview values, not production outcomes.',
    });
  }

  if (metrics.subscription_contacts_total === 0) {
    alerts.push({
      id: 'empty_outcomes',
      level: 'info',
      title: 'No subscription contacts in scope',
      detail: 'Stay.ai outcomes contract returned an empty result set for the current filters.',
    });
  }

  const trust: TrustLabel = metadata.trust_label;
  if (trust === 'low' || trust === 'untrusted') {
    alerts.push({
      id: 'low_trust',
      level: 'danger',
      title: `Low trust label (${trust})`,
      detail: 'Trust labels are system-calculated. Manual elevation is blocked by source rules.',
    });
  }

  const freshness = metadata.freshness_status.toLowerCase();
  if (STALE_FRESHNESS.has(freshness)) {
    alerts.push({
      id: 'stale_source',
      level: 'warning',
      title: `Stale source data (${metadata.freshness_status})`,
      detail: 'Source freshness past warning threshold — outcomes may lag behind reality.',
    });
  } else if (PENDING_FRESHNESS.has(freshness)) {
    alerts.push({
      id: 'pending_freshness',
      level: 'warning',
      title: `Pending freshness (${metadata.freshness_status})`,
      detail: 'Source sync is lagging or unknown; treat values as preliminary.',
    });
  }

  if (metadata.source_confirmation_status === 'pending') {
    alerts.push({
      id: 'pending_stayai_confirmation',
      level: 'warning',
      title: 'Pending Stay.ai confirmation',
      detail: 'Stay.ai final state has not been confirmed for the entire window.',
    });
  }
  if (metadata.source_confirmation_status === 'missing') {
    alerts.push({
      id: 'missing_stayai_final_state',
      level: 'danger',
      title: 'Missing Stay.ai final state',
      detail:
        'No Stay.ai final state — retention/cancellation outcomes cannot be finalized for this window.',
    });
  }

  if (metrics.portal_link_sent_total > metrics.portal_completion_confirmed_total) {
    alerts.push({
      id: 'portal_link_unknown_completion',
      level: 'warning',
      title: 'Portal link sent — completion unknown',
      detail:
        'Portal link delivery is diagnostic only. It does not count as portal completion until confirmed.',
    });
  }

  if (
    metrics.shopify_context_available_total > 0 &&
    metadata.source_confirmation_status !== 'confirmed'
  ) {
    alerts.push({
      id: 'shopify_context_only',
      level: 'warning',
      title: 'Shopify context available — Stay.ai final missing',
      detail: 'Shopify is context-only and never overrides Stay.ai subscription truth.',
    });
  }

  if (
    metrics.synthflow_subscription_journeys_total > 0 &&
    metrics.subscription_outcome_unknown_total >=
      metrics.synthflow_subscription_journeys_total * 0.5
  ) {
    alerts.push({
      id: 'synthflow_journey_incomplete',
      level: 'warning',
      title: 'Synthflow journey incomplete',
      detail:
        'A large share of Synthflow journeys ended without a Stay.ai-confirmed final state.',
    });
  }

  const exportFields: Array<keyof SubscriptionOutcomeMetadata> = [
    'metric_id',
    'formula_version',
    'freshness_status',
    'trust_label',
    'owner',
    'timestamp',
    'fingerprint',
    'audit_reference',
    'source_confirmation_status',
  ];
  const missingExportFields = exportFields.filter((field) => !metadata[field]);
  if (missingExportFields.length > 0) {
    alerts.push({
      id: 'export_audit_unavailable',
      level: 'danger',
      title: 'Export / audit metadata unavailable',
      detail: `Missing required export metadata fields: ${missingExportFields.join(', ')}.`,
    });
  }

  return alerts;
}
