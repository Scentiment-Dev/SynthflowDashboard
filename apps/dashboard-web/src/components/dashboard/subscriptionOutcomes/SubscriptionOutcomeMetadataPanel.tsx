import type { ReactNode } from 'react';
import {
  Clock,
  FileSearch2,
  Fingerprint,
  Hash,
  ListTree,
  ScrollText,
  ShieldCheck,
  Tag,
  User2,
} from 'lucide-react';
import type {
  SubscriptionOutcomeMetadata,
  SubscriptionOutcomesResponse,
} from '../../../types/subscriptionOutcomes';
import {
  freshnessToneClasses,
  sourceConfirmationToneClasses,
  trustToneClasses,
} from '../../../utils/subscriptionOutcomesState';
import MetadataFilterChips from '../MetadataFilterChips';

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
      className="surface-card p-5 sm:p-6"
    >
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="eyebrow flex items-center gap-1.5">
            <ListTree className="h-3 w-3" /> Metric metadata · audit trail
          </p>
          <h3 className="display-title mt-1 text-base sm:text-lg">
            Outcome metric definition, source authority, and audit trail
          </h3>
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-600">
            Every KPI and funnel section in this view is governed by the metric definitions,
            formula version, source authority, trust label, freshness, and audit reference shown
            below. These fields must accompany every export.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span
            data-testid="outcome-metadata-trust"
            className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold ${trustToneClasses(metadata.trust_label)}`}
          >
            Trust: {metadata.trust_label}
          </span>
          <span
            data-testid="outcome-metadata-freshness"
            className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold ${freshnessToneClasses(metadata.freshness_status)}`}
          >
            Freshness: {metadata.freshness_status}
          </span>
          <span
            data-testid="outcome-metadata-source-confirmation"
            className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold ${sourceConfirmationToneClasses(metadata.source_confirmation_status)}`}
          >
            Source confirmation: {metadata.source_confirmation_status}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-[11px] font-semibold text-violet-700 ring-1 ring-violet-200">
            <ShieldCheck className="h-3 w-3" aria-hidden /> Source authority:{' '}
            {data.source_of_truth_system}
          </span>
        </div>
      </header>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <dl className="space-y-3 text-sm text-slate-700">
          <MetadataItem icon={Hash} label="Metric ID">
            <span className="mono text-sm text-slate-950">{metadata.metric_id}</span>
          </MetadataItem>
          <MetadataItem icon={Tag} label="Formula version">
            <span
              data-testid="outcome-metadata-formula-version"
              className="mono text-sm text-slate-950"
            >
              {metadata.formula_version}
            </span>
          </MetadataItem>
          <MetadataItem icon={User2} label="Owner">
            <span className="text-sm font-medium text-slate-950">{metadata.owner}</span>
          </MetadataItem>
          <MetadataItem icon={Clock} label="Generated at">
            <span className="mono text-sm text-slate-950">{metadata.timestamp}</span>
          </MetadataItem>
          <MetadataItem icon={ListTree} label="Scenario">
            <span className="mono text-sm text-slate-950">{data.scenario}</span>
          </MetadataItem>
        </dl>
        <dl className="space-y-3 text-sm text-slate-700">
          <MetadataItem icon={Fingerprint} label="Fingerprint">
            <span
              data-testid="outcome-metadata-fingerprint"
              className="block break-all rounded-xl border border-slate-200 bg-slate-50/80 p-3 font-mono text-[11px] leading-5 text-slate-800"
            >
              {metadata.fingerprint}
            </span>
          </MetadataItem>
          <MetadataItem icon={FileSearch2} label="Audit reference">
            <span
              data-testid="outcome-metadata-audit-reference"
              className="break-all font-mono text-sm text-slate-950"
            >
              {metadata.audit_reference}
            </span>
          </MetadataItem>
          <MetadataItem icon={ScrollText} label="Metric definitions">
            <div className="mt-1 flex flex-col gap-2">
              {metadata.metric_definitions.map((definition) => (
                <span
                  key={definition}
                  data-testid={`outcome-definition-${definition.split(' ')[0]}`}
                  className="break-words rounded-xl border border-violet-200 bg-violet-50/80 px-2.5 py-1.5 font-mono text-[11px] leading-5 text-violet-900"
                >
                  {definition}
                </span>
              ))}
            </div>
          </MetadataItem>
          <MetadataItem icon={Tag} label="Filters applied">
            <div className="mt-1">
              <MetadataFilterChips filters={metadata.filters} />
            </div>
          </MetadataItem>
        </dl>
      </div>
    </section>
  );
}

function MetadataItem({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof ShieldCheck;
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
        <Icon className="h-3 w-3" aria-hidden /> {label}
      </dt>
      <dd className="mt-1.5">{children}</dd>
    </div>
  );
}
