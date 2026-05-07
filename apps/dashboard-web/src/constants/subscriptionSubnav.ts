/**
 * Subscription analytics secondary navigation — single source of truth for the
 * 10 required subscription subpages. Each item has a real route under
 * `/subscriptions/...`. Items marked as `live` are fully implemented; items
 * marked as `planned` (or the legacy `prototype` flag) route to a stub subpage
 * that explains what the tab will show — the support user always has an answer
 * when they click a tab.
 *
 * The IA spec lives at:
 *   docs/07_dashboard_ui_ux/subscription_analytics_information_architecture_v2.md
 */

export type SubscriptionSubnavStatus = 'planned' | 'prototype' | 'live';

export type SubscriptionSubnavItemId =
  | 'command-center'
  | 'outcomes'
  | 'non-cancellation'
  | 'cancellation-intake'
  | 'cost-too-high'
  | 'business-value'
  | 'portal-handoff'
  | 'containment'
  | 'follow-up'
  | 'export-audit';

export type SubscriptionSubnavItem = {
  id: SubscriptionSubnavItemId;
  label: string;
  shortLabel?: string;
  href: string;
  description: string;
  status: SubscriptionSubnavStatus;
  attentionCount?: number;
};

export const SUBSCRIPTION_SUBNAV_ITEMS: SubscriptionSubnavItem[] = [
  {
    id: 'command-center',
    label: 'Command Center',
    shortLabel: 'Command',
    href: '/subscriptions',
    description: 'What changed in subscriptions today?',
    status: 'live',
  },
  {
    id: 'outcomes',
    label: 'Outcome Summary',
    shortLabel: 'Outcomes',
    href: '/subscriptions/outcomes',
    description: 'Did the call end in confirmed save / cancel / pending?',
    status: 'live',
  },
  {
    id: 'non-cancellation',
    label: 'Non-Cancellation Actions',
    shortLabel: 'Non-Cancel',
    href: '/subscriptions/non-cancellation',
    description: 'Are skip / pause / frequency-change / SKU swap completing?',
    status: 'planned',
  },
  {
    id: 'cancellation-intake',
    label: 'Cancellation Intake',
    shortLabel: 'Cancel Intake',
    href: '/subscriptions/cancellation-intake',
    description: 'Which cancel reasons are coming in?',
    status: 'planned',
  },
  {
    id: 'cost-too-high',
    label: 'Cost Too High Funnel',
    shortLabel: 'Cost Too High',
    href: '/subscriptions/cost-too-high',
    description: 'Frequency change → 25% off → confirmed cancel — where do we lose them?',
    status: 'planned',
  },
  {
    id: 'business-value',
    label: 'Business Value',
    shortLabel: 'Value',
    href: '/subscriptions/business-value',
    description: 'Calls we saved — in dollars.',
    status: 'live',
  },
  {
    id: 'portal-handoff',
    label: 'Portal & Handoff',
    shortLabel: 'Portal',
    href: '/subscriptions/portal-handoff',
    description: 'Link sent vs confirmed completion vs failure.',
    status: 'planned',
  },
  {
    id: 'containment',
    label: 'Containment Quality',
    shortLabel: 'Containment',
    href: '/subscriptions/containment',
    description: 'True containment: contained without repeat contact.',
    status: 'planned',
  },
  {
    id: 'follow-up',
    label: 'Follow-Up Queue',
    shortLabel: 'Follow-Up',
    href: '/subscriptions/follow-up',
    description: 'Calls that need a human.',
    status: 'live',
  },
  {
    id: 'export-audit',
    label: 'Export & Audit',
    shortLabel: 'Export',
    href: '/subscriptions/export-audit',
    description: 'Pull a governed export.',
    status: 'planned',
  },
];

export function findSubscriptionSubnavItem(
  id: SubscriptionSubnavItemId,
): SubscriptionSubnavItem | undefined {
  return SUBSCRIPTION_SUBNAV_ITEMS.find((item) => item.id === id);
}
