import { describe, expect, it, vi, afterEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BusinessValuePage from '../components/subscription-v2/pages/BusinessValuePage';
import CommandCenterPage from '../components/subscription-v2/pages/CommandCenterPage';
import { SUBSCRIPTION_FOLLOW_UP_FIXTURES } from '../data/subscriptionFollowUpFixtures';

vi.mock('../hooks/useSubscriptionFollowUp', async () => {
  const actual = await vi.importActual<typeof import('../hooks/useSubscriptionFollowUp')>(
    '../hooks/useSubscriptionFollowUp',
  );
  return {
    ...actual,
    useSubscriptionFollowUp: vi.fn(actual.useSubscriptionFollowUp),
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
});
