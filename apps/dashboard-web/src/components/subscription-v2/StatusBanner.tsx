import type { ReactNode } from 'react';
import {
  AlertOctagon,
  CloudOff,
  Inbox,
  KeyRound,
  Loader2,
  Timer,
} from 'lucide-react';

export type StatusBannerKind =
  | 'loading'
  | 'live'
  | 'fixture_unreachable'
  | 'fixture_malformed'
  | 'permission_denied'
  | 'pending'
  | 'missing'
  | 'empty';

type StatusBannerProps = {
  kind: StatusBannerKind;
  /** Optional override for the headline. Falls back to the canonical template. */
  headline?: string;
  /** Optional support detail. Should never expose engineering vocabulary. */
  detail?: string;
  /** Optional CTA button content. */
  action?: ReactNode;
  /** Pending count, used for the "soft pending" template. */
  pendingCount?: number;
  /** When in the live state, the friendly age (e.g. "Updated 2 min ago"). */
  updatedAge?: string;
};

const TEMPLATES: Record<
  StatusBannerKind,
  { icon: typeof Loader2; tone: string; headline: string }
> = {
  loading: {
    icon: Loader2,
    tone: 'bg-slate-50 text-slate-700 ring-slate-200',
    headline: 'Loading the latest subscription numbers…',
  },
  live: {
    icon: Timer,
    tone: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
    headline: 'Live data loaded.',
  },
  fixture_unreachable: {
    icon: CloudOff,
    tone: 'bg-amber-50 text-amber-900 ring-amber-200',
    headline: 'Live data is temporarily unavailable. Showing the last reviewed snapshot.',
  },
  fixture_malformed: {
    icon: CloudOff,
    tone: 'bg-amber-50 text-amber-900 ring-amber-200',
    headline: 'Live data is temporarily unavailable. Please refresh in a few minutes.',
  },
  permission_denied: {
    icon: KeyRound,
    tone: 'bg-rose-50 text-rose-800 ring-rose-200',
    headline:
      "We don't have permission to load live data here. Showing the last reviewed snapshot.",
  },
  pending: {
    icon: Timer,
    tone: 'bg-amber-50 text-amber-900 ring-amber-200',
    headline: 'Stay.ai has not yet confirmed every record in this period.',
  },
  missing: {
    icon: AlertOctagon,
    tone: 'bg-rose-50 text-rose-900 ring-rose-200',
    headline: "We're not getting Stay.ai final results right now.",
  },
  empty: {
    icon: Inbox,
    tone: 'bg-slate-50 text-slate-700 ring-slate-200',
    headline: 'No subscription calls in this view yet.',
  },
};

/**
 * Cycle 008 plain-language status banner. Implements the canonical templates
 * from `subscription_plain_language_copy_system.md` §2.15.
 */
export default function StatusBanner({
  kind,
  headline,
  detail,
  action,
  pendingCount,
  updatedAge,
}: StatusBannerProps) {
  const template = TEMPLATES[kind];
  const Icon = template.icon;
  const headlineText =
    headline ??
    (kind === 'pending' && typeof pendingCount === 'number' && pendingCount > 0
      ? `Stay.ai has not yet confirmed ${pendingCount} call${pendingCount === 1 ? '' : 's'} in this period.`
      : kind === 'live' && updatedAge
        ? `Live data loaded · ${updatedAge}`
        : template.headline);

  return (
    <section
      role="status"
      data-testid={`subscription-status-banner-${kind}`}
      className={`flex flex-col gap-3 rounded-2xl px-4 py-3 ring-1 sm:flex-row sm:items-center sm:justify-between ${template.tone}`}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/70 ring-1 ring-inset ring-white/30">
          <Icon
            className={`h-4 w-4 ${kind === 'loading' ? 'animate-spin' : ''}`}
            aria-hidden
          />
        </span>
        <div>
          <p className="text-sm font-semibold leading-5">{headlineText}</p>
          {detail ? (
            <p className="mt-0.5 text-[12px] leading-5 opacity-90">{detail}</p>
          ) : null}
        </div>
      </div>
      {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
    </section>
  );
}
