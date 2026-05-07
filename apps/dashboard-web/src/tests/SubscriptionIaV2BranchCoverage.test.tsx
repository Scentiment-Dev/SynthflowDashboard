import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import App from '../App';
import Topbar from '../components/navigation/Topbar';
import StatusBanner from '../components/subscription-v2/StatusBanner';
import { DashboardFilterProvider } from '../context/DashboardFilterContext';
import { useDashboardFilters } from '../context/DashboardFilterContext';
import * as outcomesHook from '../hooks/useSubscriptionOutcomes';
import * as businessValueHook from '../hooks/useSubscriptionBusinessValue';
import * as followUpHook from '../hooks/useSubscriptionFollowUp';
import { SUBSCRIPTION_BUSINESS_VALUE_FIXTURES } from '../data/subscriptionBusinessValueFixtures';
import { SUBSCRIPTION_FOLLOW_UP_FIXTURES } from '../data/subscriptionFollowUpFixtures';
import { SUBSCRIPTION_OUTCOMES_FIXTURES } from '../data/subscriptionOutcomesFixtures';

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ ok: false, status: 503, json: vi.fn().mockResolvedValue({}) }),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('Topbar fallback rendering', () => {
  it('falls back to the generic Subscription analytics title when the path is unknown', () => {
    render(
      <DashboardFilterProvider>
        <MemoryRouter initialEntries={['/totally-unknown-path']}>
          <Routes>
            <Route path="*" element={<Topbar />} />
          </Routes>
        </MemoryRouter>
      </DashboardFilterProvider>,
    );
    expect(
      screen.getByRole('heading', { name: /Subscription analytics/i }),
    ).toBeInTheDocument();
  });

  it('falls back to raw filter values when not in PLATFORM/SEGMENT/RANGE label maps', async () => {
    // eslint-disable-next-line no-unused-vars
    let setPlatform: ((_next: string) => void) | null = null;
    // eslint-disable-next-line no-unused-vars
    let setSegment: ((_next: string) => void) | null = null;
    // eslint-disable-next-line no-unused-vars
    let setDateRange: ((_next: string) => void) | null = null;

    function FilterDriver() {
      const filters = useDashboardFilters();
      setPlatform = (value) => filters.setPlatform(value as never);
      setSegment = (value) => filters.setSegment(value as never);
      setDateRange = (value) => filters.setDateRange(value as never);
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
      setPlatform?.('unknown_platform_xyz');
      setSegment?.('unknown_segment_xyz');
      setDateRange?.('120d');
    });

    await waitFor(() => {
      expect(screen.getByText(/unknown_platform_xyz/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/unknown_segment_xyz/i)).toBeInTheDocument();
    expect(screen.getByText(/120d/i)).toBeInTheDocument();
  });
});

describe('Command Center page state branches', () => {
  it('renders the empty-state attention panel when both pending and follow-ups are zero', async () => {
    const baseFixture = SUBSCRIPTION_OUTCOMES_FIXTURES.baseline;
    vi.spyOn(outcomesHook, 'useSubscriptionOutcomes').mockReturnValue({
      data: {
        ...baseFixture,
        metrics: {
          ...baseFixture.metrics,
          pending_stayai_confirmation_total: 0,
          portal_link_sent_total: 0,
          portal_completion_confirmed_total: 0,
        },
      },
      loading: false,
      error: null,
      source: 'api',
      permissionDenied: false,
      scenario: 'baseline',
    } as ReturnType<typeof outcomesHook.useSubscriptionOutcomes>);

    vi.spyOn(businessValueHook, 'useSubscriptionBusinessValue').mockReturnValue({
      data: SUBSCRIPTION_BUSINESS_VALUE_FIXTURES.baseline,
      loading: false,
      error: null,
      source: 'api',
      permissionDenied: false,
      scenario: 'baseline',
    } as ReturnType<typeof businessValueHook.useSubscriptionBusinessValue>);

    vi.spyOn(followUpHook, 'useSubscriptionFollowUp').mockReturnValue({
      data: SUBSCRIPTION_FOLLOW_UP_FIXTURES.empty,
      loading: false,
      error: null,
      source: 'api',
      permissionDenied: false,
      scenario: 'empty',
    } as ReturnType<typeof followUpHook.useSubscriptionFollowUp>);

    render(
      <MemoryRouter initialEntries={['/subscriptions']}>
        <App />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(
        screen.getByText(/Nothing needs attention right now/i),
      ).toBeInTheDocument();
    });
    expect(
      screen.getByText(/All Stay\.ai-controlled subscription states are clear/i),
    ).toBeInTheDocument();
  });

  it('renders the permission-denied banner when outcomes hook flags permissionDenied', async () => {
    vi.spyOn(outcomesHook, 'useSubscriptionOutcomes').mockReturnValue({
      data: SUBSCRIPTION_OUTCOMES_FIXTURES.baseline,
      loading: false,
      error: 'permission denied',
      source: 'fixture',
      permissionDenied: true,
      scenario: 'baseline',
    } as ReturnType<typeof outcomesHook.useSubscriptionOutcomes>);

    render(
      <MemoryRouter initialEntries={['/subscriptions']}>
        <App />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(
        screen.getByTestId('subscription-status-banner-permission_denied'),
      ).toBeInTheDocument();
    });
  });

  it('renders the singular "1 call is still waiting" copy when pending count is 1', async () => {
    const baseFixture = SUBSCRIPTION_OUTCOMES_FIXTURES.baseline;
    vi.spyOn(outcomesHook, 'useSubscriptionOutcomes').mockReturnValue({
      data: {
        ...baseFixture,
        metrics: {
          ...baseFixture.metrics,
          pending_stayai_confirmation_total: 1,
          portal_link_sent_total: 0,
          portal_completion_confirmed_total: 0,
        },
      },
      loading: false,
      error: null,
      source: 'api',
      permissionDenied: false,
      scenario: 'baseline',
    } as ReturnType<typeof outcomesHook.useSubscriptionOutcomes>);

    render(
      <MemoryRouter initialEntries={['/subscriptions']}>
        <App />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(
        screen.getByText(/1 call is still waiting for official confirmation/i),
      ).toBeInTheDocument();
    });
  });

  it('renders the "queued for review" branch when only follow-ups exist', async () => {
    const baseFixture = SUBSCRIPTION_OUTCOMES_FIXTURES.baseline;
    vi.spyOn(outcomesHook, 'useSubscriptionOutcomes').mockReturnValue({
      data: {
        ...baseFixture,
        metrics: {
          ...baseFixture.metrics,
          pending_stayai_confirmation_total: 0,
          portal_link_sent_total: 0,
          portal_completion_confirmed_total: 0,
        },
      },
      loading: false,
      error: null,
      source: 'api',
      permissionDenied: false,
      scenario: 'baseline',
    } as ReturnType<typeof outcomesHook.useSubscriptionOutcomes>);

    vi.spyOn(followUpHook, 'useSubscriptionFollowUp').mockReturnValue({
      data: {
        ...SUBSCRIPTION_FOLLOW_UP_FIXTURES.baseline,
        records: SUBSCRIPTION_FOLLOW_UP_FIXTURES.baseline.records.filter(
          (r) =>
            r.portal_completion_status !== 'completion_unknown' &&
            r.portal_completion_status !== 'link_sent',
        ),
      },
      loading: false,
      error: null,
      source: 'api',
      permissionDenied: false,
      scenario: 'baseline',
    } as ReturnType<typeof followUpHook.useSubscriptionFollowUp>);

    render(
      <MemoryRouter initialEntries={['/subscriptions']}>
        <App />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(
        screen.getByText(/queued for review/i),
      ).toBeInTheDocument();
    });
  });
});

