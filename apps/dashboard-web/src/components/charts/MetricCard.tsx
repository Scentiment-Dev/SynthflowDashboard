import { ArrowDownRight, ArrowUpRight, Minus, Sparkles, TrendingUp } from 'lucide-react';
import type { MetricCardData } from '../../types/metrics';
import { formatMetricValue } from '../../utils/formatters';
import SourceBadge from '../status/SourceBadge';
import TrustBadge from '../status/TrustBadge';

const RAW_DELTA = 'starter baseline';
const POLISHED_DELTA = 'Awaiting first confirmed window';

type DeltaDirection = 'positive' | 'negative' | 'neutral';

function deriveDeltaDirection(deltaText: string): DeltaDirection {
  const trimmed = deltaText.trim();
  if (/^[-−–]/.test(trimmed) || /\bdown\b/i.test(trimmed)) return 'negative';
  if (/^\+/.test(trimmed) || /\bup\b/i.test(trimmed)) return 'positive';
  return 'neutral';
}

export default function MetricCard({ metric }: { metric: MetricCardData }) {
  const rawDelta = metric.delta ?? RAW_DELTA;
  const isPlaceholderDelta = rawDelta === RAW_DELTA;
  const deltaText = isPlaceholderDelta ? POLISHED_DELTA : rawDelta;
  const deltaDirection: DeltaDirection = isPlaceholderDelta
    ? 'neutral'
    : deriveDeltaDirection(deltaText);
  const valueIsString = typeof metric.value === 'string';
  const isPreview = valueIsString && metric.value === 'starter';

  return (
    <article className="surface-card lift-on-hover relative flex h-full flex-col gap-4 overflow-hidden p-5">
      <span
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-violet-100/70 to-cyan-100/40 blur-2xl"
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow text-slate-500">{metric.label}</p>
          <p className="metric-value mt-3 text-[34px] leading-none">
            {isPreview ? '—' : formatMetricValue(metric.value)}
          </p>
          {isPreview ? (
            <p className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
              <Sparkles className="h-3 w-3 text-violet-500" /> Preview value · awaiting live contract
            </p>
          ) : null}
        </div>
        <span
          aria-hidden
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-violet-50 text-slate-600 shadow-sm"
        >
          <TrendingUp className="h-4 w-4" />
        </span>
      </div>

      <div className="relative flex flex-wrap gap-2">
        <TrustBadge trustLabel={metric.trust_label} />
        <SourceBadge source={metric.source_of_truth} />
      </div>

      <p className="relative text-sm leading-6 text-slate-600">{metric.description}</p>

      <div className="relative mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-3 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
        <span className="inline-flex items-center gap-1">
          {deltaDirection === 'positive' ? (
            <ArrowUpRight className="h-3 w-3 text-emerald-600" />
          ) : deltaDirection === 'negative' ? (
            <ArrowDownRight className="h-3 w-3 text-rose-600" />
          ) : (
            <Minus className="h-3 w-3 text-slate-400" />
          )}
          {deltaText}
        </span>
        <span className="font-mono normal-case tracking-normal text-slate-400">{metric.key}</span>
      </div>
    </article>
  );
}
