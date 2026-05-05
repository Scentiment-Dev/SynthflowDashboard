const rows = [
  { evidence: 'Permission checks', owner: 'Backend API', status: 'Explicit deny by default' },
  { evidence: 'Export audit metadata', owner: 'Export service', status: 'Fingerprint + audit reference required' },
  { evidence: 'Trust label audit', owner: 'Governance service', status: 'Manual elevation blocked' },
  { evidence: 'Backfill control', owner: 'Data/ops', status: 'Change request required' },
];

export function AuditEvidenceTable() {
  return (
    <section className="surface-card p-5 sm:p-6">
      <header>
        <p className="eyebrow">Audit</p>
        <h3 className="display-title mt-1 text-base sm:text-lg">Audit Evidence Surfaces</h3>
        <p className="mt-1.5 text-sm leading-6 text-slate-600">
          Audit evidence and accountability surfaces tracked outside of the dashboard layer.
        </p>
      </header>
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200/70">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50/80">
            <tr className="text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              <th className="px-4 py-2.5">Evidence</th>
              <th className="px-4 py-2.5">Owner</th>
              <th className="px-4 py-2.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.evidence} className="transition-colors hover:bg-slate-50/60">
                <td className="px-4 py-2.5 font-semibold text-slate-900">{row.evidence}</td>
                <td className="px-4 py-2.5 text-slate-700">{row.owner}</td>
                <td className="px-4 py-2.5 text-slate-600">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
