import { Link2, MailCheck } from 'lucide-react';
import type { PortalJourneyMetrics } from '../../../types/subscriptionAnalytics';
import { formatRatio } from '../../../utils/subscriptionAnalyticsState';
import { formatMetricValue } from '../../../utils/formatters';

export default function PortalJourneyPanel({ portal }: { portal: PortalJourneyMetrics }) {
  const sent = portal.portal_link_sent_count;
  const completed = portal.confirmed_portal_completion_count;
  const completionRate = formatRatio(completed, sent);
  const linkOnly = Math.max(0, sent - completed);

  return (
    <section
      data-testid="portal-journey-panel"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <header>
        <h3 className="text-base font-semibold text-slate-950">Portal journey</h3>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Portal link delivery is diagnostic only. Portal completion requires confirmed completion
          events, not link delivery.
        </p>
      </header>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
            <Link2 className="h-4 w-4" /> Portal link sent
          </div>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{formatMetricValue(sent)}</p>
          <p className="mt-2 text-sm leading-6">
            Link delivery only. Cannot be counted as portal completion.
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-950">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
            <MailCheck className="h-4 w-4" /> Confirmed portal completion
          </div>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{formatMetricValue(completed)}</p>
          <p className="mt-2 text-sm leading-6">
            Stay.ai/portal-confirmed completion. Counted toward portal completion rate.
          </p>
        </div>
      </div>
      <dl
        data-testid="portal-journey-summary"
        className="mt-4 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 md:grid-cols-3"
      >
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Confirmed completion rate
          </dt>
          <dd className="mt-1 text-lg font-semibold text-slate-950">{completionRate}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Links sent without confirmed completion
          </dt>
          <dd className="mt-1 text-lg font-semibold text-slate-950">{formatMetricValue(linkOnly)}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Locked rule</dt>
          <dd className="mt-1 leading-6">Portal link sent ≠ portal completion.</dd>
        </div>
      </dl>
    </section>
  );
}
