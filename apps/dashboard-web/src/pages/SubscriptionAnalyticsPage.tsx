import { Route, Routes } from 'react-router-dom';
import SubscriptionLayout from '../components/subscription-v2/SubscriptionLayout';
import CommandCenterPage from '../components/subscription-v2/pages/CommandCenterPage';
import OutcomesPage from '../components/subscription-v2/pages/OutcomesPage';
import BusinessValuePage from '../components/subscription-v2/pages/BusinessValuePage';
import FollowUpPage from '../components/subscription-v2/pages/FollowUpPage';
import DiagnosticsPage from '../components/subscription-v2/pages/DiagnosticsPage';
import ComingSoonPage from '../components/subscription-v2/pages/ComingSoonPage';

/**
 * Cycle 008 — Subscription analytics IA v2 router.
 *
 * Replaces the Cycle 006 / 007 stacked single-page subscription module with a
 * 10-subpage router. Only one subpage mounts at a time. The Cycle 002 / 005
 * legacy panels and the source-health view live behind the Diagnostics route
 * so the customer-support surface is never stacked with operator-only panels.
 */
export default function SubscriptionAnalyticsPage() {
  return (
    <SubscriptionLayout>
      <Routes>
        <Route index element={<CommandCenterPage />} />
        <Route path="outcomes" element={<OutcomesPage />} />
        <Route
          path="non-cancellation"
          element={
            <ComingSoonPage
              eyebrow="Non-cancellation actions"
              title="Are skip / pause / frequency-change / SKU swap completing?"
              whatItWillShow="A per-action sparkbar list with completion rate, source authority, and trust chip for skip, pause, frequency change, address change, SKU swap, reactivate, and one-time add-on actions."
              whyItIsBlocked="Stay.ai non-cancellation action joins are still being verified for production."
              whatToUseInstead="Open the Outcome Summary page to see overall save / cancel / pending counts."
              fallbackHref="/subscriptions/outcomes"
              fallbackLabel="Open Outcome Summary"
            />
          }
        />
        <Route
          path="cancellation-intake"
          element={
            <ComingSoonPage
              eyebrow="Cancellation intake"
              title="Which cancel reasons are coming in?"
              whatItWillShow="The seven official cancellation reasons with count, share, save rate, and primary next-step. Cost-too-high cancels link to the Cost Too High retention funnel."
              whyItIsBlocked="The cancellation reason taxonomy is wired in the backend, but the page-level UI ships in a follow-up cycle."
              whatToUseInstead="Use the Follow-Up Queue to act on individual customers needing a human today."
              fallbackHref="/subscriptions/follow-up"
              fallbackLabel="Open Follow-Up Queue"
            />
          }
        />
        <Route
          path="cost-too-high"
          element={
            <ComingSoonPage
              eyebrow="Cost too high retention"
              title="Frequency change → 25% off → confirmed cancel — where do we lose them?"
              whatItWillShow="A sequence-strict funnel showing retention offer effectiveness per offer version, plus the offer cost vs gross value protected mini-card."
              whyItIsBlocked="Offer-version joins are not yet built. Tracked in the Cycle 008 plan."
              whatToUseInstead="Open the Business Value page for the headline retention impact today."
              fallbackHref="/subscriptions/business-value"
              fallbackLabel="Open Business Value"
            />
          }
        />
        <Route path="business-value" element={<BusinessValuePage />} />
        <Route
          path="portal-handoff"
          element={
            <ComingSoonPage
              eyebrow="Portal & handoff"
              title="Link sent vs confirmed completion vs failure"
              whatItWillShow="A four-stage portal funnel (link sent → opened → started → completion confirmed) with channel completion rates and the locked rule banner: a portal link sent is not portal completion."
              whyItIsBlocked="Portal completion telemetry has gaps the team is closing in the next cycle."
              whatToUseInstead="The Follow-Up Queue surfaces individual customers whose portal completion is unconfirmed."
              fallbackHref="/subscriptions/follow-up"
              fallbackLabel="Open Follow-Up Queue"
            />
          }
        />
        <Route
          path="containment"
          element={
            <ComingSoonPage
              eyebrow="Containment quality"
              title="True containment: contained without repeat contact"
              whatItWillShow="A true subscription containment KPI plus a 1 / 7 / 30-day repeat-contact heatmap and the locked exclusion rule for abandoned and drop-off calls."
              whyItIsBlocked="Repeat-contact join is not yet built. Tracked in the Cycle 008 plan."
              whatToUseInstead="Open the Outcome Summary page to see save and cancel mix today."
              fallbackHref="/subscriptions/outcomes"
              fallbackLabel="Open Outcome Summary"
            />
          }
        />
        <Route path="follow-up" element={<FollowUpPage />} />
        <Route
          path="export-audit"
          element={
            <ComingSoonPage
              eyebrow="Governed exports"
              title="Pull a governed export"
              whatItWillShow="A page-resident export drawer with manifest preview (active filters, metric definitions, trust labels, freshness, formula versions, owner, time, fingerprint, audit reference) plus an export queue with status and audit links."
              whyItIsBlocked="Export drawer ships in a separate PR coordinated with the second-designer agent so RBAC and manifest-mismatch behaviour stay consistent."
              whatToUseInstead="Per-page export buttons on every subscription subpage — currently disabled with a clear reason — will activate as soon as the drawer lands."
              fallbackHref="/subscriptions"
              fallbackLabel="Back to Command Center"
            />
          }
        />
        <Route path="diagnostics" element={<DiagnosticsPage />} />
      </Routes>
    </SubscriptionLayout>
  );
}
