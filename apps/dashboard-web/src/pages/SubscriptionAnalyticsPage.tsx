import DashboardModulePage from '../components/dashboard/DashboardModulePage';
import SubscriptionAnalyticsView from '../components/dashboard/subscription/SubscriptionAnalyticsView';
import SubscriptionOutcomesView from '../components/dashboard/subscriptionOutcomes/SubscriptionOutcomesView';
import SourceHealthView from '../components/dashboard/sourceHealth/SourceHealthView';

export default function SubscriptionAnalyticsPage() {
  return (
    <div className="space-y-8">
      <SubscriptionOutcomesView />
      <section
        aria-labelledby="subscription-source-health-section"
        className="space-y-6 border-t border-dashed border-slate-300 pt-6"
      >
        <header>
          <h2
            id="subscription-source-health-section"
            className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500"
          >
            Cycle 004 source health, freshness, and lineage
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
            Operator-readable view of subscription source authority, freshness, conflict, and
            lineage. Stay.ai retains final subscription truth; Shopify is context only; Portal
            link sent is not portal completion.
          </p>
        </header>
        <SourceHealthView />
      </section>
      <section
        aria-labelledby="subscription-cycle002-section"
        className="space-y-6 border-t border-dashed border-slate-300 pt-6"
      >
        <header>
          <h2
            id="subscription-cycle002-section"
            className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500"
          >
            Cycle 002 contract-wired subscription view
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
            Contract-wired Stay.ai-controlled subscription shell. Retained for backward
            compatibility with Cycle 002 surface tests.
          </p>
        </header>
        <SubscriptionAnalyticsView />
      </section>
      <section
        aria-labelledby="subscription-shell-section"
        className="space-y-6 border-t border-dashed border-slate-300 pt-6"
      >
        <header>
          <h2
            id="subscription-shell-section"
            className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500"
          >
            Cycle 001 dashboard module shell
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Retained for backward compatibility with Cycle 001 module shell tests.
          </p>
        </header>
        <DashboardModulePage module="subscriptions" />
      </section>
    </div>
  );
}
