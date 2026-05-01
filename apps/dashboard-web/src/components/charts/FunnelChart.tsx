import type { FunnelStep } from '../../types/metrics';
import { formatPercent } from '../../utils/formatters';
import SourceBadge from '../status/SourceBadge';
import TrustBadge from '../status/TrustBadge';

export default function FunnelChart({ title, description, steps }: { title: string; description?: string; steps: FunnelStep[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h3 className="text-base font-semibold text-slate-950">{title}</h3>
        {description ? <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p> : null}
      </div>
      <div className="mt-4 space-y-4">
        {steps.map((step) => (
          <div key={step.id}>
            <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-950">{step.label}</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  <SourceBadge source={step.source_of_truth} />
                  <TrustBadge trustLabel={step.trust_label} />
                </div>
              </div>
              <div className="text-sm font-medium text-slate-700">{step.count.toLocaleString()} • {formatPercent(step.rate)}</div>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-slate-900 transition-all"
                style={{ width: `${Math.max(4, Math.min(100, step.rate))}%` }}
                aria-label={`${step.label}: ${formatPercent(step.rate)}`}
              />
            </div>
            {step.rule ? <p className="mt-1 text-xs leading-5 text-slate-500">{step.rule}</p> : null}
          </div>
        ))}
      </div>
    </section>
  );
}
