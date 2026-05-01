import type { SubscriptionOverviewMetrics } from '../../../types/subscriptionAnalytics';
import { formatCount } from '../../../utils/subscriptionAnalyticsState';

type OverviewTile = {
  key: keyof SubscriptionOverviewMetrics;
  label: string;
  source: string;
  description: string;
  emphasis: 'primary' | 'cancellation' | 'retention' | 'pending';
};

const TILES: OverviewTile[] = [
  {
    key: 'subscription_overview_count',
    label: 'Subscriptions in scope',
    source: 'Stay.ai',
    description: 'All subscription records visible in current contract response.',
    emphasis: 'primary',
  },
  {
    key: 'cancellation_requests_count',
    label: 'Cancellation requests',
    source: 'Stay.ai + Synthflow',
    description: 'Customer-initiated cancellation attempts (request only — not yet confirmed).',
    emphasis: 'cancellation',
  },
  {
    key: 'confirmed_cancellations_count',
    label: 'Confirmed cancellations',
    source: 'Stay.ai',
    description: 'Stay.ai-confirmed cancelled state. Approved official paths only.',
    emphasis: 'cancellation',
  },
  {
    key: 'save_retention_attempts_count',
    label: 'Save / retention attempts',
    source: 'Stay.ai + Synthflow',
    description: 'Attempts where retention offers were exposed to the subscriber.',
    emphasis: 'retention',
  },
  {
    key: 'confirmed_retained_subscriptions_count',
    label: 'Confirmed retained subscriptions',
    source: 'Stay.ai',
    description: 'Save outcome counted only after Stay.ai confirms retained subscription state.',
    emphasis: 'retention',
  },
  {
    key: 'pending_stayai_confirmation_count',
    label: 'Pending Stay.ai confirmation',
    source: 'Stay.ai',
    description: 'Records awaiting Stay.ai final state. Not counted as success or cancellation.',
    emphasis: 'pending',
  },
];

const emphasisClasses: Record<OverviewTile['emphasis'], string> = {
  primary: 'border-slate-200 bg-white text-slate-950',
  cancellation: 'border-rose-200 bg-rose-50 text-rose-950',
  retention: 'border-emerald-200 bg-emerald-50 text-emerald-950',
  pending: 'border-amber-200 bg-amber-50 text-amber-950',
};

export default function SubscriptionOverviewGrid({
  overview,
}: {
  overview: SubscriptionOverviewMetrics;
}) {
  return (
    <section
      data-testid="subscription-overview-grid"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <header className="mb-4">
        <h3 className="text-base font-semibold text-slate-950">Subscription overview</h3>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Stay.ai-controlled subscription counts. Requests are not outcomes; only confirmed Stay.ai
          state finalizes cancellation or retention.
        </p>
      </header>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {TILES.map((tile) => (
          <article
            key={tile.key}
            data-testid={`overview-tile-${tile.key}`}
            className={`rounded-2xl border p-4 shadow-sm ${emphasisClasses[tile.emphasis]}`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide opacity-80">{tile.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">{formatCount(overview[tile.key])}</p>
            <p className="mt-3 text-xs uppercase tracking-wide opacity-80">Source: {tile.source}</p>
            <p className="mt-2 text-sm leading-6 opacity-90">{tile.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