describe('Business Value page branches', () => {
  it('renders the column placeholders when no metrics fall in the column state', async () => {
    vi.spyOn(businessValueHook, 'useSubscriptionBusinessValue').mockReturnValue({
      data: {
        ...SUBSCRIPTION_BUSINESS_VALUE_FIXTURES.empty,
        metrics: [],
      },
      loading: false,
      error: null,
      source: 'api',
      permissionDenied: false,
      scenario: 'empty',
    } as ReturnType<typeof businessValueHook.useSubscriptionBusinessValue>);

    render(
      <MemoryRouter initialEntries={['/subscriptions/business-value']}>
        <App />
      </MemoryRouter>,
    );
    await waitFor(() => {
      const columns = screen.getAllByText(/No metrics in this state for the current view/i);
      expect(columns.length).toBeGreaterThanOrEqual(3);
    });
  });

  it('renders the permission-denied banner when the hook flags it', async () => {
    vi.spyOn(businessValueHook, 'useSubscriptionBusinessValue').mockReturnValue({
      data: SUBSCRIPTION_BUSINESS_VALUE_FIXTURES.baseline,
      loading: false,
      error: 'permission denied',
      source: 'fixture',
      permissionDenied: true,
      scenario: 'baseline',
    } as ReturnType<typeof businessValueHook.useSubscriptionBusinessValue>);

    render(
      <MemoryRouter initialEntries={['/subscriptions/business-value']}>
        <App />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(
        screen.getByTestId('subscription-status-banner-permission_denied'),
      ).toBeInTheDocument();
    });
  });
});

