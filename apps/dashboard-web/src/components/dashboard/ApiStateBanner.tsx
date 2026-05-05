import { CheckCircle2, Loader2, WifiOff } from 'lucide-react';

export default function ApiStateBanner({
  loading,
  error,
  source,
}: {
  loading: boolean;
  error: string | null;
  source: 'api' | 'fixture';
}) {
  if (loading) {
    return (
      <div className="surface-card flex items-center gap-3 px-4 py-3 text-sm text-slate-700">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-50 ring-1 ring-slate-200">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-500" />
        </span>
        <span>Loading dashboard contract from analytics-api…</span>
      </div>
    );
  }

  if (source === 'api') {
    return (
      <div className="surface-card flex items-center gap-3 border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-900">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 ring-1 ring-emerald-200">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
        </span>
        <span>
          <strong>Live API contract loaded.</strong> Metrics below reflect the most recent backend
          response.
        </span>
      </div>
    );
  }

  return (
    <div className="surface-card flex items-start gap-3 border-amber-200 bg-amber-50/70 px-4 py-3 text-sm leading-6 text-amber-900">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 ring-1 ring-amber-200">
        <WifiOff className="h-3.5 w-3.5 text-amber-700" />
      </span>
      <span>
        <strong>Contract preview rendered from shared fixture.</strong> Live analytics-api is not
        yet reachable for this module{error ? `: ${error}` : '.'} Values are non-production and
        intentionally surfaced so operators are never shown silent placeholders.
      </span>
    </div>
  );
}
