import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import DateRangeFilter from '../components/filters/DateRangeFilter';
import PlatformFilter from '../components/filters/PlatformFilter';
import SegmentFilter from '../components/filters/SegmentFilter';
import ExportAuditForm from '../components/forms/ExportAuditForm';
import TimeSeriesChart from '../components/charts/TimeSeriesChart';
import { DashboardFilterProvider, useDashboardFilters } from '../context/DashboardFilterContext';
import { MODULE_FIXTURES } from '../data/dashboardFixtures';
import { ApiClientError, apiGet, apiPost } from '../services/apiClient';
import {
  createExportAudit,
  getDashboardModules,
  getDashboardSummary,
  getMetricDefinitions,
  getMetricSeries,
  getNoDriftRules,
} from '../services/dashboardApi';

function FilterProbe() {
  const { filters, resetFilters } = useDashboardFilters();
  return (
    <div>
      <p data-testid="filters">{`${filters.dateRange}|${filters.platform}|${filters.segment}`}</p>
      <button type="button" onClick={resetFilters}>
        Reset filters
      </button>
    </div>
  );
}

function OutsideProviderConsumer() {
  useDashboardFilters();
  return <div>never rendered</div>;
}

describe('frontend service and shell coverage', () => {
  it('handles apiGet success and error states', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 503,
          json: vi.fn(),
        }),
    );

    await expect(apiGet<{ ok: boolean }>('/health')).resolves.toEqual({ ok: true });

    await expect(apiGet('/down')).rejects.toMatchObject({
      name: 'ApiClientError',
      status: 503,
    } satisfies Partial<ApiClientError>);
  });

  it('handles apiPost success and error states', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ created: true }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 400,
          json: vi.fn(),
        }),
    );

    await expect(apiPost('/example', { sample: true })).resolves.toEqual({ created: true });
    await expect(apiPost('/bad', { sample: false })).rejects.toMatchObject({
      name: 'ApiClientError',
      status: 400,
    } satisfies Partial<ApiClientError>);
  });

  it('calls dashboard API wrapper functions with expected paths', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(['ok']),
    });
    vi.stubGlobal('fetch', fetchMock);

    await getDashboardModules();
    await getDashboardSummary('subscriptions');
    await getMetricDefinitions();
    await getMetricSeries('subscription_action_completion_rate');
    await getNoDriftRules();
    await createExportAudit({
      requested_by: 'tester',
      module: 'subscriptions',
      metric_keys: ['m1'],
      include_definitions: true,
      include_trust_labels: true,
      include_freshness: true,
      include_formula_versions: true,
      reason: 'coverage',
    });

    const calledPaths = fetchMock.mock.calls.map((call) => call[0] as string);
    expect(calledPaths).toEqual(
      expect.arrayContaining([
        'http://localhost:8000/metrics/modules',
        'http://localhost:8000/metrics/modules/subscriptions/summary',
        'http://localhost:8000/metrics/definitions',
        'http://localhost:8000/metrics/subscription_action_completion_rate/series',
        'http://localhost:8000/governance/no-drift-rules',
        'http://localhost:8000/exports/audit',
      ]),
    );
  });

  it('renders routes and page wrappers for all primary module paths', async () => {
    const cases: Array<[string, RegExp]> = [
      ['/', /Executive Overview/i],
      ['/overview', /Executive Overview/i],
      ['/subscriptions', /Subscription Analytics/i],
      ['/cancellations', /Cancellation Analytics/i],
      ['/retention', /Cancellation \/ Retention Analytics/i],
      ['/order-status', /Order Status Analytics/i],
      ['/escalations', /Escalations Analytics/i],
      ['/data-quality', /Data Quality \/ Trust Analytics/i],
      ['/governance', /RBAC, Export, Audit, and Trust Controls/i],
      ['/exports', /Governance \/ RBAC \/ Exports/i],
    ];

    for (const [route, heading] of cases) {
      const { unmount } = render(
        <MemoryRouter initialEntries={[route]}>
          <App />
        </MemoryRouter>,
      );
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
      });
      unmount();
    }
  });

  it('renders filter controls, updates values, and resets defaults', () => {
    render(
      <DashboardFilterProvider>
        <DateRangeFilter />
        <PlatformFilter />
        <SegmentFilter />
        <FilterProbe />
      </DashboardFilterProvider>,
    );

    expect(screen.getByTestId('filters')).toHaveTextContent('30d|all|all');

    fireEvent.change(screen.getByLabelText(/Date Range/i), { target: { value: '7d' } });
    fireEvent.change(screen.getByLabelText(/Platform/i), { target: { value: 'stayai' } });
    fireEvent.change(screen.getByLabelText(/Segment/i), { target: { value: 'subscriptions' } });

    expect(screen.getByTestId('filters')).toHaveTextContent('7d|stayai|subscriptions');

    fireEvent.click(screen.getByRole('button', { name: /Reset filters/i }));
    expect(screen.getByTestId('filters')).toHaveTextContent('30d|all|all');
  });

  it('throws when useDashboardFilters is used outside provider', () => {
    expect(() => render(<OutsideProviderConsumer />)).toThrow(
      /useDashboardFilters must be used inside DashboardFilterProvider/i,
    );
  });

  it('shows export audit success and fallback error states', async () => {
    const createExportAuditSpy = vi.spyOn(await import('../services/dashboardApi'), 'createExportAudit');

    createExportAuditSpy.mockResolvedValueOnce({
      export_id: 'exp-1',
      requested_by: 'frontend_skeleton_user',
      module: 'subscriptions',
      created_at: new Date().toISOString(),
      metric_keys: ['a'],
      definitions_included: true,
      trust_labels_included: true,
      freshness_included: true,
      formula_versions_included: true,
      owner: 'analytics',
      fingerprint: 'fingerprint123',
      audit_reference: 'audit-ref-123',
      trust_label: 'medium',
    });

    render(
      <ExportAuditForm
        module="subscriptions"
        definitions={MODULE_FIXTURES.subscriptions.summary.definitions}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /Request export audit metadata/i }));
    await waitFor(() => {
      expect(screen.getByText(/Audit ready: audit-ref-123 \/ fingerprint123/i)).toBeInTheDocument();
    });

    createExportAuditSpy.mockRejectedValueOnce(new Error('api unavailable'));
    fireEvent.click(screen.getByRole('button', { name: /Request export audit metadata/i }));
    await waitFor(() => {
      expect(screen.getByText(/Using disabled\/stub state until API is available: api unavailable/i)).toBeInTheDocument();
    });
  });

  it('renders time series chart without optional description', () => {
    render(
      <TimeSeriesChart
        title="Trend only title"
        data={[{ period: 'Day 1', value: 1, trust_label: 'medium' }]}
      />,
    );

    expect(screen.getByRole('heading', { name: /Trend only title/i })).toBeInTheDocument();
    expect(screen.queryByText(/expected during skeleton development/i)).not.toBeInTheDocument();
  });

  it('renders live API banner branch when summary request succeeds', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(MODULE_FIXTURES.subscriptions.summary),
      }),
    );

    render(
      <MemoryRouter initialEntries={['/subscriptions']}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Live API contract loaded/i)).toBeInTheDocument();
    });
  });
});
