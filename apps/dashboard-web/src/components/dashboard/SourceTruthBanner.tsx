import { ShieldCheck } from 'lucide-react';
import SourceBadge from '../status/SourceBadge';

export default function SourceTruthBanner({ sourcePriority, lockedRules }: { sourcePriority: string[]; lockedRules: string[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
            <ShieldCheck className="h-4 w-4 text-slate-600" /> Source-of-truth controls
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            These controls are shown directly in the dashboard so users can see why a metric is trusted, limited, or blocked.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {sourcePriority.map((source) => (
            <SourceBadge key={source} source={source} />
          ))}
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {lockedRules.map((rule) => (
          <div key={rule} className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm leading-6 text-slate-700">
            {rule}
          </div>
        ))}
      </div>
    </section>
  );
}
