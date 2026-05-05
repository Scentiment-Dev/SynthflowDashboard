import { NavLink } from 'react-router-dom';
import { Activity, ShieldCheck, Sparkles } from 'lucide-react';
import { NAV_ITEMS } from '../../constants/navigation';

const NAV_GROUPS: Array<{ label: string; modules: string[] }> = [
  { label: 'Customer outcomes', modules: ['overview', 'subscriptions', 'cancellations', 'retention'] },
  { label: 'Operations', modules: ['order_status', 'escalations'] },
  { label: 'Trust & governance', modules: ['data_quality', 'governance'] },
];

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200/80 bg-white/80 px-4 py-5 backdrop-blur-xl md:flex md:flex-col">
      <div className="surface-ink relative px-5 py-5">
        <span className="ambient-glow -left-12 -top-16 bg-violet-500/40" />
        <span className="ambient-glow -bottom-20 -right-10 bg-cyan-400/30" style={{ animationDelay: '-6s' }} />
        <div className="relative">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-300">
            <Sparkles className="h-3.5 w-3.5 text-violet-300" />
            Scentiment
          </div>
          <h2 className="mt-3 text-xl font-semibold tracking-tight text-white">
            Phone Support Analytics
          </h2>
          <p className="mt-2 text-[12px] leading-5 text-slate-300/90">
            Stay.ai-anchored subscription intelligence for the post-call experience team.
          </p>
          <div className="mt-4 flex items-center gap-2 text-[11px] font-medium text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Source-of-truth lock active
          </div>
        </div>
      </div>

      <nav aria-label="Primary" className="mt-6 flex-1 space-y-5 overflow-y-auto pr-1">
        {NAV_GROUPS.map((group) => {
          const items = NAV_ITEMS.filter((item) => group.modules.includes(item.module));
          if (items.length === 0) return null;
          return (
            <div key={group.label}>
              <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                {group.label}
              </p>
              <ul className="mt-2 space-y-0.5">
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={`${item.href}-${item.label}`}>
                      <NavLink
                        to={item.href}
                        className={({ isActive }) =>
                          `group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                            isActive
                              ? 'bg-slate-950 text-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.6)]'
                              : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-950'
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <span
                              aria-hidden
                              className={`absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-violet-500 transition-all ${
                                isActive ? 'h-6 w-1' : 'h-0 w-0'
                              }`}
                            />
                            <span
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition ${
                                isActive
                                  ? 'bg-white/10 text-white'
                                  : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-slate-900'
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                            </span>
                            <span className="flex-1 truncate">{item.label}</span>
                            {item.module === 'subscriptions' ? (
                              <span
                                className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
                                  isActive
                                    ? 'bg-violet-500/30 text-violet-100'
                                    : 'bg-violet-100 text-violet-700'
                                }`}
                              >
                                Priority
                              </span>
                            ) : null}
                          </>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white/70 p-3 text-xs text-slate-600 shadow-sm">
        <div className="flex items-center gap-2 text-slate-900">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">
            Governance
          </span>
        </div>
        <p className="mt-2 leading-5">
          Trust labels, freshness, and source authority ride with every metric. Exports require
          fingerprint and audit reference.
        </p>
        <div className="mt-3 flex items-center justify-between text-[11px] font-medium text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Activity className="h-3 w-3 text-violet-500" />
            v0.9 · cycle 006
          </span>
          <span className="inline-flex items-center gap-1 text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            no-drift
          </span>
        </div>
      </div>
    </aside>
  );
}
