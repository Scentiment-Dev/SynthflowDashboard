import { ListChecks, ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

type ReadinessLevel = 'neutral' | 'warning' | 'blocked';

type SubscriptionStateRow = {
  key: string;
  label: string;
  level: ReadinessLevel;
  placeholderStatus: string;
  guidance: string;
};

const levelClasses: Record<ReadinessLevel, string> = {
  neutral: 'border-slate-200 bg-slate-50/80 text-slate-700',
  warning: 'border-amber-200 bg-amber-50/80 text-amber-900',
  blocked: 'border-rose-200 bg-rose-50/80 text-rose-900',
};

const levelChip: Record<ReadinessLevel, { label: string; classes: string; icon: typeof ShieldCheck }> = {
  neutral: {
    label: 'Visible state',
    classes: 'bg-white text-slate-700 ring-1 ring-slate-200',
    icon: ShieldCheck,
  },
  warning: {
    label: 'Heads up',
    classes: 'bg-white text-amber-800 ring-1 ring-amber-200',
    icon: AlertTriangle,
  },
  blocked: {
    label: 'Blocked',
    classes: 'bg-white text-rose-800 ring-1 ring-rose-200',
    icon: ShieldAlert,
  },
};

const SUBSCRIPTION_STATE_ROWS: SubscriptionStateRow[] = [
  {
    key: 'loading',
    label: 'Loading',
    level: 'neutral',
    placeholderStatus: 'Visible placeholder state',
    guidance: 'Displayed while awaiting the dashboard module contract response.',
  },
  {
    key: 'empty',
    label: 'Empty',
    level: 'neutral',
    placeholderStatus: 'Visible placeholder state',
    guidance: 'Displayed when no eligible rows are returned for the active filters.',
  },
  {
    key: 'error',
    label: 'Error',
    level: 'warning',
    placeholderStatus: 'Visible placeholder state',
    guidance: 'Displayed when the source or API request fails and the fixture is used.',
  },
  {
    key: 'permission_denied',
    label: 'Permission denied',
    level: 'blocked',
    placeholderStatus: 'Pending server confirmation',
    guidance: 'Server-side explicit deny must be returned before this section unlocks.',
  },
  {
    key: 'low_trust',
    label: 'Low trust',
    level: 'warning',
    placeholderStatus: 'Visible placeholder state',
    guidance: 'Trust labels remain calculated and never manually elevated.',
  },
  {
    key: 'stale_data',
    label: 'Stale data',
    level: 'warning',
    placeholderStatus: 'Visible placeholder state',
    guidance: 'Shown when source freshness exceeds the warning threshold.',
  },
  {
    key: 'pending_source_confirmation',
    label: 'Pending source confirmation',
    level: 'warning',
    placeholderStatus: 'Visible placeholder state',
    guidance: 'Source match pending until official evidence arrives from Stay.ai.',
  },
  {
    key: 'missing_stayai_final_state',
    label: 'Missing Stay.ai final state',
    level: 'blocked',
    placeholderStatus: 'Pending source finalization',
    guidance: 'No retained or cancelled outcome is finalized without Stay.ai.',
  },
  {
    key: 'portal_unknown_completion',
    label: 'Portal link sent, completion unknown',
    level: 'warning',
    placeholderStatus: 'Visible placeholder state',
    guidance: 'Portal link delivery is diagnostic only; completion remains unconfirmed.',
  },
  {
    key: 'shopify_without_stayai_final',
    label: 'Shopify context available, Stay.ai final missing',
    level: 'warning',
    placeholderStatus: 'Visible placeholder state',
    guidance: 'Shopify can support context display but cannot finalize subscription state.',
  },
  {
    key: 'synthflow_journey_incomplete',
    label: 'Synthflow journey incomplete',
    level: 'warning',
    placeholderStatus: 'Visible placeholder state',
    guidance: 'Journey remains incomplete until required events are normalized.',
  },
  {
    key: 'export_pending_metadata',
    label: 'Export blocked/pending metadata',
    level: 'blocked',
    placeholderStatus: 'Blocked by backend metadata',
    guidance: 'Export remains blocked until metadata and audit fields are returned.',
  },
  {
    key: 'audit_unavailable',
    label: 'Audit metadata unavailable',
    level: 'blocked',
    placeholderStatus: 'Blocked by audit response',
    guidance: 'Audit fingerprint and reference placeholders remain until backend response.',
  },
  {
    key: 'rbac_unavailable',
    label: 'RBAC server confirmation unavailable',
    level: 'blocked',
    placeholderStatus: 'Blocked by authz confirmation',
    guidance: 'UI cannot treat local role checks as production authorization.',
  },
];

export default function SubscriptionStateReadinessPanel() {
  return (
    <section className="surface-card p-5 sm:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="eyebrow flex items-center gap-1.5">
            <ListChecks className="h-3 w-3" /> Shell state coverage
          </p>
          <h3 className="display-title mt-1 text-base sm:text-lg">
            Subscription shell state readiness
          </h3>
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-600">
            Operator-visible UI states that intentionally surface incomplete or pending data. These
            are non-production UI markers and do not represent confirmed business outcomes.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200">
          {SUBSCRIPTION_STATE_ROWS.length} states tracked
        </span>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {SUBSCRIPTION_STATE_ROWS.map((row) => {
          const chip = levelChip[row.level];
          const ChipIcon = chip.icon;
          return (
            <div
              key={row.key}
              className={`flex flex-col gap-2 rounded-xl border p-3 ${levelClasses[row.level]}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold leading-tight">{row.label}</p>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${chip.classes}`}
                >
                  <ChipIcon className="h-3 w-3" /> {chip.label}
                </span>
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-70">
                {row.placeholderStatus}
              </p>
              <p className="text-sm leading-6 opacity-90">{row.guidance}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
