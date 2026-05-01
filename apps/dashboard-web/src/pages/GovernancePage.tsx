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
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Governance</p>
        <h1 className="text-3xl font-bold text-slate-950">RBAC, Export, Audit, and Trust Controls</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Wave 7 surfaces the backend governance rules that protect metric trust, export evidence, and access control. The frontend only displays governance state; access is enforced by the API.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {rules.map((rule) => <GovernanceRuleCard key={rule.title} {...rule} />)}
      </div>
      <PermissionMatrixTable />
      <ExportGovernanceChecklist />
      <AuditEvidenceTable />
    </div>
  );
}
