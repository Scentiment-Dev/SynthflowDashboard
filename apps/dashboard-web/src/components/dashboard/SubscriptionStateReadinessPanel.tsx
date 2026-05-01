type ReadinessLevel = 'neutral' | 'warning' | 'blocked';

type SubscriptionStateRow = {
  key: string;
  label: string;
  level: ReadinessLevel;
  placeholderStatus: string;
  guidance: string;
};

const levelClasses: Record<ReadinessLevel, string> = {
  neutral: 'border-slate-200 bg-slate-50 text-slate-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
  blocked: 'border-rose-200 bg-rose-50 text-rose-900',
};

const SUBSCRIPTION_STATE_ROWS: SubscriptionStateRow[] = [
  {
    key: 'loading',
    label: 'Loading',
    level: 'neutral',
    placeholderStatus: 'Visible placeholder state',
    guidance: 'Displayed while awaiting dashboard module contract response.',
  },
  {
    key: 'empty',
    label: 'Empty',
    level: 'neutral',
    placeholderStatus: 'Visible placeholder state',
    guidance: 'Displayed when no eligible rows are returned for filters.',
  },
  {
    key: 'error',
    label: 'Error',
    level: 'warning',
    placeholderStatus: 'Visible placeholder state',
    guidance: 'Displayed when source or API request fails and fixtures are used.',
  },
  {
    key: 'permission_denied',
    label: 'Permission denied',
    level: 'blocked',
    placeholderStatus: 'Pending server confirmation',
    guidance: 'Server-side explicit deny must be returned before unlock.',
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
    guidance: 'Shown when source freshness exceeds warning thresholds.',
  },
  {
    key: 'pending_source_confirmation',
    label: 'Pending source confirmation',
    level: 'warning',
    placeholderStatus: 'Visible placeholder state',
    guidance: 'Source match pending until official evidence arrives.',
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
    guidance: 'Audit fingerprint/reference placeholders remain until backend response.',
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
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-950">Subscription shell state readiness</h3>
      <p className="mt-1 text-sm leading-6 text-slate-600">
        Cycle 001 frontend placeholders for subscription analytics states. These are non-production UI markers and do not represent confirmed business outcomes.
      </p>
      <div className="mt-4 grid gap-3">
        {SUBSCRIPTION_STATE_ROWS.map((row) => (
          <div key={row.key} className={`rounded-xl border p-3 ${levelClasses[row.level]}`}>
            <div className="text-sm font-semibold">{row.label}</div>
            <div className="mt-1 text-xs uppercase tracking-wide opacity-90">{row.placeholderStatus}</div>
            <p className="mt-2 text-sm leading-6">{row.guidance}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
