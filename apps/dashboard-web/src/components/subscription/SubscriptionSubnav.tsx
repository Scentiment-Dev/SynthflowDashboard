import { NavLink } from 'react-router-dom';
import {
  SUBSCRIPTION_SUBNAV_ITEMS,
  type SubscriptionSubnavItem,
  type SubscriptionSubnavItemId,
} from '../../constants/subscriptionSubnav';

type SubscriptionSubnavProps = {
  items?: SubscriptionSubnavItem[];
  activeId?: SubscriptionSubnavItemId;
  // eslint-disable-next-line no-unused-vars
  onSelect?: (selectedItem: SubscriptionSubnavItem) => void;
};

const STATUS_LABEL: Record<SubscriptionSubnavItem['status'], string> = {
  prototype: 'Coming soon',
  planned: 'Coming soon',
  live: 'Live',
};

const STATUS_CHIP_CLASS: Record<SubscriptionSubnavItem['status'], string> = {
  prototype: 'bg-amber-100 text-amber-800 ring-amber-200',
  planned: 'bg-amber-100 text-amber-800 ring-amber-200',
  live: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
};

/**
 * Cycle 008 — Subscription analytics secondary navigation. Each tab is a
 * `NavLink` that activates by route, rather than the Cycle 007 disabled-button
 * prototype. Coming-soon tabs route to a stub subpage that explains what the
 * tab will show, instead of a hard-disabled state — the support user always has
 * an answer when they click a tab.
 *
 * Banned-string policy: this component never surfaces "Cycle / Wave / IA v2 /
 * subnav" engineering vocabulary on the page surface (per the plain-language
 * copy guide §4.2 and the issue register).
 */
export default function SubscriptionSubnav({
  items = SUBSCRIPTION_SUBNAV_ITEMS,
  activeId,
  onSelect,
}: SubscriptionSubnavProps) {
  return (
    <nav
      aria-label="Subscription analytics"
      className="surface-card relative px-3 py-2 sm:px-4"
    >
      <ul
        className="flex snap-x snap-mandatory items-center gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => {
          const isActive = activeId ? item.id === activeId : undefined;
          const baseClass =
            'group relative inline-flex shrink-0 snap-start items-center gap-2 rounded-full border px-3.5 py-2 text-[12px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60';

          const handleClick = () => {
            onSelect?.(item);
          };

          return (
            <li key={item.id} className="snap-start">
              <NavLink
                to={item.href}
                end={item.href === '/subscriptions'}
                onClick={handleClick}
                aria-current={isActive ? 'page' : undefined}
                className={({ isActive: routeActive }) => {
                  const active = isActive ?? routeActive;
                  const stateClass = active
                    ? 'border-slate-950 bg-slate-950 text-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.6)]'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50';
                  return `${baseClass} ${stateClass}`;
                }}
                title={item.description}
              >
                {({ isActive: routeActive }) => {
                  const active = isActive ?? routeActive;
                  return (
                    <>
                      <span className="whitespace-nowrap">
                        {item.shortLabel ?? item.label}
                      </span>
                      {typeof item.attentionCount === 'number' && item.attentionCount > 0 ? (
                        <span
                          aria-label={`${item.attentionCount} need attention`}
                          className={`inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                            active ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {item.attentionCount}
                        </span>
                      ) : null}
                      {!active && item.status !== 'live' ? (
                        <span
                          aria-hidden
                          className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ring-1 ${STATUS_CHIP_CLASS[item.status]}`}
                        >
                          {STATUS_LABEL[item.status]}
                        </span>
                      ) : null}
                    </>
                  );
                }}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
