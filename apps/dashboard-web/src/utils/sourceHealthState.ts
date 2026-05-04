import type {
  ConflictStatus,
  DataQualityStatus,
  FreshnessStatus,
  OverallSourceHealth,
  SourceAuthorityLevel,
  SourceConfirmationLevel,
  SourceHealthEntry,
  SourceHealthSystem,
  SubscriptionSourceHealthResponse,
} from '../types/sourceHealth';
import type { TrustLabel } from '../types/metrics';
import type { StatusTone } from './subscriptionAnalyticsState';

export type SourceVisualState =
  | 'fresh'
  | 'stale'
  | 'unknown_freshness'
  | 'missing_source'
  | 'missing_stay_ai_final'
  | 'pending_source_confirmation'
  | 'conflict_detected'
  | 'context_only_available'
  | 'portal_link_sent_completion_missing'
  | 'synthflow_journey_incomplete';

export type SourceVisualStateMeta = {
  id: SourceVisualState;
  label: string;
  detail: string;
  tone: StatusTone;
};

export const SOURCE_VISUAL_STATE_LIBRARY: SourceVisualStateMeta[] = [
  {
    id: 'fresh',
    label: 'Fresh',
    detail: 'Source last seen within the freshness threshold and reporting current data.',
    tone: 'success',
  },
  {
    id: 'stale',
    label: 'Stale',
    detail: 'Source last seen past the freshness threshold; values may be out of date.',
    tone: 'warning',
  },
  {
    id: 'unknown_freshness',
    label: 'Unknown freshness',
    detail: 'Last-seen timestamp is missing or unreadable; freshness cannot be confirmed.',
    tone: 'warning',
  },
  {
    id: 'missing_source',
    label: 'Missing source',
    detail: 'Required source feed is not present in the current contract response.',
    tone: 'danger',
  },
  {
    id: 'missing_stay_ai_final',
    label: 'Missing Stay.ai final state',
    detail: 'No Stay.ai-confirmed retained or cancelled outcome is available; final outcome stays pending.',
    tone: 'danger',
  },
  {
    id: 'pending_source_confirmation',
    label: 'Pending source confirmation',
    detail: 'Source has rows but is still awaiting Stay.ai-final confirmation.',
    tone: 'warning',
  },
  {
    id: 'conflict_detected',
    label: 'Conflict detected',
    detail: 'Cross-source conflicts found. Stay.ai authority is preserved; conflict requires triage.',
    tone: 'warning',
  },
  {
    id: 'context_only_available',
    label: 'Context-only source available',
    detail: 'Shopify context rows present. Context never finalizes subscription outcomes.',
    tone: 'neutral',
  },
  {
    id: 'portal_link_sent_completion_missing',
    label: 'Portal link sent — completion missing',
    detail: 'Portal completion signal pending. Link delivery is not portal completion.',
    tone: 'warning',
  },
  {
    id: 'synthflow_journey_incomplete',
    label: 'Synthflow journey incomplete',
    detail: 'Synthflow journey events missing required dispositions; containment cannot be claimed.',
    tone: 'warning',
  },
];

export type SourceHealthAlert = {
  id: string;
  level: 'info' | 'warning' | 'danger';
  title: string;
  detail: string;
};

export function overallHealthTone(value: OverallSourceHealth): StatusTone {
  switch (value) {
    case 'healthy':
      return 'success';
    case 'warning':
      return 'warning';
    case 'degraded':
      return 'danger';
    default:
      return 'neutral';
  }
}

export function conflictStatusTone(value: ConflictStatus): StatusTone {
  switch (value) {
    case 'none':
      return 'success';
    case 'pending':
      return 'warning';
    case 'conflict_detected':
      return 'danger';
    default:
      return 'neutral';
  }
}

export function freshnessTone(value: FreshnessStatus): StatusTone {
  switch (value) {
    case 'fresh':
      return 'success';
    case 'stale':
      return 'warning';
    default:
      return 'warning';
  }
}

