import { useMemo, useState } from 'react';
import { createExportAudit } from '../../services/dashboardApi';
import type { DashboardModule, MetricDefinition } from '../../types/metrics';

export default function ExportAuditForm({ module, definitions }: { module: DashboardModule; definitions: MetricDefinition[] }) {
  const [status, setStatus] = useState<string>('Export audit has not been requested.');
  const metricKeys = useMemo(() => definitions.map((definition) => definition.metric_key), [definitions]);

  const handleAuditClick = async () => {
    setStatus('Creating export audit request...');
    try {
      const record = await createExportAudit({
        requested_by: 'frontend_skeleton_user',
        module,
        metric_keys: metricKeys,
        include_definitions: true,
        include_trust_labels: true,
        include_freshness: true,
        include_formula_versions: true,
        reason: 'Wave 4 frontend export audit smoke check',
      });
      setStatus(`Audit ready: ${record.audit_reference} / ${record.fingerprint}`);
    } catch (error) {
      setStatus(`Using disabled/stub state until API is available: ${(error as Error).message}`);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-950">Export audit action stub</h3>
      <p className="mt-1 text-sm leading-6 text-slate-600">
        This button intentionally calls the Wave 3 backend audit endpoint and should remain permission-gated in production.
      </p>
      <button
        type="button"
        onClick={handleAuditClick}
        className="mt-4 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
      >
        Request export audit metadata
      </button>
      <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">{status}</p>
    </section>
  );
}
