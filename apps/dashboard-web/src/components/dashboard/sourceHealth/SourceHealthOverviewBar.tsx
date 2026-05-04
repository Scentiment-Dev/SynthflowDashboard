import {
  Activity,
  AlertTriangle,
  Fingerprint,
  GitMerge,
  ScrollText,
} from 'lucide-react';
import type { SubscriptionSourceHealthResponse } from '../../../types/sourceHealth';
import { statusBadgeClasses, statusToneClasses } from '../../../utils/subscriptionAnalyticsState';
import {
  conflictStatusLabel,
  conflictStatusTone,
  overallHealthLabel,
  overallHealthTone,
} from '../../../utils/sourceHealthState';

export default function SourceHealthOverviewBar({
  data,
}: {
  data: SubscriptionSourceHealthResponse;
}) {
  const overallTone = overallHealthTone(data.overall_source_health);
  const conflictTone = conflictStatusTone(data.conflict_status);

  return (
    <section
      data-testid="source-health-overview-bar"
      className={`flex flex-col gap-4 rounded-2xl border p-5 shadow-sm md:flex-row md:items-stretch md:justify-between ${statusToneClasses(overallTone)}`}
    >
      <div className="flex items-start gap-3">
        <Activity className="mt-0.5 h-6 w-6 shrink-0" aria-hidden />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">
            Subscription source health
          </p>
          <p className="mt-1 text-xl font-semibold">{overallHealthLabel(data.overall_source_health)}</p>
          <p className="mt-2 max-w-2xl text-sm leading-6">
            Stay.ai owns subscription final state. Synthflow owns automated journey events. Shopify
            is context only. Portal completion requires confirmed completion, not link delivery.
          </p>
        </div>
      </div>
      <div className="flex flex-col items-start gap-2 md:items-end">
        <span
          data-testid="source-health-overview-conflict-status"
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusBadgeClasses(conflictTone)}`}
        >
          <GitMerge className="h-3 w-3" aria-hidden /> {conflictStatusLabel(data.conflict_status)}
        </span>
        {data.pending_or_unknown_final_outcome ? (
          <span
            data-testid="source-health-overview-pending-final"
            className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900 ring-1 ring-amber-300"
          >
            <AlertTriangle className="h-3 w-3" aria-hidden /> Pending or unknown final outcome
          </span>
        ) : (
          <span
            data-testid="source-health-overview-final-confirmed"
            className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900 ring-1 ring-emerald-300"
          >
            Stay.ai final state confirmed
          </span>
        )}
        {data.generated_from_fixture ? (
          <span
            data-testid="source-health-overview-fixture-tag"
            className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-amber-900 ring-1 ring-amber-200"
          >
            Contract preview (fixture)
          </span>
        ) : null}
        <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-[11px] font-mono text-slate-700 ring-1 ring-slate-200">
          <Fingerprint className="h-3 w-3" aria-hidden /> {data.metadata.fingerprint}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-[11px] font-mono text-slate-700 ring-1 ring-slate-200">
          <ScrollText className="h-3 w-3" aria-hidden /> {data.metadata.audit_reference}
        </span>
      </div>
    </section>
  );
}
