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
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-950">Recent normalized event trace</h3>
      <p className="mt-1 text-sm leading-6 text-slate-600">Starter table for API-backed normalized events, source references, and downstream audit review.</p>
      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">Outcome</th>
              <th className="px-4 py-3">Trust</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-3 text-slate-600">{row.occurred_at}</td>
                <td className="px-4 py-3"><SourceBadge source={row.source} /></td>
                <td className="px-4 py-3 font-medium text-slate-950">{row.event_type}</td>
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
