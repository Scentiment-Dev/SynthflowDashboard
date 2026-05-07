/**
 * Cycle 008 — Plain-language copy helpers.
 *
 * Single source of truth for converting backend enums into the support-user
 * language defined in `docs/07_dashboard_ui_ux/subscription_plain_language_copy_system.md`.
 * Engineering vocabulary like `pending_stayai_match`, `blocked_by_data`, formula
 * versions, audit references, and fingerprints never reach Level 1 surfaces;
 * this module is the seam that translates them.
 */

import type { TrustLabel } from '../../types/metrics';
import type {
  BusinessValueState,
  SubscriptionFreshnessStatus,
  SubscriptionSourceConfirmation,
} from '../../types/subscriptionBusinessValue';

export type StateChipTone = 'success' | 'info' | 'warning' | 'danger' | 'neutral' | 'brand';

export const TRUST_CHIP_LABEL: Record<TrustLabel, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  untrusted: 'Untrusted',
};

export const TRUST_CHIP_TOOLTIP: Record<TrustLabel, string> = {
  high: 'How reliable this metric is right now. We have official confirmation from Stay.ai and the source is fresh.',
  medium:
    'How reliable this metric is right now. We have most of the data we need. A few records are still pending or partly estimated.',
  low: 'How reliable this metric is right now. Some of this data is missing or out of date. Treat the number as a rough guide.',
  untrusted:
    'How reliable this metric is right now. We cannot trust this number right now. Open the data quality page for details.',
};

export const TRUST_TONE: Record<TrustLabel, StateChipTone> = {
  high: 'success',
  medium: 'info',
  low: 'warning',
  untrusted: 'danger',
};

export const FRESHNESS_LABEL: Record<SubscriptionFreshnessStatus, string> = {
  fresh: 'On time',
  stale: 'Too old to trust',
  unknown: 'Status unknown',
};

export const FRESHNESS_TONE: Record<SubscriptionFreshnessStatus, StateChipTone> = {
  fresh: 'success',
  stale: 'danger',
  unknown: 'neutral',
};

export const BUSINESS_VALUE_STATE_LABEL: Record<BusinessValueState, string> = {
  confirmed: 'Confirmed',
  estimated: 'Estimated',
  pending: 'Pending Stay.ai',
  unknown: 'Unknown',
  blocked_by_data: 'Blocked — data missing',
};

export const BUSINESS_VALUE_STATE_TOOLTIP: Record<BusinessValueState, string> = {
  confirmed:
    'Stay.ai has confirmed the outcome and the financial figures are validated.',
  estimated:
    'Stay.ai has confirmed the outcome but the financial figures use modelled support cost or revenue.',
  pending:
    'We do not yet have official subscription confirmation, so this number is provisional.',
  unknown:
    "We can't compute this metric from the data we currently have.",
  blocked_by_data:
    'A required join (for example, offer version) is not yet built.',
};

export const BUSINESS_VALUE_STATE_TONE: Record<BusinessValueState, StateChipTone> = {
  confirmed: 'success',
  estimated: 'info',
  pending: 'warning',
  unknown: 'neutral',
  blocked_by_data: 'danger',
};

export const SOURCE_CONFIRMATION_LABEL: Record<SubscriptionSourceConfirmation, string> = {
  confirmed: 'Stay.ai · official',
  pending: 'Stay.ai · pending',
  missing: 'Stay.ai · not received',
};

export const SOURCE_CONFIRMATION_TONE: Record<SubscriptionSourceConfirmation, StateChipTone> = {
  confirmed: 'brand',
  pending: 'warning',
  missing: 'danger',
};

/**
 * Format a numeric value with currency / count semantics for support-user views.
 * Counts use locale formatting; currency uses USD; ratios use up to one decimal.
 */
export function formatBusinessValue(
  value: number | null | undefined,
  unit: string,
): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  if (unit === 'usd') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  }
  if (unit === 'ratio') {
    return `${value.toFixed(value % 1 === 0 ? 0 : 2)}×`;
  }
  if (unit === 'percent') {
    return `${value.toLocaleString()}%`;
  }
  return value.toLocaleString();
}

/**
 * Convert an ISO timestamp into the friendly Level-2 form
 * "5 May at 14:21 ET". Falls back to the raw input if parsing fails so
 * we never silently render an empty string.
 */
export function formatFriendlyTimestamp(iso: string): string {
  try {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return iso;
    const day = date.getUTCDate();
    const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
    const hour = String(date.getUTCHours()).padStart(2, '0');
    const minute = String(date.getUTCMinutes()).padStart(2, '0');
    return `${day} ${month} at ${hour}:${minute} UTC`;
  } catch {
    return iso;
  }
}

/**
 * Compute "Updated N min ago" / "Updated N hr ago" relative copy for the
 * Level-2 expander. Always returns a non-empty string.
 */
export function formatRelativeAge(iso: string, now: Date = new Date()): string {
  try {
    const then = new Date(iso);
    if (Number.isNaN(then.getTime())) return 'Updated recently';
    const ms = now.getTime() - then.getTime();
    const minutes = Math.max(0, Math.round(ms / 60000));
    if (minutes < 1) return 'Updated just now';
    if (minutes < 60) return `Updated ${minutes} min ago`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `Updated ${hours} hr ago`;
    const days = Math.round(hours / 24);
    return `Updated ${days} day${days === 1 ? '' : 's'} ago`;
  } catch {
    return 'Updated recently';
  }
}

export const SLA_LABEL: Record<string, string> = {
  on_track: 'On track',
  due_soon: 'Due soon',
  breached: 'Breached',
  unknown: 'Status unknown',
};

export const SLA_TONE: Record<string, StateChipTone> = {
  on_track: 'success',
  due_soon: 'warning',
  breached: 'danger',
  unknown: 'neutral',
};

export const PORTAL_STATE_LABEL: Record<string, string> = {
  link_sent: 'Link sent',
  link_opened: 'Link opened',
  portal_started: 'Portal started',
  portal_completed: 'Completion confirmed',
  link_failed_bounce: 'Link failed (bounced)',
  link_failed_optout: 'Link failed (opted out)',
  link_failed_expired: 'Link expired',
  completion_unknown: 'Completion unknown',
};

export const PRIORITY_LABEL: Record<string, string> = {
  high: 'High priority',
  medium: 'Medium priority',
  low: 'Low priority',
};

export const PRIORITY_TONE: Record<string, StateChipTone> = {
  high: 'danger',
  medium: 'warning',
  low: 'neutral',
};
