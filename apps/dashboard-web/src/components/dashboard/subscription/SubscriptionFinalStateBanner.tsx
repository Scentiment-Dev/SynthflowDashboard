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
      className={`relative flex flex-col gap-4 overflow-hidden rounded-2xl border p-5 shadow-sm md:flex-row md:items-center md:justify-between ${statusToneClasses(finalTone)}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/40 blur-3xl"
      />
      <div className="relative flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/85 text-current shadow-sm ring-1 ring-white/60">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] opacity-80">
            Stay.ai final subscription state
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-tight">
            {finalStateLabel(data.final_subscription_state)}
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-6">
            Stay.ai is the source of truth for subscription outcomes. Shopify and Synthflow remain
            context only — they cannot finalize a subscription state.
          </p>
        </div>
      </div>
      <div className="relative flex flex-col items-start gap-2 md:items-end">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ${statusBadgeClasses(sourceTone)}`}
        >
          Source confirmation: {data.source_confirmation_status}
        </span>
        <span className="inline-flex items-center rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold ring-1 ring-slate-200 text-slate-700">
          Source-of-truth system: {data.source_of_truth_system}
        </span>
        {data.generated_from_fixture ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold ring-1 ring-amber-200 text-amber-900">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Contract preview (fixture)
          </span>
        ) : null}
      </div>
    </section>
  );
}
