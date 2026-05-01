export type GovernanceRuleCardProps = {
  title: string;
  rule: string;
  enforcedIn: string[];
};

export function GovernanceRuleCard({ title, rule, enforcedIn }: GovernanceRuleCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Governance Rule</p>
      <h3 className="mt-1 text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-700">{rule}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {enforcedIn.map((item) => (
          <span key={item} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
            {item}
          </span>
        ))}
      </div>
    </article>
  );
}
