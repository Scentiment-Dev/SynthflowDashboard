import { Clock, Fingerprint, FileSearch2, ScrollText, ShieldCheck } from 'lucide-react';
import type {
  SubscriptionOutcomeMetadata,
  SubscriptionOutcomesResponse,
} from '../../../types/subscriptionOutcomes';
import {
  freshnessToneClasses,
  sourceConfirmationToneClasses,
  trustToneClasses,
} from '../../../utils/subscriptionOutcomesState';

function FilterChips({ filters }: { filters: Record<string, unknown> }) {
  const entries = Object.entries(filters);
  if (entries.length === 0) {
    return <p className="text-sm leading-6 text-slate-500">No filters reported.</p>;
  }
  return (
    <ul className="flex flex-wrap gap-2">
      {entries.map(([key, value]) => (
        <li
          key={key}
          className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200"
        >
          {key}:{' '}
          <span className="ml-1 font-mono">
            {Array.isArray(value) ? value.join(', ') : String(value)}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function SubscriptionOutcomeMetadataPanel({
  metadata,
  data,
}: {
  metadata: SubscriptionOutcomeMetadata;
  data: SubscriptionOutcomesResponse;
}) {
  return (
    <section
      data-testid="subscription-outcome-metadata-panel"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-950">
            Outcome metric definition, source authority, and audit trail
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
            Every KPI and funnel section in this view is governed by the metric definitions,
            formula version, source authority, trust label, freshness, and audit reference shown
            below. These fields must accompany every export.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span
            data-testid="outcome-metadata-trust"
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${trustToneClasses(metadata.trust_label)}`}
          >
            Trust: {metadata.trust_label}
          </span>
          <span
            data-testid="outcome-metadata-freshness"
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${freshnessToneClasses(metadata.freshness_status)}`}
          >
            Freshness: {metadata.freshness_status}
          </span>
          <span
            data-testid="outcome-metadata-source-confirmation"
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${sourceConfirmationToneClasses(metadata.source_confirmation_status)}`}
          >
            Source confirmation: {metadata.source_confirmation_status}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-200">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden /> Source authority:{' '}
            {data.source_of_truth_system}
          </span>
        </div>
      </header>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <dl className="space-y-3 text-sm text-slate-700">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Metric ID
            </dt>
            <dd className="mt-1 font-mono text-sm text-slate-950">{metadata.metric_id}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Formula version
            </dt>
            <dd
              data-testid="outcome-metadata-formula-version"
              className="mt-1 font-mono text-sm text-slate-950"
            >
              {metadata.formula_version}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Owner</dt>
            <dd className="mt-1 text-sm text-slate-950">{metadata.owner}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              <Clock className="-mt-0.5 mr-1 inline-block h-3 w-3" />
              Generated at
            </dt>
            <dd className="mt-1 font-mono text-sm text-slate-950">{metadata.timestamp}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Scenario
            </dt>
            <dd className="mt-1 font-mono text-sm text-slate-950">{data.scenario}</dd>
          </div>
        </dl>
        <dl className="space-y-3 text-sm text-slate-700">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              <Fingerprint className="-mt-0.5 mr-1 inline-block h-3 w-3" />
              Fingerprint
            </dt>
            <dd
              data-testid="outcome-metadata-fingerprint"
              className="mt-1 break-all rounded-xl bg-slate-50 p-3 font-mono text-xs leading-5 text-slate-800"
            >
              {metadata.fingerprint}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              <FileSearch2 className="-mt-0.5 mr-1 inline-block h-3 w-3" />
              Audit reference
            </dt>
            <dd
              data-testid="outcome-metadata-audit-reference"
              className="mt-1 break-all font-mono text-sm text-slate-950"
            >
              {metadata.audit_reference}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              <ScrollText className="-mt-0.5 mr-1 inline-block h-3 w-3" />
              Metric definitions
            </dt>
            <dd className="mt-1 flex flex-col gap-2">
              {metadata.metric_definitions.map((definition) => (
                <span
                  key={definition}
                  data-testid={`outcome-definition-${definition.split(' ')[0]}`}
                  className="break-words rounded-xl bg-violet-50 px-2.5 py-1.5 font-mono text-[11px] leading-5 text-violet-800 ring-1 ring-violet-200"
                >
                  {definition}
                </span>
              ))}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Filters applied
            </dt>
            <dd className="mt-2">
              <FilterChips filters={metadata.filters} />
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