export function dataQualityTone(value: DataQualityStatus): StatusTone {
  switch (value) {
    case 'passing':
      return 'success';
    case 'warning':
      return 'warning';
    case 'failing':
      return 'danger';
    default:
      return 'neutral';
  }
}

export function confirmationTone(value: SourceConfirmationLevel): StatusTone {
  switch (value) {
    case 'confirmed':
      return 'success';
    case 'pending':
      return 'warning';
    default:
      return 'danger';
  }
}

export function trustLabelTone(value: TrustLabel): StatusTone {
  switch (value) {
    case 'high':
      return 'success';
    case 'medium':
      return 'warning';
    case 'low':
      return 'danger';
    default:
      return 'danger';
  }
}

export type SourceAuthorityCopy = {
  finalSubscriptionTruth: boolean;
  authorityLine: string;
  authorityHelper: string;
  ownership: string;
};

export const SOURCE_SYSTEM_COPY: Record<SourceHealthSystem, {
  label: string;
  domain: string;
  authority: SourceAuthorityCopy;
}> = {
  stay_ai: {
    label: 'Stay.ai',
    domain: 'Subscription state, actions, save/retention, cancellation outcomes.',
    authority: {
      finalSubscriptionTruth: true,
      authorityLine: 'Final subscription truth',
      authorityHelper:
        'Authoritative for Stay.ai-confirmed retained, saved, cancelled, and pending states.',
      ownership: 'Owns: subscription final state.',
    },
  },
  synthflow: {
    label: 'Synthflow',
    domain: 'Automated phone-support journey events.',
    authority: {
      finalSubscriptionTruth: false,
      authorityLine: 'Journey-event authority',
      authorityHelper:
        'Authoritative for automated journey events; never overrides Stay.ai final state.',
      ownership: 'Owns: automated journey events.',
    },
  },
  shopify: {
    label: 'Shopify',
    domain: 'Order, product, customer, fulfillment, tracking, tags, order status.',
    authority: {
      finalSubscriptionTruth: false,
      authorityLine: 'Context only',
      authorityHelper:
        'Provides order/customer context only. Never finalizes subscription outcomes.',
      ownership: 'Owns: order context.',
    },
  },
  portal: {
    label: 'Portal',
    domain: 'Portal completion signals (link delivery vs. confirmed completion).',
    authority: {
      finalSubscriptionTruth: false,
      authorityLine: 'Completion signal',
      authorityHelper:
        'Reports portal completion signals. Link sent is not completion; confirmed completion is required.',
      ownership: 'Owns: confirmed portal completion signal.',
    },
  },
};

export function authorityLabel(level: SourceAuthorityLevel): string {
  switch (level) {
    case 'authoritative_final_state':
      return 'Authoritative final state';
    case 'journey_event_authoritative':
      return 'Journey-event authoritative';
    case 'context_only':
      return 'Context only';
    default:
      return 'Completion signal';
  }
}

export function freshnessLabel(value: FreshnessStatus): string {
  if (value === 'fresh') return 'Fresh';
  if (value === 'stale') return 'Stale';
  return 'Unknown';
}

export function confirmationLabel(value: SourceConfirmationLevel): string {
  if (value === 'confirmed') return 'Confirmed';
  if (value === 'pending') return 'Pending';
  return 'Missing';
}

export function dataQualityLabel(value: DataQualityStatus): string {
  if (value === 'passing') return 'Passing';
  if (value === 'warning') return 'Warning';
  return 'Failing';
}

export function overallHealthLabel(value: OverallSourceHealth): string {
  switch (value) {
    case 'healthy':
      return 'Overall: Healthy';
    case 'warning':
      return 'Overall: Warning';
    case 'degraded':
      return 'Overall: Degraded';
    default:
      return 'Overall: Unknown';
  }
}

