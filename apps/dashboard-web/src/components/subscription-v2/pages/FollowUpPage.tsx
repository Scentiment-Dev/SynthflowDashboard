import { useEffect, useMemo, useState } from 'react';
import SubscriptionPageHeader from '../../subscription/SubscriptionPageHeader';
import PageActionBar from '../PageActionBar';
import StatusBanner from '../StatusBanner';
import StateChip from '../StateChip';
import { useSubscriptionFollowUp } from '../../../hooks/useSubscriptionFollowUp';
import {
  formatBusinessValue,
  formatRelativeAge,
  PORTAL_STATE_LABEL,
  PORTAL_STATE_TONE,
  PRIORITY_LABEL,
  PRIORITY_TONE,
  SLA_LABEL,
  SLA_TONE,
  SOURCE_CONFIRMATION_LABEL,
  SOURCE_CONFIRMATION_TONE,
} from '../copy';
import type {
  SubscriptionFollowUpRecord,
  SubscriptionFollowUpScenario,
} from '../../../types/subscriptionFollowUp';

const SCENARIOS: Array<{
  id: SubscriptionFollowUpScenario;
  label: string;
  helper: string;
}> = [
  {
    id: 'baseline',
    label: 'Baseline',
    helper: 'Mix of pending, portal-unknown, and low-trust follow-ups.',
  },
  {
    id: 'pending_stayai_confirmation',
    label: 'Pending Stay.ai',
    helper: 'Most rows are still waiting for Stay.ai confirmation.',
  },
  {
    id: 'missing_stayai_final_state',
    label: 'Missing Stay.ai',
    helper: 'Stay.ai delivery is interrupted; queue is in hard-fail.',
  },
  {
    id: 'empty',
    label: 'Empty queue',
    helper: 'No calls need a human right now.',
  },
];

type ReasonFilter =
  | 'all'
  | 'pending_stayai'
  | 'portal_unknown'
  | 'low_trust';

const REASON_FILTERS: Array<{ id: ReasonFilter; label: string }> = [
  { id: 'all', label: 'All follow-ups' },
  { id: 'pending_stayai', label: 'Pending Stay.ai' },
  { id: 'portal_unknown', label: 'Portal unknown' },
  { id: 'low_trust', label: 'Low trust' },
];

function matchesReason(record: SubscriptionFollowUpRecord, filter: ReasonFilter): boolean {
  switch (filter) {
    case 'all':
      return true;
    case 'pending_stayai':
      return record.stayai_confirmation_status !== 'confirmed';
    case 'portal_unknown':
      return (
        record.portal_completion_status === 'completion_unknown' ||
        record.portal_completion_status === 'link_sent'
      );
    case 'low_trust':
      // "Low trust" is a data-reliability signal, NOT operational priority.
      // Priority is a triage field (low/medium/high) and a trustworthy record
      // can still be priority=low. We surface low-trust rows by:
      //   1. Stay.ai confirmation status === "missing" (the official outcome
      //      has no final state, so the record cannot be fully trusted), OR
      //   2. The follow-up reason text explicitly mentions "low trust"
      //      (operator-authored override).
      return (
        record.stayai_confirmation_status === 'missing' ||
        record.reason.toLowerCase().includes('low trust')
      );
    default:
      return true;
  }
}

/**
 * Cycle 008 Failure + Follow-Up Queue.
 *
 * Implements the W4 workflow ("Which customers need follow-up?"). Operator
 * table with anonymised contact ID, plain-language reason, age, source authority,
 * suggested action, value at risk, and SLA state. Bulk actions appear when at
 * least one row is selected; export drawer integration ships in Agent C's PR.
 */
