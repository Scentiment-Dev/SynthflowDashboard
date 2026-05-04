import { GitBranch, ShieldCheck, ShieldOff } from 'lucide-react';
import type { SubscriptionSourceHealthResponse } from '../../../types/sourceHealth';
import {
  authorityLabel,
  conflictStatusLabel,
  conflictStatusTone,
  SOURCE_SYSTEM_COPY,
} from '../../../utils/sourceHealthState';
import { statusBadgeClasses, statusToneClasses } from '../../../utils/subscriptionAnalyticsState';

export default function LineageConflictPanel({
  data,
}: {
  data: SubscriptionSourceHealthResponse;
}) {
  const conflictTone = conflictStatusTone(data.conflict_status);
  return (
    <section
      data-testid="lineage-conflict-panel"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-950">Lineage and conflict explanation</h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
            What each source signal means and whether it can be used as final subscription truth.
            Reads top-down for operators and leadership; raw lineage references are provided
            inline for engineers.
          </p>
        </div>
        <span
          data-testid="lineage-conflict-panel-status"
          className={`inline-flex w-fit items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusBadgeClasses(conflictTone)}`}
        >
          <GitBranch className="h-3 w-3" aria-hidden /> {conflictStatusLabel(data.conflict_status)}
        </span>
      </header>

      <div className={`mt-4 rounded-xl border p-4 text-sm ${statusToneClasses(conflictTone)}`}>
        <p className="font-semibold">How conflicts are resolved</p>
        <p className="mt-1 leading-6">
          Stay.ai is the authoritative final state for subscription outcomes. Even when other
          sources disagree, the dashboard never overrides Stay.ai. Conflicts are surfaced for
          triage but do not change displayed final outcomes.
        </p>
      </div>

      <ol className="mt-5 grid gap-3">
        {data.sources.map((source) => {
          const copy = SOURCE_SYSTEM_COPY[source.source_system];
          const canFinalize = copy.authority.finalSubscriptionTruth;
          return (
            <li
              key={source.source_system}
              data-testid={`lineage-row-${source.source_system}`}
              className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[200px_1fr_auto] md:items-center"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Source
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-950">{copy.label}</p>
                <p className="mt-1 text-[11px] leading-4 text-slate-600">{copy.authority.ownership}</p>
              </div>
              <div className="text-sm leading-6 text-slate-700">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Signal meaning
                </p>
                <p className="mt-1">
                  Authority: <span className="font-semibold">{authorityLabel(source.source_authority_level)}</span>.{' '}
                  {copy.authority.authorityHelper}
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  Lineage:{' '}
                  <span
                    data-testid={`lineage-row-${source.source_system}-lineage`}
                    className="break-all rounded bg-white px-1 py-0.5 font-mono text-[11px] text-slate-800 ring-1 ring-slate-200"
                  >
                    {source.lineage_reference}
                  </span>
                </p>
                {source.conflict_count > 0 ? (
                  <p
                    data-testid={`lineage-row-${source.source_system}-conflict-note`}
                    className="mt-2 text-xs text-amber-900"
                  >
                    {source.conflict_count} cross-source conflict
                    {source.conflict_count === 1 ? '' : 's'} reported. Stay.ai authority is preserved.
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col items-start gap-1 md:items-end">
                {canFinalize ? (
                  <span
                    data-testid={`lineage-row-${source.source_system}-can-finalize`}
                    className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-900 ring-1 ring-violet-200"
                  >
                    <ShieldCheck className="h-3 w-3" aria-hidden /> Can finalize subscription
                  </span>
                ) : (
                  <span
                    data-testid={`lineage-row-${source.source_system}-cannot-finalize`}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200"
                  >
                    <ShieldOff className="h-3 w-3" aria-hidden /> Cannot finalize subscription
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {data.missing_stay_ai_final_state_warning ? (
        <p
          data-testid="lineage-conflict-panel-missing-stay-ai"
          className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm leading-6 text-rose-900"
        >
          {data.missing_stay_ai_final_state_warning}
        </p>
      ) : null}
      {data.portal_completion_warning ? (
        <p
          data-testid="lineage-conflict-panel-portal-warning"
          className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900"
        >
          {data.portal_completion_warning}
        </p>
      ) : null}
      <p
        data-testid="lineage-conflict-panel-shopify-warning"
        className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700"
      >
        {data.shopify_context_warning}
      </p>
    </section>
  );
}
