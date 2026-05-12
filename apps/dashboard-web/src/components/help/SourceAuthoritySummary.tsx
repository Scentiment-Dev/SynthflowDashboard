import { Info } from 'lucide-react';
import StateChip from '../subscription-v2/StateChip';
import {
  SOURCE_AUTHORITY_EXPLANATION,
  SOURCE_AUTHORITY_LABEL,
  type SubscriptionSourceRole,
} from '../../lib/plainLanguageCopy';

const ROLE_TONE: Record<SubscriptionSourceRole, 'brand' | 'warning' | 'info' | 'success'> = {
  stayai_final: 'brand',
  stayai_pending: 'warning',
  synthflow_journey: 'info',
  shopify_context: 'info',
  portal_link_sent: 'warning',
  portal_completion: 'success',
};

type SourceAuthoritySummaryProps = {
  /** Roles to render in the order provided. */
  roles: SubscriptionSourceRole[];
  /** Optional preface above the chip list. */
  intro?: string;
};

/**
 * Cycle 008 source-authority summary. Renders a mini-legend of which
 * systems contribute to the page surface and what each one means in plain
 * language. Used at the top of every subpage so first-time users can
 * answer "what's behind this number?" in ≤5 seconds.
 */
export default function SourceAuthoritySummary({
  roles,
  intro,
}: SourceAuthoritySummaryProps) {
  return (
    <section
      data-testid="source-authority-summary"
      aria-label="Source authority summary"
      className="surface-card flex flex-col gap-3 px-4 py-3"
    >
      <header className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        <Info className="h-3 w-3" /> Where these numbers come from
      </header>
      {intro ? <p className="text-[12px] text-slate-600">{intro}</p> : null}
      <ul className="space-y-2">
        {roles.map((role) => (
          <li key={role} className="flex flex-wrap items-start gap-2 text-[12px] text-slate-700">
            <StateChip tone={ROLE_TONE[role]} label={SOURCE_AUTHORITY_LABEL[role]} />
            <span className="flex-1 leading-5 text-slate-600">
              {SOURCE_AUTHORITY_EXPLANATION[role]}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
