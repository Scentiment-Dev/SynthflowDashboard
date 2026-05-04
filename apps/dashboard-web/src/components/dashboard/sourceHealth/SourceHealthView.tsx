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
        className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between"
      >
        <div className="flex items-center gap-3 text-sm text-slate-700">
          {state.loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-slate-500" aria-hidden />
              <span>Loading source-health contract from analytics-api…</span>
            </>
          ) : state.source === 'api' ? (
            <>
              <Wifi className="h-4 w-4 text-emerald-600" aria-hidden />
              <span>
                Live API contract loaded. Overall health:{' '}
                <strong>{state.data.overall_source_health}</strong>.
              </span>
            </>
          ) : state.permissionDenied ? (
            <>
              <ServerCrash className="h-4 w-4 text-rose-600" aria-hidden />
              <span>
                Permission denied by server: rendering shared-contract preview only. UI does not
                bypass server-side authorization.
              </span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 text-amber-600" aria-hidden />
              <span>
                Contract preview from fixture (analytics-api unreachable
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
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
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
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                  active
                    ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
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
