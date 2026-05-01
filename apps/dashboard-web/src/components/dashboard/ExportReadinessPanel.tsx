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
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-base font-semibold text-slate-950">
        <FileCheck2 className="h-5 w-5 text-slate-600" /> Export readiness: {module}
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Export buttons should remain disabled in production until the backend export audit endpoint returns all required metadata fields.
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {requiredItems.map((item) => (
          <div key={item} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            {item}
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs uppercase tracking-wide text-slate-400">
        {definitions.length} definition{definitions.length === 1 ? '' : 's'} attached to this module.
      </p>
    </section>
  );
}
