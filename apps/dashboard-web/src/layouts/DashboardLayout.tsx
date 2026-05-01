import type { ReactNode } from 'react';
import Sidebar from '../components/navigation/Sidebar';
import Topbar from '../components/navigation/Topbar';
import DateRangeFilter from '../components/filters/DateRangeFilter';
import PlatformFilter from '../components/filters/PlatformFilter';
import SegmentFilter from '../components/filters/SegmentFilter';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Sidebar />
      <div className="lg:pl-72">
        <Topbar />
        <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <section className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
            <DateRangeFilter />
            <PlatformFilter />
            <SegmentFilter />
          </section>
          {children}
        </main>
      </div>
    </div>
  );
}
