const rows = [
  { role: 'Admin', permissions: 'All permissions', note: 'Full access, still subject to explicit-deny checks.' },
  { role: 'Analyst', permissions: 'Read modules + export metrics', note: 'No RBAC/backfill administration.' },
  { role: 'Support Lead', permissions: 'Read dashboard modules', note: 'No export or audit write access.' },
  { role: 'Compliance Manager', permissions: 'Governance, audit, export review', note: 'Can review governance evidence.' },
  { role: 'Viewer', permissions: 'Read metrics only', note: 'Exports are denied by default.' },
];

export function PermissionMatrixTable() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">Server-side Permission Matrix</h3>
      <p className="mt-1 text-sm text-slate-600">Permissions must be enforced by the backend. The frontend can display role context, but it cannot grant access.</p>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr><th className="px-3 py-2">Role</th><th className="px-3 py-2">Permissions</th><th className="px-3 py-2">Governance note</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.role}>
                <td className="px-3 py-2 font-medium text-slate-900">{row.role}</td>
                <td className="px-3 py-2 text-slate-700">{row.permissions}</td>
                <td className="px-3 py-2 text-slate-600">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
