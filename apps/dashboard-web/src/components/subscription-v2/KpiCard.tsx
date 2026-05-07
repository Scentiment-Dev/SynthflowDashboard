import type { ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import StateChip from './StateChip';
import type { StateChipTone } from './copy';

export type KpiCardDelta = {
  label: string;
  direction: 'up' | 'down' | 'flat';
};

type KpiCardProps = {
  label: string;
  value: string;
  /** Short sub-line under the value (e.g. "of 180 cancellation requests"). */
  valueSubline?: string;
  sourceChipLabel?: string;
  sourceChipTone?: StateChipTone;
  trustChipLabel?: string;
  trustChipTone?: StateChipTone;
  trustChipTooltip?: string;
  stateChipLabel?: string;
  stateChipTone?: StateChipTone;
  stateChipTooltip?: string;
  delta?: KpiCardDelta;
  /** Optional drilldown affordance (button or link). */
  action?: ReactNode;
  /** Optional Level-2 disclosure. */
  disclosure?: ReactNode;
  /** Make the entire card a clickable link (handled by parent if needed). */
  onClick?: () => void;
  testId?: string;
};

const DELTA_ICON = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  flat: Minus,
};

const DELTA_TONE = {
  up: 'text-emerald-700',
  down: 'text-rose-700',
  flat: 'text-slate-500',
};

/**
 * Cycle 008 KPI card. Level-1 surface follows the locked layout:
 *   value  →  source chip  →  trust chip  →  state/delta  →  optional action.
 *
 * Card title in eyebrow style is the metric's plain-language name.
 * No formula text on the card surface; that lives in the optional disclosure.
 */
export default function KpiCard({
  label,
  value,
  valueSubline,
  sourceChipLabel,
  sourceChipTone = 'brand',
  trustChipLabel,
  trustChipTone = 'success',
  trustChipTooltip,
  stateChipLabel,
  stateChipTone = 'info',
  stateChipTooltip,
  delta,
  action,
  disclosure,
  onClick,
  testId,
}: KpiCardProps) {
  const isInteractive = Boolean(onClick);
  const Wrapper: 'button' | 'div' = isInteractive ? 'button' : 'div';

  return (
    <Wrapper
      type={isInteractive ? 'button' : undefined}
      onClick={onClick}
      data-testid={testId}
      className={`surface-card flex h-full flex-col gap-2.5 px-4 py-4 text-left ${
        isInteractive
          ? 'cursor-pointer transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md'
          : ''
      }`}
    >
      <p className="eyebrow !tracking-[0.18em]">{label}</p>
      <div>
        <p className="text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
        {valueSubline ? (
          <p className="mt-1 text-[12px] leading-5 text-slate-500">{valueSubline}</p>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        {sourceChipLabel ? (
          <StateChip tone={sourceChipTone} label={sourceChipLabel} />
        ) : null}
        {trustChipLabel ? (
          <StateChip
            tone={trustChipTone}
            label={trustChipLabel}
            tooltip={trustChipTooltip}
          />
        ) : null}
        {stateChipLabel ? (
          <StateChip tone={stateChipTone} label={stateChipLabel} tooltip={stateChipTooltip} />
        ) : null}
      </div>
      {delta ? (
        <p className={`flex items-center gap-1 text-[12px] font-semibold ${DELTA_TONE[delta.direction]}`}>
          {(() => {
            const Icon = DELTA_ICON[delta.direction];
            return <Icon className="h-3.5 w-3.5" />;
          })()}
          {delta.label}
        </p>
      ) : null}
      {action ? <div className="mt-auto pt-1">{action}</div> : null}
      {disclosure}
    </Wrapper>
  );
}
