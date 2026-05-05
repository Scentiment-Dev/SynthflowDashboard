import { Table2 } from 'lucide-react';
import type { MetricCardData } from '../../types/metrics';
import SourceBadge from '../status/SourceBadge';
import TrustBadge from '../status/TrustBadge';

export default function MetricTable({ metrics }: { metrics: MetricCardData[] }) {
  return (
    <section className="surface-card p-5 sm:p-6">
      <header>
        <p className="eyebrow flex items-center gap-1.5">
          <Table2 className="h-3 w-3" /> Metric readiness
        </p>
        <h3 className="display-title mt-1 text-base sm:text-lg">Metric readiness table</h3>
        <p className="mt-1.5 text-sm leading-6 text-slate-600">
          Each row carries a system-calculated trust label and source of truth. Values flow only
          from contract-backed metrics — no manual elevation is permitted.
        </p>
      </header>
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200/70">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50/80">
            <tr className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              <th className="px-4 py-2.5">Metric</th>
              <th className="px-4 py-2.5">Current value</th>
              <th className="px-4 py-2.5">Source</th>
              <th className="px-4 py-2.5">Trust</th>
              <th className="px-4 py-2.5">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {metrics.map((metric) => (
              <tr key={metric.key} className="transition-colors hover:bg-slate-50/60">
                <td className="px-4 py-3 font-semibold text-slate-900">{metric.label}</td>
                <td className="px-4 py-3 font-mono text-sm text-slate-700">{metric.value}</td>
                <td className="px-4 py-3"><SourceBadge source={metric.source_of_truth} /></td>
                <td className="px-4 py-3"><TrustBadge trustLabel={metric.trust_label} /></td>
                <td className="max-w-lg px-4 py-3 leading-6 text-slate-600">{metric.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
