import DashboardModulePage from '../components/dashboard/DashboardModulePage';
import SubscriptionAnalyticsView from '../components/dashboard/subscription/SubscriptionAnalyticsView';

export default function SubscriptionAnalyticsPage() {
  return (
    <div className="space-y-8">
      <SubscriptionAnalyticsView />
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
            Retained for backward compatibility. Cycle 002 contract-wired view above is the
            canonical subscription analytics surface.
          </p>
        </header>
        <DashboardModulePage module="subscriptions" />
      </section>
    </div>
  );
}
