import { Fingerprint, FileSearch2, Clock, ScrollText } from 'lucide-react';
import type { SubscriptionAnalyticsMetricMetadata } from '../../../types/subscriptionAnalytics';
import TrustBadge from '../../status/TrustBadge';

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
          {key}: <span className="ml-1 font-mono">{Array.isArray(value) ? value.join(', ') : String(value)}</span>
        </li>
      ))}
    </ul>
  );
}

export default function SubscriptionMetricMetadataPanel({
  metadata,
}: {
  metadata: SubscriptionAnalyticsMetricMetadata;
}) {
  return (
    <section
      data-testid="subscription-metric-metadata-panel"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-950">Metric metadata and audit trail</h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
            Required by export governance: filters, definitions, trust label, freshness, formula
            version, owner, timestamp, fingerprint, and audit reference must all accompany this
            metric before export is unblocked.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <TrustBadge trustLabel={metadata.trust_label} />
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
            Source system: {metadata.source_system}
          </span>
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
            Source confirmation: {metadata.source_confirmation_status}
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
            <dd className="mt-1 font-mono text-sm text-slate-950">{metadata.formula_version}</dd>
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
              Freshness
            </dt>
            <dd className="mt-1 text-sm text-slate-950">{metadata.freshness}</dd>
          </div>
        </dl>
        <dl className="space-y-3 text-sm text-slate-700">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              <Fingerprint className="-mt-0.5 mr-1 inline-block h-3 w-3" />
              Fingerprint
            </dt>
            <dd
              data-testid="metric-metadata-fingerprint"
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
              data-testid="metric-metadata-audit-reference"
              className="mt-1 break-all font-mono text-sm text-slate-950"
            >
              {metadata.audit_reference}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              <ScrollText className="-mt-0.5 mr-1 inline-block h-3 w-3" />
              Metric definitions referenced
            </dt>
            <dd className="mt-1 flex flex-wrap gap-2">
              {metadata.metric_definitions.map((definition) => (
                <span
                  key={definition}
                  className="inline-flex items-center rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-200"
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
            <dd className="mt-2"><FilterChips filters={metadata.filters} /></dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
