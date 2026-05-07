import type { ReactNode } from 'react';
import Sidebar from '../components/navigation/Sidebar';
import Topbar from '../components/navigation/Topbar';
import DateRangeFilter from '../components/filters/DateRangeFilter';
import PlatformFilter from '../components/filters/PlatformFilter';
import SegmentFilter from '../components/filters/SegmentFilter';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen text-slate-950">
      <Sidebar />
      <div className="lg:pl-72">
        <Topbar />
        <main className="mx-auto flex max-w-[1400px] flex-col gap-7 px-4 py-6 sm:px-6 lg:px-8">
          <section
            aria-label="Dashboard filters"
            className="surface-card grid gap-3 px-4 py-3 md:grid-cols-3 md:gap-4 md:px-5 md:py-4"
          >
            <DateRangeFilter />
            <PlatformFilter />
            <SegmentFilter />
          </section>
          {children}
        </main>
        <footer className="mx-auto max-w-[1400px] px-4 pb-10 pt-4 text-[11px] text-slate-400 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-3">
            <span>
              Scentiment internal analytics · Stay.ai owns subscription outcome truth ·
              Shopify is context only · Trust labels are system-calculated.
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
