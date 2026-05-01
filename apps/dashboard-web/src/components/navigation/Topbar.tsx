import { ShieldCheck } from 'lucide-react';
import { useDashboardFilters } from '../../context/DashboardFilterContext';

export default function Topbar() {
  const { filters, resetFilters } = useDashboardFilters();
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Internal dashboard</p>
          <h1 className="text-lg font-semibold text-slate-950">Analytics implementation foundation</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700 ring-1 ring-emerald-200">
            <ShieldCheck className="h-3.5 w-3.5" /> no-drift enabled
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1">{filters.dateRange}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">{filters.platform}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">{filters.segment}</span>
          <button type="button" onClick={resetFilters} className="rounded-full border border-slate-200 px-3 py-1 font-semibold text-slate-700 hover:bg-slate-50">
            Reset
          </button>
        </div>
      </div>
    </header>
  );
}
