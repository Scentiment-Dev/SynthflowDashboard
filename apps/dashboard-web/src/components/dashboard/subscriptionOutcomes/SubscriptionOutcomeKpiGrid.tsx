import { ShieldCheck, TrendingUp } from 'lucide-react';
import type {
  SubscriptionOutcomeKpiCard,
  SubscriptionOutcomeRateCard,
} from '../../../utils/subscriptionOutcomesState';
import {
  formatCount,
  funnelStageToneClasses,
  safeRatio,
} from '../../../utils/subscriptionOutcomesState';

const TONE_CLASS_MAP: Record<SubscriptionOutcomeKpiCard['tone'], string> = {
  primary: funnelStageToneClasses('primary'),
  cancellation: funnelStageToneClasses('cancellation'),
  retention: funnelStageToneClasses('retention'),
  context: funnelStageToneClasses('context'),
  unknown: funnelStageToneClasses('unknown'),
  pending: 'border-amber-200 bg-amber-50 text-amber-900',
  missing: 'border-rose-200 bg-rose-50 text-rose-900',
};

const TONE_BAR: Record<SubscriptionOutcomeKpiCard['tone'], string> = {
  primary: 'from-slate-500 to-slate-300',
  cancellation: 'from-rose-500 to-rose-300',
  retention: 'from-emerald-500 to-emerald-300',
  context: 'from-sky-500 to-sky-300',
  unknown: 'from-amber-500 to-amber-300',
  pending: 'from-amber-500 to-amber-300',
  missing: 'from-rose-500 to-rose-300',
};

const TONE_LABEL: Record<SubscriptionOutcomeKpiCard['tone'], string> = {
  primary: 'Stay.ai journey',
  cancellation: 'Cancellation',
  retention: 'Retention',
  context: 'Context',
  unknown: 'Pending / unknown',
  pending: 'Pending',
  missing: 'Missing',
};

export default function SubscriptionOutcomeKpiGrid({
  cards,
  rateCards,
}: {
  cards: SubscriptionOutcomeKpiCard[];
  rateCards: SubscriptionOutcomeRateCard[];
}) {
  const totalForShare = cards.find((card) => card.id === 'subscription_contacts_total')?.value ?? 0;

  return (
    <section
      data-testid="subscription-outcome-kpi-grid"
      className="surface-card space-y-6 p-5 sm:p-6"
    >
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="eyebrow flex items-center gap-1.5">
            <TrendingUp className="h-3 w-3" /> Outcome KPIs
          </p>
          <h3 className="display-title mt-1 text-base sm:text-lg">
            Subscription outcome KPIs
          </h3>
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-600">
            Stay.ai is the source of truth for subscription outcomes. Counts and rates below are
            scoped to the active contract response. Requests, link delivery, and Shopify context
            never finalize subscription state.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-[11px] font-semibold text-violet-700 ring-1 ring-violet-200">
          <ShieldCheck className="h-3 w-3" aria-hidden /> Stay.ai final authority
        </span>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {cards.map((card) => {
          const share = totalForShare > 0 ? card.value / totalForShare : 0;
          const sharePct = Math.min(100, Math.max(2, share * 100));
          const showShare = card.id !== 'subscription_contacts_total' && totalForShare > 0;
          return (
            <article
              key={card.id}
              data-testid={`outcome-kpi-${card.id}`}
              className={`relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border p-4 ${TONE_CLASS_MAP[card.tone]}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-80">
                    {card.label}
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.16em] opacity-60">
                    {TONE_LABEL[card.tone]}
                  </p>
                </div>
                {card.isFinalAuthority ? (
                  <span
                    className="inline-flex items-center gap-1 rounded-full bg-white/85 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-violet-700 ring-1 ring-violet-200"
                    aria-label="Stay.ai final-authority metric"
                  >
                    <ShieldCheck className="h-2.5 w-2.5" /> Final
                  </span>
                ) : null}
              </div>
              <p className="metric-value text-3xl">{formatCount(card.value)}</p>
              {showShare ? (
                <div className="space-y-1">
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/70">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${TONE_BAR[card.tone]}`}
                      style={{ width: `${sharePct.toFixed(2)}%` }}
                      role="presentation"
                    />
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] opacity-70">
                    {(share * 100).toFixed(1)}% of subscription contacts
                  </p>
                </div>
              ) : null}
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] opacity-80">
                Source: {card.authority}
              </p>
              <p className="text-sm leading-6 opacity-90">{card.helper}</p>
            </article>
          );
        })}
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {rateCards.map((rateCard) => {
          const { display, rate } = safeRatio(rateCard.numerator, rateCard.denominator);
          const ratePct = Math.min(100, Math.max(2, rate * 100));
          return (
            <article
              key={rateCard.id}
              data-testid={`outcome-rate-${rateCard.id}`}
              className="relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-white p-4 text-violet-950 shadow-sm"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-violet-200/60 blur-3xl"
              />
              <div className="relative flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-700">
                    {rateCard.label}
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-violet-500">
                    Stay.ai-confirmed ratio
                  </p>
                </div>
                <ShieldCheck className="h-4 w-4 shrink-0 text-violet-500" aria-hidden />
              </div>
              <div className="relative flex items-baseline gap-2">
                <p className="metric-value text-[40px] leading-none text-violet-900">{display}</p>
                {display !== 'n/a' ? (
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-500">
                    confirmed
                  </span>
                ) : null}
              </div>
              {display !== 'n/a' ? (
                <div className="relative h-1.5 overflow-hidden rounded-full bg-violet-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-400"
                    style={{ width: `${ratePct.toFixed(2)}%` }}
                    role="presentation"
                  />
                </div>
              ) : (
                <div className="relative h-1.5 overflow-hidden rounded-full bg-slate-100" aria-hidden />
              )}
              <p className="relative text-sm leading-6 text-violet-900/90">{rateCard.helper}</p>
              <p
                data-testid={`outcome-rate-formula-${rateCard.id}`}
                className="relative rounded-xl border border-violet-200 bg-white/80 px-2.5 py-1.5 font-mono text-[11px] leading-5 text-violet-900"
              >
                {rateCard.formula}
                <span className="ml-2 text-violet-500">
                  ({formatCount(rateCard.numerator)} / {formatCount(rateCard.denominator)})
                </span>
              </p>
              <p className="relative text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-500">
                Authority: {rateCard.authority}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
