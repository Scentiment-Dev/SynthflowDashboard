import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Database,
  GitMerge,
  ShieldCheck,
  ShieldOff,
} from 'lucide-react';
import type { SourceHealthEntry } from '../../../types/sourceHealth';
import { statusBadgeClasses, statusToneClasses } from '../../../utils/subscriptionAnalyticsState';
import {
  authorityLabel,
  confirmationLabel,
  confirmationTone,
  dataQualityLabel,
  dataQualityTone,
  formatLastSeenRelative,
  freshnessLabel,
  freshnessTone,
  SOURCE_SYSTEM_COPY,
  trustLabelTone,
} from '../../../utils/sourceHealthState';
import { formatMetricValue } from '../../../utils/formatters';

const AUTHORITY_BADGE_CLASSES: Record<SourceHealthEntry['source_authority_level'], string> = {
  authoritative_final_state: 'bg-violet-100 text-violet-900 ring-violet-300',
  journey_event_authoritative: 'bg-indigo-100 text-indigo-900 ring-indigo-300',
  context_only: 'bg-slate-100 text-slate-700 ring-slate-300',
  completion_signal: 'bg-cyan-100 text-cyan-900 ring-cyan-300',
};

const SYSTEM_ACCENT: Record<SourceHealthEntry['source_system'], string> = {
  stay_ai: 'border-violet-300',
  synthflow: 'border-indigo-300',
  shopify: 'border-emerald-300',
  portal: 'border-cyan-300',
};

