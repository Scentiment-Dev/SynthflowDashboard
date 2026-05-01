import {
  BarChart3,
  Boxes,
  ClipboardCheck,
  DatabaseZap,
  FileLock2,
  Gauge,
  GitBranch,
  Headphones,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import type { DashboardModule } from '../types/metrics';

export type NavItem = {
  label: string;
  href: string;
  module: DashboardModule;
  icon: LucideIcon;
  owner: 'Agent A' | 'Agent B' | 'Agent C';
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'Overview', href: '/overview', module: 'overview', icon: Gauge, owner: 'Agent B' },
  { label: 'Subscriptions', href: '/subscriptions', module: 'subscriptions', icon: Boxes, owner: 'Agent B' },
  { label: 'Cancellations', href: '/cancellations', module: 'cancellations', icon: GitBranch, owner: 'Agent B' },
  { label: 'Retention', href: '/retention', module: 'retention', icon: BarChart3, owner: 'Agent B' },
  { label: 'Order Status', href: '/order-status', module: 'order_status', icon: ClipboardCheck, owner: 'Agent B' },
  { label: 'Escalations', href: '/escalations', module: 'escalations', icon: Headphones, owner: 'Agent B' },
  { label: 'Data Quality', href: '/data-quality', module: 'data_quality', icon: DatabaseZap, owner: 'Agent C' },
  { label: 'Governance', href: '/governance', module: 'governance', icon: ShieldCheck, owner: 'Agent C' },
  { label: 'Exports', href: '/exports', module: 'governance', icon: FileLock2, owner: 'Agent C' },
];

export const NO_DRIFT_RULES = [
  'Portal success requires confirmed portal completion, not link sent.',
  'Abandoned/drop-off and unresolved calls are excluded from successful containment.',
  'Stay.ai remains the source of truth for subscription state/action/cancellation/save outcomes.',
  'Shopify remains the source of truth for order/product/customer/order-status context.',
  'Save requires confirmed retained subscription outcome.',
  'Confirmed cancellation requires Stay.ai cancelled state or approved official completion path.',
  'Cost Too High cancellation flow sequence is frequency change offer → 25% off offer → confirmed cancellation if both are declined.',
  'Trust labels are system-calculated and cannot be manually elevated.',
  'Exports must include filters, definitions, trust labels, freshness, formula versions, owner, timestamp, fingerprint, and audit reference.',
  'Permissions are enforced server-side using explicit deny.',
];
