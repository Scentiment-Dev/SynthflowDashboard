import { Activity, Workflow } from 'lucide-react';
import SubscriptionPageHeader from '../../subscription/SubscriptionPageHeader';
import StateChip from '../StateChip';
import SectionHeader from '../../design/SectionHeader';
import DashboardModulePage from '../../dashboard/DashboardModulePage';
import SubscriptionAnalyticsView from '../../dashboard/subscription/SubscriptionAnalyticsView';
import SourceHealthView from '../../dashboard/sourceHealth/SourceHealthView';

/**
 * Cycle 008 Diagnostics drawer route.
 *
 * Holds the previously-stacked legacy panels that PM rejected from the
 * Command Center: the contract-wired subscription view, the source-health
 * view, and the dashboard module shell. This page is intentionally not in the
 * primary subnav — it is reachable only via the Command Center "Open
 * diagnostic view" link, so it cannot be mistaken for a customer-support
 * surface.
 */
export default function DiagnosticsPage() {
  return (
    <div className="space-y-6">
      <SubscriptionPageHeader
        id="subscription-diagnostics-heading"
        eyebrow="Subscription diagnostics"
        title="Operator diagnostics for subscription analytics"
        description={
          <>
            This view is for operations and data engineering. It surfaces source health,
            contract details, and the original module shell. Customer-support workflows live
            on the main subscription pages.
          </>
        }
        meta={
          <>
            <StateChip tone="warning" label="Operator-only view" />
            <StateChip tone="neutral" label="Not customer-support copy" />
          </>
        }
      />

      <section
        aria-labelledby="diagnostics-source-health-heading"
        className="space-y-4"
      >
        <SectionHeader
          id="diagnostics-source-health-heading"
          eyebrow={
            <span>
              <Activity className="mr-1 inline-block h-3 w-3 -translate-y-0.5" /> Source health
            </span>
          }
          title="Source health, freshness, and lineage"
          description="Operator-readable view of subscription source authority, freshness, conflicts, and lineage."
        />
        <SourceHealthView />
      </section>

      <section
        aria-labelledby="diagnostics-contract-heading"
        className="space-y-4"
      >
        <SectionHeader
          id="diagnostics-contract-heading"
          eyebrow="Subscription source detail"
          title="Subscription source detail"
          description="Stay.ai-controlled subscription detail wired against the analytics service contract. Operator-only."
        />
        <SubscriptionAnalyticsView />
      </section>

      <section
        aria-labelledby="diagnostics-shell-heading"
        className="space-y-4"
      >
        <SectionHeader
          id="diagnostics-shell-heading"
          eyebrow={
            <span>
              <Workflow className="mr-1 inline-block h-3 w-3 -translate-y-0.5" /> Module shell
            </span>
          }
          title="Module shell — diagnostic only"
          description="Original dashboard module shell retained for operations regression checks."
        />
        <DashboardModulePage module="subscriptions" />
      </section>
    </div>
  );
}
