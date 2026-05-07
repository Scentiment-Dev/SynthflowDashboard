import { useId, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import StatusPill from '../design/StatusPill';
import type { TrustLabel } from '../../types/metrics';
import {
  TRUST_ANCHOR_SENTENCE,
  TRUST_LEVEL_DETAIL,
  TRUST_NEXT_STEP,
} from '../../lib/plainLanguageCopy';
import { TRUST_CHIP_LABEL, TRUST_TONE } from '../subscription-v2/copy';

type TrustExplanationPopoverProps = {
  trust: TrustLabel;
  /** Optional helper text shown above the next-step copy. */
  contextLine?: string;
  /** Optional override for the chip label (defaults to copy-system label). */
  chipLabel?: string;
};

/**
 * Cycle 008 trust-chip popover. Click the chip → reveal the locked anchor
 * sentence ("How reliable this metric is right now."), the state-specific
 * detail, and the operator's next step.
 *
 * The component is intentionally button-based so it is keyboard-focusable
 * and screen-reader-friendly. The popover collapses on a second click /
 * Escape.
 */
export default function TrustExplanationPopover({
  trust,
  contextLine,
  chipLabel,
}: TrustExplanationPopoverProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const tone = TRUST_TONE[trust];
  const label = chipLabel ?? TRUST_CHIP_LABEL[trust];

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`Trust ${label} — ${TRUST_ANCHOR_SENTENCE}`}
        onClick={() => setOpen((prev) => !prev)}
        data-testid={`trust-explanation-${trust}`}
        className="inline-flex items-center gap-1 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60"
      >
        <StatusPill tone={tone} icon={<ShieldCheck />}>{label}</StatusPill>
      </button>
      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label="Trust explanation"
          className="absolute left-0 top-full z-20 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-3 text-xs leading-5 text-slate-700 shadow-lg"
        >
          <p className="font-semibold text-slate-900">{TRUST_ANCHOR_SENTENCE}</p>
          <p className="mt-1 text-slate-600">{TRUST_LEVEL_DETAIL[trust]}</p>
          {contextLine ? (
            <p className="mt-2 rounded-md bg-slate-50 px-2 py-1 text-[11px] text-slate-600">
              {contextLine}
            </p>
          ) : null}
          <p className="mt-2 text-[11px] font-semibold text-slate-700">What to do next</p>
          <p className="text-[11px] text-slate-600">{TRUST_NEXT_STEP[trust]}</p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-900"
          >
            Close
          </button>
        </div>
      ) : null}
    </div>
  );
}
