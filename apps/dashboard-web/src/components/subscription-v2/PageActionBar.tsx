import { Download, Filter, X } from 'lucide-react';
import StatusPill from '../design/StatusPill';
import { useSubscriptionAdvancedFilters } from '../../hooks/useSubscriptionAdvancedFilters';

type ActiveFilterChip = {
  id: string;
  label: string;
};

type PageActionBarProps = {
  activeFilters?: ActiveFilterChip[];
  onOpenFilters?: () => void;
  // eslint-disable-next-line no-unused-vars
  onClearFilter?: (_filterId: string) => void;
  onClearAllFilters?: () => void;
  onExport?: () => void;
  exportLabel?: string;
  exportDisabledReason?: string;
  filterDisabledReason?: string;
};

/**
 * Cycle 008 page-level action bar. Provides the integration seams Agent C will
 * wire to the Advanced Filter Drawer and the Export Drawer in a follow-up PR.
 *
 * When the drawers are not yet mounted (Agent C's PR has not landed), the
 * buttons render in an "available" state so the support user knows the
 * affordances exist; the click handlers are wired by the parent page when the
 * drawer is mounted, so this component never lies about a feature being live.
 */
export default function PageActionBar({
  activeFilters = [],
  onOpenFilters,
  onClearFilter,
  onClearAllFilters,
  onExport,
  exportLabel = 'Export this view',
  exportDisabledReason,
  filterDisabledReason,
}: PageActionBarProps) {
  const advancedFilters = useSubscriptionAdvancedFilters();
  const filterCount = activeFilters.length;
  const filterButtonDisabled = Boolean(filterDisabledReason);
  const exportButtonDisabled = Boolean(exportDisabledReason);

  return (
    <section
      aria-label="Page actions"
      data-testid="subscription-page-action-bar"
      className="surface-card flex flex-col gap-3 px-4 py-3 sm:px-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenFilters}
            disabled={filterButtonDisabled}
            aria-disabled={filterButtonDisabled || undefined}
            title={filterDisabledReason}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 ${
              filterButtonDisabled
                ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400'
                : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Filter className="h-3.5 w-3.5" />
            Filter the data
            {filterCount > 0 ? (
              <span
                className="ml-1 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-violet-100 px-1 text-[10px] font-bold text-violet-700"
                aria-label={`${filterCount} filter${filterCount === 1 ? '' : 's'} active`}
              >
                {filterCount}
              </span>
            ) : null}
          </button>
          <StatusPill tone="neutral" size="sm">
            {advancedFilters.data.options.filter((opt) => opt.is_enabled).length} dimensions
            available
          </StatusPill>
          {advancedFilters.data.options.some((opt) => !opt.is_enabled) ? (
            <StatusPill tone="warning" size="sm">
              {advancedFilters.data.options.filter((opt) => !opt.is_enabled).length} not
              yet wired
            </StatusPill>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onExport}
          disabled={exportButtonDisabled}
          aria-disabled={exportButtonDisabled || undefined}
          title={exportDisabledReason}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 ${
            exportButtonDisabled
              ? 'cursor-not-allowed border border-slate-200 bg-slate-50 text-slate-400'
              : 'border border-slate-900 bg-slate-900 text-white hover:bg-slate-800'
          }`}
        >
          <Download className="h-3.5 w-3.5" />
          {exportLabel}
        </button>
      </div>

      {filterCount > 0 ? (
        <div
          aria-label="Active filters"
          className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-2"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Active filters
          </span>
          {activeFilters.map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => onClearFilter?.(chip.id)}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-slate-300 hover:bg-white"
              aria-label={`Remove filter ${chip.label}`}
            >
              {chip.label}
              <X className="h-3 w-3" />
            </button>
          ))}
          {onClearAllFilters ? (
            <button
              type="button"
              onClick={onClearAllFilters}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-900"
            >
              Clear all
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
