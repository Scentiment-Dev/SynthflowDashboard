const required = [
  'Filters',
  'Definitions',
  'Trust labels',
  'Freshness',
  'Formula versions',
  'Owner',
  'Timestamp',
  'Fingerprint',
  'Audit reference',
];

export function ExportGovernanceChecklist() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">Export Metadata Requirements</h3>
      <p className="mt-1 text-sm text-slate-600">Every export must include the full audit bundle before it is treated as governance-compliant.</p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {required.map((item) => (
          <li key={item} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            ✓ {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
