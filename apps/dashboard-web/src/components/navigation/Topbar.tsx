import { useLocation } from 'react-router-dom';
import { Bell, Calendar, Filter, RefreshCw, Search, ShieldCheck } from 'lucide-react';
import { useDashboardFilters } from '../../context/DashboardFilterContext';
import { NAV_ITEMS } from '../../constants/navigation';

const PAGE_META: Record<string, { eyebrow: string; title: string }> = {
  '/overview': { eyebrow: 'Executive command center', title: 'Cross-platform support intelligence' },
  '/subscriptions': { eyebrow: 'Subscription analytics', title: 'Stay.ai subscription outcome intelligence' },
  '/cancellations': { eyebrow: 'Cancellation analytics', title: 'Confirmed cancellation outcomes' },
  '/retention': { eyebrow: 'Retention analytics', title: 'Save rate and retention journey' },
  '/order-status': { eyebrow: 'Order status', title: 'Shopify order context analytics' },
  '/escalations': { eyebrow: 'Escalations', title: 'Live-agent handoff quality' },
  '/data-quality': { eyebrow: 'Data quality', title: 'Source freshness, contracts, and trust' },
  '/governance': { eyebrow: 'Governance', title: 'RBAC, exports, and audit controls' },
  '/exports': { eyebrow: 'Governance', title: 'Export readiness and audit metadata' },
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
  const meta =
    PAGE_META[location.pathname] ??
    (fallback
      ? { eyebrow: 'Internal analytics', title: fallback.label }
      : { eyebrow: 'Internal analytics', title: 'Phone Support Analytics' });

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="eyebrow">{meta.eyebrow}</p>
            <h1 className="display-title mt-1 truncate text-[22px] sm:text-2xl">{meta.title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-sm text-slate-600 shadow-sm md:flex">
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-xs">Search metric, formula, audit ID…</span>
              <span className="ml-2 rounded-md border border-slate-200 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
                ⌘K
              </span>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Sync
            </button>
            <button
              type="button"
              className="relative inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              aria-label="Notifications"
            >
              <Bell className="h-3.5 w-3.5" />
              <span className="absolute right-1.5 top-1.5 inline-flex h-1.5 w-1.5 rounded-full bg-rose-500" />
            </button>
            <div
              className="hidden items-center gap-2 rounded-full bg-slate-950 px-2 py-1 text-xs font-medium text-white shadow-sm md:flex"
              title="Signed-in operator"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 text-[11px] font-bold uppercase">
                KS
              </span>
              <span className="pr-2 text-slate-200">Analytics ops</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-2.5 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700 ring-1 ring-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5" /> No-drift enforced
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-1 font-semibold text-violet-700 ring-1 ring-violet-200">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500 pulse-dot" /> Stay.ai source of truth
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
