import { CheckCircle2, Circle, CircleAlert, CircleX, Workflow } from 'lucide-react';
import type { JourneyNode } from '../../types/metrics';

const statusStyles: Record<JourneyNode['status'], string> = {
  success: 'border-emerald-200 bg-emerald-50/70 text-emerald-900',
  warning: 'border-amber-200 bg-amber-50/70 text-amber-900',
  failure: 'border-rose-200 bg-rose-50/70 text-rose-900',
  neutral: 'border-slate-200 bg-slate-50/70 text-slate-900',
};

const statusAccent: Record<JourneyNode['status'], string> = {
  success: 'from-emerald-400 to-emerald-200',
  warning: 'from-amber-400 to-amber-200',
  failure: 'from-rose-400 to-rose-200',
  neutral: 'from-slate-400 to-slate-200',
};

const icons = {
  success: CheckCircle2,
  warning: CircleAlert,
  failure: CircleX,
  neutral: Circle,
};

export default function JourneyFlowChart({
  title,
  description,
  nodes,
}: {
  title: string;
  description?: string;
  nodes: JourneyNode[];
}) {
  return (
    <section className="surface-card p-5 sm:p-6">
      <header>
        <p className="eyebrow flex items-center gap-1.5">
          <Workflow className="h-3 w-3" /> Locked measurement journey
        </p>
        <h3 className="display-title mt-1 text-base sm:text-lg">{title}</h3>
        {description ? (
          <p className="mt-1.5 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
        ) : null}
      </header>
      <ol className="mt-4 grid gap-3 xl:grid-cols-4">
        {nodes.map((node, index) => {
          const Icon = icons[node.status];
          return (
            <li key={node.id} className="relative">
              <div className={`relative h-full overflow-hidden rounded-2xl border p-4 ${statusStyles[node.status]}`}>
                <span
                  aria-hidden
                  className={`absolute inset-x-4 top-0 h-0.5 rounded-full bg-gradient-to-r ${statusAccent[node.status]}`}
                />
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] opacity-80">
                    <span className="rounded-full bg-white/80 px-1.5 py-0.5 font-mono text-[9px]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    Step
                  </span>
                  <Icon className="h-5 w-5 shrink-0 opacity-80" />
                </div>
                <h4 className="mt-3 text-sm font-semibold leading-snug">{node.label}</h4>
                <p className="mt-2 text-sm leading-6 opacity-90">{node.description}</p>
                <div className="mt-3 flex items-center justify-between gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] opacity-80">
                  <span>Source</span>
                  <span className="rounded-full bg-white/80 px-2 py-0.5 normal-case tracking-normal">
                    {node.source}
                  </span>
                </div>
                {node.lockedRule ? (
                  <p className="mt-3 rounded-xl border border-white/60 bg-white/70 p-2 text-[11px] leading-5 text-slate-700">
                    <span className="font-semibold">Locked rule · </span>
                    {node.lockedRule}
                  </p>
                ) : null}
              </div>
              {index < nodes.length - 1 ? (
                <div
                  className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm xl:flex"
                  aria-hidden
                >
                  →
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
