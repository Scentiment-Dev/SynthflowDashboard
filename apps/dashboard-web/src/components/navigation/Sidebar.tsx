import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../../constants/navigation';

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-white px-4 py-5 lg:block">
      <div className="rounded-2xl bg-slate-950 p-4 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Scentiment</p>
        <h2 className="mt-2 text-lg font-semibold">Phone Support Analytics</h2>
        <p className="mt-2 text-xs leading-5 text-slate-300">Wave 4 frontend skeleton • Agent B ownership</p>
      </div>
      <nav className="mt-5 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={`${item.href}-${item.label}`}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                }`
              }
            >
              <span className="flex items-center gap-3"><Icon className="h-4 w-4" /> {item.label}</span>
              <span className="text-[10px] uppercase tracking-wide opacity-70">{item.owner}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
