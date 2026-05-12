import { describe, expect, it, vi, afterEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BusinessValuePage from '../components/subscription-v2/pages/BusinessValuePage';
import CommandCenterPage from '../components/subscription-v2/pages/CommandCenterPage';
import { SUBSCRIPTION_FOLLOW_UP_FIXTURES } from '../data/subscriptionFollowUpFixtures';
import { SUBSCRIPTION_OUTCOMES_FIXTURES } from '../data/subscriptionOutcomesFixtures';

vi.mock('../hooks/useSubscriptionFollowUp', async () => {
  const actual = await vi.importActual<typeof import('../hooks/useSubscriptionFollowUp')>(
    '../hooks/useSubscriptionFollowUp',
  );
  return {
    ...actual,
    useSubscriptionFollowUp: vi.fn(actual.useSubscriptionFollowUp),
  };
});

vi.mock('../hooks/useSubscriptionOutcomes', async () => {
  const actual = await vi.importActual<typeof import('../hooks/useSubscriptionOutcomes')>(
    '../hooks/useSubscriptionOutcomes',
  );
  return {
    ...actual,
    useSubscriptionOutcomes: vi.fn(actual.useSubscriptionOutcomes),
  };
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('BusinessValuePage coverage guards', () => {
  it('switches to missing Stay.ai scenario and shows blocked export feedback', async () => {
    render(
      <MemoryRouter>
        <BusinessValuePage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByTestId('business-value-scenario-missing_stayai_final_state'));
    expect(
      screen.getByText(/The numbers below cannot be trusted until this is fixed/i),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('page-action-export-button'));
    fireEvent.click(screen.getByTestId('subscription-export-drawer-generate'));

    await waitFor(() => {
      expect(screen.getByTestId('export-result-toast')).toHaveTextContent(
        /required manifest fields are missing/i,
      );
    });
  });

  it('uses the pending export path on baseline and returns audit metadata', async () => {
    render(
      <MemoryRouter>
        <BusinessValuePage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByTestId('page-action-export-button'));
    fireEvent.click(screen.getByTestId('subscription-export-drawer-generate'));

    await waitFor(() => {
      expect(screen.getByTestId('export-result-toast')).toHaveTextContent(
        /pending an audit reference/i,
      );
    });
  });
});

describe('CommandCenterPage coverage guards', () => {
  it('renders singular attention copy when exactly one item needs review', async () => {
    const hooks = await import('../hooks/useSubscriptionFollowUp');
    const mocked = vi.mocked(hooks.useSubscriptionFollowUp);
    mocked.mockReturnValue({
      data: {
        ...SUBSCRIPTION_FOLLOW_UP_FIXTURES.baseline,
        records: [
          {
            ...SUBSCRIPTION_FOLLOW_UP_FIXTURES.baseline.records[0],
            portal_completion_status: 'portal_started',
          },
        ],
      },
      loading: false,
      error: null,
      source: 'fixture',
      permissionDenied: false,
      scenario: 'baseline',
    });

    render(
      <MemoryRouter>
        <CommandCenterPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('1 item need a look.')).toBeInTheDocument();
    });
  });

  it('renders singular portal-handoff wording when exactly one portal completion is unknown', async () => {
    const hooks = await import('../hooks/useSubscriptionFollowUp');
    const mocked = vi.mocked(hooks.useSubscriptionFollowUp);
    mocked.mockReturnValue({
      data: {
        ...SUBSCRIPTION_FOLLOW_UP_FIXTURES.baseline,
        records: [
          {
            ...SUBSCRIPTION_FOLLOW_UP_FIXTURES.baseline.records[0],
            portal_completion_status: 'completion_unknown',
          },
          {
            ...SUBSCRIPTION_FOLLOW_UP_FIXTURES.baseline.records[1],
            portal_completion_status: 'portal_started',
          },
        ],
      },
      loading: false,
      error: null,
      source: 'fixture',
      permissionDenied: false,
      scenario: 'baseline',
    });

    render(
      <MemoryRouter>
        <CommandCenterPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText(/1 customer's portal completion is unconfirmed/i),
      ).toBeInTheDocument();
    });
  });

  it('renders the all-clear message when there is no pending or follow-up work', async () => {
    const followUpHooks = await import('../hooks/useSubscriptionFollowUp');
    vi.mocked(followUpHooks.useSubscriptionFollowUp).mockReturnValue({
      data: {
        ...SUBSCRIPTION_FOLLOW_UP_FIXTURES.empty,
      },
      loading: false,
      error: null,
      source: 'fixture',
      permissionDenied: false,
      scenario: 'empty',
    });

    const outcomesHooks = await import('../hooks/useSubscriptionOutcomes');
    vi.mocked(outcomesHooks.useSubscriptionOutcomes).mockReturnValue({
      data: {
        ...SUBSCRIPTION_OUTCOMES_FIXTURES.baseline,
        metrics: {
          ...SUBSCRIPTION_OUTCOMES_FIXTURES.baseline.metrics,
          pending_stayai_confirmation_total: 0,
        },
      },
      loading: false,
      error: null,
      source: 'fixture',
      permissionDenied: false,
      scenario: 'baseline',
    });

    render(
      <MemoryRouter>
        <CommandCenterPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Nothing needs attention right now\./i)).toBeInTheDocument();
      expect(
        screen.getByText(/All Stay\.ai-controlled subscription states are clear\./i),
      ).toBeInTheDocument();
    });
  });

  it('renders the permission-denied status banner action when fixture access is denied', async () => {
    const outcomesHooks = await import('../hooks/useSubscriptionOutcomes');
    vi.mocked(outcomesHooks.useSubscriptionOutcomes).mockReturnValue({
      data: SUBSCRIPTION_OUTCOMES_FIXTURES.baseline,
      loading: false,
      error: 'forbidden',
      source: 'fixture',
      permissionDenied: true,
      scenario: 'baseline',
    });

    render(
      <MemoryRouter>
        <CommandCenterPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /ask my manager for access/i })).toBeInTheDocument();
    });
  });

  it('executes the command-center export confirm callback and shows pending toast', async () => {
    render(
      <MemoryRouter>
        <CommandCenterPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByTestId('page-action-export-button'));
    fireEvent.click(screen.getByTestId('subscription-export-drawer-generate'));

    await waitFor(() => {
      expect(screen.getByTestId('export-result-toast')).toHaveTextContent(
        /pending an audit reference/i,
      );
    });
  });
});
