import { FileCheck2 } from 'lucide-react';
import type { DashboardModule, MetricDefinition } from '../../types/metrics';

export default function ExportReadinessPanel({ module, definitions }: { module: DashboardModule; definitions: MetricDefinition[] }) {
  const requiredItems = [
    'filters',
    'definitions',
    'trust labels',
    'freshness',
    'formula versions',
    'owner',
    'timestamp',
    'fingerprint',
    'audit reference',
  ];

  return (
    <section className="surface-card p-5 sm:p-6">
      <header className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 ring-1 ring-slate-200">
          <FileCheck2 className="h-4.5 w-4.5 text-slate-700" />
        </span>
        <div>
          <p className="eyebrow">Export readiness</p>
          <h3 className="display-title mt-0.5 text-base sm:text-lg">
            Export readiness: {module}
          </h3>
          <p className="mt-1.5 text-sm leading-6 text-slate-600">
            Exports stay disabled in production until the backend export audit endpoint returns all
            required metadata fields.
          </p>
        </div>
      </header>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {requiredItems.map((item) => (
          <div
            key={item}
            className="rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5 text-sm font-medium text-slate-700"
          >
            {item}
          </div>
        ))}
      </div>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {definitions.length} definition{definitions.length === 1 ? '' : 's'} attached to this module
      </p>
    </section>
  );
}
