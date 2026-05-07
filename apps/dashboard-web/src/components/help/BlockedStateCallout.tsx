import type { ReactNode } from 'react';
import { AlertOctagon, Ban, KeyRound, ShieldOff, Timer } from 'lucide-react';

export type BlockedReason =
  | 'permission'
  | 'data_missing'
  | 'low_trust'
  | 'untrusted'
  | 'pending'
  | 'manifest_mismatch';

type BlockedStateCalloutProps = {
  reason: BlockedReason;
  headline: string;
  detail: string;
  /** Optional verb-led action / CTA. */
  action?: ReactNode;
  /** Optional reference (audit reference, ticket, etc.). */
  reference?: string;
  testId?: string;
};

const REASON_ICON: Record<BlockedReason, typeof Ban> = {
  permission: KeyRound,
  data_missing: Ban,
  low_trust: ShieldOff,
  untrusted: AlertOctagon,
  pending: Timer,
  manifest_mismatch: Ban,
};

const REASON_TONE: Record<BlockedReason, string> = {
  permission: 'border-rose-200 bg-rose-50 text-rose-900',
  data_missing: 'border-amber-200 bg-amber-50 text-amber-900',
  low_trust: 'border-amber-200 bg-amber-50 text-amber-900',
  untrusted: 'border-rose-200 bg-rose-50 text-rose-900',
  pending: 'border-amber-200 bg-amber-50 text-amber-900',
  manifest_mismatch: 'border-amber-200 bg-amber-50 text-amber-900',
};

/**
 * Cycle 008 blocked-state callout. Renders one sentence + one action plus
 * an optional audit reference for governance trace. Uses the locked
 * templates from `subscription_plain_language_copy_system.md` §2.15.
 */
export default function BlockedStateCallout({
  reason,
  headline,
  detail,
  action,
  reference,
  testId = 'blocked-state-callout',
}: BlockedStateCalloutProps) {
  const Icon = REASON_ICON[reason];
  return (
    <section
      role="status"
      aria-label={headline}
      data-testid={`${testId}-${reason}`}
      className={`flex flex-col gap-3 rounded-2xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${REASON_TONE[reason]}`}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/70 ring-1 ring-inset ring-white/30">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <div>
          <p className="text-sm font-semibold leading-5">{headline}</p>
          <p className="mt-0.5 text-[12px] leading-5 opacity-90">{detail}</p>
          {reference ? (
            <p className="mt-1 text-[11px] font-mono opacity-80">audit reference: {reference}</p>
          ) : null}
        </div>
      </div>
      {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
    </section>
  );
}
