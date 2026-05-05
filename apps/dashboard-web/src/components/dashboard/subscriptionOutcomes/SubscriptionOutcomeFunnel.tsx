import { ChevronRight, GitMerge, ShieldCheck } from 'lucide-react';
import type { SubscriptionOutcomeFunnelStage } from '../../../utils/subscriptionOutcomesState';
import {
  formatCount,
  formatRatePercent,
  funnelStageBarClasses,
  funnelStageToneClasses,
} from '../../../utils/subscriptionOutcomesState';

const MIN_BAR_WIDTH_PERCENT = 6;

export default function SubscriptionOutcomeFunnel({
  stages,
}: {
  stages: SubscriptionOutcomeFunnelStage[];
}) {
  const maxCount = stages.reduce((acc, stage) => Math.max(acc, stage.count), 0);
  const finalAuthorityCount = stages.filter((stage) => stage.isFinalAuthority).length;

  return (
    <section
      data-testid="subscription-outcome-funnel"
      className="surface-card p-5 sm:p-6"
    >
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="eyebrow flex items-center gap-1.5">
            <GitMerge className="h-3 w-3" /> Outcome funnel
          </p>
          <h3 className="display-title mt-1 text-base sm:text-lg">
            Subscription outcome funnel
          </h3>
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-600">
            End-to-end view of the Stay.ai-controlled subscription outcome flow. Shopify context
            and portal link delivery never imply a finalized subscription outcome.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200">
            Total subscription contacts: {formatCount(stages[0]?.count ?? 0)}
          </span>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-[11px] font-semibold text-violet-700 ring-1 ring-violet-200">
            <ShieldCheck className="h-3 w-3" /> {finalAuthorityCount} Stay.ai-final stages
          </span>
        </div>
      </header>
      <ol className="mt-5 space-y-2.5">
        {stages.map((stage, index) => {
          const sharePercent = stage.share * 100;
          const sharePercentDisplay = formatRatePercent(stage.share);
          const widthPercent =
            maxCount > 0
              ? Math.max(MIN_BAR_WIDTH_PERCENT, (stage.count / maxCount) * 100)
              : MIN_BAR_WIDTH_PERCENT;
          const isLast = index === stages.length - 1;
          return (
            <li
              key={stage.id}
              data-testid={`funnel-stage-${stage.id}`}
              className={`relative rounded-2xl border p-4 ${funnelStageToneClasses(stage.tone)}`}
            >
              <div className="flex flex-col gap-2.5 md:flex-row md:items-start md:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/80 text-[11px] font-bold tracking-wider text-slate-900 ring-1 ring-white">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-tight">
                      {stage.label.replace(/^\d+\.\s*/, '')}
                    </p>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] opacity-80">
                      Source authority: {stage.authority}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  {stage.isFinalAuthority ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/85 px-2.5 py-1 font-semibold ring-1 ring-slate-200">
                      <ShieldCheck className="h-3 w-3" aria-hidden /> Stay.ai final
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-white/75 px-2.5 py-1 font-semibold ring-1 ring-slate-200">
                      Context / request
                    </span>
                  )}
                  <span
                    data-testid={`funnel-stage-count-${stage.id}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 font-semibold ring-1 ring-slate-200"
                  >
                    <span className="metric-value text-[13px] leading-none">
                      {formatCount(stage.count)}
                    </span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-700">{sharePercentDisplay} of contacts</span>
                  </span>
                </div>
              </div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/60">
                <div
                  data-testid={`funnel-stage-bar-${stage.id}`}
                  className={`h-full rounded-full transition-all ${funnelStageBarClasses(stage.tone)}`}
                  style={{ width: `${Math.min(100, widthPercent).toFixed(2)}%` }}
                  role="presentation"
                  aria-label={`${stage.label} share: ${sharePercentDisplay}`}
                  aria-valuenow={Number(sharePercent.toFixed(2))}
                />
              </div>
              <p className="mt-2.5 text-sm leading-6 opacity-90">{stage.rule}</p>
              {!isLast ? (
                <div className="mt-2 flex justify-center md:hidden" aria-hidden>
                  <ChevronRight className="h-3 w-3 rotate-90 text-slate-400" />
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
