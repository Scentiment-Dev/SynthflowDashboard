import { Activity, GitBranch, History, Sparkles, Workflow } from 'lucide-react';
import DashboardModulePage from '../components/dashboard/DashboardModulePage';
import SubscriptionAnalyticsView from '../components/dashboard/subscription/SubscriptionAnalyticsView';
import SubscriptionOutcomesView from '../components/dashboard/subscriptionOutcomes/SubscriptionOutcomesView';
import SourceHealthView from '../components/dashboard/sourceHealth/SourceHealthView';
import SectionHeader from '../components/design/SectionHeader';

export default function SubscriptionAnalyticsPage() {
  return (
    <div className="space-y-10">
      <section
        aria-labelledby="subscription-hero-heading"
        className="surface-ink surface-grid-overlay relative overflow-hidden p-6 sm:p-9"
      >
        <span className="ambient-glow -left-16 -top-20 bg-violet-500/40" />
        <span
          className="ambient-glow -bottom-24 right-0 bg-cyan-500/35"
          style={{ animationDelay: '-7s' }}
        />
        <div className="relative grid gap-6 lg:grid-cols-[2fr,1fr] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-violet-200">
              <Sparkles className="h-3.5 w-3.5 text-violet-300" /> Subscription analytics · priority
              module
            </p>
            <h1
              id="subscription-hero-heading"
              className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-[40px] md:leading-[1.05]"
            >
              Stay.ai subscription outcome intelligence
            </h1>
            <p className="mt-3 max-w-3xl text-[15px] leading-7 text-slate-200/90">
              The first fully elevated analytics module. Stay.ai owns subscription outcome truth,
              Shopify is context only, portal link delivery is never portal completion. Every KPI
              ships with a source authority, trust label, freshness state, and exportable audit
              metadata.
            </p>
          </div>
          <dl className="grid grid-cols-3 gap-3 text-center text-white">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-200/80">
                Source of truth
              </dt>
              <dd className="mt-2 text-sm font-semibold">Stay.ai</dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-200/80">
                Context
              </dt>
              <dd className="mt-2 text-sm font-semibold">Shopify · Synthflow</dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200/80">
                Trust mode
              </dt>
              <dd className="mt-2 text-sm font-semibold">System-calculated</dd>
            </div>
          </dl>
        </div>
      </section>

      <SubscriptionOutcomesView />

      <section aria-labelledby="subscription-source-health-section" className="space-y-4">
        <SectionHeader
          id="subscription-source-health-section"
          eyebrow={
            <span>
              <Activity className="mr-1 inline-block h-3 w-3 -translate-y-0.5" /> Source health
            </span>
          }
          title="Source health, freshness, and lineage"
          description="Operator-readable view of subscription source authority, freshness, conflicts, and lineage. Stay.ai retains final subscription truth; Shopify is context only; portal link sent is not portal completion."
        />
        <SourceHealthView />
      </section>

      <section aria-labelledby="subscription-cycle002-section" className="space-y-4">
        <SectionHeader
          id="subscription-cycle002-section"
          eyebrow="Contract-wired view"
          title="Cycle 002 contract-wired subscription view"
          description="Stay.ai-controlled subscription shell wired against the analytics-api contract. Retained alongside the elevated outcome view above for backward compatibility."
        />
        <SubscriptionAnalyticsView />
      </section>

      <section aria-labelledby="subscription-shell-section" className="space-y-4">
        <SectionHeader
          id="subscription-shell-section"
          eyebrow={
            <span>
              <Workflow className="mr-1 inline-block h-3 w-3 -translate-y-0.5" /> Module shell
            </span>
          }
          title="Cycle 001 dashboard module shell"
          description="Original module shell retained for backward compatibility with shell-state and routing tests."
        />
        <DashboardModulePage module="subscriptions" />
      </section>

      <p className="flex items-center justify-end gap-2 text-[11px] text-slate-400">
        <History className="h-3 w-3" />
        Legacy sections kept mounted for regression coverage <GitBranch className="h-3 w-3" />
      </p>
    </div>
  );
}
