import type {
  SourceConfirmationStatus,
  SubscriptionAnalyticsResponse,
  SubscriptionTruthState,
} from '../types/subscriptionAnalytics';
import type { TrustLabel } from '../types/metrics';

export type StatusTone = 'success' | 'warning' | 'danger' | 'neutral';

export function finalStateTone(state: SubscriptionTruthState): StatusTone {
  if (state === 'retained' || state === 'saved' || state === 'active') return 'success';
  if (state === 'cancelled') return 'neutral';
  if (state === 'pending') return 'warning';
  return 'danger';
}

export function finalStateLabel(state: SubscriptionTruthState): string {
  switch (state) {
    case 'retained':
      return 'Retained (Stay.ai confirmed)';
    case 'saved':
      return 'Saved (Stay.ai confirmed)';
    case 'cancelled':
      return 'Cancelled (Stay.ai confirmed)';
    case 'active':
      return 'Active (Stay.ai confirmed)';
    case 'pending':
      return 'Pending Stay.ai confirmation';
    default:
      return 'Unknown — Stay.ai final state missing';
  }
}

export function sourceConfirmationTone(status: SourceConfirmationStatus): StatusTone {
  if (status === 'confirmed') return 'success';
  if (status === 'pending') return 'warning';
  return 'danger';
}

export function statusToneClasses(tone: StatusTone): string {
  switch (tone) {
    case 'success':
      return 'border-emerald-200 bg-emerald-50 text-emerald-900';
    case 'warning':
      return 'border-amber-200 bg-amber-50 text-amber-900';
    case 'danger':
      return 'border-rose-200 bg-rose-50 text-rose-900';
    default:
      return 'border-slate-200 bg-slate-50 text-slate-800';
  }
}

export function statusBadgeClasses(tone: StatusTone): string {
  switch (tone) {
    case 'success':
      return 'bg-emerald-100 text-emerald-800 ring-emerald-200';
    case 'warning':
      return 'bg-amber-100 text-amber-900 ring-amber-200';
    case 'danger':
      return 'bg-rose-100 text-rose-800 ring-rose-200';
    default:
      return 'bg-slate-100 text-slate-700 ring-slate-200';
  }
}

export type SubscriptionStateAlert = {
  id: string;
  level: 'info' | 'warning' | 'danger';
  title: string;
  detail: string;
};

const STALE_FRESHNESS_VALUES = new Set(['stale', 'expired', 'overdue']);
const PENDING_FRESHNESS_VALUES = new Set(['pending', 'lagging', 'unknown']);

