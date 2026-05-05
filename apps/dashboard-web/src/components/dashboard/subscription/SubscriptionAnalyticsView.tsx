import { useMemo, useState } from 'react';
import { Loader2, ServerCrash, Wifi, WifiOff } from 'lucide-react';
import { useSubscriptionAnalytics } from '../../../hooks/useSubscriptionAnalytics';
import {
  deriveSubscriptionStateAlerts,
} from '../../../utils/subscriptionAnalyticsState';
import type { SubscriptionAnalyticsScenario } from '../../../types/subscriptionAnalytics';
import SubscriptionFinalStateBanner from './SubscriptionFinalStateBanner';
import SubscriptionOverviewGrid from './SubscriptionOverviewGrid';
import PortalJourneyPanel from './PortalJourneyPanel';
import ShopifyContextPanel from './ShopifyContextPanel';
import SynthflowJourneyPanel from './SynthflowJourneyPanel';
import SourceConfirmationPanel from './SourceConfirmationPanel';
import SubscriptionMetricMetadataPanel from './SubscriptionMetricMetadataPanel';
import SubscriptionStateAlertsPanel from './SubscriptionStateAlertsPanel';

const SCENARIOS: Array<{ id: SubscriptionAnalyticsScenario; label: string; helper: string }> = [
  {
    id: 'baseline',
    label: 'Baseline',
    helper: 'Stay.ai-confirmed retained outcome with low pending counts.',
  },
  {
    id: 'missing_stayai_confirmation',
    label: 'Missing Stay.ai confirmation',
    helper: 'No Stay.ai final state — UI must show blocked outcomes and low trust.',
  },
];

export default function SubscriptionAnalyticsView() {
  const [scenario, setScenario] = useState<SubscriptionAnalyticsScenario>('baseline');
  const state = useSubscriptionAnalytics(scenario);
  const alerts = useMemo(
    () =>
      deriveSubscriptionStateAlerts(state.data, {
        error: state.error,
        permissionDenied: state.permissionDenied,
        loading: state.loading,
        source: state.source,
      }),
    [state.data, state.error, state.permissionDenied, state.loading, state.source],
  );

  return (
    <div className="space-y-6">
      <section
        data-testid="subscription-analytics-status-bar"
        className="surface-card flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between"
      >
        <div className="flex items-center gap-3 text-sm text-slate-700">
          {state.loading ? (
            <>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-50 ring-1 ring-slate-200">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-500" aria-hidden />
              </span>
              <span>Loading subscription analytics contract from analytics-api…</span>
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
                <strong>Contract preview from fixture</strong> (analytics-api unreachable
                {state.error ? `: ${state.error}` : ''}). Values are non-production.
              </span>
            </>
          )}
        </div>
        <fieldset
          aria-label="Contract scenario"
          className="flex flex-wrap items-center gap-2 text-sm"
        >
          <legend className="sr-only">Contract scenario</legend>
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

      <SubscriptionFinalStateBanner data={state.data} />
      <SubscriptionStateAlertsPanel alerts={alerts} />
      <SubscriptionOverviewGrid overview={state.data.subscription_overview} />
      <section className="grid gap-4 xl:grid-cols-2">
        <PortalJourneyPanel portal={state.data.portal_journey} />
        <ShopifyContextPanel shopify={state.data.shopify_context} />
      </section>
      <SynthflowJourneyPanel journey={state.data.synthflow_journey} />
      <SourceConfirmationPanel sourceConfirmation={state.data.source_confirmation} />
      <SubscriptionMetricMetadataPanel metadata={state.data.metric_metadata} />
    </div>
  );
}
