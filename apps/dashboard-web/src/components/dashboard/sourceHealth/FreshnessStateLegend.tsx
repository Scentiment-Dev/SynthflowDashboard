import {
  SOURCE_VISUAL_STATE_LIBRARY,
  type SourceVisualState,
} from '../../../utils/sourceHealthState';
import { statusToneClasses } from '../../../utils/subscriptionAnalyticsState';

export default function FreshnessStateLegend({
  activeStates,
}: {
  activeStates: SourceVisualState[];
}) {
  const activeSet = new Set(activeStates);
  return (
    <section
      data-testid="freshness-state-legend"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <header className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-950">Freshness and data quality states</h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
            Each state is system-derived. Active states for the current contract response are
            highlighted; inactive states are listed for operator reference.
          </p>
        </div>
        <span
          data-testid="freshness-state-legend-active-count"
          className="inline-flex w-fit items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200"
        >
          {activeSet.size} active
        </span>
      </header>
      <ul className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-2">
        {SOURCE_VISUAL_STATE_LIBRARY.map((meta) => {
          const isActive = activeSet.has(meta.id);
          return (
            <li
              key={meta.id}
              data-testid={`freshness-state-${meta.id}`}
              data-active={isActive ? 'true' : 'false'}
              className={`relative rounded-2xl border p-4 ${
                isActive ? statusToneClasses(meta.tone) : 'border-slate-200 bg-slate-50 text-slate-500'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold">{meta.label}</p>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${
                    isActive
                      ? 'bg-white/80 text-slate-900 ring-slate-300'
                      : 'bg-slate-100 text-slate-500 ring-slate-200'
                  }`}
                >
                  {isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 opacity-90">{meta.detail}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
