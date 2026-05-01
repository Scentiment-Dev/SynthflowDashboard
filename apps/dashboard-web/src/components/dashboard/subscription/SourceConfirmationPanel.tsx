import type { SourceConfirmationMetrics } from '../../../types/subscriptionAnalytics';
import {
  formatRatio,
  sourceConfirmationTone,
  statusBadgeClasses,
} from '../../../utils/subscriptionAnalyticsState';
import { formatMetricValue } from '../../../utils/formatters';

export default function SourceConfirmationPanel({
  sourceConfirmation,
}: {
  sourceConfirmation: SourceConfirmationMetrics;
}) {
  const total =
    sourceConfirmation.confirmed_records_count +
    sourceConfirmation.pending_records_count +
    sourceConfirmation.missing_records_count;
  const tone = sourceConfirmationTone(sourceConfirmation.source_confirmation_status);

  const rows = [
    {
      key: 'confirmed',
      label: 'Confirmed',
      count: sourceConfirmation.confirmed_records_count,
      helper: 'Stay.ai final state confirmed.',
      tone: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    },
    {
      key: 'pending',
      label: 'Pending',
      count: sourceConfirmation.pending_records_count,
      helper: 'Awaiting Stay.ai confirmation.',
      tone: 'border-amber-200 bg-amber-50 text-amber-900',
    },
    {
      key: 'missing',
      label: 'Missing',
      count: sourceConfirmation.missing_records_count,
      helper: 'No Stay.ai final state available.',
      tone: 'border-rose-200 bg-rose-50 text-rose-900',
    },
  ];

  return (
    <section
      data-testid="source-confirmation-panel"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <header className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-950">Source confirmation (Stay.ai)</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Stay.ai owns subscription source-of-truth. Pending and missing records cannot be treated
            as confirmed cancellation, save, or retained outcomes.
          </p>
        </div>
        <span
          className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusBadgeClasses(tone)}`}
        >
          Status: {sourceConfirmation.source_confirmation_status}
        </span>
      </header>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {rows.map((row) => (
          <article
            key={row.key}
            data-testid={`source-confirmation-${row.key}`}
            className={`rounded-2xl border p-4 ${row.tone}`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide">{row.label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">{formatMetricValue(row.count)}</p>
            <p className="mt-1 text-xs uppercase tracking-wide opacity-80">
              {formatRatio(row.count, total)} of records
            </p>
            <p className="mt-2 text-sm leading-6 opacity-90">{row.helper}</p>
          </article>
        ))}
      </div>
      <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">
        Source-of-truth system: {sourceConfirmation.source_of_truth_system}
      </p>
    </section>
  );
}
