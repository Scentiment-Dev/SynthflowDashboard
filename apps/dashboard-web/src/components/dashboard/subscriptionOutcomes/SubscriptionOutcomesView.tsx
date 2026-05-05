import { useMemo, useState } from 'react';
import { Loader2, ServerCrash, ShieldCheck, Sparkles, Wifi, WifiOff } from 'lucide-react';
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

  const totalContacts = state.data.metrics.subscription_contacts_total;

  return (
    <section
      data-testid="subscription-outcome-analytics-section"
      aria-labelledby="subscription-outcome-section-heading"
      className="space-y-5"
    >
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="eyebrow inline-flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-violet-500" /> Outcome intelligence · Stay.ai
            authoritative
          </p>
          <h2
            id="subscription-outcome-section-heading"
            className="display-title mt-2 text-xl tracking-tight text-slate-950 sm:text-2xl"
          >
            Subscription outcome analytics
            <span className="sr-only"> · Cycle 005 subscription outcome analytics</span>
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            The first production-priority subscription analytics module. Every metric on this view
            carries a definition, source authority, trust label, and audit reference. Stay.ai owns
            outcome truth; Shopify is context only; portal link delivery is not portal completion.
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 lg:items-end">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-[11px] font-semibold text-violet-700 ring-1 ring-violet-200">
            <ShieldCheck className="h-3 w-3" /> Stay.ai final authority
          </span>
          <p className="metric-value text-2xl text-slate-900">
            {totalContacts.toLocaleString()}
            <span className="ml-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              subscription contacts in scope
            </span>
          </p>
        </div>
      </header>

      <section
        data-testid="subscription-outcome-status-bar"
        className="surface-card flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between"
      >
        <div className="flex items-start gap-3 text-sm text-slate-700 md:items-center">
          {state.loading ? (
            <>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-50 ring-1 ring-slate-200">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-500" aria-hidden />
              </span>
              <span>Loading subscription outcomes from analytics-api…</span>
            </>
          ) : state.source === 'api' ? (
            <>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-200">
                <Wifi className="h-3.5 w-3.5 text-emerald-700" aria-hidden />
              </span>
              <span>
                <strong>Live API contract loaded.</strong> Stay.ai source confirmation:{' '}
                <span className="font-semibold text-slate-900">
                  {state.data.source_confirmation_status}
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
                <strong>Contract preview from fixture</strong> (
                {state.error?.toLowerCase().includes('shape mismatch')
                  ? 'analytics-api returned a malformed contract'
                  : 'analytics-api unreachable'}
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
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
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