export function conflictStatusLabel(value: ConflictStatus): string {
  switch (value) {
    case 'none':
      return 'No cross-source conflicts';
    case 'pending':
      return 'Pending: source still resolving';
    case 'conflict_detected':
      return 'Conflict detected (Stay.ai retains authority)';
    default:
      return 'Conflict status unknown';
  }
}

const REQUIRED_SOURCES: SourceHealthSystem[] = ['stay_ai', 'synthflow', 'shopify', 'portal'];

function findSource(
  data: SubscriptionSourceHealthResponse,
  system: SourceHealthSystem,
): SourceHealthEntry | undefined {
  return data.sources.find((source) => source.source_system === system);
}

export function deriveSourceHealthAlerts(
  data: SubscriptionSourceHealthResponse,
  options: {
    error: string | null;
    permissionDenied: boolean;
    loading: boolean;
    source: 'api' | 'fixture';
  },
): SourceHealthAlert[] {
  const alerts: SourceHealthAlert[] = [];

  if (options.loading) {
    alerts.push({
      id: 'loading',
      level: 'info',
      title: 'Loading source health contract',
      detail: 'Awaiting Stay.ai-backed source health response from analytics-api.',
    });
  }

  if (options.permissionDenied) {
    alerts.push({
      id: 'permission_denied',
      level: 'danger',
      title: 'Permission denied (server)',
      detail: 'Server-side explicit deny enforced. UI does not bypass authz.',
    });
  } else if (options.error && options.source === 'fixture') {
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
        options.error ??
        'Backend not reachable; rendering shared-contract preview values, not production source health.',
    });
  }

  REQUIRED_SOURCES.forEach((system) => {
    if (!findSource(data, system)) {
      alerts.push({
        id: `missing_source_${system}`,
        level: 'danger',
        title: `Missing ${SOURCE_SYSTEM_COPY[system].label} source feed`,
        detail: `${SOURCE_SYSTEM_COPY[system].label} feed is absent in this response. Required for source-health rollup.`,
      });
    }
  });

  const stayAi = findSource(data, 'stay_ai');
  if (stayAi && stayAi.source_confirmation_status !== 'confirmed') {
    alerts.push({
      id: 'missing_stay_ai_final',
      level: 'danger',
      title: 'Missing Stay.ai final state',
      detail:
        data.missing_stay_ai_final_state_warning ??
        'Final subscription outcome stays pending or unknown until Stay.ai confirms.',
    });
  }

  const portal = findSource(data, 'portal');
  if (portal && portal.source_confirmation_status !== 'confirmed') {
    alerts.push({
      id: 'portal_link_sent_completion_missing',
      level: 'warning',
      title: 'Portal link sent — completion missing',
      detail:
        data.portal_completion_warning ??
        'Portal completion requires confirmed completion event, not link delivery.',
    });
  }

  const synthflow = findSource(data, 'synthflow');
  if (synthflow && synthflow.missing_required_fields.length > 0) {
    alerts.push({
      id: 'synthflow_journey_incomplete',
      level: 'warning',
      title: 'Synthflow journey incomplete',
      detail: `Required journey fields missing: ${synthflow.missing_required_fields.join(', ')}.`,
    });
  }

  data.sources.forEach((source) => {
    if (source.freshness_status === 'stale') {
      alerts.push({
        id: `stale_${source.source_system}`,
        level: 'warning',
        title: `${SOURCE_SYSTEM_COPY[source.source_system].label} stale (${source.freshness_minutes}m)`,
        detail: 'Source freshness is past warning threshold — values may be out of date.',
      });
    } else if (source.freshness_status === 'unknown') {
      alerts.push({
        id: `unknown_freshness_${source.source_system}`,
        level: 'warning',
        title: `${SOURCE_SYSTEM_COPY[source.source_system].label} freshness unknown`,
        detail: 'Last-seen timestamp could not be resolved; treat values as preliminary.',
      });
    }

    if (source.data_quality_status === 'failing') {
      alerts.push({
        id: `quality_failing_${source.source_system}`,
        level: 'danger',
        title: `${SOURCE_SYSTEM_COPY[source.source_system].label} data quality failing`,
        detail: source.missing_required_fields.length > 0
          ? `Missing required fields: ${source.missing_required_fields.join(', ')}.`
          : 'Data quality checks are failing for this source.',
      });
    }

    if (source.conflict_count > 0) {
      alerts.push({
        id: `conflict_${source.source_system}`,
        level: 'warning',
        title: `${SOURCE_SYSTEM_COPY[source.source_system].label} reports ${source.conflict_count} conflict${source.conflict_count === 1 ? '' : 's'}`,
        detail: 'Stay.ai authority is preserved. Operators must triage cross-source disagreement.',
      });
    }
  });

  if (data.conflict_status === 'conflict_detected') {
    alerts.push({
      id: 'conflict_status_overall',
      level: 'warning',
      title: 'Cross-source conflict detected',
      detail: 'At least one source disagreement was logged. Stay.ai final state remains the source of truth.',
    });
  }

  if (data.pending_or_unknown_final_outcome) {
    alerts.push({
      id: 'pending_or_unknown_final_outcome',
      level: 'warning',
      title: 'Pending or unknown final subscription outcome',
      detail: 'Stay.ai-confirmed final state is not yet available across the response set.',
    });
  }

  const shopify = findSource(data, 'shopify');
  if (shopify && shopify.record_count > 0 && stayAi && stayAi.source_confirmation_status !== 'confirmed') {
    alerts.push({
      id: 'context_only_without_stay_ai_final',
      level: 'warning',
      title: 'Context-only source available; Stay.ai final missing',
      detail: data.shopify_context_warning,
    });
  }

  return alerts;
}

