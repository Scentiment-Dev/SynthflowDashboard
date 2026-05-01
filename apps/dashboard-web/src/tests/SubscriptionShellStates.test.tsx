import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DashboardModulePage from '../components/dashboard/DashboardModulePage';
import SubscriptionStateReadinessPanel from '../components/dashboard/SubscriptionStateReadinessPanel';
import { MODULE_FIXTURES } from '../data/dashboardFixtures';
import { useDashboardSummary } from '../hooks/useDashboardSummary';

vi.mock('../hooks/useDashboardSummary', () => ({
  useDashboardSummary: vi.fn(),
}));

const mockedUseDashboardSummary = vi.mocked(useDashboardSummary);

it('renders all required Cycle 001 subscription placeholder states', () => {
  render(<SubscriptionStateReadinessPanel />);

  expect(screen.getByRole('heading', { name: /Subscription shell state readiness/i })).toBeInTheDocument();
  expect(
    screen.getByText(/non-production UI markers and do not represent confirmed business outcomes/i),
  ).toBeInTheDocument();

  [
    'Loading',
    'Empty',
    'Error',
    'Permission denied',
    'Low trust',
    'Stale data',
    'Pending source confirmation',
    'Missing Stay.ai final state',
    'Portal link sent, completion unknown',
    'Shopify context available, Stay.ai final missing',
    'Synthflow journey incomplete',
    'Export blocked/pending metadata',
    'Audit metadata unavailable',
    'RBAC server confirmation unavailable',
  ].forEach((label) => {
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});

it('renders explicit permission-denied shell state for subscriptions', () => {
  mockedUseDashboardSummary.mockReturnValue({
    data: MODULE_FIXTURES.subscriptions,
    loading: false,
    error: '403 forbidden by backend RBAC policy',
    source: 'fixture',
  });

  render(
    <MemoryRouter>
      <DashboardModulePage module="subscriptions" />
    </MemoryRouter>,
  );

  expect(screen.getByText(/Permission denied from analytics API/i)).toBeInTheDocument();
});

it('renders empty-state placeholder when no summary metrics are available', () => {
  mockedUseDashboardSummary.mockReturnValue({
    data: {
      ...MODULE_FIXTURES.subscriptions,
      summary: {
        ...MODULE_FIXTURES.subscriptions.summary,
        cards: [],
      },
    },
    loading: false,
    error: null,
    source: 'fixture',
  });

  render(
    <MemoryRouter>
      <DashboardModulePage module="subscriptions" />
    </MemoryRouter>,
  );

  expect(
    screen.getByText(/No eligible metrics returned for current filters/i),
  ).toBeInTheDocument();
});
