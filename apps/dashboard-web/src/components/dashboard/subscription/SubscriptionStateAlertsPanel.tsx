import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import type { SubscriptionStateAlert } from '../../../utils/subscriptionAnalyticsState';

const levelStyles: Record<SubscriptionStateAlert['level'], string> = {
  info: 'border-slate-200 bg-slate-50 text-slate-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
  danger: 'border-rose-200 bg-rose-50 text-rose-900',
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
        className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 shadow-sm"
      >
        All Stay.ai-controlled subscription states are clear and confirmed for the current contract response.
      </section>
    );
  }

  return (
    <section
      data-testid="subscription-state-alerts-panel"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <header className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-950">Subscription state controls</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            UI states derived from the live contract. Each row reflects a guard rule that prevents
            the dashboard from presenting unconfirmed outcomes as production results.
          </p>
        </div>
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
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
              className={`flex items-start gap-3 rounded-2xl border p-3 ${levelStyles[alert.level]}`}
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <div>
                <p className="text-sm font-semibold">{alert.title}</p>
                <p className="mt-1 text-sm leading-6 opacity-90">{alert.detail}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