export function activeVisualStates(
  data: SubscriptionSourceHealthResponse,
): SourceVisualState[] {
  const states = new Set<SourceVisualState>();

  REQUIRED_SOURCES.forEach((system) => {
    if (!findSource(data, system)) states.add('missing_source');
  });

  data.sources.forEach((source) => {
    if (source.freshness_status === 'fresh') states.add('fresh');
    else if (source.freshness_status === 'stale') states.add('stale');
    else states.add('unknown_freshness');

    if (source.source_confirmation_status === 'pending') {
      states.add('pending_source_confirmation');
    }

    if (source.conflict_count > 0) {
      states.add('conflict_detected');
    }
  });

  if (data.conflict_status === 'conflict_detected') {
    states.add('conflict_detected');
  }

  const stayAi = findSource(data, 'stay_ai');
  if (!stayAi || stayAi.source_confirmation_status !== 'confirmed') {
    states.add('missing_stay_ai_final');
  }

  const portal = findSource(data, 'portal');
  if (portal && portal.source_confirmation_status !== 'confirmed') {
    states.add('portal_link_sent_completion_missing');
  }

  const shopify = findSource(data, 'shopify');
  if (shopify && shopify.record_count > 0) {
    states.add('context_only_available');
  }

  const synthflow = findSource(data, 'synthflow');
  if (synthflow && synthflow.missing_required_fields.length > 0) {
    states.add('synthflow_journey_incomplete');
  }

  return SOURCE_VISUAL_STATE_LIBRARY.filter((meta) => states.has(meta.id)).map(
    (meta) => meta.id,
  );
}

export function formatLastSeenRelative(freshnessMinutes: number): string {
  if (!Number.isFinite(freshnessMinutes) || freshnessMinutes < 0) return 'unknown';
  if (freshnessMinutes < 1) return 'less than a minute ago';
  if (freshnessMinutes < 60) {
    return `${Math.round(freshnessMinutes)}m ago`;
  }
  const hours = freshnessMinutes / 60;
  if (hours < 24) {
    const rounded = Math.round(hours * 10) / 10;
    return `${rounded}h ago`;
  }
  const days = hours / 24;
  const roundedDays = Math.round(days * 10) / 10;
  return `${roundedDays}d ago`;
}
