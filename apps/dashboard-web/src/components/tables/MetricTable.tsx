import type { MetricCardData } from '../../types/metrics';
import SourceBadge from '../status/SourceBadge';
import TrustBadge from '../status/TrustBadge';

export default function MetricTable({ metrics }: { metrics: MetricCardData[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-950">Metric readiness table</h3>
      <p className="mt-1 text-sm leading-6 text-slate-600">Starter implementation view for Agent B to wire into live API states and table actions.</p>
      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Metric</th>
              <th className="px-4 py-3">Current value</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Trust</th>
              <th className="px-4 py-3">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {metrics.map((metric) => (
              <tr key={metric.key}>
                <td className="px-4 py-3 font-medium text-slate-950">{metric.label}</td>
                <td className="px-4 py-3 text-slate-700">{metric.value}</td>
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
