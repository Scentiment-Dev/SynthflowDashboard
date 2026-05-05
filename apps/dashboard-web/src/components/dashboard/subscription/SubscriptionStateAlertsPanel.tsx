import { AlertTriangle, CheckCircle2, Info, ShieldAlert } from 'lucide-react';
import type { SubscriptionStateAlert } from '../../../utils/subscriptionAnalyticsState';

const levelStyles: Record<SubscriptionStateAlert['level'], string> = {
  info: 'border-slate-200 bg-slate-50/80 text-slate-800',
  warning: 'border-amber-200 bg-amber-50/80 text-amber-900',
  danger: 'border-rose-200 bg-rose-50/80 text-rose-900',
};

const levelIcon = {
  info: Info,
  warning: AlertTriangle,
  danger: ShieldAlert,
} as const;

export default function SubscriptionStateAlertsPanel({
  alerts,
}: {
  alerts: SubscriptionStateAlert[];
}) {
  if (alerts.length === 0) {
    return (
      <section
        data-testid="subscription-state-alerts-panel"
        className="surface-card flex items-center gap-3 border-emerald-200 bg-emerald-50/70 px-4 py-3.5 text-sm text-emerald-900"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 ring-1 ring-emerald-200">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
        </span>
        <span>
          <strong>All Stay.ai-controlled subscription states are clear</strong> and confirmed for
          the current contract response.
        </span>
      </section>
    );
  }

  return (
    <section
      data-testid="subscription-state-alerts-panel"
      className="surface-card p-5 sm:p-6"
    >
      <header className="mb-4 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="eyebrow">Subscription state controls</p>
          <h3 className="display-title mt-1 text-base sm:text-lg">
            Subscription state controls
          </h3>
          <p className="mt-1.5 text-sm leading-6 text-slate-600">
            UI states derived from the live contract. Each row reflects a guard rule that prevents
            the dashboard from presenting unconfirmed outcomes as production results.
          </p>
        </div>
        <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200">
          {alerts.length} active
        </span>
      </header>
      <ul className="grid gap-3 md:grid-cols-2">
        {alerts.map((alert) => {
          const Icon = levelIcon[alert.level];
          return (
            <li
              key={alert.id}
              data-testid={`subscription-alert-${alert.id}`}
              className={`flex items-start gap-3 rounded-2xl border p-3.5 ${levelStyles[alert.level]}`}
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <div>
                <p className="text-sm font-semibold leading-tight">{alert.title}</p>
                <p className="mt-1 text-sm leading-6 opacity-90">{alert.detail}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
