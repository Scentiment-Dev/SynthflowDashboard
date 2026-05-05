import { useId } from 'react';
import { CartesianGrid, Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowDownRight, ArrowUpRight, LineChart as LineChartIcon, Minus } from 'lucide-react';
import type { MetricSeriesPoint } from '../../types/metrics';

export default function TimeSeriesChart({
  title,
  description,
  data,
}: {
  title: string;
  description?: string;
  data: MetricSeriesPoint[];
}) {
  const reactId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const fillId = `trendFill-${reactId}`;
  const strokeId = `trendStroke-${reactId}`;
  const last = data[data.length - 1]?.value ?? null;
  const first = data[0]?.value ?? null;
  const delta =
    last !== null && first !== null && first !== 0 ? ((last - first) / first) * 100 : null;
  const deltaDisplay = delta !== null ? `${delta > 0 ? '+' : ''}${delta.toFixed(1)}%` : '—';
  const deltaTone =
    delta === null || delta === 0
      ? 'text-slate-600 bg-slate-50 ring-slate-200'
      : delta > 0
        ? 'text-emerald-700 bg-emerald-50 ring-emerald-200'
        : 'text-rose-700 bg-rose-50 ring-rose-200';

  return (
    <section className="surface-card p-5 sm:p-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="eyebrow flex items-center gap-1.5">
            <LineChartIcon className="h-3 w-3" /> Trend signal
          </p>
          <h3 className="display-title mt-1 text-base sm:text-lg">{title}</h3>
          {description ? (
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="metric-value text-2xl">{last !== null ? last.toLocaleString() : '—'}</p>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Latest window
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${deltaTone}`}
          >
            {delta === null || delta === 0 ? (
              <Minus className="h-3 w-3" />
            ) : delta > 0 ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {deltaDisplay}
          </span>
        </div>
      </header>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id={strokeId} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 5" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="period"
              tick={{ fontSize: 11, fill: '#64748b' }}
              stroke="#cbd5e1"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#64748b' }}
              stroke="#cbd5e1"
              tickLine={false}
              axisLine={false}
              width={36}
            />
            <Tooltip
              cursor={{ stroke: '#a78bfa', strokeWidth: 1, strokeDasharray: '4 4' }}
              contentStyle={{
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                boxShadow: '0 12px 32px -16px rgba(15, 23, 42, 0.4)',
                fontSize: 12,
                fontWeight: 500,
                color: '#0f172a',
              }}
              labelStyle={{ color: '#475569', fontSize: 11, fontWeight: 600 }}
              formatter={(value) => [`${Number(value).toLocaleString()}`, 'Value']}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={`url(#${strokeId})`}
              strokeWidth={2.5}
              fill={`url(#${fillId})`}
              dot={{ r: 2.5, stroke: '#7c3aed', strokeWidth: 2, fill: '#fff' }}
              activeDot={{ r: 5, stroke: '#7c3aed', strokeWidth: 2, fill: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
