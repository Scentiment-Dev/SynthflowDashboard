import SubscriptionPageHeader from '../../subscription/SubscriptionPageHeader';
import PageActionBar from '../PageActionBar';
import StateChip from '../StateChip';
import SubscriptionOutcomesView from '../../dashboard/subscriptionOutcomes/SubscriptionOutcomesView';

/**
 * Cycle 008 Outcome Summary shell.
 *
 * Implements the W2 workflow ("How many cancellations were saved?"). The
 * existing `SubscriptionOutcomesView` (Cycle 005) is mounted inside the IA v2
 * shell so the outcome funnel and KPIs render under a plain-language header
 * with the page action bar. The legacy view continues to own the funnel and
 * scenario-toggle internals; replacing it with a redesigned variant is a
 * follow-up cycle's scope.
 */
export default function OutcomesPage() {
  return (
    <div className="space-y-5">
      <SubscriptionPageHeader
        id="subscription-outcomes-heading"
        eyebrow="Subscription outcomes"
        title="Did the call end in confirmed save / cancel / pending?"
        description={
          <>
            Stay.ai is the system that owns the official subscription record. Save and
            cancel counts here come from confirmed Stay.ai final state.
          </>
        }
        meta={
          <>
            <StateChip tone="brand" label="Stay.ai · source of truth" />
            <StateChip tone="info" label="Portal · completion confirmed counts only" />
          </>
        }
      />

      <PageActionBar
        activeFilters={[{ id: 'date_preset', label: 'Last 30 days' }]}
        filterDisabledReason="Filter drawer ships in a follow-up PR. Default Last 30 days is applied."
        exportDisabledReason="Export drawer ships in a follow-up PR. Use Export & Audit for now."
      />

      <SubscriptionOutcomesView />
    </div>
  );
}
