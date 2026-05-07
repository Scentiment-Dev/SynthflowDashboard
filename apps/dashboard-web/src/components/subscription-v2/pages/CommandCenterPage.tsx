import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import SubscriptionPageHeader from '../../subscription/SubscriptionPageHeader';
import PageActionBar from '../PageActionBar';
import KpiCard from '../KpiCard';
import StateChip from '../StateChip';
import StatusBanner from '../StatusBanner';
import MetricDisclosure from '../MetricDisclosure';
import { useSubscriptionOutcomes } from '../../../hooks/useSubscriptionOutcomes';
import { useSubscriptionBusinessValue } from '../../../hooks/useSubscriptionBusinessValue';
import { useSubscriptionFollowUp } from '../../../hooks/useSubscriptionFollowUp';
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

function pickHeadlineMetric(
  metrics: ReturnType<typeof useSubscriptionBusinessValue>['data']['metrics'],
) {
  return (
    metrics.find((m) => m.metric_id === 'net_business_value_impact') ?? metrics[0] ?? null
  );
}

/**
 * Cycle 008 Command Center.
 *
 * Implements the W1 workflow ("What changed in subscriptions today?"). Above
 * the fold: 5 KPIs max, a "What needs attention now" panel with at most 3 rows,
 * and clear drilldown CTAs. Source-health, event traces, formula tables, and
 * raw governance metadata are NOT mounted on this page; they live behind their
 * own subnav routes (Outcomes, Diagnostics) per the IA v2 spec.
 */
