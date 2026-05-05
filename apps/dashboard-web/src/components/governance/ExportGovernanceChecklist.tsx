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

import { Check } from 'lucide-react';

export function ExportGovernanceChecklist() {
  return (
    <section className="surface-card p-5 sm:p-6">
      <header>
        <p className="eyebrow">Exports</p>
        <h3 className="display-title mt-1 text-base sm:text-lg">Export Metadata Requirements</h3>
        <p className="mt-1.5 text-sm leading-6 text-slate-600">
          Every export must include the full audit bundle before it is treated as
          governance-compliant.
        </p>
      </header>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {required.map((item) => (
          <li
            key={item}
            className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5 text-sm text-slate-800"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 ring-1 ring-emerald-200">
              <Check className="h-3 w-3 text-emerald-700" />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
