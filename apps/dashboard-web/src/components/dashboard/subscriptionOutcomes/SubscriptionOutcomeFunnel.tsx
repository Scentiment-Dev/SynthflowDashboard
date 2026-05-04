import { ShieldCheck } from 'lucide-react';
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

  return (
    <section
      data-testid="subscription-outcome-funnel"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <header className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-950">
            Subscription outcome funnel
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
            End-to-end view of the Stay.ai-controlled subscription outcome flow. Shopify context
            and portal link delivery never imply a finalized subscription outcome.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
          Total subscription contacts: {formatCount(stages[0]?.count ?? 0)}
        </span>
      </header>
      <ol className="mt-4 space-y-3">
        {stages.map((stage) => {
          const sharePercent = stage.share * 100;
          const sharePercentDisplay = formatRatePercent(stage.share);
          const widthPercent =
            maxCount > 0
              ? Math.max(MIN_BAR_WIDTH_PERCENT, (stage.count / maxCount) * 100)
              : MIN_BAR_WIDTH_PERCENT;
          return (
            <li
              key={stage.id}
              data-testid={`funnel-stage-${stage.id}`}
              className={`rounded-2xl border p-4 ${funnelStageToneClasses(stage.tone)}`}
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{stage.label}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide opacity-80">
                    Source authority: {stage.authority}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {stage.isFinalAuthority ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 font-semibold ring-1 ring-slate-200">
                      <ShieldCheck className="h-3 w-3" aria-hidden /> Stay.ai final
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-white/70 px-2.5 py-1 font-semibold ring-1 ring-slate-200">
                      Context / request
                    </span>
                  )}
                  <span
                    data-testid={`funnel-stage-count-${stage.id}`}
                    className="inline-flex items-center rounded-full bg-white/80 px-2.5 py-1 font-semibold ring-1 ring-slate-200"
                  >
                    {formatCount(stage.count)} • {sharePercentDisplay} of contacts
                  </span>
                </div>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/60">
                <div
                  data-testid={`funnel-stage-bar-${stage.id}`}
                  className={`h-full rounded-full transition-all ${funnelStageBarClasses(stage.tone)}`}
                  style={{ width: `${Math.min(100, widthPercent).toFixed(2)}%` }}
                  role="presentation"
                  aria-label={`${stage.label} share: ${sharePercentDisplay}`}
                  aria-valuenow={Number(sharePercent.toFixed(2))}
                />
              </div>
              <p className="mt-2 text-sm leading-6 opacity-90">{stage.rule}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
