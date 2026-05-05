import type { SubscriptionOverviewMetrics } from '../../../types/subscriptionAnalytics';
import { formatMetricValue } from '../../../utils/formatters';

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
    description: 'All subscription records visible in the current contract response.',
    emphasis: 'primary',
  },
  {
    key: 'cancellation_requests_count',
    label: 'Cancellation requests',
    source: 'Stay.ai + Synthflow',
    description:
      'Customer-initiated cancellation attempts (request only — not yet confirmed).',
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
  cancellation: 'border-rose-200 bg-rose-50/70 text-rose-950',
  retention: 'border-emerald-200 bg-emerald-50/70 text-emerald-950',
  pending: 'border-amber-200 bg-amber-50/70 text-amber-950',
};

const emphasisAccent: Record<OverviewTile['emphasis'], string> = {
  primary: 'from-slate-400 to-slate-200',
  cancellation: 'from-rose-400 to-rose-200',
  retention: 'from-emerald-400 to-emerald-200',
  pending: 'from-amber-400 to-amber-200',
};

const emphasisLabel: Record<OverviewTile['emphasis'], string> = {
  primary: 'Stay.ai authoritative',
  cancellation: 'Cancellation track',
  retention: 'Retention track',
  pending: 'Pending Stay.ai final',
};

export default function SubscriptionOverviewGrid({
  overview,
}: {
  overview: SubscriptionOverviewMetrics;
}) {
  return (
    <section
      data-testid="subscription-overview-grid"
      className="surface-card p-5 sm:p-6"
    >
      <header className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Cycle 002 contract</p>
          <h3 className="display-title mt-1 text-base sm:text-lg">Subscription overview</h3>
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-600">
            Stay.ai-controlled subscription counts. Requests are not outcomes; only confirmed
            Stay.ai state finalizes a cancellation or a retention save.
          </p>
        </div>
      </header>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {TILES.map((tile) => (
          <article
            key={tile.key}
            data-testid={`overview-tile-${tile.key}`}
            className={`relative overflow-hidden rounded-2xl border p-4 ${emphasisClasses[tile.emphasis]}`}
          >
            <span
              aria-hidden
              className={`absolute inset-x-4 top-0 h-0.5 rounded-full bg-gradient-to-r ${emphasisAccent[tile.emphasis]}`}
            />
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-80">
              {tile.label}
            </p>
            <p className="metric-value mt-2 text-3xl">{formatMetricValue(overview[tile.key])}</p>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] opacity-70">
              {emphasisLabel[tile.emphasis]} · {tile.source}
            </p>
            <p className="mt-2 text-sm leading-6 opacity-90">{tile.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
