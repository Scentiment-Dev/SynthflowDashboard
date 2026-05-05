import { Shield } from 'lucide-react';
import PremiumCard from '../design/PremiumCard';
import StatusPill from '../design/StatusPill';

export type GovernanceRuleCardProps = {
  title: string;
  rule: string;
  enforcedIn: string[];
};

export function GovernanceRuleCard({ title, rule, enforcedIn }: GovernanceRuleCardProps) {
  return (
    <PremiumCard as="article" padded={false} className="lift-on-hover relative overflow-hidden p-5">
      <span
        className="ambient-glow bg-violet-500/30"
        style={{ top: '-60%', right: '-30%', width: '100%', height: '120%', opacity: 0.45 }}
        aria-hidden
      />
      <div className="relative z-10">
        <p className="eyebrow flex items-center gap-1.5">
          <Shield className="h-3 w-3" /> Governance Rule
        </p>
        <h3 className="display-title mt-1 text-base">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{rule}</p>
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {enforcedIn.map((item) => (
            <StatusPill key={item} tone="neutral" size="sm">
              {item}
            </StatusPill>
          ))}
        </div>
      </div>
    </PremiumCard>
  );
}