describe('Follow-Up Queue page branches', () => {
  it('renders the permission-denied banner when the hook flags it', async () => {
    vi.spyOn(followUpHook, 'useSubscriptionFollowUp').mockReturnValue({
      data: SUBSCRIPTION_FOLLOW_UP_FIXTURES.baseline,
      loading: false,
      error: 'permission denied',
      source: 'fixture',
      permissionDenied: true,
      scenario: 'baseline',
    } as ReturnType<typeof followUpHook.useSubscriptionFollowUp>);

    render(
      <MemoryRouter initialEntries={['/subscriptions/follow-up']}>
        <App />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(
        screen.getByTestId('subscription-status-banner-permission_denied'),
      ).toBeInTheDocument();
    });
  });

  it('toggles individual row selection and clears the row when clicked again', async () => {
    render(
      <MemoryRouter initialEntries={['/subscriptions/follow-up']}>
        <App />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('follow-up-table')).toBeInTheDocument();
    });
    const firstRow = screen.getByTestId('follow-up-row-case-1001');
    const checkbox = within(firstRow).getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(screen.getByTestId('follow-up-bulk-actions')).toBeInTheDocument();
    fireEvent.click(checkbox);
    await waitFor(() => {
      expect(screen.queryByTestId('follow-up-bulk-actions')).toBeNull();
    });
  });

  it('clears the reason chip via the page action bar Active filters chip and ignores non-reason chips', async () => {
    render(
      <MemoryRouter initialEntries={['/subscriptions/follow-up']}>
        <App />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('follow-up-reason-all')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('follow-up-reason-pending_stayai'));
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Remove filter Pending Stay\.ai/i }),
      ).toBeInTheDocument();
    });
    // Clear the non-reason "Open queue" chip first; reason should remain.
    fireEvent.click(screen.getByRole('button', { name: /Remove filter Open queue/i }));
    expect(
      screen.getByRole('button', { name: /Remove filter Pending Stay\.ai/i }),
    ).toBeInTheDocument();
    // Now clear the reason chip; reason filter should reset to "all".
    fireEvent.click(
      screen.getByRole('button', { name: /Remove filter Pending Stay\.ai/i }),
    );
    await waitFor(() => {
      expect(
        screen.queryByRole('button', { name: /Remove filter Pending Stay\.ai/i }),
      ).toBeNull();
    });
  });
});

describe('StatusBanner action / detail branches', () => {
  it('renders without action and without detail blocks gracefully', () => {
    render(<StatusBanner kind="empty" />);
    expect(screen.getByText(/No subscription calls in this view yet/i)).toBeInTheDocument();
  });

  it('renders detail block when only detail is supplied (no action)', () => {
    render(<StatusBanner kind="missing" detail="Stay.ai feed dropped" />);
    expect(screen.getByText('Stay.ai feed dropped')).toBeInTheDocument();
  });
});
