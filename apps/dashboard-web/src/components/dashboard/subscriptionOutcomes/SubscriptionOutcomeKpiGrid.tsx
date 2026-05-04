import { ShieldCheck } from 'lucide-react';
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

export default function SubscriptionOutcomeKpiGrid({
  cards,
  rateCards,
}: {
  cards: SubscriptionOutcomeKpiCard[];
  rateCards: SubscriptionOutcomeRateCard[];
}) {
  return (
    <section
      data-testid="subscription-outcome-kpi-grid"
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <header className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-950">
            Subscription outcome KPIs
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
            Stay.ai is the source of truth for subscription outcomes. Counts and rates below are
            scoped to the current contract response. Requests, link delivery, and Shopify context
            never finalize subscription state.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-200">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden /> Stay.ai final authority
        </span>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {cards.map((card) => (
          <article
            key={card.id}
            data-testid={`outcome-kpi-${card.id}`}
            className={`flex h-full flex-col gap-3 rounded-2xl border p-4 ${TONE_CLASS_MAP[card.tone]}`}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
                {card.label}
              </p>
              {card.isFinalAuthority ? (
                <ShieldCheck
                  className="h-4 w-4 shrink-0 opacity-70"
                  aria-label="Stay.ai final-authority metric"
                />
              ) : null}
            </div>
            <p className="text-3xl font-semibold tracking-tight">{formatCount(card.value)}</p>
            <p className="text-xs uppercase tracking-wide opacity-80">
              Source authority: {card.authority}
            </p>
            <p className="text-sm leading-6 opacity-90">{card.helper}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {rateCards.map((rateCard) => {
          const { display } = safeRatio(rateCard.numerator, rateCard.denominator);
          return (
            <article
              key={rateCard.id}
              data-testid={`outcome-rate-${rateCard.id}`}
              className="flex flex-col gap-3 rounded-2xl border border-violet-200 bg-violet-50 p-4 text-violet-950"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
                  {rateCard.label}
                </p>
                <ShieldCheck className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
              </div>
              <p className="text-3xl font-semibold tracking-tight">{display}</p>
              <p className="text-xs uppercase tracking-wide opacity-80">
                Source authority: {rateCard.authority}
              </p>
              <p className="text-sm leading-6 opacity-90">{rateCard.helper}</p>
              <p
                data-testid={`outcome-rate-formula-${rateCard.id}`}
                className="rounded-xl bg-white/70 px-2.5 py-1.5 font-mono text-[11px] leading-5 text-violet-900"
              >
                {rateCard.formula}
                <span className="ml-2 text-violet-700">
                  ({formatCount(rateCard.numerator)} / {formatCount(rateCard.denominator)})
                </span>
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
