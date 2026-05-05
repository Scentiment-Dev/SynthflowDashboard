const rows = [
  { role: 'Admin', permissions: 'All permissions', note: 'Full access, still subject to explicit-deny checks.' },
  { role: 'Analyst', permissions: 'Read modules + export metrics', note: 'No RBAC/backfill administration.' },
  { role: 'Support Lead', permissions: 'Read dashboard modules', note: 'No export or audit write access.' },
  { role: 'Compliance Manager', permissions: 'Governance, audit, export review', note: 'Can review governance evidence.' },
  { role: 'Viewer', permissions: 'Read metrics only', note: 'Exports are denied by default.' },
];

export function PermissionMatrixTable() {
  return (
    <section className="surface-card p-5 sm:p-6">
      <header>
        <p className="eyebrow">Permissions</p>
        <h3 className="display-title mt-1 text-base sm:text-lg">Server-side Permission Matrix</h3>
        <p className="mt-1.5 text-sm leading-6 text-slate-600">
          Permissions must be enforced by the backend. The frontend can display role context, but
          it cannot grant access.
        </p>
      </header>
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200/70">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50/80">
            <tr className="text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              <th className="px-4 py-2.5">Role</th>
              <th className="px-4 py-2.5">Permissions</th>
              <th className="px-4 py-2.5">Governance note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.role} className="transition-colors hover:bg-slate-50/60">
                <td className="px-4 py-2.5 font-semibold text-slate-900">{row.role}</td>
                <td className="px-4 py-2.5 text-slate-700">{row.permissions}</td>
                <td className="px-4 py-2.5 text-slate-600">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
