import { useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SubscriptionPageHeader from '../../subscription/SubscriptionPageHeader';
import PageActionBar from '../PageActionBar';
import StatusBanner from '../StatusBanner';
import StateChip from '../StateChip';
import MetricDisclosure from '../MetricDisclosure';
import { useSubscriptionBusinessValue } from '../../../hooks/useSubscriptionBusinessValue';
import {
  BUSINESS_VALUE_STATE_LABEL,
  BUSINESS_VALUE_STATE_TONE,
  BUSINESS_VALUE_STATE_TOOLTIP,
  formatBusinessValue,
  formatFriendlyTimestamp,
  formatRelativeAge,
  TRUST_CHIP_LABEL,
  TRUST_CHIP_TOOLTIP,
  TRUST_TONE,
} from '../copy';
import type { SubscriptionBusinessValueScenario } from '../../../types/subscriptionBusinessValue';

const SCENARIOS: Array<{
  id: SubscriptionBusinessValueScenario;
  label: string;
  helper: string;
}> = [
  {
    id: 'baseline',
    label: 'Baseline',
    helper: 'Mix of confirmed, estimated, and pending business-value metrics.',
  },
  {
    id: 'pending_stayai_confirmation',
    label: 'Pending Stay.ai',
    helper: 'Stay.ai has not yet confirmed every record in the period.',
  },
  {
    id: 'missing_stayai_final_state',
    label: 'Missing Stay.ai',
    helper: 'Stay.ai delivery is interrupted; nothing is confirmed.',
  },
  {
    id: 'empty',
    label: 'Empty window',
    helper: 'No subscription calls in this view yet.',
  },
];

const HEADLINE_METRIC_ID = 'net_business_value_impact';

const COLUMN_GROUPS: Array<{
  key: 'confirmed' | 'estimated' | 'pending';
  title: string;
  description: string;
  states: Array<'confirmed' | 'estimated' | 'pending' | 'unknown' | 'blocked_by_data'>;
  className: string;
}> = [
  {
    key: 'confirmed',
    title: 'Confirmed',
    description: 'Stay.ai-confirmed values you can quote in board reporting.',
    states: ['confirmed'],
    className: 'border-emerald-200/80 bg-emerald-50/50',
  },
  {
    key: 'estimated',
    title: 'Estimated',
    description: 'Useful for trends, not for board decks.',
    states: ['estimated'],
    className: 'border-sky-200/80 bg-sky-50/50',
  },
  {
    key: 'pending',
    title: 'Pending or blocked',
    description: 'Numbers we cannot publish yet.',
    states: ['pending', 'unknown', 'blocked_by_data'],
    className: 'border-amber-200/80 bg-amber-50/40',
  },
];

/**
 * Cycle 008 Business Value / Cost Savings page.
 *
 * Implements the W3 workflow ("How much money did we save?"). Renders the
 * Net Business Value Impact headline plus a three-column layout grouped by
 * `BusinessValueState` (confirmed / estimated / pending+blocked). Every card
 * carries a state chip and a Level 2 disclosure. No raw enums on Level 1.
 */
export default function BusinessValuePage() {
  const [scenario, setScenario] = useState<SubscriptionBusinessValueScenario>('baseline');
  const state = useSubscriptionBusinessValue(scenario);

  const headlineMetric = useMemo(
    () =>
      state.data.metrics.find((m) => m.metric_id === HEADLINE_METRIC_ID) ??
      state.data.metrics[0],
    [state.data.metrics],
  );

  const grouped = useMemo(() => {
    const map: Record<string, typeof state.data.metrics> = {
      confirmed: [],
      estimated: [],
      pending: [],
    };
    for (const metric of state.data.metrics) {
      if (metric.metric_id === HEADLINE_METRIC_ID) continue;
      if (metric.value_state === 'confirmed') map.confirmed.push(metric);
      else if (metric.value_state === 'estimated') map.estimated.push(metric);
      else map.pending.push(metric);
    }
    return map;
  }, [state.data.metrics]);

  return (
    <div className="space-y-5">
      <SubscriptionPageHeader
        id="subscription-business-value-heading"
        eyebrow="Business value"
        title="Calls we saved — in dollars"
        description={
          <>
            Net business value = gross protected − offer cost + support cost avoided. Each
            number is tagged with how reliable it is right now.
          </>
        }
        meta={
          <>
            <StateChip tone="brand" label="Stay.ai · source of truth" />
            <StateChip tone="info" label="Shopify · context only" />
            <StateChip
              tone={TRUST_TONE[state.data.metadata.trust_label]}
              label={`Trust · ${TRUST_CHIP_LABEL[state.data.metadata.trust_label]}`}
              tooltip={TRUST_CHIP_TOOLTIP[state.data.metadata.trust_label]}
            />
          </>
        }
        actions={
          <Link
            to="/subscriptions/follow-up"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-400 hover:bg-slate-50"
          >
            Open follow-up queue
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        }
      />

      <PageActionBar
        activeFilters={[{ id: 'date_preset', label: 'Last 30 days' }]}
        filterDisabledReason="Filter drawer ships in a follow-up PR. Default Last 30 days is applied."
        exportDisabledReason="Export drawer ships in a follow-up PR. Use Export & Audit for now."
      />

      {state.source === 'fixture' ? (
        state.permissionDenied ? (
          <StatusBanner kind="permission_denied" />
        ) : (
          <StatusBanner kind="fixture_unreachable" />
        )
      ) : null}

      {scenario === 'missing_stayai_final_state' ? (
        <StatusBanner
          kind="missing"
          detail="The numbers below cannot be trusted until this is fixed."
          action={
            <Link
              to="/data-quality"
              className="rounded-full border border-rose-200 bg-white px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50"
            >
              Open data quality
            </Link>
          }
        />
      ) : null}

      <fieldset
        aria-label="Business value scenario"
        className="surface-card flex flex-wrap items-center gap-2 px-4 py-3"
      >
        <legend className="sr-only">Business value scenario</legend>
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          View
        </span>
        {SCENARIOS.map((option) => {
          const active = option.id === scenario;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setScenario(option.id)}
              aria-pressed={active}
              title={option.helper}
              data-testid={`business-value-scenario-${option.id}`}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                active
                  ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </fieldset>

      {headlineMetric ? (
        <section
          aria-labelledby="business-value-headline-heading"
          className="surface-card-elevated relative overflow-hidden p-6 sm:p-8"
        >
          <p className="eyebrow">Net business value impact</p>
          <h2
            id="business-value-headline-heading"
            className="display-title mt-2 text-3xl text-slate-950 sm:text-4xl md:text-5xl"
          >
            {formatBusinessValue(headlineMetric.value, headlineMetric.unit)}
          </h2>
          <p className="mt-2 max-w-xl text-sm text-slate-600">
            {headlineMetric.plain_language_summary}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StateChip
              tone={BUSINESS_VALUE_STATE_TONE[headlineMetric.value_state]}
              label={BUSINESS_VALUE_STATE_LABEL[headlineMetric.value_state]}
              tooltip={BUSINESS_VALUE_STATE_TOOLTIP[headlineMetric.value_state]}
            />
            <StateChip tone="brand" label="Stay.ai · official" />
            <StateChip
              tone={TRUST_TONE[headlineMetric.trust_label]}
              label={TRUST_CHIP_LABEL[headlineMetric.trust_label]}
              tooltip={TRUST_CHIP_TOOLTIP[headlineMetric.trust_label]}
            />
          </div>
          <MetricDisclosure
            summary={headlineMetric.plain_language_summary}
            formula={headlineMetric.formula}
            formulaVersion={headlineMetric.formula_version}
            owner={headlineMetric.owner}
            updatedAge={formatRelativeAge(headlineMetric.timestamp)}
            updatedTimestamp={formatFriendlyTimestamp(headlineMetric.timestamp)}
            governance={
              <ul className="space-y-1">
                <li>metric id: {headlineMetric.metric_id}</li>
                <li>fingerprint: {headlineMetric.fingerprint}</li>
                <li>audit reference: {headlineMetric.audit_reference}</li>
              </ul>
            }
          />
        </section>
      ) : null}

      <section
        aria-labelledby="business-value-grid-heading"
        className="grid gap-4 lg:grid-cols-3"
      >
        <h2 id="business-value-grid-heading" className="sr-only">
          Business value metrics by state
        </h2>
        {COLUMN_GROUPS.map((group) => {
          const groupMetrics = grouped[group.key] ?? [];
          return (
            <article
              key={group.key}
              data-testid={`business-value-column-${group.key}`}
              className={`flex flex-col gap-3 rounded-2xl border ${group.className} p-4`}
            >
              <header className="space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-600">
                  {group.title}
                </p>
                <p className="text-[12px] text-slate-600">{group.description}</p>
              </header>
              {groupMetrics.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-300 bg-white/70 px-3 py-2 text-[12px] text-slate-500">
                  No metrics in this state for the current view.
                </p>
              ) : (
                <ul className="space-y-3">
                  {groupMetrics.map((metric) => (
                    <li
                      key={metric.metric_id}
                      data-testid={`business-value-metric-${metric.metric_id}`}
                      className="rounded-xl border border-white bg-white/80 p-3 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            {metric.display_label}
                          </p>
                          <p className="mt-1 text-xl font-semibold text-slate-950">
                            {formatBusinessValue(metric.value, metric.unit)}
                          </p>
                        </div>
                        <StateChip
                          tone={BUSINESS_VALUE_STATE_TONE[metric.value_state]}
                          label={BUSINESS_VALUE_STATE_LABEL[metric.value_state]}
                          tooltip={BUSINESS_VALUE_STATE_TOOLTIP[metric.value_state]}
                        />
                      </div>
                      <p className="mt-1 text-[12px] leading-5 text-slate-600">
                        {metric.plain_language_summary}
                      </p>
                      {metric.blocked_reason_plain_language ? (
                        <p className="mt-2 rounded-lg bg-amber-50 px-2 py-1.5 text-[11px] text-amber-900">
                          {metric.blocked_reason_plain_language}
                        </p>
                      ) : null}
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <StateChip
                          tone={TRUST_TONE[metric.trust_label]}
                          label={TRUST_CHIP_LABEL[metric.trust_label]}
                          tooltip={TRUST_CHIP_TOOLTIP[metric.trust_label]}
                        />
                      </div>
                      <MetricDisclosure
                        summary={metric.plain_language_summary}
                        formula={metric.formula}
                        formulaVersion={metric.formula_version}
                        owner={metric.owner}
                        updatedAge={formatRelativeAge(metric.timestamp)}
                        updatedTimestamp={formatFriendlyTimestamp(metric.timestamp)}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </article>
          );
        })}
      </section>
    </div>
  );
}
