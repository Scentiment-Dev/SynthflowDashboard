import { CheckCircle2, Circle, CircleAlert, CircleX } from 'lucide-react';
import type { JourneyNode } from '../../types/metrics';

const statusStyles: Record<JourneyNode['status'], string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
  failure: 'border-rose-200 bg-rose-50 text-rose-800',
  neutral: 'border-slate-200 bg-slate-50 text-slate-800',
};

const icons = {
  success: CheckCircle2,
  warning: CircleAlert,
  failure: CircleX,
  neutral: Circle,
};

export default function JourneyFlowChart({ title, description, nodes }: { title: string; description?: string; nodes: JourneyNode[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h3 className="text-base font-semibold text-slate-950">{title}</h3>
        {description ? <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p> : null}
      </div>
      <div className="mt-4 grid gap-3 xl:grid-cols-4">
        {nodes.map((node, index) => {
          const Icon = icons[node.status];
          return (
            <div key={node.id} className="relative">
              <div className={`min-h-48 rounded-2xl border p-4 ${statusStyles[node.status]}`}>
                <div className="flex items-center justify-between gap-3">
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="rounded-full bg-white/70 px-2 py-1 text-xs font-semibold">{node.source}</span>
                </div>
                <h4 className="mt-4 text-sm font-semibold">{node.label}</h4>
                <p className="mt-2 text-sm leading-6 opacity-90">{node.description}</p>
                {node.lockedRule ? <p className="mt-3 rounded-xl bg-white/70 p-2 text-xs leading-5">{node.lockedRule}</p> : null}
              </div>
              {index < nodes.length - 1 ? (
                <div className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 xl:flex">
                  →
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
