import type { TrustLabel } from '../types/metrics';

export function formatMetricValue(value: string | number) {
  if (typeof value === 'string') return value;
  if (Number.isInteger(value)) return value.toLocaleString();
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export function formatPercent(value: number) {
  return `${value.toFixed(value % 1 === 0 ? 0 : 1)}%`;
}

export function trustLabelClasses(trustLabel: TrustLabel) {
  const classes: Record<TrustLabel, string> = {
    high: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    medium: 'bg-sky-50 text-sky-700 ring-sky-200',
    low: 'bg-amber-50 text-amber-700 ring-amber-200',
    untrusted: 'bg-rose-50 text-rose-700 ring-rose-200',
  };
  return classes[trustLabel];
}

export function sourceBadgeClasses(source: string) {
  if (source.toLowerCase().includes('stay.ai')) return 'bg-violet-50 text-violet-700 ring-violet-200';
  if (source.toLowerCase().includes('shopify')) return 'bg-green-50 text-green-700 ring-green-200';
  if (source.toLowerCase().includes('synthflow')) return 'bg-indigo-50 text-indigo-700 ring-indigo-200';
  if (source.toLowerCase().includes('portal')) return 'bg-cyan-50 text-cyan-700 ring-cyan-200';
  return 'bg-slate-100 text-slate-700 ring-slate-200';
}