export function deriveSubscriptionStateAlerts(
  data: SubscriptionAnalyticsResponse,
  options: { error: string | null; permissionDenied: boolean; loading: boolean; source: 'api' | 'fixture' },
): SubscriptionStateAlert[] {
  const alerts: SubscriptionStateAlert[] = [];
  const meta = data.metric_metadata;
  const portal = data.portal_journey;
  const overview = data.subscription_overview;
  const sourceConfirmation = data.source_confirmation;
  const synthflow = data.synthflow_journey;
  const statusBreakdown = synthflow.status_breakdown ?? {};
  const totalSynthflowEvents = Object.values(statusBreakdown).reduce(
    (acc, count) => acc + count,
    0,
  );

  if (options.loading) {
    alerts.push({
      id: 'loading',
      level: 'info',
      title: 'Loading subscription analytics contract',
      detail: 'Awaiting Stay.ai-backed analytics response from analytics-api.',
    });
  }

  if (options.permissionDenied) {
    alerts.push({
      id: 'permission_denied',
      level: 'danger',
      title: 'Permission denied (server)',
      detail: 'Server-side explicit deny enforced. UI does not bypass authz.',
    });
  } else if (!options.permissionDenied && options.error && options.source === 'fixture') {
    alerts.push({
      id: 'rbac_unavailable',
      level: 'danger',
      title: 'RBAC server confirmation unavailable',
      detail: 'Local checks are not treated as production authorization.',
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
        options.error ?? 'Backend not reachable; rendering shared-contract preview values, not production analytics.',
    });
  }

  if (overview.subscription_overview_count === 0) {
    alerts.push({
      id: 'empty',
      level: 'info',
      title: 'No subscription rows for current filters',
      detail: 'Stay.ai contract returned an empty result set; nothing to display until rows arrive.',
    });
  }

  const trust: TrustLabel = meta.trust_label;
  if (trust === 'low' || trust === 'untrusted') {
    alerts.push({
      id: 'low_trust',
      level: 'danger',
      title: `Low trust label (${trust})`,
      detail: 'Trust labels are system-calculated. Manual elevation is blocked.',
    });
  }

  if (STALE_FRESHNESS_VALUES.has(meta.freshness.toLowerCase())) {
    alerts.push({
      id: 'stale',
      level: 'warning',
      title: `Stale data (${meta.freshness})`,
      detail: 'Source freshness is past warning threshold — values may be out of date.',
    });
  } else if (PENDING_FRESHNESS_VALUES.has(meta.freshness.toLowerCase())) {
    alerts.push({
      id: 'pending_freshness',
      level: 'warning',
      title: `Pending freshness (${meta.freshness})`,
      detail: 'Source sync is lagging; treat values as preliminary.',
    });
  }

  if (sourceConfirmation.source_confirmation_status === 'pending') {
    alerts.push({
      id: 'pending_source_confirmation',
      level: 'warning',
      title: 'Pending Stay.ai source confirmation',
      detail: 'Source match still awaiting Stay.ai final state evidence.',
    });
  }
  if (sourceConfirmation.source_confirmation_status === 'missing') {
    alerts.push({
      id: 'missing_stayai_final_state',
      level: 'danger',
      title: 'Missing Stay.ai final state',
      detail: 'No retained or cancelled outcome is finalized without Stay.ai.',
    });
  }

  if (data.final_subscription_state === 'unknown' || data.final_subscription_state === 'pending') {
    alerts.push({
      id: 'final_state_not_confirmed',
      level: 'warning',
      title: 'Final subscription state not confirmed',
      detail: 'Dashboard will not display retention/cancellation as final until Stay.ai confirms.',
    });
  }

  if (portal.portal_link_sent_count > portal.confirmed_portal_completion_count) {
    alerts.push({
      id: 'portal_link_unknown_completion',
      level: 'warning',
      title: 'Portal link sent, completion unknown',
      detail: 'Portal link delivery does not count as portal completion until confirmed.',
    });
  }

  if (
    data.shopify_context.context_records_available_count > 0 &&
    sourceConfirmation.source_confirmation_status !== 'confirmed'
  ) {
    alerts.push({
      id: 'shopify_without_stayai_final',
      level: 'warning',
      title: 'Shopify context available, Stay.ai final missing',
      detail: 'Shopify is context-only and never overrides Stay.ai subscription truth.',
    });
  }

  const incompleteSynthflowEvents =
    (statusBreakdown.unresolved ?? 0) +
    (statusBreakdown.transferred ?? 0) +
    (statusBreakdown.abandoned ?? 0);
  if (
    totalSynthflowEvents > 0 &&
    incompleteSynthflowEvents >= totalSynthflowEvents * 0.5
  ) {
    alerts.push({
      id: 'synthflow_journey_incomplete',
      level: 'warning',
      title: 'Synthflow journey incomplete',
      detail: 'Most journey events are unresolved, transferred, or abandoned and are excluded from containment success.',
    });
  }

  if (!meta.audit_reference || !meta.fingerprint) {
    alerts.push({
      id: 'audit_unavailable',
      level: 'danger',
      title: 'Audit metadata unavailable',
      detail: 'Audit reference or fingerprint missing; export remains blocked.',
    });
  }

  const exportRequiredFields: Array<keyof typeof meta> = [
    'metric_id',
    'formula_version',
    'freshness',
    'trust_label',
    'owner',
    'timestamp',
    'fingerprint',
    'audit_reference',
    'source_system',
    'source_confirmation_status',
  ];
  const exportMissing = exportRequiredFields.filter((field) => !meta[field]);
  if (exportMissing.length > 0) {
    alerts.push({
      id: 'export_pending_metadata',
      level: 'danger',
      title: 'Export blocked / pending metadata',
      detail: `Missing required export metadata fields: ${exportMissing.join(', ')}.`,
    });
  }

  return alerts;
}

const RATIO_INTEGER_TOLERANCE = 1e-9;

export function formatRatio(numerator: number, denominator: number): string {
  if (denominator <= 0) return 'n/a';
  const ratio = (numerator / denominator) * 100;
  const rounded = Math.round(ratio);
  const isEffectivelyInteger = Math.abs(ratio - rounded) < RATIO_INTEGER_TOLERANCE;
  return `${ratio.toFixed(isEffectivelyInteger ? 0 : 1)}%`;
}
