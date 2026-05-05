import type { SynthflowJourneyMetrics } from '../../../types/subscriptionAnalytics';
import { formatRatio } from '../../../utils/subscriptionAnalyticsState';
import { formatMetricValue } from '../../../utils/formatters';

const STATUS_COPY: Record<string, { label: string; tone: string; helper: string }> = {
  completed: {
    label: 'Completed',
    tone: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    helper: 'Resolved automated journey events.',
  },
  unresolved: {
    label: 'Unresolved',
    tone: 'border-amber-200 bg-amber-50 text-amber-900',
    helper: 'Journey ended without customer resolution. Excluded from containment success.',
  },
  transferred: {
    label: 'Transferred',
    tone: 'border-rose-200 bg-rose-50 text-rose-900',
    helper: 'Live-agent transfer. Excluded from containment success.',
  },
  abandoned: {
    label: 'Abandoned',
    tone: 'border-rose-200 bg-rose-50 text-rose-900',
    helper: 'Caller dropped before resolution. Excluded from containment success.',
  },
};

const STATUS_ORDER = ['completed', 'unresolved', 'transferred', 'abandoned'];

function statusKeyFor(rawKey: string) {
  return STATUS_COPY[rawKey]
    ? rawKey
    : Object.keys(STATUS_COPY).find((known) => known === rawKey.toLowerCase()) ?? rawKey;
}

export default function SynthflowJourneyPanel({
  journey,
}: {
  journey: SynthflowJourneyMetrics;
}) {
  const total = journey.journey_event_count;
  const breakdown = journey.status_breakdown ?? {};
  const seen = new Set<string>();
  const rows = STATUS_ORDER.filter((status) => status in breakdown).map((status) => {
    seen.add(status);
    return [status, breakdown[status]] as const;
  });
  const extras = Object.entries(breakdown).filter(([key]) => !seen.has(key));

  return (
    <section data-testid="synthflow-journey-panel" className="surface-card p-5 sm:p-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="eyebrow">Synthflow automation</p>
          <h3 className="display-title mt-1 text-base sm:text-lg">Synthflow automated journey</h3>
          <p className="mt-1.5 text-sm leading-6 text-slate-600">
            Synthflow owns automated phone support journey events. Successful containment excludes
            unresolved, transferred, and abandoned calls.
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700 ring-1 ring-slate-200">
          {formatMetricValue(total)} events
        </div>
      </header>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {[...rows, ...extras].map(([rawStatus, count]) => {
          const status = statusKeyFor(rawStatus);
          const copy = STATUS_COPY[status] ?? {
            label: rawStatus,
            tone: 'border-slate-200 bg-slate-50 text-slate-800',
            helper: 'Custom Synthflow status from contract response.',
          };
          return (
            <article
              key={rawStatus}
              data-testid={`synthflow-status-${rawStatus}`}
              className={`rounded-2xl border p-4 ${copy.tone}`}
            >
              <p className="text-xs font-semibold uppercase tracking-wide">{copy.label}</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight">{formatMetricValue(count)}</p>
              <p className="mt-1 text-xs uppercase tracking-wide opacity-80">
                {formatRatio(count, total)} of journey events
              </p>
              <p className="mt-2 text-sm leading-6 opacity-90">{copy.helper}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
