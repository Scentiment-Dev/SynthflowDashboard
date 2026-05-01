import ApiStateBanner from './ApiStateBanner';
import ExportReadinessPanel from './ExportReadinessPanel';
import MetricDefinitionPanel from './MetricDefinitionPanel';
import ModuleHeader from './ModuleHeader';
import SourceTruthBanner from './SourceTruthBanner';
import SubscriptionStateReadinessPanel from './SubscriptionStateReadinessPanel';
import ExportAuditForm from '../forms/ExportAuditForm';
import FunnelChart from '../charts/FunnelChart';
import JourneyFlowChart from '../charts/JourneyFlowChart';
import MetricCard from '../charts/MetricCard';
import TimeSeriesChart from '../charts/TimeSeriesChart';
import EventLogTable from '../tables/EventLogTable';
import MetricTable from '../tables/MetricTable';
import { useDashboardSummary } from '../../hooks/useDashboardSummary';
import type { DashboardModule } from '../../types/metrics';

export default function DashboardModulePage({ module }: { module: DashboardModule }) {
  const { data, loading, error, source } = useDashboardSummary(module);
  const { summary } = data;
  const isSubscriptionModule = module === 'subscriptions';
  const isPermissionDenied = Boolean(error && /403|forbidden|permission denied/i.test(error));
  const hasSummaryRows = summary.cards.length > 0;

  return (
    <div className="space-y-6">
      <ApiStateBanner loading={loading} error={error} source={source} />
      {isPermissionDenied && (
        <section className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-900 shadow-sm">
          Permission denied from analytics API. Frontend shell remains in blocked mode until server-side RBAC confirmation is available.
        </section>
      )}
      <ModuleHeader eyebrow={data.eyebrow} title={data.title} description={data.description} />
      <SourceTruthBanner sourcePriority={data.sourcePriority} lockedRules={data.lockedRules} />
      {isSubscriptionModule && <SubscriptionStateReadinessPanel />}
      <section className="grid gap-4 md:grid-cols-3">
        {hasSummaryRows ? (
          summary.cards.map((metric) => <MetricCard key={metric.key} metric={metric} />)
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm md:col-span-3">
            No eligible metrics returned for current filters. This empty-state placeholder is shown until contract-backed rows are available.
          </div>
        )}
      </section>
      <section className="grid gap-4 xl:grid-cols-2">
        <TimeSeriesChart title="Outcome trend" description="Fixture trend until Agent A connects live metric series endpoints." data={data.trend} />
        <FunnelChart title="Source confirmation funnel" description="Each step shows the controlling source and calculated trust label." steps={data.funnel} />
      </section>
      <JourneyFlowChart title="Locked measurement journey" description="Required flow from source event to trusted dashboard metric." nodes={data.journey} />
      <section className="grid gap-4 xl:grid-cols-2">
        <MetricTable metrics={summary.cards} />
        <EventLogTable />
      </section>
      <MetricDefinitionPanel definitions={summary.definitions} />
      <section className="grid gap-4 xl:grid-cols-2">
        <ExportReadinessPanel module={module} definitions={summary.definitions} />
        <ExportAuditForm module={module} definitions={summary.definitions} />
      </section>
    </div>
  );
}
