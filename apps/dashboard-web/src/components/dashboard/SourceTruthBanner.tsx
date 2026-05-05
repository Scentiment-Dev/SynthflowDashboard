import { ShieldCheck } from 'lucide-react';
import SourceBadge from '../status/SourceBadge';

export default function SourceTruthBanner({
  sourcePriority,
  lockedRules,
}: {
  sourcePriority: string[];
  lockedRules: string[];
}) {
  return (
    <section className="surface-card relative overflow-hidden p-5 sm:p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-8 -top-12 h-40 w-40 rounded-full bg-violet-100/50 blur-3xl"
      />
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-50 ring-1 ring-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
            </span>
            Source-of-truth controls
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            These guards are surfaced inline so operators can see why a metric is trusted, limited,
            or blocked before it ever ships to a stakeholder.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {sourcePriority.map((source) => (
            <SourceBadge key={source} source={source} />
          ))}
        </div>
      </div>
      <div className="relative mt-5 grid gap-3 md:grid-cols-2">
        {lockedRules.map((rule) => (
          <div
            key={rule}
            className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5 text-sm leading-6 text-slate-700"
          >
            <span className="mr-2 inline-flex h-1.5 w-1.5 -translate-y-0.5 rounded-full bg-violet-500 align-middle" />
            {rule}
          </div>
        ))}
      </div>
    </section>
  );
}
