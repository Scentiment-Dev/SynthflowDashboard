/**
 * Cycle 007 Subscription IA v2 — single source of truth for the 10 required
 * subscription subpages. The Cycle 007 prototype renders this list as the
 * SubscriptionSubnav under the existing /subscriptions hero. Items marked as
 * `planned` render as disabled pills with a "Planned" chip; the only
 * `prototype` item in Cycle 007 is `command-center`.
 *
 * The IA v2 spec lives at:
 *   docs/07_dashboard_ui_ux/subscription_analytics_information_architecture_v2.md
 *
 * The wireframe + component contracts live at:
 *   project-management/reports/cycle-007/design/subscription_ia_v2_wireframe_spec.md
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
    status: 'prototype',
  },
  {
    id: 'outcomes',
    label: 'Outcome Summary',
    shortLabel: 'Outcomes',
    href: '/subscriptions/outcomes',
    description: 'Did calls end in confirmed save / cancel / pending?',
    status: 'planned',
  },
  {
    id: 'non-cancellation',
    label: 'Non-Cancellation Actions',
    shortLabel: 'Non-Cancel',
    href: '/subscriptions/non-cancellation',
    description: 'Skip, pause, frequency change, address change, SKU swap, reactivate, one-time add-on.',
    status: 'planned',
  },
  {
    id: 'cancellation-intake',
    label: 'Cancellation Intake',
    shortLabel: 'Cancel Intake',
    href: '/subscriptions/cancellation-intake',
    description: 'Which cancel reasons are coming in and where is the path going?',
    status: 'planned',
  },
  {
    id: 'cost-too-high',
    label: 'Cost Too High Funnel',
    shortLabel: 'Cost Too High',
    href: '/subscriptions/cost-too-high',
    description: 'Frequency change → 25% off → confirmed cancellation if both declined.',
    status: 'planned',
  },
  {
    id: 'business-value',
    label: 'Business Value',
    shortLabel: 'Value',
    href: '/subscriptions/business-value',
    description: 'Net business value: gross protected − offer cost + support avoided.',
    status: 'planned',
  },
  {
    id: 'portal-handoff',
    label: 'Portal + Handoff',
    shortLabel: 'Portal',
    href: '/subscriptions/portal-handoff',
    description: 'Link sent vs confirmed completion vs failure mode.',
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
    description: 'Who needs a human, and which were the failures?',
    status: 'planned',
  },
  {
    id: 'export-audit',
    label: 'Export + Audit',
    shortLabel: 'Export',
    href: '/subscriptions/export-audit',
    description: 'Pull a governed export with manifest, fingerprint, and audit reference.',
    status: 'planned',
  },
];

export function findSubscriptionSubnavItem(
  id: SubscriptionSubnavItemId,
): SubscriptionSubnavItem | undefined {
  return SUBSCRIPTION_SUBNAV_ITEMS.find((item) => item.id === id);
}
