import { useDashboardFilters } from '../../context/DashboardFilterContext';
import type { DashboardFilters } from '../../types/analytics';

const options: Array<{ label: string; value: DashboardFilters['platform'] }> = [
  { label: 'All platforms', value: 'all' },
  { label: 'Synthflow', value: 'synthflow' },
  { label: 'Stay.ai', value: 'stayai' },
  { label: 'Shopify', value: 'shopify' },
  { label: 'Portal', value: 'portal' },
  { label: 'Live agent / RingCX', value: 'live_agent' },
];

export default function PlatformFilter() {
  const { filters, setPlatform } = useDashboardFilters();
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Platform</span>
      <select
        value={filters.platform}
        onChange={(event) => setPlatform(event.target.value as DashboardFilters['platform'])}
        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-slate-300 transition focus:ring-4"
      >
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}
