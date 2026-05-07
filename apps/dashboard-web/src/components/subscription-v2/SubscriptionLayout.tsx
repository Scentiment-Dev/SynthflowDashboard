import type { ReactNode } from 'react';
import SubscriptionSubnav from '../subscription/SubscriptionSubnav';

/**
 * Cycle 008 IA v2 shell. Renders the subscription subnav above whichever
 * subpage is currently active. Subpages mount and unmount on route change so
 * the page never stacks all subscription panels on a single scroll.
 */
export default function SubscriptionLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-5">
      <SubscriptionSubnav />
      {children}
    </div>
  );
}
