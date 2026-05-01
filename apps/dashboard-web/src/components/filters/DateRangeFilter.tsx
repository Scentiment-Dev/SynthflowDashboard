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
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Date Range</span>
      <select
        value={filters.dateRange}
        onChange={(event) => setDateRange(event.target.value as DashboardFilters['dateRange'])}
        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-slate-300 transition focus:ring-4"
      >
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}
