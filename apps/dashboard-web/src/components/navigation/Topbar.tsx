import { useLocation } from 'react-router-dom';
import { Calendar, Filter, ShieldCheck } from 'lucide-react';
import { useDashboardFilters } from '../../context/DashboardFilterContext';
import { NAV_ITEMS } from '../../constants/navigation';

const PAGE_META: Record<string, { eyebrow: string; title: string }> = {
  '/overview': { eyebrow: 'Today, across support', title: 'What changed in support today?' },
  '/subscriptions': {
    eyebrow: 'Subscription analytics',
    title: 'Command Center',
  },
  '/subscriptions/outcomes': {
    eyebrow: 'Subscription analytics',
    title: 'Outcomes',
  },
  '/subscriptions/non-cancellation': {
    eyebrow: 'Subscription analytics',
    title: 'Non-Cancellation Actions',
  },
  '/subscriptions/cancellation-intake': {
    eyebrow: 'Subscription analytics',
    title: 'Cancellation Intake',
  },
  '/subscriptions/cost-too-high': {
    eyebrow: 'Subscription analytics',
    title: 'Cost Too High retention funnel',
  },
  '/subscriptions/business-value': {
    eyebrow: 'Subscription analytics',
    title: 'Business Value & Cost Savings',
  },
  '/subscriptions/portal-handoff': {
    eyebrow: 'Subscription analytics',
    title: 'Portal Handoff',
  },
  '/subscriptions/containment': {
    eyebrow: 'Subscription analytics',
    title: 'Containment quality',
  },
  '/subscriptions/follow-up': {
    eyebrow: 'Subscription analytics',
    title: 'Follow-Up Queue',
  },
  '/subscriptions/export-audit': {
    eyebrow: 'Subscription analytics',
    title: 'Export & Audit',
  },
  '/subscriptions/diagnostics': {
    eyebrow: 'Subscription analytics',
    title: 'Diagnostics (operator-only)',
  },
  '/cancellations': { eyebrow: 'Confirmed cancellations', title: 'Where customers actually cancelled' },
  '/retention': { eyebrow: 'Calls we saved', title: 'Where we kept the subscription' },
  '/order-status': { eyebrow: 'Order status', title: 'Shopify order context analytics' },
  '/escalations': { eyebrow: 'Escalations', title: 'Live-agent handoff quality' },
  '/data-quality': { eyebrow: 'Data quality', title: 'How fresh is our data?' },
  '/governance': { eyebrow: 'Governance', title: 'Who can see and export what' },
  '/exports': { eyebrow: 'Exports', title: 'Recent exports and audit trail' },
};

const PLATFORM_LABEL: Record<string, string> = {
  all: 'All platforms',
  stayai: 'Stay.ai',
  shopify: 'Shopify',
  synthflow: 'Synthflow',
  portal: 'Portal',
  live_agent: 'Live agent',
};

const SEGMENT_LABEL: Record<string, string> = {
  all: 'All journeys',
  subscriptions: 'Subscriptions',
  cancellations: 'Cancellations',
  order_status: 'Order status',
  escalations: 'Escalations',
};

const RANGE_LABEL: Record<string, string> = {
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
  '90d': 'Last 90 days',
};

export default function Topbar() {
  const { filters, resetFilters } = useDashboardFilters();
  const location = useLocation();
  const fallback = NAV_ITEMS.find((item) => item.href === location.pathname);
  // Eyebrow scope rule: only show "Subscription analytics" when the current
  // route is actually under /subscriptions/*. The dashboard also covers
  // overview, cancellations, retention, order status, escalations, data
  // quality, governance, and exports, so for any non-subscription route the
  // generic "Internal analytics" label is the safe fallback.
  const isSubscriptionRoute = location.pathname.startsWith('/subscriptions');
  const fallbackEyebrow = isSubscriptionRoute ? 'Subscription analytics' : 'Internal analytics';
  const meta =
    PAGE_META[location.pathname] ??
    (fallback
      ? { eyebrow: fallbackEyebrow, title: fallback.label }
      : { eyebrow: fallbackEyebrow, title: fallbackEyebrow });

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <p className="eyebrow">{meta.eyebrow}</p>
          <h1 className="display-title mt-1 truncate text-[22px] sm:text-2xl">{meta.title}</h1>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-2.5 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700 ring-1 ring-emerald-200"
              title="These metrics use the same definitions as the official rulebook."
            >
              <ShieldCheck className="h-3.5 w-3.5" /> Trusted definitions on
            </span>
            <span
              className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-1 font-semibold text-violet-700 ring-1 ring-violet-200"
              title="Stay.ai is the system that owns the official subscription record."
            >
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500 pulse-dot" /> Stay.ai · source of truth
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-600">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              {RANGE_LABEL[filters.dateRange] ?? filters.dateRange}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-600">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              {PLATFORM_LABEL[filters.platform] ?? filters.platform}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-600">
              {SEGMENT_LABEL[filters.segment] ?? filters.segment}
            </span>
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Reset filters
          </button>
        </div>
      </div>
    </header>
  );
}
