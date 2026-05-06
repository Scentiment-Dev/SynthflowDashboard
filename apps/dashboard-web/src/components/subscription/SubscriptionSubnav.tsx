import { Compass, Lock } from 'lucide-react';
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
  prototype: 'Prototype',
  planned: 'Planned',
  live: 'Live',
};

const STATUS_CHIP_CLASS: Record<SubscriptionSubnavItem['status'], string> = {
  prototype: 'bg-violet-100 text-violet-700 ring-violet-200',
  planned: 'bg-slate-100 text-slate-500 ring-slate-200',
  live: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
};

export default function SubscriptionSubnav({
  items = SUBSCRIPTION_SUBNAV_ITEMS,
  activeId = 'command-center',
  onSelect,
}: SubscriptionSubnavProps) {
  return (
    <nav
      aria-label="Subscription analytics"
      className="surface-card relative flex flex-col gap-3 px-4 py-3 sm:px-5"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
          <Compass className="h-3.5 w-3.5 text-violet-500" />
          Subscription analytics · subnav
        </div>
        <span className="hidden text-[11px] text-slate-400 md:inline">
          IA v2 · 10 focused subpages · Cycle 007 prototype
        </span>
      </div>

      <ul
        role="tablist"
        aria-label="Subscription subpages"
        className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => {
          const isActive = item.id === activeId;
          const isDisabled = item.status === 'planned';
          const baseClass =
            'group relative inline-flex shrink-0 snap-start items-center gap-2 rounded-full border px-3.5 py-2 text-[12px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60';
          const stateClass = isActive
            ? 'border-slate-950 bg-slate-950 text-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.6)]'
            : isDisabled
              ? 'border-slate-200 bg-slate-50 text-slate-400'
              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50';

          const handleClick = () => {
            if (isDisabled) {
              return;
            }
            onSelect?.(item);
          };

          return (
            <li key={item.id} role="presentation" className="snap-start">
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-current={isActive ? 'page' : undefined}
                aria-disabled={isDisabled || undefined}
                disabled={isDisabled}
                onClick={handleClick}
                className={`${baseClass} ${stateClass}`}
                title={item.description}
              >
                <span className="whitespace-nowrap">{item.shortLabel ?? item.label}</span>
                {typeof item.attentionCount === 'number' && item.attentionCount > 0 ? (
                  <span
                    aria-label={`${item.attentionCount} need attention`}
                    className={`inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {item.attentionCount}
                  </span>
                ) : null}
                {!isActive ? (
                  <span
                    aria-hidden
                    className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ring-1 ${STATUS_CHIP_CLASS[item.status]}`}
                  >
                    {item.status === 'planned' ? <Lock className="h-2.5 w-2.5" /> : null}
                    {STATUS_LABEL[item.status]}
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>

      <p className="text-[11px] leading-5 text-slate-500">
        IA v2 splits subscription analytics into 10 focused subpages so support, retention, and
        leadership users see only what they need. Planned tabs ship in Cycle 008 once their
        backend contracts and panel migrations land. See the IA spec under
        <span className="ml-1 font-mono text-slate-600">
          docs/07_dashboard_ui_ux/subscription_analytics_information_architecture_v2.md
        </span>
        .
      </p>
    </nav>
  );
}
