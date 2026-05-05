import { Compass } from 'lucide-react';
import { useDashboardFilters } from '../../context/DashboardFilterContext';
import type { DashboardFilters } from '../../types/analytics';

const options: Array<{ label: string; value: DashboardFilters['segment'] }> = [
  { label: 'All customer journeys', value: 'all' },
  { label: 'Subscriptions', value: 'subscriptions' },
  { label: 'Cancellations', value: 'cancellations' },
  { label: 'Order status', value: 'order_status' },
  { label: 'Escalations', value: 'escalations' },
];

export default function SegmentFilter() {
  const { filters, setSegment } = useDashboardFilters();
  return (
    <label className="block">
      <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
        <Compass className="h-3 w-3" /> Segment
      </span>
      <select
        value={filters.segment}
        onChange={(event) => setSegment(event.target.value as DashboardFilters['segment'])}
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
