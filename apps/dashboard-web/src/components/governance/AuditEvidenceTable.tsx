const rows = [
  { evidence: 'Permission checks', owner: 'Backend API', status: 'Explicit deny by default' },
  { evidence: 'Export audit metadata', owner: 'Export service', status: 'Fingerprint + audit reference required' },
  { evidence: 'Trust label audit', owner: 'Governance service', status: 'Manual elevation blocked' },
  { evidence: 'Backfill control', owner: 'Data/ops', status: 'Change request required' },
];

export function AuditEvidenceTable() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">Audit Evidence Surfaces</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr><th className="px-3 py-2">Evidence</th><th className="px-3 py-2">Owner</th><th className="px-3 py-2">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.evidence}>
                <td className="px-3 py-2 font-medium text-slate-900">{row.evidence}</td>
                <td className="px-3 py-2 text-slate-700">{row.owner}</td>
                <td className="px-3 py-2 text-slate-600">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
