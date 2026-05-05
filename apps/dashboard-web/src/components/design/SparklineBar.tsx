type SparklineBarProps = {
  values: number[];
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'neutral';
  className?: string;
  ariaLabel?: string;
};

const TONE_BAR: Record<NonNullable<SparklineBarProps['tone']>, string> = {
  brand: 'bg-gradient-to-t from-violet-500 to-indigo-400',
  success: 'bg-gradient-to-t from-emerald-500 to-emerald-300',
  warning: 'bg-gradient-to-t from-amber-500 to-amber-300',
  danger: 'bg-gradient-to-t from-rose-500 to-rose-300',
  neutral: 'bg-gradient-to-t from-slate-500 to-slate-300',
};

export default function SparklineBar({
  values,
  tone = 'brand',
  className = '',
  ariaLabel,
}: SparklineBarProps) {
  const max = values.reduce((acc, value) => Math.max(acc, value), 0);
  const safeMax = max > 0 ? max : 1;
  return (
    <div
      role="img"
      aria-label={ariaLabel ?? 'trend sparkline'}
      className={`flex h-10 items-end gap-[3px] ${className}`.trim()}
    >
      {values.map((value, index) => {
        const heightPct = Math.max(8, (value / safeMax) * 100);
        return (
          <div
            key={index}
            className={`w-1.5 rounded-sm opacity-80 ${TONE_BAR[tone]}`}
            style={{ height: `${heightPct.toFixed(2)}%` }}
          />
        );
      })}
    </div>
  );
}
