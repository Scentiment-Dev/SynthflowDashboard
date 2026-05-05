import { useMemo, useState } from 'react';
import { Loader2, ServerCrash, Wifi, WifiOff } from 'lucide-react';
import { useSubscriptionSourceHealth } from '../../../hooks/useSubscriptionSourceHealth';
import {
  activeVisualStates,
  deriveSourceHealthAlerts,
} from '../../../utils/sourceHealthState';
import type { SourceHealthScenario } from '../../../types/sourceHealth';
import SourceHealthOverviewBar from './SourceHealthOverviewBar';
import SourceHealthAlertsPanel from './SourceHealthAlertsPanel';
import SourceHealthCard from './SourceHealthCard';
import FreshnessStateLegend from './FreshnessStateLegend';
import LineageConflictPanel from './LineageConflictPanel';

const SCENARIOS: Array<{ id: SourceHealthScenario; label: string; helper: string }> = [
  {
    id: 'baseline',
    label: 'Baseline',
    helper: 'Stay.ai-confirmed final state with portal completion still pending.',
  },
  {
    id: 'missing_stayai_final_state',
    label: 'Missing Stay.ai final state',
    helper: 'Stay.ai stale and unconfirmed; final outcome remains unknown.',
  },
  {
    id: 'failing_quality_with_missing_stayai',
    label: 'Failing data quality',
    helper: 'Synthflow data quality failing while Stay.ai is also missing.',
  },
  {
    id: 'conflicting_sources',
    label: 'Conflicts',
    helper: 'Cross-source disagreements logged; Stay.ai authority preserved.',
  },
];

export default function SourceHealthView() {
  const [scenario, setScenario] = useState<SourceHealthScenario>('baseline');
  const state = useSubscriptionSourceHealth(scenario);
  const alerts = useMemo(
    () =>
      deriveSourceHealthAlerts(state.data, {
        error: state.error,
        permissionDenied: state.permissionDenied,
        loading: state.loading,
        source: state.source,
      }),
    [state.data, state.error, state.permissionDenied, state.loading, state.source],
  );
  const visualStates = useMemo(() => activeVisualStates(state.data), [state.data]);

  return (
    <div data-testid="source-health-view" className="space-y-6">
      <section
        data-testid="source-health-status-bar"
        className="surface-card flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between"
      >
        <div className="flex items-center gap-3 text-sm text-slate-700">
          {state.loading ? (
            <>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-50 ring-1 ring-slate-200">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-500" aria-hidden />
              </span>
              <span>Loading source-health contract from analytics-api…</span>
            </>
          ) : state.source === 'api' ? (
            <>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-200">
                <Wifi className="h-3.5 w-3.5 text-emerald-700" aria-hidden />
              </span>
              <span>
                <strong>Live API contract loaded.</strong> Overall health:{' '}
                <span className="font-semibold text-slate-900">
                  {state.data.overall_source_health}
                </span>
                .
              </span>
            </>
          ) : state.permissionDenied ? (
            <>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-50 ring-1 ring-rose-200">
                <ServerCrash className="h-3.5 w-3.5 text-rose-700" aria-hidden />
              </span>
              <span>
                <strong>Permission denied by server</strong>: rendering shared-contract preview
                only. UI does not bypass server-side authorization.
              </span>
            </>
          ) : (
            <>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 ring-1 ring-amber-200">
                <WifiOff className="h-3.5 w-3.5 text-amber-700" aria-hidden />
              </span>
              <span>
                <strong>Contract preview from fixture</strong> (analytics-api unreachable
                {state.error ? `: ${state.error}` : ''}). Values are non-production.
              </span>
            </>
          )}
        </div>
        <fieldset
          aria-label="Source-health scenario"
          className="flex flex-wrap items-center gap-2 text-sm"
        >
          <legend className="sr-only">Source-health scenario</legend>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Scenario
          </span>
          {SCENARIOS.map((option) => {
            const active = option.id === scenario;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setScenario(option.id)}
                aria-pressed={active}
                title={option.helper}
                data-testid={`source-health-scenario-${option.id}`}
                className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold transition ${
                  active
                    ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </fieldset>
      </section>

      <SourceHealthOverviewBar data={state.data} />

      <SourceHealthAlertsPanel alerts={alerts} />

      <section
        data-testid="source-health-card-grid"
        className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-4"
      >
        {state.data.sources.map((source) => (
          <SourceHealthCard key={source.source_system} source={source} />
        ))}
      </section>

      <FreshnessStateLegend activeStates={visualStates} />

      <LineageConflictPanel data={state.data} />
    </div>
  );
}
