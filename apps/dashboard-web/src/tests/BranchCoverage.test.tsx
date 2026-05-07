import { act, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import FunnelChart from '../components/charts/FunnelChart';
import JourneyFlowChart from '../components/charts/JourneyFlowChart';
import MetricCard from '../components/charts/MetricCard';
import TimeSeriesChart from '../components/charts/TimeSeriesChart';
import ModuleHeader from '../components/dashboard/ModuleHeader';
import ExportReadinessPanel from '../components/dashboard/ExportReadinessPanel';
import MetricDefinitionPanel from '../components/dashboard/MetricDefinitionPanel';
import SubscriptionOutcomeKpiGrid from '../components/dashboard/subscriptionOutcomes/SubscriptionOutcomeKpiGrid';
import PremiumCard from '../components/design/PremiumCard';
import SectionHeader from '../components/design/SectionHeader';
import StatusPill from '../components/design/StatusPill';
import Sidebar from '../components/navigation/Sidebar';
import Topbar from '../components/navigation/Topbar';
import { ShieldCheck } from 'lucide-react';
import {
  DashboardFilterProvider,
  useDashboardFilters,
} from '../context/DashboardFilterContext';
import {
  formatMetricValue,
  formatPercent,
  sourceBadgeClasses,
  trustLabelClasses,
} from '../utils/formatters';

describe('branch coverage for dashboard UI helpers', () => {
  it('covers formatter branches for metric values and percentages', () => {
    expect(formatMetricValue('starter')).toBe('starter');
    expect(formatMetricValue(1000)).toBe('1,000');
    expect(formatMetricValue(12.345)).toBe('12.35');
    expect(formatPercent(12)).toBe('12%');
    expect(formatPercent(12.4)).toBe('12.4%');
  });

  it('covers source badge class branches', () => {
    expect(sourceBadgeClasses('Stay.ai')).toContain('violet');
    expect(sourceBadgeClasses('Shopify')).toContain('green');
    expect(sourceBadgeClasses('Synthflow')).toContain('indigo');
    expect(sourceBadgeClasses('Portal')).toContain('cyan');
    expect(sourceBadgeClasses('Unknown Source')).toContain('slate');
  });

  it('covers trust label class variants', () => {
    expect(trustLabelClasses('high')).toContain('emerald');
    expect(trustLabelClasses('medium')).toContain('sky');
    expect(trustLabelClasses('low')).toContain('amber');
    expect(trustLabelClasses('untrusted')).toContain('rose');
  });

  it('covers funnel chart branches for description and optional rules', () => {
    const steps = [
      {
        id: 'step-1',
        label: 'Step one',
        count: 100,
        rate: 75,
        source_of_truth: 'Stay.ai',
        trust_label: 'medium' as const,
        rule: 'Rule present',
      },
      {
        id: 'step-2',
        label: 'Step two',
        count: 50,
        rate: 50,
        source_of_truth: 'Shopify',
        trust_label: 'low' as const,
      },
    ];

    const { rerender } = render(
      <FunnelChart title="Funnel with description" description="Branch coverage description" steps={steps} />,
    );
    expect(screen.getByText(/Branch coverage description/i)).toBeInTheDocument();
    expect(screen.getByText(/Rule present/i)).toBeInTheDocument();

    rerender(<FunnelChart title="Funnel without description" steps={steps} />);
    expect(screen.queryByText(/Branch coverage description/i)).not.toBeInTheDocument();
  });

  it('covers journey chart branches for lockedRule and connector arrows', () => {
    const nodes = [
      {
        id: 'node-1',
        label: 'Node one',
        description: 'First step',
        status: 'warning' as const,
        source: 'Synthflow',
        lockedRule: 'Locked requirement',
      },
      {
        id: 'node-2',
        label: 'Node two',
        description: 'Second step',
        status: 'success' as const,
        source: 'Stay.ai',
      },
    ];

    const { rerender } = render(
      <JourneyFlowChart title="Journey with description" description="Journey detail" nodes={nodes} />,
    );
    expect(screen.getByText(/Journey detail/i)).toBeInTheDocument();
    expect(screen.getByText(/Locked requirement/i)).toBeInTheDocument();

    rerender(<JourneyFlowChart title="Journey without description" nodes={nodes} />);
    expect(screen.queryByText(/Journey detail/i)).not.toBeInTheDocument();
  });

  it('covers module header action branch', () => {
    const { rerender } = render(
      <ModuleHeader
        eyebrow="Test eyebrow"
        title="Test title"
        description="Test description"
        actions={<button type="button">Action</button>}
      />,
    );
    expect(screen.getByRole('button', { name: /Action/i })).toBeInTheDocument();

    rerender(<ModuleHeader eyebrow="Test eyebrow" title="Test title" description="Test description" />);
    expect(screen.queryByRole('button', { name: /Action/i })).not.toBeInTheDocument();
  });

  it('covers export readiness pluralization branch', () => {
    const definition = {
      metric_key: 'm1',
      display_name: 'M1',
      module: 'subscriptions' as const,
      formula: 'a/b',
      source_of_truth: 'Stay.ai',
      trust_rule: 'confirmed source required',
    };

    const { rerender } = render(
      <ExportReadinessPanel module="subscriptions" definitions={[definition]} />,
    );
    expect(screen.getByText(/1 definition attached/i)).toBeInTheDocument();

    rerender(<ExportReadinessPanel module="subscriptions" definitions={[definition, { ...definition, metric_key: 'm2' }]} />);
    expect(screen.getByText(/2 definitions attached/i)).toBeInTheDocument();
  });

  it('covers MetricCard preview value and delta polish branches', () => {
    const baseMetric = {
      key: 'metric_alpha',
      label: 'Alpha metric',
      value: 'starter',
      trust_label: 'medium' as const,
      source_of_truth: 'Stay.ai',
      description: 'Preview metric description.',
    };
    const { rerender } = render(<MetricCard metric={baseMetric} />);
    expect(screen.getByText(/Preview value/i)).toBeInTheDocument();
    expect(screen.getByText(/Awaiting first confirmed window/i)).toBeInTheDocument();

    rerender(
      <MetricCard
        metric={{
          ...baseMetric,
          value: 1234,
          delta: '+18% week over week',
        }}
      />,
    );
    expect(screen.queryByText(/Preview value/i)).not.toBeInTheDocument();
    expect(screen.getByText(/\+18% week over week/i)).toBeInTheDocument();

    rerender(
      <MetricCard
        metric={{
          ...baseMetric,
          value: 1000,
          delta: '-12% week over week',
        }}
      />,
    );
    expect(screen.getByText(/-12% week over week/i)).toBeInTheDocument();

    rerender(
      <MetricCard
        metric={{
          ...baseMetric,
          value: 500,
          delta: 'within tolerance',
        }}
      />,
    );
    expect(screen.getByText(/within tolerance/i)).toBeInTheDocument();
  });

  it('covers TimeSeriesChart description and delta tone branches', () => {
    const data = [
      { period: '2026-04-01', value: 100, trust_label: 'medium' as const },
      { period: '2026-04-02', value: 80, trust_label: 'medium' as const },
    ];
    const { rerender } = render(
      <TimeSeriesChart title="Trend" description="Series detail" data={data} />,
    );
    expect(screen.getByText(/Series detail/i)).toBeInTheDocument();
    expect(screen.getByText(/-20\.0%/)).toBeInTheDocument();

    rerender(<TimeSeriesChart title="Trend" data={[]} />);
    expect(screen.queryByText(/Series detail/i)).not.toBeInTheDocument();
    expect(screen.getAllByText(/—/).length).toBeGreaterThan(0);

    rerender(
      <TimeSeriesChart
        title="Trend"
        data={[
          { period: '2026-04-01', value: 0, trust_label: 'medium' as const },
          { period: '2026-04-02', value: 50, trust_label: 'medium' as const },
        ]}
      />,
    );
    expect(screen.getAllByText(/—/).length).toBeGreaterThan(0);

    rerender(
      <TimeSeriesChart
        title="Trend"
        data={[
          { period: '2026-04-01', value: 50, trust_label: 'medium' as const },
          { period: '2026-04-02', value: 100, trust_label: 'medium' as const },
        ]}
      />,
    );
    expect(screen.getByText(/\+100\.0%/)).toBeInTheDocument();
  });

  it('covers FunnelChart empty steps branch', () => {
    render(<FunnelChart title="Empty funnel" steps={[]} />);
    expect(screen.getByText(/Top of funnel 0/i)).toBeInTheDocument();
  });

  it('covers SectionHeader optional and align branches', () => {
    const { rerender } = render(
      <SectionHeader
        align="left"
        title="Title only"
        actions={<button type="button">Section action</button>}
      />,
    );
    expect(screen.getByRole('button', { name: /Section action/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Title only/i })).toBeInTheDocument();

    rerender(
      <SectionHeader
        eyebrow="Eyebrow"
        title="Full title"
        description="With description"
      />,
    );
    expect(screen.getByText(/With description/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Section action/i })).not.toBeInTheDocument();

    rerender(
      <SectionHeader
        id="hdr-meta-x"
        ariaLabelledBy="hdr-meta-x"
        title="Title with meta"
        meta={<span data-testid="section-header-meta">meta-chip</span>}
      />,
    );
    const titledHeader = screen.getByRole('heading', { name: /Title with meta/i });
    expect(titledHeader).toHaveAttribute('id', 'hdr-meta-x');
    expect(screen.getByTestId('section-header-meta')).toBeInTheDocument();
  });

  it('covers MetricDefinitionPanel formula version fallback branch', () => {
    render(
      <MetricDefinitionPanel
        definitions={[
          {
            metric_key: 'm1',
            display_name: 'M1',
            module: 'subscriptions',
            formula: 'a/b',
            source_of_truth: 'Stay.ai',
            trust_rule: 'confirmed only',
          },
          {
            metric_key: 'm2',
            display_name: 'M2',
            module: 'subscriptions',
            formula: 'c/d',
            source_of_truth: 'Stay.ai',
            trust_rule: 'confirmed only',
            formula_version: 'v1.2.3',
          },
        ]}
      />,
    );
    expect(screen.getByText(/version pending/i)).toBeInTheDocument();
    expect(screen.getByText(/v1.2.3/i)).toBeInTheDocument();
  });

  it('covers Topbar PAGE_META fallback for non-mapped routes', () => {
    const renderRoute = (path: string) =>
      render(
        <DashboardFilterProvider>
          <MemoryRouter initialEntries={[path]}>
            <Routes>
              <Route path="*" element={<Topbar />} />
            </Routes>
          </MemoryRouter>
        </DashboardFilterProvider>,
      );

    const { unmount } = renderRoute('/order-status');
    expect(
      screen.getByRole('heading', { name: /Shopify order context analytics/i }),
    ).toBeInTheDocument();
    unmount();

    const { unmount: unmount2 } = renderRoute('/some-unknown-route');
    expect(screen.getByRole('heading', { name: /Internal analytics/i })).toBeInTheDocument();
    unmount2();
  });

  it('covers Topbar filter-label fallbacks for live_agent platform and order_status segment', () => {
    let setPlatform: ((next: 'live_agent') => void) | null = null;
    let setSegment: ((next: 'order_status') => void) | null = null;

    function FilterDriver() {
      const filters = useDashboardFilters();
      setPlatform = (value) => filters.setPlatform(value);
      setSegment = (value) => filters.setSegment(value);
      return null;
    }

    render(
      <DashboardFilterProvider>
        <MemoryRouter initialEntries={['/overview']}>
          <Routes>
            <Route
              path="*"
              element={
                <>
                  <FilterDriver />
                  <Topbar />
                </>
              }
            />
          </Routes>
        </MemoryRouter>
      </DashboardFilterProvider>,
    );

    act(() => {
      setPlatform?.('live_agent');
      setSegment?.('order_status');
    });

    expect(screen.getByText(/^Live agent$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Order status$/i)).toBeInTheDocument();
  });

  it('covers SubscriptionOutcomeKpiGrid hide-share branch for cards exceeding total', () => {
    render(
      <SubscriptionOutcomeKpiGrid
        cards={[
          {
            id: 'subscription_contacts_total',
            label: 'Subscription contacts',
            value: 100,
            tone: 'primary',
            authority: 'Stay.ai',
            isFinalAuthority: true,
            helper: 'Total contacts.',
          },
          {
            id: 'shopify_context_available_total',
            label: 'Shopify context available',
            value: 200,
            tone: 'context',
            authority: 'Shopify',
            isFinalAuthority: false,
            helper: 'Context-only counter that can exceed total subscription contacts.',
          },
        ]}
        rateCards={[]}
      />,
    );

    expect(screen.queryByText(/% of subscription contacts/i)).not.toBeInTheDocument();
  });

  it('covers SubscriptionOutcomeKpiGrid totalForShare fallback when subscription_contacts_total is missing', () => {
    render(
      <SubscriptionOutcomeKpiGrid
        cards={[
          {
            id: 'cancellation_requests_total',
            label: 'Cancellation contacts',
            value: 0,
            tone: 'cancellation',
            authority: 'Stay.ai',
            isFinalAuthority: true,
            helper: 'Confirmed cancellation outcomes only.',
          },
        ]}
        rateCards={[]}
      />,
    );

    expect(screen.getByTestId('outcome-kpi-cancellation_requests_total')).toBeInTheDocument();
    expect(screen.queryByText(/of subscription contacts/i)).not.toBeInTheDocument();
  });

  it('renders Sidebar with priority badge active and inactive states', () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={['/subscriptions']}>
        <Sidebar />
      </MemoryRouter>,
    );
    expect(screen.getAllByText(/Priority/i).length).toBeGreaterThan(0);
    unmount();

    render(
      <MemoryRouter initialEntries={['/overview']}>
        <Sidebar />
      </MemoryRouter>,
    );
    expect(screen.getAllByText(/Priority/i).length).toBeGreaterThan(0);
  });

  it('covers PremiumCard variant, padded, and as branches', () => {
    const { container, rerender } = render(
      <PremiumCard variant="default" padded={false} className="extra">
        <p>Default</p>
      </PremiumCard>,
    );
    expect(container.querySelector('section.surface-card.extra')).not.toBeNull();
    expect(container.querySelector('section.surface-card.p-5')).toBeNull();

    rerender(
      <PremiumCard as="article" variant="elevated" padded>
        <p>Elevated</p>
      </PremiumCard>,
    );
    expect(container.querySelector('article.surface-card-elevated.p-5')).not.toBeNull();

    rerender(
      <PremiumCard as="div" variant="inset" padded={false}>
        <p>Inset</p>
      </PremiumCard>,
    );
    expect(container.querySelector('div.rounded-2xl')).not.toBeNull();
  });

  it('covers StatusPill tone, size, icon, and pulse branches', () => {
    const { container, rerender } = render(
      <StatusPill tone="success" size="md" pulse>
        Healthy
      </StatusPill>,
    );
    expect(screen.getByText(/Healthy/i)).toBeInTheDocument();
    expect(container.querySelector('.bg-emerald-500')).not.toBeNull();

    rerender(
      <StatusPill tone="warning" size="sm" icon={<ShieldCheck />}>
        Warning
      </StatusPill>,
    );
    expect(screen.getByText(/Warning/i)).toBeInTheDocument();

    rerender(
      <StatusPill tone="danger">Danger</StatusPill>,
    );
    expect(screen.getByText(/Danger/i)).toBeInTheDocument();

    rerender(
      <StatusPill tone="info">Info</StatusPill>,
    );
    expect(screen.getByText(/Info/i)).toBeInTheDocument();

    rerender(
      <StatusPill tone="brand">Brand</StatusPill>,
    );
    expect(screen.getByText(/Brand/i)).toBeInTheDocument();
  });

  it('covers SubscriptionOutcomeKpiGrid n/a rate card branch (zero denominator hides progress bar)', () => {
    const { container } = render(
      <SubscriptionOutcomeKpiGrid
        cards={[]}
        rateCards={[
          {
            id: 'retention_rate',
            label: 'Retention rate',
            helper: 'Stay.ai-confirmed retention.',
            authority: 'Stay.ai',
            numeratorKey: 'confirmed_retained_total',
            denominatorKey: 'subscription_contacts_total',
            rate: 0,
            numerator: 0,
            denominator: 0,
            formula: 'confirmed_retained_total / subscription_contacts_total',
            isFinalAuthority: true,
          },
        ]}
      />,
    );
    const card = screen.getByTestId('outcome-rate-retention_rate');
    expect(card).toBeInTheDocument();
    expect(screen.getByText(/n\/a/i)).toBeInTheDocument();
    expect(card.querySelector('span.text-violet-500.uppercase')).toBeNull();
    expect(container.querySelector('.bg-gradient-to-r.from-violet-500.to-indigo-400')).toBeNull();
  });
});
