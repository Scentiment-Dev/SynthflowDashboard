import type { ReactNode } from 'react';
import StatusPill from '../design/StatusPill';
import type { StateChipTone } from './copy';

type StateChipProps = {
  tone: StateChipTone;
  label: string;
  tooltip?: string;
  icon?: ReactNode;
};

const TONE_MAP: Record<StateChipTone, 'success' | 'info' | 'warning' | 'danger' | 'neutral' | 'brand'> = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  danger: 'danger',
  neutral: 'neutral',
  brand: 'brand',
};

/**
 * One-thought-per-chip primitive for plain-language state surfaces. Wraps the
 * design-system `StatusPill` and forwards the optional tooltip as a title
 * attribute so keyboard / hover users see the state-specific elaboration.
 */
export default function StateChip({ tone, label, tooltip, icon }: StateChipProps) {
  return (
    <span title={tooltip} aria-label={tooltip ? `${label} — ${tooltip}` : label}>
      <StatusPill tone={TONE_MAP[tone]} icon={icon}>
        {label}
      </StatusPill>
    </span>
  );
}
