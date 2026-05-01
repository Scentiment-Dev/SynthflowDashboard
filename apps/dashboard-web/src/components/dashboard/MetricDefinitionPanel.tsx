import type { MetricDefinition } from '../../types/metrics';
import SourceBadge from '../status/SourceBadge';

export default function MetricDefinitionPanel({ definitions }: { definitions: MetricDefinition[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-slate-950">Metric definitions and formula versions</h3>
        <p className="text-sm leading-6 text-slate-600">
          Every displayed metric must expose its formula, source of truth, trust rule, owner, and formula version before production release.
        </p>
      </div>
      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Metric</th>
              <th className="px-4 py-3">Formula</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Trust rule</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {definitions.map((definition) => (
              <tr key={definition.metric_key}>
                <td className="px-4 py-3 align-top">
                  <div className="font-medium text-slate-950">{definition.display_name}</div>
                  <div className="mt-1 text-xs text-slate-500">{definition.metric_key}</div>
                  <div className="mt-1 text-xs text-slate-500">{definition.formula_version ?? 'version pending'}</div>
                </td>
                <td className="max-w-xs px-4 py-3 align-top font-mono text-xs leading-5 text-slate-700">{definition.formula}</td>
                <td className="px-4 py-3 align-top"><SourceBadge source={definition.source_of_truth} /></td>
                <td className="max-w-md px-4 py-3 align-top leading-6 text-slate-600">{definition.trust_rule}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
