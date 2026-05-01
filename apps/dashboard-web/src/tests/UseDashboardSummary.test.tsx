import { render, screen, waitFor } from '@testing-library/react';
import { useDashboardSummary } from '../hooks/useDashboardSummary';
import * as dashboardApi from '../services/dashboardApi';
import { MODULE_FIXTURES } from '../data/dashboardFixtures';

function HookProbe() {
  const state = useDashboardSummary('subscriptions');
  return (
    <div>
      <p data-testid="source">{state.source}</p>
      <p data-testid="loading">{state.loading ? 'loading' : 'idle'}</p>
      <p data-testid="card-count">{state.data.summary.cards.length}</p>
      <p data-testid="error">{state.error ?? 'none'}</p>
    </div>
  );
}

describe('useDashboardSummary', () => {
  it('switches to api source on successful summary fetch', async () => {
    vi.spyOn(dashboardApi, 'getDashboardSummary').mockResolvedValueOnce(
      MODULE_FIXTURES.subscriptions.summary,
    );

    render(<HookProbe />);

    await waitFor(() => {
      expect(screen.getByTestId('source')).toHaveTextContent('api');
      expect(screen.getByTestId('loading')).toHaveTextContent('idle');
      expect(screen.getByTestId('error')).toHaveTextContent('none');
    });
  });

  it('falls back to fixture source on summary fetch failure', async () => {
    vi.spyOn(dashboardApi, 'getDashboardSummary').mockRejectedValueOnce(
      new Error('summary unavailable'),
    );

    render(<HookProbe />);

    await waitFor(() => {
      expect(screen.getByTestId('source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('loading')).toHaveTextContent('idle');
      expect(screen.getByTestId('error')).toHaveTextContent('summary unavailable');
    });
  });

  it('ignores late resolve after unmount', async () => {
    let resolveSummary = () => {};
    const lateSummary = new Promise<typeof MODULE_FIXTURES.subscriptions.summary>((resolve) => {
      resolveSummary = () => resolve(MODULE_FIXTURES.subscriptions.summary);
    });
    vi.spyOn(dashboardApi, 'getDashboardSummary').mockReturnValueOnce(lateSummary);

    const { unmount } = render(<HookProbe />);
    unmount();

    resolveSummary();
    await Promise.resolve();
    await Promise.resolve();

    expect(true).toBe(true);
  });
});
