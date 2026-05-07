import type { ReactNode } from 'react';
import StatusPill from '../design/StatusPill';
import type { StateChipTone } from './copy';

type StateChipProps = {
  tone: StateChipTone;
  label: string;
  tooltip?: string;
  icon?: ReactNode;
};

/**
 * One-thought-per-chip primitive for plain-language state surfaces. Wraps the
 * design-system `StatusPill` and forwards the optional tooltip as a title
 * attribute so keyboard / hover users see the state-specific elaboration.
 *
 * `StateChipTone` is intentionally the same string-union as `StatusTone`, so
 * we forward `tone` directly to `StatusPill` without an identity tone map.
 */
export default function StateChip({ tone, label, tooltip, icon }: StateChipProps) {
  return (
    <span title={tooltip} aria-label={tooltip ? `${label} — ${tooltip}` : label}>
      <StatusPill tone={tone} icon={icon}>
        {label}
      </StatusPill>
    </span>
  );
}
