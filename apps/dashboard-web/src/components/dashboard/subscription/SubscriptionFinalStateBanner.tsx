import { CheckCircle2, CircleAlert, CircleX, ShieldCheck } from 'lucide-react';
import type { SubscriptionAnalyticsResponse } from '../../../types/subscriptionAnalytics';
import {
  finalStateLabel,
  finalStateTone,
  sourceConfirmationTone,
  statusBadgeClasses,
  statusToneClasses,
} from '../../../utils/subscriptionAnalyticsState';

const statusIcon = {
  success: CheckCircle2,
  warning: CircleAlert,
  danger: CircleX,
  neutral: ShieldCheck,
} as const;

export default function SubscriptionFinalStateBanner({
  data,
}: {
  data: SubscriptionAnalyticsResponse;
}) {
  const finalTone = finalStateTone(data.final_subscription_state);
  const sourceTone = sourceConfirmationTone(data.source_confirmation_status);
  const Icon = statusIcon[finalTone];
  return (
    <section
      data-testid="subscription-final-state-banner"
      className={`flex flex-col gap-3 rounded-2xl border p-5 shadow-sm md:flex-row md:items-center md:justify-between ${statusToneClasses(finalTone)}`}
    >
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-6 w-6 shrink-0" aria-hidden />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">
            Stay.ai final subscription state
          </p>
          <p className="mt-1 text-xl font-semibold">
            {finalStateLabel(data.final_subscription_state)}
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-6">
            Stay.ai is the source of truth for subscription outcomes. Shopify and Synthflow are context only.
          </p>
        </div>
      </div>
      <div className="flex flex-col items-start gap-2 md:items-end">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusBadgeClasses(sourceTone)}`}
        >
          Source confirmation: {data.source_confirmation_status}
        </span>
        <span className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs font-semibold ring-1 ring-slate-200">
          Source-of-truth system: {data.source_of_truth_system}
        </span>
        {data.generated_from_fixture ? (
          <span className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs font-semibold ring-1 ring-amber-200 text-amber-900">
            Contract preview (fixture)
          </span>
        ) : null}
      </div>
    </section>
  );
}
