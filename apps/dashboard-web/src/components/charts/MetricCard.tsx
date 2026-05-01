import { Activity, ArrowUpRight } from 'lucide-react';
import type { MetricCardData } from '../../types/metrics';
import { formatMetricValue } from '../../utils/formatters';
import SourceBadge from '../status/SourceBadge';
import TrustBadge from '../status/TrustBadge';

export default function MetricCard({ metric }: { metric: MetricCardData }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{metric.label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{formatMetricValue(metric.value)}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-2 text-slate-500">
          <Activity className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <TrustBadge trustLabel={metric.trust_label} />
        <SourceBadge source={metric.source_of_truth} />
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{metric.description}</p>
      <div className="mt-4 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
        <ArrowUpRight className="h-3.5 w-3.5" /> {metric.delta ?? 'starter baseline'}
      </div>
    </article>
  );
}
