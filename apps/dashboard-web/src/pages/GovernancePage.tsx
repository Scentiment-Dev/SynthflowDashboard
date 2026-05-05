import { ShieldCheck } from 'lucide-react';
import { AuditEvidenceTable } from '../components/governance/AuditEvidenceTable';
import { ExportGovernanceChecklist } from '../components/governance/ExportGovernanceChecklist';
import { GovernanceRuleCard } from '../components/governance/GovernanceRuleCard';
import { PermissionMatrixTable } from '../components/governance/PermissionMatrixTable';

const rules = [
  {
    title: 'Server-side explicit deny',
    rule: 'Permissions are enforced server-side using explicit deny.',
    enforcedIn: ['FastAPI dependencies', 'RBAC service', 'backend tests'],
  },
  {
    title: 'Trust labels are system-calculated',
    rule: 'Trust labels are system-calculated and cannot be manually elevated.',
    enforcedIn: ['Governance service', 'dbt tests', 'export metadata'],
  },
  {
    title: 'Export audit metadata required',
    rule: 'Exports must include filters, definitions, trust labels, freshness, formula versions, owner, timestamp, fingerprint, and audit reference.',
    enforcedIn: ['Export service', 'frontend export form', 'dbt tests'],
  },
  {
    title: 'Backfill is governed only',
    rule: 'Historical backfill is not base launch scope unless handled through a governed reprocess/backfill pipeline.',
    enforcedIn: ['Backfill policy evaluator', 'warehouse backfill_control'],
  },
];

export function GovernancePage() {
  return (
    <div className="space-y-8">
      <section className="surface-ink surface-grid-overlay relative overflow-hidden p-6 sm:p-8">
        <span
          className="ambient-glow bg-violet-500/40"
          style={{ top: '-30%', left: '-15%', width: '60%', height: '110%' }}
          aria-hidden
        />
        <span
          className="ambient-glow bg-cyan-400/30"
          style={{ bottom: '-50%', right: '-15%', width: '60%', height: '110%', animationDelay: '-6s' }}
          aria-hidden
        />
        <div className="relative z-10 flex flex-col gap-3">
          <p className="eyebrow flex items-center gap-1.5 text-violet-200">
            <ShieldCheck className="h-3 w-3" /> Governance · trust controls
          </p>
          <h1 className="display-title text-3xl text-white sm:text-4xl">
            RBAC, Export, Audit, and Trust Controls
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-300">
            Backend governance rules that protect metric trust, export evidence, and access control.
            The dashboard only surfaces governance state — access is enforced by the API and trust
            labels are system-calculated.
          </p>
        </div>
      </section>
      <div className="grid gap-4 lg:grid-cols-2">
        {rules.map((rule) => <GovernanceRuleCard key={rule.title} {...rule} />)}
      </div>
      <PermissionMatrixTable />
      <ExportGovernanceChecklist />
      <AuditEvidenceTable />
    </div>
  );
}
