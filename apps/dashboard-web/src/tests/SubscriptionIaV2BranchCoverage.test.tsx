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
import { __resetSubscriptionAdvancedFiltersCache } from '../hooks/useSubscriptionAdvancedFilters';

beforeEach(() => {
  __resetSubscriptionAdvancedFiltersCache();
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ ok: false, status: 503, json: vi.fn().mockResolvedValue({}) }),
  );
});

afterEach(() => {
  __resetSubscriptionAdvancedFiltersCache();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('Topbar fallback rendering', () => {
  it('uses the product-name title and Internal analytics eyebrow for unknown non-subscription paths', () => {
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
      screen.getByRole('heading', { name: /Synthflow analytics dashboard/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Internal analytics/i)).toBeInTheDocument();
  });

  // Regression for Cursor Bugbot findings on PR #31:
  //  1. Only routes under /subscriptions/* should render the "Subscription
  //     analytics" eyebrow.
  //  2. The eyebrow and the H1 MUST NEVER render the identical text (no
  //     "stacked twin headers"); the H1 falls back to the product name.
  it('uses Subscription analytics eyebrow + product-name title for unknown routes under /subscriptions/*', () => {
    render(
      <DashboardFilterProvider>
        <MemoryRouter initialEntries={['/subscriptions/some-future-page']}>
          <Routes>
            <Route path="*" element={<Topbar />} />
          </Routes>
        </MemoryRouter>
      </DashboardFilterProvider>,
    );
    expect(
      screen.getByRole('heading', { name: /Synthflow analytics dashboard/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Subscription analytics/i)).toBeInTheDocument();
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

describe('FollowUpPage low_trust filter (regression for Bugbot review #31)', () => {
  it('does NOT include a priority=low record whose reason is unrelated to trust', async () => {
    vi.spyOn(followUpHook, 'useSubscriptionFollowUp').mockReturnValue({
      data: {
        ...SUBSCRIPTION_FOLLOW_UP_FIXTURES.baseline,
        records: [
          {
            ...SUBSCRIPTION_FOLLOW_UP_FIXTURES.baseline.records[0],
            customer_or_case_id: 'case-trust-decoy',
            priority: 'low',
            reason: 'Awaiting Stay.ai confirmation',
            stayai_confirmation_status: 'pending',
            support_label: 'Should not appear under low trust',
          },
        ],
      },
      loading: false,
      error: null,
      source: 'api',
      permissionDenied: false,
      scenario: 'baseline',
    } as ReturnType<typeof followUpHook.useSubscriptionFollowUp>);

    render(
      <MemoryRouter initialEntries={['/subscriptions/follow-up']}>
        <App />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('follow-up-reason-low_trust')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('follow-up-reason-low_trust'));
    await waitFor(() => {
      const matches = screen.getAllByText(/No follow-ups in this filter/i);
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  it('DOES include a record whose stayai_confirmation_status is "missing"', async () => {
    vi.spyOn(followUpHook, 'useSubscriptionFollowUp').mockReturnValue({
      data: {
        ...SUBSCRIPTION_FOLLOW_UP_FIXTURES.baseline,
        records: [
          {
            ...SUBSCRIPTION_FOLLOW_UP_FIXTURES.baseline.records[0],
            customer_or_case_id: 'case-missing-confirmation',
            priority: 'high',
            reason: 'Outcome unresolved',
            stayai_confirmation_status: 'missing',
            support_label: 'Should appear under low trust',
          },
        ],
      },
      loading: false,
      error: null,
      source: 'api',
      permissionDenied: false,
      scenario: 'baseline',
    } as ReturnType<typeof followUpHook.useSubscriptionFollowUp>);

    render(
      <MemoryRouter initialEntries={['/subscriptions/follow-up']}>
        <App />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByTestId('follow-up-reason-low_trust'));
    await waitFor(() => {
      expect(
        screen.getByTestId('follow-up-row-case-missing-confirmation'),
      ).toBeInTheDocument();
    });
  });
});

describe('FollowUpPage selection scope (regression for Codex review #31)', () => {
  it('clears the selection when the reason filter changes (no ghost selections resurface)', async () => {
    render(
      <MemoryRouter initialEntries={['/subscriptions/follow-up']}>
        <App />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('follow-up-table')).toBeInTheDocument();
    });

    // Select case-1002 (portal-unknown row) while viewing all follow-ups.
    const portalRow = screen.getByTestId('follow-up-row-case-1002');
    fireEvent.click(within(portalRow).getByRole('checkbox'));
    expect(screen.getByTestId('follow-up-bulk-actions')).toBeInTheDocument();

    // Switch the reason chip to Pending Stay.ai. case-1002 is no longer
    // visible, AND the selection map is wiped on reason change, so the
    // bulk-action bar must disappear.
    fireEvent.click(screen.getByTestId('follow-up-reason-pending_stayai'));
    await waitFor(() => {
      expect(screen.queryByTestId('follow-up-bulk-actions')).toBeNull();
    });

    // Switch back to All follow-ups. The selection map was reset on the
    // reason change, so case-1002 must NOT resurface as still-selected; the
    // bulk-action bar must remain hidden until the operator explicitly
    // re-selects rows under the current scope. (Cursor Bugbot finding on
    // PR #31: prevent ghost selections from earlier filters resurfacing.)
    fireEvent.click(screen.getByTestId('follow-up-reason-all'));
    await waitFor(() => {
      expect(screen.getByTestId('follow-up-table')).toBeInTheDocument();
    });
    const restoredRow = screen.getByTestId('follow-up-row-case-1002');
    expect(within(restoredRow).getByRole('checkbox')).not.toBeChecked();
    expect(screen.queryByTestId('follow-up-bulk-actions')).toBeNull();
  });

  it('clears the entire selection when the scenario changes', async () => {
    render(
      <MemoryRouter initialEntries={['/subscriptions/follow-up']}>
        <App />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('follow-up-table')).toBeInTheDocument();
    });

    fireEvent.click(
      within(screen.getByTestId('follow-up-row-case-1001')).getByRole('checkbox'),
    );
    expect(screen.getByTestId('follow-up-bulk-actions')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Follow-up queue scenario/i), {
      target: { value: 'pending_stayai_confirmation' },
    });
    await waitFor(() => {
      expect(screen.queryByTestId('follow-up-bulk-actions')).toBeNull();
    });

    fireEvent.change(screen.getByLabelText(/Follow-up queue scenario/i), {
      target: { value: 'baseline' },
    });
    await waitFor(() => {
      expect(screen.getByTestId('follow-up-table')).toBeInTheDocument();
    });
    // After scenario change, the selection map is reset, so the row in baseline
    // must no longer be marked checked and the bulk-action bar must remain
    // hidden.
    const restoredRow = screen.getByTestId('follow-up-row-case-1001');
    expect(within(restoredRow).getByRole('checkbox')).not.toBeChecked();
    expect(screen.queryByTestId('follow-up-bulk-actions')).toBeNull();
  });
});

describe('MetricDisclosure / PageActionBar branches', () => {
  it('MetricDisclosure renders the updated-age line without a timestamp suffix when only updatedAge is supplied', async () => {
    const { default: MetricDisclosure } = await import(
      '../components/subscription-v2/MetricDisclosure'
    );
    render(
      <MetricDisclosure
        summary="Plain language definition"
        updatedAge="Updated 5 min ago"
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Show metric definition/i }));
    expect(screen.getByText(/Updated 5 min ago/)).toBeInTheDocument();
    expect(screen.queryByText(/·/)).toBeNull();
  });

  it('PageActionBar omits the "not yet wired" pill when every advanced filter dimension is enabled', async () => {
    const advancedFiltersHook = await import(
      '../hooks/useSubscriptionAdvancedFilters'
    );
    const fixture = await import(
      '../data/subscriptionAdvancedFiltersFixtures'
    );
    vi.spyOn(advancedFiltersHook, 'useSubscriptionAdvancedFilters').mockReturnValue({
      data: {
        ...fixture.SUBSCRIPTION_ADVANCED_FILTERS_FIXTURE,
        options: fixture.SUBSCRIPTION_ADVANCED_FILTERS_FIXTURE.options.map((opt) => ({
          ...opt,
          is_enabled: true,
        })),
      },
      loading: false,
      error: null,
      source: 'api',
      permissionDenied: false,
    } as ReturnType<typeof advancedFiltersHook.useSubscriptionAdvancedFilters>);

    const { default: PageActionBar } = await import(
      '../components/subscription-v2/PageActionBar'
    );
    render(<PageActionBar />);
    expect(screen.queryByText(/not\s+yet wired/i)).toBeNull();
    expect(screen.getByText(/dimensions available/i)).toBeInTheDocument();
  });
});

describe('Patch coverage — additional Cycle 008 branches', () => {
  it('Command Center renders the live banner branch when outcomes are sourced from the API', async () => {
    vi.spyOn(outcomesHook, 'useSubscriptionOutcomes').mockReturnValue({
      data: SUBSCRIPTION_OUTCOMES_FIXTURES.baseline,
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
        screen.getByTestId('subscription-status-banner-live'),
      ).toBeInTheDocument();
    });
  });

  it('Command Center renders the fixture-unreachable banner branch when outcomes fall back to fixture', async () => {
    vi.spyOn(outcomesHook, 'useSubscriptionOutcomes').mockReturnValue({
      data: SUBSCRIPTION_OUTCOMES_FIXTURES.baseline,
      loading: false,
      error: 'network down',
      source: 'fixture',
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
        screen.getByTestId('subscription-status-banner-fixture_unreachable'),
      ).toBeInTheDocument();
    });
  });

  it('Command Center hides the headline business-value KPI when no metrics are returned', async () => {
    vi.spyOn(outcomesHook, 'useSubscriptionOutcomes').mockReturnValue({
      data: SUBSCRIPTION_OUTCOMES_FIXTURES.baseline,
      loading: false,
      error: null,
      source: 'api',
      permissionDenied: false,
      scenario: 'baseline',
    } as ReturnType<typeof outcomesHook.useSubscriptionOutcomes>);
    vi.spyOn(businessValueHook, 'useSubscriptionBusinessValue').mockReturnValue({
      data: { ...SUBSCRIPTION_BUSINESS_VALUE_FIXTURES.empty, metrics: [] },
      loading: false,
      error: null,
      source: 'api',
      permissionDenied: false,
      scenario: 'empty',
    } as ReturnType<typeof businessValueHook.useSubscriptionBusinessValue>);

    render(
      <MemoryRouter initialEntries={['/subscriptions']}>
        <App />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(
        screen.queryByTestId('command-center-kpi-business-value'),
      ).toBeNull();
    });
  });

  it('Command Center renders the plural attention copy when multiple items need attention', async () => {
    const baseFixture = SUBSCRIPTION_OUTCOMES_FIXTURES.baseline;
    vi.spyOn(outcomesHook, 'useSubscriptionOutcomes').mockReturnValue({
      data: {
        ...baseFixture,
        metrics: {
          ...baseFixture.metrics,
          pending_stayai_confirmation_total: 2,
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
        screen.getByText(/2 calls are still waiting for official confirmation/i),
      ).toBeInTheDocument();
    });
  });

  it('Follow-Up Queue renders empty-state copy and the Clear filters button when no records match', async () => {
    vi.spyOn(followUpHook, 'useSubscriptionFollowUp').mockReturnValue({
      data: SUBSCRIPTION_FOLLOW_UP_FIXTURES.empty,
      loading: false,
      error: null,
      source: 'api',
      permissionDenied: false,
      scenario: 'empty',
    } as ReturnType<typeof followUpHook.useSubscriptionFollowUp>);

    render(
      <MemoryRouter initialEntries={['/subscriptions/follow-up']}>
        <App />
      </MemoryRouter>,
    );
    await waitFor(() => {
      const matches = screen.getAllByText(/No follow-ups in this filter/i);
      expect(matches.length).toBeGreaterThan(0);
    });
    fireEvent.click(screen.getByRole('button', { name: /Clear filters/i }));
    expect(screen.getByTestId('follow-up-reason-all')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('Follow-Up Queue renders the missing-Stay.ai banner when the scenario is set to missing_stayai_final_state', async () => {
    render(
      <MemoryRouter initialEntries={['/subscriptions/follow-up']}>
        <App />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByLabelText(/Follow-up queue scenario/i)).toBeInTheDocument();
    });
    fireEvent.change(screen.getByLabelText(/Follow-up queue scenario/i), {
      target: { value: 'missing_stayai_final_state' },
    });
    await waitFor(() => {
      expect(
        screen.getByTestId('subscription-status-banner-missing'),
      ).toBeInTheDocument();
    });
  });

  it('Business Value page renders the empty hero copy when metrics is empty', async () => {
    vi.spyOn(businessValueHook, 'useSubscriptionBusinessValue').mockReturnValue({
      data: { ...SUBSCRIPTION_BUSINESS_VALUE_FIXTURES.empty, metrics: [] },
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
});
