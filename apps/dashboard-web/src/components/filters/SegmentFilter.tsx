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
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Segment</span>
      <select
        value={filters.segment}
        onChange={(event) => setSegment(event.target.value as DashboardFilters['segment'])}
        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-slate-300 transition focus:ring-4"
      >
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}
