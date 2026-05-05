import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import FunnelChart from '../components/charts/FunnelChart';
import JourneyFlowChart from '../components/charts/JourneyFlowChart';
import MetricCard from '../components/charts/MetricCard';
import TimeSeriesChart from '../components/charts/TimeSeriesChart';
import ModuleHeader from '../components/dashboard/ModuleHeader';
import ExportReadinessPanel from '../components/dashboard/ExportReadinessPanel';
import MetricDefinitionPanel from '../components/dashboard/MetricDefinitionPanel';
import SectionHeader from '../components/design/SectionHeader';
import Topbar from '../components/navigation/Topbar';
import { DashboardFilterProvider } from '../context/DashboardFilterContext';
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

    rerender(<TimeSeriesChart title="Trend" data={[]} />);
    expect(screen.queryByText(/Series detail/i)).not.toBeInTheDocument();

    rerender(
      <TimeSeriesChart
        title="Trend"
        data={[
          { period: '2026-04-01', value: 0, trust_label: 'medium' as const },
          { period: '2026-04-02', value: 50, trust_label: 'medium' as const },
        ]}
      />,
    );
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
    expect(screen.getByRole('heading', { name: /Phone Support Analytics/i })).toBeInTheDocument();
    unmount2();
  });
});
