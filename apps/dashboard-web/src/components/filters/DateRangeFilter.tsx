import { Calendar } from 'lucide-react';
import { useDashboardFilters } from '../../context/DashboardFilterContext';
import type { DashboardFilters } from '../../types/analytics';

const options: Array<{ label: string; value: DashboardFilters['dateRange'] }> = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
];

export default function DateRangeFilter() {
  const { filters, setDateRange } = useDashboardFilters();
  return (
    <label className="block">
      <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
        <Calendar className="h-3 w-3" /> Date Range
      </span>
      <select
        value={filters.dateRange}
        onChange={(event) => setDateRange(event.target.value as DashboardFilters['dateRange'])}
        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 outline-none ring-violet-200 transition hover:border-slate-300 focus:border-violet-400 focus:ring-4"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