export default function CommandCenterPage() {
  const outcomes = useSubscriptionOutcomes('baseline');
  const businessValue = useSubscriptionBusinessValue('baseline');
  const followUp = useSubscriptionFollowUp('baseline');

  const headlineMetric = useMemo(
    () => pickHeadlineMetric(businessValue.data.metrics),
    [businessValue.data.metrics],
  );

  const metrics = outcomes.data.metrics;
  const pendingCount = metrics.pending_stayai_confirmation_total;
  const portalSent = metrics.portal_link_sent_total;
  const portalConfirmed = metrics.portal_completion_confirmed_total;
  const portalRate =
    portalSent > 0 ? Math.round((portalConfirmed / portalSent) * 1000) / 10 : null;

  const followUpCount = followUp.data.records.length;
  const portalUnknownCount = followUp.data.records.filter(
    (r) =>
      r.portal_completion_status === 'completion_unknown' ||
      r.portal_completion_status === 'link_sent',
  ).length;

  const totalAttention = pendingCount + portalUnknownCount;

  return (
    <div className="space-y-5">
      <SubscriptionPageHeader
        id="subscription-command-center-heading"
        eyebrow="Subscription analytics"
        title="What changed in subscriptions today?"
        description={
          <>
            Stay.ai is the system that owns the official subscription record. Shopify is
            context only. Numbers shown follow our published rulebook.
          </>
        }
        meta={
          <>
            <StateChip
              tone="brand"
              label="Stay.ai · source of truth"
            />
            <StateChip
              tone="info"
              label="Shopify · context only"
            />
            <StateChip
              tone="neutral"
              label="Trust labels · system-calculated"
            />
          </>
        }
        actions={
          <Link
            to="/subscriptions/follow-up"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-900 bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800"
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

      {outcomes.source === 'fixture' ? (
        outcomes.permissionDenied ? (
          <StatusBanner
            kind="permission_denied"
            action={
              <button
                type="button"
                className="rounded-full border border-rose-200 bg-white px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50"
              >
                Ask my manager for access
              </button>
            }
          />
        ) : (
          <StatusBanner
            kind="fixture_unreachable"
            action={
              <button
                type="button"
                className="rounded-full border border-amber-300 bg-white px-3 py-1 text-xs font-semibold text-amber-900 hover:bg-amber-50"
              >
                Refresh
              </button>
            }
          />
        )
      ) : (
        <StatusBanner
          kind="live"
          updatedAge={formatRelativeAge(outcomes.data.metadata.timestamp)}
        />
      )}

      <section
        aria-labelledby="command-center-kpis-heading"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        <h2 id="command-center-kpis-heading" className="sr-only">
          Headline subscription KPIs
        </h2>
        <KpiCard
          testId="command-center-kpi-saves"
          label="Confirmed saves"
          value={metrics.confirmed_retained_total.toLocaleString()}
          valueSubline={`of ${metrics.save_or_retention_attempts_total.toLocaleString()} retention attempts`}
          sourceChipLabel="Stay.ai · official"
          sourceChipTone="brand"
          trustChipLabel={TRUST_CHIP_LABEL[outcomes.data.metadata.trust_label]}
          trustChipTone={TRUST_TONE[outcomes.data.metadata.trust_label]}
          trustChipTooltip={TRUST_CHIP_TOOLTIP[outcomes.data.metadata.trust_label]}
          delta={{ label: 'vs prior 28 days', direction: 'up' }}
        />
        <KpiCard
          testId="command-center-kpi-cancels"
          label="Confirmed cancels"
          value={metrics.confirmed_cancellations_total.toLocaleString()}
          valueSubline={`of ${metrics.cancellation_requests_total.toLocaleString()} cancellation requests`}
          sourceChipLabel="Stay.ai · official"
          sourceChipTone="brand"
          trustChipLabel={TRUST_CHIP_LABEL[outcomes.data.metadata.trust_label]}
          trustChipTone={TRUST_TONE[outcomes.data.metadata.trust_label]}
          trustChipTooltip={TRUST_CHIP_TOOLTIP[outcomes.data.metadata.trust_label]}
          delta={{ label: 'vs prior 28 days', direction: 'down' }}
        />
        <KpiCard
          testId="command-center-kpi-pending"
          label="Pending Stay.ai"
          value={pendingCount.toLocaleString()}
          valueSubline="awaiting official confirmation"
          sourceChipLabel="Stay.ai · pending"
          sourceChipTone="warning"
          stateChipLabel={pendingCount > 0 ? 'Pending Stay.ai' : 'All confirmed'}
          stateChipTone={pendingCount > 0 ? 'warning' : 'success'}
          stateChipTooltip={
            pendingCount > 0
              ? BUSINESS_VALUE_STATE_TOOLTIP.pending
              : 'All records in this view are officially confirmed.'
          }
        />
        <KpiCard
          testId="command-center-kpi-portal"
          label="Portal completion"
          value={portalRate !== null ? `${portalRate}%` : '—'}
          valueSubline={`${portalConfirmed} of ${portalSent} links confirmed`}
          sourceChipLabel="Portal · completion confirmed"
          sourceChipTone="info"
          trustChipLabel={TRUST_CHIP_LABEL[outcomes.data.metadata.trust_label]}
          trustChipTone={TRUST_TONE[outcomes.data.metadata.trust_label]}
          trustChipTooltip={TRUST_CHIP_TOOLTIP[outcomes.data.metadata.trust_label]}
        />
        {headlineMetric ? (
          <KpiCard
            testId="command-center-kpi-business-value"
            label="Net business value"
            value={formatBusinessValue(headlineMetric.value, headlineMetric.unit)}
            valueSubline="gross protected − offer cost + support avoided"
            sourceChipLabel="Stay.ai · official"
            sourceChipTone="brand"
            stateChipLabel={BUSINESS_VALUE_STATE_LABEL[headlineMetric.value_state]}
            stateChipTone={BUSINESS_VALUE_STATE_TONE[headlineMetric.value_state]}
            stateChipTooltip={
              BUSINESS_VALUE_STATE_TOOLTIP[headlineMetric.value_state]
            }
            disclosure={
              <MetricDisclosure
                summary={headlineMetric.plain_language_summary}
                formula={headlineMetric.formula}
                formulaVersion={headlineMetric.formula_version}
                owner={headlineMetric.owner}
                updatedAge={formatRelativeAge(headlineMetric.timestamp)}
                updatedTimestamp={formatFriendlyTimestamp(headlineMetric.timestamp)}
              />
            }
          />
        ) : null}
      </section>

      <section
        aria-labelledby="command-center-attention-heading"
        className="surface-card space-y-3 px-5 py-5"
      >
        <header className="flex items-center justify-between gap-3">
          <div>
            <p className="eyebrow">What needs attention now</p>
            <h2
              id="command-center-attention-heading"
              className="display-title mt-1 text-lg sm:text-xl"
            >
              {totalAttention === 0
                ? 'Nothing needs attention right now.'
                : `${totalAttention} item${totalAttention === 1 ? '' : 's'} need a look.`}
            </h2>
          </div>
          <ShieldCheck className="hidden h-5 w-5 text-emerald-600 sm:block" aria-hidden />
        </header>

        <ul className="space-y-2">
          {pendingCount > 0 ? (
            <li className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/60 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-amber-900">
                  {pendingCount} call{pendingCount === 1 ? ' is' : 's are'} still waiting for
                  official confirmation
                </p>
                <p className="text-[12px] text-amber-800/90">
                  Stay.ai has not sent a final outcome yet. Numbers may change.
                </p>
              </div>
              <Link
                to="/subscriptions/follow-up"
                className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-white px-3 py-1 text-xs font-semibold text-amber-900 hover:bg-amber-100"
              >
                Open follow-up queue
                <ArrowRight className="h-3 w-3" />
              </Link>
            </li>
          ) : null}

          {portalUnknownCount > 0 ? (
            <li className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/60 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-amber-900">
                  {portalUnknownCount} customer{portalUnknownCount === 1 ? "'s" : "s'"} portal
                  completion is unconfirmed
                </p>
                <p className="text-[12px] text-amber-800/90">
                  The customer received the link, but we have not confirmed they finished
                  the action.
                </p>
              </div>
              <Link
                to="/subscriptions/follow-up"
                className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-white px-3 py-1 text-xs font-semibold text-amber-900 hover:bg-amber-100"
              >
                Review portal handoff
                <ArrowRight className="h-3 w-3" />
              </Link>
            </li>
          ) : null}

          {followUpCount > 0 && pendingCount === 0 && portalUnknownCount === 0 ? (
            <li className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {followUpCount} follow-up{followUpCount === 1 ? '' : 's'} queued for review
                </p>
                <p className="text-[12px] text-slate-500">
                  Operators picking work today should start here.
                </p>
              </div>
              <Link
                to="/subscriptions/follow-up"
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-white"
              >
                Open follow-up queue
                <ArrowRight className="h-3 w-3" />
              </Link>
            </li>
          ) : null}

          {totalAttention === 0 && followUpCount === 0 ? (
            <li className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              All Stay.ai-controlled subscription states are clear. No follow-ups in the
              queue.
            </li>
          ) : null}
        </ul>
      </section>

      <section
        aria-labelledby="command-center-outcome-summary-heading"
        className="surface-card space-y-3 px-5 py-5"
      >
        <header className="flex items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Outcome path summary</p>
            <h2
              id="command-center-outcome-summary-heading"
              className="display-title mt-1 text-lg sm:text-xl"
            >
              How calls are moving through the subscription flow
            </h2>
          </div>
          <Link
            to="/subscriptions/outcomes"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-950"
          >
            See full outcomes
            <ArrowRight className="h-3 w-3" />
          </Link>
        </header>
        <ol className="grid gap-3 sm:grid-cols-3">
          <li className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              In scope
            </p>
            <p className="mt-1 text-2xl font-semibold text-slate-950">
              {metrics.subscription_contacts_total.toLocaleString()}
            </p>
            <p className="mt-1 text-[12px] text-slate-500">
              subscription calls handled in this view
            </p>
          </li>
          <li className="rounded-2xl border border-emerald-200/70 bg-emerald-50/60 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Confirmed save
            </p>
            <p className="mt-1 text-2xl font-semibold text-emerald-900">
              {metrics.confirmed_retained_total.toLocaleString()}
            </p>
            <p className="mt-1 text-[12px] text-emerald-800/80">
              Stay.ai-confirmed retained subscriptions
            </p>
          </li>
          <li className="rounded-2xl border border-rose-200/70 bg-rose-50/60 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-700">
              Confirmed cancel
            </p>
            <p className="mt-1 text-2xl font-semibold text-rose-900">
              {metrics.confirmed_cancellations_total.toLocaleString()}
            </p>
            <p className="mt-1 text-[12px] text-rose-800/80">
              Stay.ai-confirmed cancellations
            </p>
          </li>
        </ol>
      </section>

      <p className="text-right text-[11px] text-slate-400">
        <Link
          to="/subscriptions/diagnostics"
          className="font-semibold text-slate-500 hover:text-slate-700"
        >
          Open diagnostic view
        </Link>
      </p>
    </div>
  );
}
