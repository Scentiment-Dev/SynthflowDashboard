import { Sigma } from 'lucide-react';
import type { MetricDefinition } from '../../types/metrics';
import SourceBadge from '../status/SourceBadge';

export default function MetricDefinitionPanel({ definitions }: { definitions: MetricDefinition[] }) {
  return (
    <section className="surface-card p-5 sm:p-6">
      <header>
        <p className="eyebrow flex items-center gap-1.5">
          <Sigma className="h-3 w-3" /> Metric definitions
        </p>
        <h3 className="display-title mt-1 text-base sm:text-lg">
          Metric definitions and formula versions
        </h3>
        <p className="mt-1.5 text-sm leading-6 text-slate-600">
          Every displayed metric exposes its formula, source of truth, trust rule, owner, and
          formula version. This is required before any production release.
        </p>
      </header>
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200/70">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50/80">
            <tr className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              <th className="px-4 py-2.5">Metric</th>
              <th className="px-4 py-2.5">Formula</th>
              <th className="px-4 py-2.5">Source</th>
              <th className="px-4 py-2.5">Trust rule</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {definitions.map((definition) => (
              <tr key={definition.metric_key} className="transition-colors hover:bg-slate-50/60">
                <td className="px-4 py-3 align-top">
                  <div className="font-semibold text-slate-900">{definition.display_name}</div>
                  <div className="mt-1 font-mono text-xs text-slate-500">{definition.metric_key}</div>
                  <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    {definition.formula_version ?? 'version pending'}
                  </div>
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
