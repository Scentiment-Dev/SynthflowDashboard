import { AlertTriangle, CheckCircle2, Info, ShieldAlert, ShieldCheck } from 'lucide-react';
import type { SubscriptionOutcomeAlert } from '../../../utils/subscriptionOutcomesState';

const LEVEL_STYLES: Record<SubscriptionOutcomeAlert['level'], string> = {
  info: 'border-slate-200 bg-slate-50/80 text-slate-800',
  warning: 'border-amber-200 bg-amber-50/80 text-amber-900',
  danger: 'border-rose-200 bg-rose-50/80 text-rose-900',
};

const LEVEL_BADGE: Record<SubscriptionOutcomeAlert['level'], string> = {
  info: 'bg-white text-slate-700 ring-slate-200',
  warning: 'bg-white text-amber-800 ring-amber-200',
  danger: 'bg-white text-rose-700 ring-rose-200',
};

const LEVEL_ICON = {
  info: Info,
  warning: AlertTriangle,
  danger: ShieldAlert,
} as const;

const LEVEL_LABEL: Record<SubscriptionOutcomeAlert['level'], string> = {
  info: 'Info',
  warning: 'Heads up',
  danger: 'Blocked',
};

export default function SubscriptionOutcomeAlertsPanel({
  alerts,
}: {
  alerts: SubscriptionOutcomeAlert[];
}) {
  if (alerts.length === 0) {
    return (
      <section
        data-testid="subscription-outcome-alerts-panel"
        className="surface-card flex items-center gap-3 border-emerald-200 bg-emerald-50/70 px-4 py-3.5 text-sm text-emerald-900"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 ring-1 ring-emerald-200">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
        </span>
        <span>
          <strong>All Stay.ai-controlled subscription outcomes are clear and confirmed</strong> for
          the current contract response.
        </span>
      </section>
    );
  }

  const dangerCount = alerts.filter((a) => a.level === 'danger').length;
  const warningCount = alerts.filter((a) => a.level === 'warning').length;

  return (
    <section
      data-testid="subscription-outcome-alerts-panel"
      className="surface-card p-5 sm:p-6"
    >
      <header className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="eyebrow flex items-center gap-1.5">
            <ShieldCheck className="h-3 w-3" /> Outcome guards
          </p>
          <h3 className="display-title mt-1 text-base sm:text-lg">
            Subscription outcome state controls
          </h3>
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-600">
            UI states derived from the live outcome contract. Each row reflects a guard rule that
            prevents the dashboard from presenting unconfirmed outcomes as production results.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {dangerCount > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700 ring-1 ring-rose-200">
              <ShieldAlert className="h-3 w-3" /> {dangerCount} blocked
            </span>
          ) : null}
          {warningCount > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800 ring-1 ring-amber-200">
              <AlertTriangle className="h-3 w-3" /> {warningCount} warnings
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200">
            {alerts.length} active
          </span>
        </div>
      </header>
      <ul className="grid gap-3 md:grid-cols-2">
        {alerts.map((alert) => {
          const Icon = LEVEL_ICON[alert.level];
          return (
            <li
              key={alert.id}
              data-testid={`outcome-alert-${alert.id}`}
              className={`flex items-start gap-3 rounded-2xl border p-3.5 ${LEVEL_STYLES[alert.level]}`}
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold leading-tight">{alert.title}</p>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ${LEVEL_BADGE[alert.level]}`}
                  >
                    {LEVEL_LABEL[alert.level]}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-6 opacity-90">{alert.detail}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