export default function SourceHealthCard({ source }: { source: SourceHealthEntry }) {
  const copy = SOURCE_SYSTEM_COPY[source.source_system];
  const isFinalTruth = copy.authority.finalSubscriptionTruth;
  const freshness = freshnessTone(source.freshness_status);
  const confirmation = confirmationTone(source.source_confirmation_status);
  const quality = dataQualityTone(source.data_quality_status);
  const trust = trustLabelTone(source.trust_label);

  return (
    <article
      data-testid={`source-health-card-${source.source_system}`}
      className={`flex h-full flex-col gap-4 rounded-2xl border-l-8 ${SYSTEM_ACCENT[source.source_system]} border-y border-r border-slate-200 bg-white p-5 shadow-sm`}
    >
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Source system
          </p>
          <h4 className="mt-1 text-lg font-semibold text-slate-950">{copy.label}</h4>
          <p className="mt-1 max-w-xs text-xs leading-5 text-slate-600">{copy.domain}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            data-testid={`source-health-card-${source.source_system}-authority`}
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ${AUTHORITY_BADGE_CLASSES[source.source_authority_level]}`}
          >
            {authorityLabel(source.source_authority_level)}
          </span>
          {isFinalTruth ? (
            <span
              data-testid={`source-health-card-${source.source_system}-final-truth-badge`}
              className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-semibold text-violet-900 ring-1 ring-violet-200"
            >
              <ShieldCheck className="h-3 w-3" aria-hidden /> Final subscription truth
            </span>
          ) : (
            <span
              data-testid={`source-health-card-${source.source_system}-non-final-badge`}
              className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200"
            >
              <ShieldOff className="h-3 w-3" aria-hidden /> Cannot finalize subscription
            </span>
          )}
        </div>
      </header>

      <div className="grid grid-cols-2 gap-2">
        <div
          data-testid={`source-health-card-${source.source_system}-freshness`}
          className={`rounded-xl border p-3 text-xs ${statusToneClasses(freshness)}`}
        >
          <p className="flex items-center gap-1 font-semibold uppercase tracking-wide">
            <Clock className="h-3 w-3" aria-hidden /> Freshness
          </p>
          <p className="mt-1 text-sm font-semibold">{freshnessLabel(source.freshness_status)}</p>
          <p className="mt-0.5 text-[11px] opacity-90">
            Last seen {formatLastSeenRelative(source.freshness_minutes)}
          </p>
        </div>
        <div
          data-testid={`source-health-card-${source.source_system}-confirmation`}
          className={`rounded-xl border p-3 text-xs ${statusToneClasses(confirmation)}`}
        >
          <p className="flex items-center gap-1 font-semibold uppercase tracking-wide">
            <CheckCircle2 className="h-3 w-3" aria-hidden /> Confirmation
          </p>
          <p className="mt-1 text-sm font-semibold">
            {confirmationLabel(source.source_confirmation_status)}
          </p>
          <p className="mt-0.5 text-[11px] opacity-90">
            {source.source_confirmation_status === 'confirmed'
              ? 'Confirmed by source feed.'
              : 'Awaiting confirmation evidence.'}
          </p>
        </div>
        <div
          data-testid={`source-health-card-${source.source_system}-quality`}
          className={`rounded-xl border p-3 text-xs ${statusToneClasses(quality)}`}
        >
          <p className="flex items-center gap-1 font-semibold uppercase tracking-wide">
            <Database className="h-3 w-3" aria-hidden /> Data quality
          </p>
          <p className="mt-1 text-sm font-semibold">{dataQualityLabel(source.data_quality_status)}</p>
          <p className="mt-0.5 text-[11px] opacity-90">
            {source.missing_required_fields.length > 0
              ? `Missing: ${source.missing_required_fields.join(', ')}`
              : 'All required fields present.'}
          </p>
        </div>
        <div
          data-testid={`source-health-card-${source.source_system}-conflicts`}
          className={`rounded-xl border p-3 text-xs ${
            source.conflict_count > 0
              ? statusToneClasses('warning')
              : statusToneClasses('success')
          }`}
        >
          <p className="flex items-center gap-1 font-semibold uppercase tracking-wide">
            <GitMerge className="h-3 w-3" aria-hidden /> Conflicts
          </p>
          <p className="mt-1 text-sm font-semibold">{formatMetricValue(source.conflict_count)}</p>
          <p className="mt-0.5 text-[11px] opacity-90">
            {source.conflict_count > 0
              ? 'Stay.ai authority preserved; triage required.'
              : 'No cross-source conflicts.'}
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-3 text-xs text-slate-600">
        <div>
          <dt className="font-semibold uppercase tracking-wide text-slate-500">Records</dt>
          <dd className="mt-0.5 font-mono text-sm text-slate-900">
            {formatMetricValue(source.record_count)}
          </dd>
        </div>
        <div>
          <dt className="font-semibold uppercase tracking-wide text-slate-500">Last seen</dt>
          <dd className="mt-0.5 font-mono text-[11px] text-slate-900">{source.last_seen_at}</dd>
        </div>
        <div>
          <dt className="font-semibold uppercase tracking-wide text-slate-500">Trust label</dt>
          <dd className="mt-0.5">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${statusBadgeClasses(trust)}`}
            >
              {source.trust_label}
            </span>
          </dd>
        </div>
        <div>
          <dt className="font-semibold uppercase tracking-wide text-slate-500">Owner</dt>
          <dd className="mt-0.5 text-slate-900">{source.owner}</dd>
        </div>
        <div className="col-span-2">
          <dt className="font-semibold uppercase tracking-wide text-slate-500">Lineage reference</dt>
          <dd
            data-testid={`source-health-card-${source.source_system}-lineage`}
            className="mt-0.5 break-all rounded-lg bg-slate-50 p-2 font-mono text-[11px] text-slate-800"
          >
            {source.lineage_reference}
          </dd>
        </div>
        <div className="col-span-2">
          <dt className="font-semibold uppercase tracking-wide text-slate-500">Audit reference</dt>
          <dd
            data-testid={`source-health-card-${source.source_system}-audit`}
            className="mt-0.5 break-all font-mono text-[11px] text-slate-900"
          >
            {source.audit_reference}
          </dd>
        </div>
      </dl>

      {source.missing_required_fields.length > 0 ? (
        <p
          data-testid={`source-health-card-${source.source_system}-missing-fields`}
          className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] leading-5 text-amber-900"
        >
          <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
          <span>
            <span className="font-semibold uppercase tracking-wide">Missing required:</span>{' '}
            {source.missing_required_fields.join(', ')}
          </span>
        </p>
      ) : null}
    </article>
  );
}
