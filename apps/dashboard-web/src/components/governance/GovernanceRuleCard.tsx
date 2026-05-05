import { Shield } from 'lucide-react';

export type GovernanceRuleCardProps = {
  title: string;
  rule: string;
  enforcedIn: string[];
};

export function GovernanceRuleCard({ title, rule, enforcedIn }: GovernanceRuleCardProps) {
  return (
    <article className="surface-card lift-on-hover relative overflow-hidden p-5">
      <div className="ambient-glow ambient-glow--violet" style={{ top: '-60%', right: '-30%', width: '100%', height: '120%', opacity: 0.45 }} />
      <div className="relative z-10">
        <p className="eyebrow flex items-center gap-1.5">
          <Shield className="h-3 w-3" /> Governance Rule
        </p>
        <h3 className="display-title mt-1 text-base">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{rule}</p>
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {enforcedIn.map((item) => (
            <span
              key={item}
              className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 ring-1 ring-slate-200"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
