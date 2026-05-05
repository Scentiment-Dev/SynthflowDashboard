import { ScrollText } from 'lucide-react';
import type { EventTableRow } from '../../types/events';
import SourceBadge from '../status/SourceBadge';
import TrustBadge from '../status/TrustBadge';

const starterRows: EventTableRow[] = [
  { id: 'evt_001', occurred_at: '2026-04-29T14:10:00Z', source: 'synthflow', event_type: 'intent_detected', outcome: 'subscription_intent', trust_label: 'medium' },
  { id: 'evt_002', occurred_at: '2026-04-29T14:11:15Z', source: 'stayai', event_type: 'subscription_action_confirmed', outcome: 'retained', trust_label: 'medium' },
  { id: 'evt_003', occurred_at: '2026-04-29T14:12:40Z', source: 'analytics_api', event_type: 'metric_snapshot_created', outcome: 'eligible_for_dashboard', trust_label: 'medium' },
];

export default function EventLogTable({ rows = starterRows }: { rows?: EventTableRow[] }) {
  return (
    <section className="surface-card p-5 sm:p-6">
      <header>
        <p className="eyebrow flex items-center gap-1.5">
          <ScrollText className="h-3 w-3" /> Event trace
        </p>
        <h3 className="display-title mt-1 text-base sm:text-lg">Recent normalized event trace</h3>
        <p className="mt-1.5 text-sm leading-6 text-slate-600">
          Latest normalized events with their source authority and trust label, ready for
          downstream audit review.
        </p>
      </header>
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200/70">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50/80">
            <tr className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              <th className="px-4 py-2.5">Time</th>
              <th className="px-4 py-2.5">Source</th>
              <th className="px-4 py-2.5">Event</th>
              <th className="px-4 py-2.5">Outcome</th>
              <th className="px-4 py-2.5">Trust</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {rows.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-slate-50/60">
                <td className="px-4 py-3 font-mono text-xs text-slate-600">{row.occurred_at}</td>
                <td className="px-4 py-3"><SourceBadge source={row.source} /></td>
                <td className="px-4 py-3 font-semibold text-slate-900">{row.event_type}</td>
                <td className="px-4 py-3 text-slate-700">{row.outcome}</td>
                <td className="px-4 py-3"><TrustBadge trustLabel={row.trust_label} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
