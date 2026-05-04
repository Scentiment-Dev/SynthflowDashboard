import { useMemo, useState } from 'react';
import { Loader2, ServerCrash, Wifi, WifiOff } from 'lucide-react';
import { useSubscriptionOutcomes } from '../../../hooks/useSubscriptionOutcomes';
import {
  buildSubscriptionOutcomeFunnel,
  buildSubscriptionOutcomeKpiCards,
  buildSubscriptionOutcomeRateCards,
  deriveSubscriptionOutcomeAlerts,
} from '../../../utils/subscriptionOutcomesState';
import type { SubscriptionOutcomesScenario } from '../../../types/subscriptionOutcomes';
import SubscriptionOutcomeKpiGrid from './SubscriptionOutcomeKpiGrid';
import SubscriptionOutcomeFunnel from './SubscriptionOutcomeFunnel';
import SubscriptionOutcomeAlertsPanel from './SubscriptionOutcomeAlertsPanel';
import SubscriptionOutcomeMetadataPanel from './SubscriptionOutcomeMetadataPanel';

const SCENARIOS: Array<{
  id: SubscriptionOutcomesScenario;
  label: string;
  helper: string;
}> = [
  {
    id: 'baseline',
    label: 'Baseline',
    helper: 'Stay.ai-confirmed mix of cancellation, retention, and pending outcomes.',
  },
  {
    id: 'pending_stayai_confirmation',
    label: 'Pending Stay.ai',
    helper: 'Stay.ai final state pending — outcomes blocked from finalization.',
  },
  {
    id: 'missing_stayai_final_state',
    label: 'Missing Stay.ai final state',
    helper: 'No Stay.ai final state — every outcome is unknown until confirmed.',
  },
  {
    id: 'empty',
    label: 'Empty',
    helper: 'No subscription contacts in scope for the current filters.',
  },
];

export default function SubscriptionOutcomesView() {
  const [scenario, setScenario] = useState<SubscriptionOutcomesScenario>('baseline');
  const state = useSubscriptionOutcomes(scenario);

  const kpiCards = useMemo(
    () => buildSubscriptionOutcomeKpiCards(state.data.metrics),
    [state.data.metrics],
  );
  const rateCards = useMemo(
    () => buildSubscriptionOutcomeRateCards(state.data.metrics),
    [state.data.metrics],
  );
  const funnelStages = useMemo(
    () => buildSubscriptionOutcomeFunnel(state.data.metrics),
    [state.data.metrics],
  );
  const alerts = useMemo(
    () =>
      deriveSubscriptionOutcomeAlerts(state.data, {
        loading: state.loading,
        error: state.error,
        source: state.source,
        permissionDenied: state.permissionDenied,
      }),
    [state.data, state.loading, state.error, state.source, state.permissionDenied],
  );

  return (
    <section
      data-testid="subscription-outcome-analytics-section"
      aria-labelledby="subscription-outcome-section-heading"
      className="space-y-5"
    >
      <header>
        <h2
          id="subscription-outcome-section-heading"
          className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500"
        >
          Cycle 005 subscription outcome analytics
        </h2>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
          First production-priority subscription analytics module. Stay.ai owns subscription
          outcome truth; Shopify is context only; portal link delivery is not portal completion.
          Every metric carries a definition, source authority, trust label, and audit reference.
        </p>
      </header>

      <section
        data-testid="subscription-outcome-status-bar"
        className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between"
      >
        <div className="flex items-start gap-3 text-sm text-slate-700 md:items-center">
          {state.loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-slate-500" aria-hidden />
              <span>Loading subscription outcomes from analytics-api…</span>
            </>
          ) : state.source === 'api' ? (
            <>
              <Wifi className="h-4 w-4 text-emerald-600" aria-hidden />
              <span>
                Live API contract loaded. Stay.ai source confirmation:{' '}
                <strong>{state.data.source_confirmation_status}</strong>.
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
          aria-label="Outcome contract scenario"
          className="flex flex-wrap items-center gap-2 text-sm"
        >
          <legend className="sr-only">Outcome contract scenario</legend>
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
                data-testid={`outcome-scenario-${option.id}`}
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

      <SubscriptionOutcomeAlertsPanel alerts={alerts} />
      <SubscriptionOutcomeKpiGrid cards={kpiCards} rateCards={rateCards} />
      <SubscriptionOutcomeFunnel stages={funnelStages} />
      <SubscriptionOutcomeMetadataPanel metadata={state.data.metadata} data={state.data} />
    </section>
  );
}