export default function FollowUpPage() {
  const [scenario, setScenario] = useState<SubscriptionFollowUpScenario>('baseline');
  const [reason, setReason] = useState<ReasonFilter>('all');
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const state = useSubscriptionFollowUp(scenario);

  const records = useMemo(
    () => state.data.records.filter((record) => matchesReason(record, reason)),
    [reason, state.data.records],
  );

  // Bulk-action affordances must reflect only the rows the operator can currently
  // see. If the reason filter or scenario changes, any selected rows that are no
  // longer visible must NOT count toward the bulk-action bar so we never apply an
  // action to cases the user is no longer reviewing.
  const visibleSelectedIds = useMemo(
    () => records.filter((record) => selected[record.customer_or_case_id]).map((r) => r.customer_or_case_id),
    [records, selected],
  );
  const selectedCount = visibleSelectedIds.length;
  const allSelected = records.length > 0 && visibleSelectedIds.length === records.length;

  useEffect(() => {
    setSelected({});
  }, [scenario]);

  const totalValueAtRisk = records.reduce(
    (sum, r) => sum + (typeof r.estimated_value_at_risk === 'number' ? r.estimated_value_at_risk : 0),
    0,
  );

  return (
    <div className="space-y-5">
      <SubscriptionPageHeader
        id="subscription-follow-up-heading"
        eyebrow="Follow-up queue"
        title="Calls that need a human"
        description={
          <>
            {records.length === 0
              ? 'No follow-ups in this filter — try widening or clearing filters.'
              : `${records.length} call${records.length === 1 ? '' : 's'} need a human, with about ${formatBusinessValue(totalValueAtRisk, 'usd')} of subscription value at risk.`}
          </>
        }
        meta={
          <>
            <StateChip tone="brand" label="Stay.ai · source of truth" />
            <StateChip tone="info" label="Portal · completion confirmed counts only" />
          </>
        }
      />

      <PageActionBar
        activeFilters={
          reason === 'all'
            ? [{ id: 'queue', label: 'Open queue' }]
            : [
                { id: 'queue', label: 'Open queue' },
                {
                  id: 'reason',
                  label:
                    REASON_FILTERS.find((option) => option.id === reason)?.label ?? reason,
                },
              ]
        }
        onClearFilter={(id) => {
          if (id === 'reason') setReason('all');
        }}
        filterDisabledReason="Filter drawer ships in a follow-up PR. Use the reason chips below for now."
        exportDisabledReason="Export drawer ships in a follow-up PR. Use Export & Audit for now."
        exportLabel={
          selectedCount > 0
            ? `Export ${selectedCount} selected row${selectedCount === 1 ? '' : 's'}`
            : 'Export this view'
        }
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
          detail="Every row in the queue is blocked until Stay.ai delivery is restored."
        />
      ) : null}

      <section
        aria-label="Follow-up queue filters"
        className="surface-card flex flex-wrap items-center gap-3 px-4 py-3"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          Reason
        </span>
        {REASON_FILTERS.map((option) => {
          const active = option.id === reason;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setReason(option.id)}
              aria-pressed={active}
              data-testid={`follow-up-reason-${option.id}`}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                active
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
              }`}
            >
              {option.label}
            </button>
          );
        })}
        <span className="ml-auto text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          Scenario
        </span>
        <select
          value={scenario}
          onChange={(event) => setScenario(event.target.value as SubscriptionFollowUpScenario)}
          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
          aria-label="Follow-up queue scenario"
        >
          {SCENARIOS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </section>

      <section
        aria-labelledby="follow-up-table-heading"
        className="surface-card overflow-hidden"
      >
        <h2 id="follow-up-table-heading" className="sr-only">
          Follow-up queue
        </h2>
        {records.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-slate-500">
            <p className="font-semibold text-slate-700">
              No follow-ups in this filter — try widening.
            </p>
            <button
              type="button"
              onClick={() => {
                setReason('all');
                setSelected({});
              }}
              className="mt-3 inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table
              data-testid="follow-up-table"
              className="w-full min-w-[720px] border-separate border-spacing-0 text-left text-sm text-slate-700"
            >
              <thead className="bg-slate-50 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                <tr>
                  <th scope="col" className="px-3 py-2">
                    <input
                      type="checkbox"
                      aria-label="Select all visible follow-ups"
                      checked={allSelected}
                      onChange={(event) => {
                        const next: Record<string, boolean> = {};
                        if (event.target.checked) {
                          for (const r of records) next[r.customer_or_case_id] = true;
                        }
                        setSelected(next);
                      }}
                    />
                  </th>
                  <th scope="col" className="px-3 py-2 font-semibold">
                    Contact
                  </th>
                  <th scope="col" className="px-3 py-2 font-semibold">
                    Reason
                  </th>
                  <th scope="col" className="px-3 py-2 font-semibold">
                    Priority
                  </th>
                  <th scope="col" className="px-3 py-2 font-semibold">
                    Source
                  </th>
                  <th scope="col" className="px-3 py-2 font-semibold">
                    Value at risk
                  </th>
                  <th scope="col" className="px-3 py-2 font-semibold">
                    Last event
                  </th>
                  <th scope="col" className="px-3 py-2 font-semibold">
                    SLA
                  </th>
                  <th scope="col" className="px-3 py-2 font-semibold">
                    Next step
                  </th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => {
                  const checked = Boolean(selected[record.customer_or_case_id]);
                  return (
                    <tr
                      key={record.customer_or_case_id}
                      data-testid={`follow-up-row-${record.customer_or_case_id}`}
                      className="border-t border-slate-100 align-top"
                    >
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          aria-label={`Select ${record.customer_or_case_id}`}
                          checked={checked}
                          onChange={() =>
                            setSelected((prev) => ({
                              ...prev,
                              [record.customer_or_case_id]: !checked,
                            }))
                          }
                        />
                      </td>
                      <td className="px-3 py-3">
                        <p className="font-semibold text-slate-900">
                          {record.customer_or_case_id}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {record.support_label}
                        </p>
                      </td>
                      <td className="px-3 py-3">
                        <p className="text-[13px] text-slate-700">
                          {record.support_summary || record.reason}
                        </p>
                        {record.blocked_reason_plain_language ? (
                          <p className="mt-1 rounded bg-amber-50 px-2 py-1 text-[11px] text-amber-900">
                            {record.blocked_reason_plain_language}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-3 py-3">
                        <StateChip
                          tone={PRIORITY_TONE[record.priority] ?? 'neutral'}
                          label={PRIORITY_LABEL[record.priority] ?? record.priority}
                        />
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-col gap-1.5">
                          <StateChip
                            tone={SOURCE_CONFIRMATION_TONE[record.stayai_confirmation_status]}
                            label={SOURCE_CONFIRMATION_LABEL[record.stayai_confirmation_status]}
                          />
                          <StateChip
                            tone={PORTAL_STATE_TONE[record.portal_completion_status] ?? 'neutral'}
                            label={
                              PORTAL_STATE_LABEL[record.portal_completion_status] ??
                              record.portal_completion_status
                            }
                          />
                        </div>
                      </td>
                      <td className="px-3 py-3 font-medium text-slate-900">
                        {formatBusinessValue(record.estimated_value_at_risk, 'usd')}
                      </td>
                      <td className="px-3 py-3 text-[12px] text-slate-500">
                        {formatRelativeAge(record.last_event_at)}
                      </td>
                      <td className="px-3 py-3">
                        <StateChip
                          tone={SLA_TONE[record.sla_status] ?? 'neutral'}
                          label={SLA_LABEL[record.sla_status] ?? record.sla_status}
                        />
                      </td>
                      <td className="px-3 py-3">
                        <p className="font-semibold text-slate-900">
                          {record.recommended_action}
                        </p>
                        {record.what_to_do_next ? (
                          <p className="text-[11px] text-slate-500">
                            {record.what_to_do_next}
                          </p>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {selectedCount > 0 ? (
          <div
            data-testid="follow-up-bulk-actions"
            className="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white/90 px-5 py-3 backdrop-blur"
          >
            <p className="text-[12px] font-semibold text-slate-700">
              {selectedCount} selected
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              >
                Mark reviewed
              </button>
              <button
                type="button"
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              >
                Escalate
              </button>
              <button
                type="button"
                title="Export drawer ships in a follow-up PR. Use Export & Audit for now."
                className="cursor-not-allowed rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-400"
                disabled
                aria-disabled
              >
                Export selected
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
