import type { ReactNode } from 'react';

export type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'brand';

type StatusPillProps = {
  tone?: StatusTone;
  icon?: ReactNode;
  children: ReactNode;
  size?: 'sm' | 'md';
  pulse?: boolean;
  className?: string;
};

const TONE_CLASS: Record<StatusTone, string> = {
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-800 ring-amber-200',
  danger: 'bg-rose-50 text-rose-700 ring-rose-200',
  info: 'bg-sky-50 text-sky-700 ring-sky-200',
  neutral: 'bg-slate-50 text-slate-700 ring-slate-200',
  brand: 'bg-violet-50 text-violet-700 ring-violet-200',
};

const TONE_DOT: Record<StatusTone, string> = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500',
  info: 'bg-sky-500',
  neutral: 'bg-slate-400',
  brand: 'bg-violet-500',
};

export default function StatusPill({
  tone = 'neutral',
  icon,
  children,
  size = 'sm',
  pulse = false,
  className = '',
}: StatusPillProps) {
  const sizeClass = size === 'sm' ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ring-1 ${TONE_CLASS[tone]} ${sizeClass} ${className}`.trim()}
    >
      {icon ? (
        <span className="flex shrink-0 items-center [&>svg]:h-3 [&>svg]:w-3" aria-hidden>
          {icon}
        </span>
      ) : (
        <span
          aria-hidden
          className={`inline-block h-1.5 w-1.5 rounded-full ${TONE_DOT[tone]} ${pulse ? 'pulse-dot' : ''}`}
        />
      )}
      <span className="whitespace-nowrap">{children}</span>
    </span>
  );
}
