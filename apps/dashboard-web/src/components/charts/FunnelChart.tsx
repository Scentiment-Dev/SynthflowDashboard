import { ChevronRight, Target } from 'lucide-react';
import type { FunnelStep } from '../../types/metrics';
import { formatPercent } from '../../utils/formatters';
import SourceBadge from '../status/SourceBadge';
import TrustBadge from '../status/TrustBadge';

export default function FunnelChart({
  title,
  description,
  steps,
}: {
  title: string;
  description?: string;
  steps: FunnelStep[];
}) {
  const topCount = steps.length > 0 ? steps[0].count : 0;
  const headlineRate = steps.length > 0 ? steps[steps.length - 1].rate : 0;

  return (
    <section className="surface-card p-5 sm:p-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="eyebrow">Conversion path</p>
          <h3 className="display-title mt-1 text-base sm:text-lg">{title}</h3>
          {description ? (
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200">
            <Target className="h-3 w-3 text-violet-500" /> End-to-end {formatPercent(headlineRate)}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600">
            Top of funnel {topCount.toLocaleString()}
          </span>
        </div>
      </header>

      <ol className="mt-5 space-y-3">
        {steps.map((step, index) => {
          const widthPct = Math.max(6, Math.min(100, step.rate));
          const isLast = index === steps.length - 1;
          return (
            <li key={step.id} className="relative">
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-gradient-to-r from-slate-50/60 to-white p-3 sm:flex-row sm:items-center">
                <div className="flex w-full items-center gap-3 sm:w-auto sm:flex-1">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-[11px] font-bold text-white shadow-sm">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">{step.label}</p>
                      <SourceBadge source={step.source_of_truth} />
                      <TrustBadge trustLabel={step.trust_label} />
                    </div>
                    <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 transition-all"
                        style={{ width: `${widthPct.toFixed(2)}%` }}
                        aria-label={`${step.label}: ${formatPercent(step.rate)}`}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-baseline gap-3 sm:flex-col sm:items-end sm:gap-0">
                  <span className="metric-value text-xl">{step.count.toLocaleString()}</span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {formatPercent(step.rate)}
                  </span>
                </div>
              </div>
              {step.rule ? (
                <p className="mt-1.5 pl-12 text-xs leading-5 text-slate-500">{step.rule}</p>
              ) : null}
              {!isLast ? (
                <div className="mt-1 flex justify-center" aria-hidden>
                  <ChevronRight className="h-3 w-3 rotate-90 text-slate-300" />
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
