import { Layers } from 'lucide-react';
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
      <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
        <Layers className="h-3 w-3" /> Platform
      </span>
      <select
        value={filters.platform}
        onChange={(event) => setPlatform(event.target.value as DashboardFilters['platform'])}
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
