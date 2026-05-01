import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function ApiStateBanner({ loading, error, source }: { loading: boolean; error: string | null; source: 'api' | 'fixture' }) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading dashboard contract from analytics API...
      </div>
    );
  }

  if (source === 'api') {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 shadow-sm">
        <CheckCircle2 className="h-4 w-4" /> Live API contract loaded. Fixture values are replaced by backend responses.
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900 shadow-sm">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>
        Using Wave 4 frontend fixtures because the API is not reachable yet{error ? `: ${error}` : '.'} This is expected during skeleton development.
      </span>
    </div>
  );
}
