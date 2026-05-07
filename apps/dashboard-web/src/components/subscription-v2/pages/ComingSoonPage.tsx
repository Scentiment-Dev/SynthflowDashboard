import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SubscriptionPageHeader from '../../subscription/SubscriptionPageHeader';
import StateChip from '../StateChip';

type ComingSoonPageProps = {
  eyebrow: string;
  title: string;
  whatItWillShow: string;
  whyItIsBlocked?: string;
  whatToUseInstead?: string;
  fallbackHref?: string;
  fallbackLabel?: string;
};

/**
 * Cycle 008 stub page for subscription subpages whose backend joins or panels
 * are not yet built. The support user always gets a real route and a real
 * answer when they click a tab — never a hard-disabled state with no
 * explanation. The page describes what the tab will show and points to the
 * most useful workflow they can run today.
 */
export default function ComingSoonPage({
  eyebrow,
  title,
  whatItWillShow,
  whyItIsBlocked,
  whatToUseInstead,
  fallbackHref = '/subscriptions',
  fallbackLabel = 'Back to Command Center',
}: ComingSoonPageProps) {
  return (
    <div className="space-y-5">
      <SubscriptionPageHeader
        eyebrow={eyebrow}
        title={title}
        description={whatItWillShow}
        meta={
          <>
            <StateChip tone="warning" label="Coming soon" />
            <StateChip tone="brand" label="Stay.ai · source of truth" />
          </>
        }
        actions={
          <Link
            to={fallbackHref}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          >
            {fallbackLabel}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        }
      />

      <section className="surface-card space-y-3 px-5 py-5">
        <p className="eyebrow">What this page will show</p>
        <p className="text-sm leading-6 text-slate-700">{whatItWillShow}</p>
        {whyItIsBlocked ? (
          <>
            <p className="eyebrow">Why we cannot ship it yet</p>
            <p className="text-sm leading-6 text-slate-700">{whyItIsBlocked}</p>
          </>
        ) : null}
        {whatToUseInstead ? (
          <>
            <p className="eyebrow">What to use today</p>
            <p className="text-sm leading-6 text-slate-700">{whatToUseInstead}</p>
          </>
        ) : null}
      </section>
    </div>
  );
}
