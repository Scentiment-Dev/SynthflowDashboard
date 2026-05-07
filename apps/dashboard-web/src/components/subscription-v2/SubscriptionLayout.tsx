import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import SubscriptionSubnav from '../subscription/SubscriptionSubnav';

/**
 * Cycle 008 IA v2 shell. Renders the subscription subnav above whichever
 * subpage is currently active. Subpages mount and unmount on route change so
 * the page never stacks all subscription panels on a single scroll.
 *
 * The Diagnostics page is intentionally NOT in the primary subnav (it is an
 * operator-only L2/L3 surface, reachable from the Command Center link). To
 * avoid the confusing UX of a subnav that has no active tab when the user
 * is on `/subscriptions/diagnostics`, the subnav is suppressed entirely on
 * that route. Caught by Cursor Bugbot on PR #31.
 */
export default function SubscriptionLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const hideSubnav = location.pathname.startsWith('/subscriptions/diagnostics');
  return (
    <div className="space-y-5">
      {hideSubnav ? null : <SubscriptionSubnav />}
      {children}
    </div>
  );
}
