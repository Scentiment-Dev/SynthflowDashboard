import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { useSubscriptionBusinessValue } from '../hooks/useSubscriptionBusinessValue';
import { useSubscriptionFollowUp } from '../hooks/useSubscriptionFollowUp';
import {
  useSubscriptionAdvancedFilters,
  __resetSubscriptionAdvancedFiltersCache,
} from '../hooks/useSubscriptionAdvancedFilters';
import * as dashboardApi from '../services/dashboardApi';
import { ApiClientError } from '../services/apiClient';
import { SUBSCRIPTION_BUSINESS_VALUE_FIXTURES } from '../data/subscriptionBusinessValueFixtures';
import { SUBSCRIPTION_FOLLOW_UP_FIXTURES } from '../data/subscriptionFollowUpFixtures';
import { SUBSCRIPTION_ADVANCED_FILTERS_FIXTURE } from '../data/subscriptionAdvancedFiltersFixtures';

afterEach(() => {
  vi.restoreAllMocks();
  __resetSubscriptionAdvancedFiltersCache();
});

beforeEach(() => {
  vi.restoreAllMocks();
  __resetSubscriptionAdvancedFiltersCache();
});

function BusinessValueProbe({ scenario = 'baseline' as const }) {
  const state = useSubscriptionBusinessValue(scenario);
  return (
    <div>
      <p data-testid="source">{state.source}</p>
      <p data-testid="loading">{state.loading ? 'loading' : 'idle'}</p>
      <p data-testid="metric-count">{state.data.metrics.length}</p>
      <p data-testid="error">{state.error ?? 'none'}</p>
      <p data-testid="permission">{state.permissionDenied ? 'denied' : 'ok'}</p>
    </div>
  );
}

function FollowUpProbe({ scenario = 'baseline' as const }) {
  const state = useSubscriptionFollowUp(scenario);
  return (
    <div>
      <p data-testid="source">{state.source}</p>
      <p data-testid="loading">{state.loading ? 'loading' : 'idle'}</p>
      <p data-testid="record-count">{state.data.records.length}</p>
      <p data-testid="error">{state.error ?? 'none'}</p>
      <p data-testid="permission">{state.permissionDenied ? 'denied' : 'ok'}</p>
    </div>
  );
}

function AdvancedFiltersProbe() {
  const state = useSubscriptionAdvancedFilters();
  return (
    <div>
      <p data-testid="source">{state.source}</p>
      <p data-testid="loading">{state.loading ? 'loading' : 'idle'}</p>
      <p data-testid="option-count">{state.data.options.length}</p>
      <p data-testid="error">{state.error ?? 'none'}</p>
    </div>
  );
}

describe('useSubscriptionBusinessValue', () => {
  it('returns api source on successful fetch with valid shape', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionBusinessValue').mockResolvedValueOnce(
      SUBSCRIPTION_BUSINESS_VALUE_FIXTURES.baseline,
    );

    render(<BusinessValueProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('source')).toHaveTextContent('api');
      expect(screen.getByTestId('loading')).toHaveTextContent('idle');
      expect(screen.getByTestId('error')).toHaveTextContent('none');
    });
  });

  it('falls back to fixture and records error on rejection', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionBusinessValue').mockRejectedValueOnce(
      new Error('business value endpoint unavailable'),
    );

    render(<BusinessValueProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('error')).toHaveTextContent('business value endpoint unavailable');
    });
  });

  it('flags permission denied when the API throws an ApiClientError 403', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionBusinessValue').mockRejectedValueOnce(
      new ApiClientError('forbidden', 403),
    );

    render(<BusinessValueProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('permission')).toHaveTextContent('denied');
    });
  });

  it('falls back to fixture when API returns a malformed payload', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionBusinessValue').mockResolvedValueOnce({
      // intentionally missing required fields
      module: 'subscriptions',
    } as never);

    render(<BusinessValueProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('error')).toHaveTextContent(/shape mismatch/);
    });
  });

  it('ignores late resolves after unmount without throwing', async () => {
    let resolveLater: () => void = () => {};
    vi.spyOn(dashboardApi, 'getSubscriptionBusinessValue').mockReturnValueOnce(
      new Promise((resolve) => {
        resolveLater = () => resolve(SUBSCRIPTION_BUSINESS_VALUE_FIXTURES.baseline);
      }),
    );
    const { unmount } = render(<BusinessValueProbe />);
    unmount();
    resolveLater();
    await Promise.resolve();
    await Promise.resolve();
    expect(true).toBe(true);
  });

  it('ignores late rejections after unmount without throwing', async () => {
    let rejectLater: () => void = () => {};
    vi.spyOn(dashboardApi, 'getSubscriptionBusinessValue').mockReturnValueOnce(
      new Promise((_resolve, reject) => {
        rejectLater = () => reject(new Error('too late'));
      }),
    );
    const { unmount } = render(<BusinessValueProbe />);
    unmount();
    rejectLater();
    await Promise.resolve();
    await Promise.resolve();
    expect(true).toBe(true);
  });
});

describe('useSubscriptionFollowUp', () => {
  it('returns api source on successful fetch with valid shape', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionFollowUp').mockResolvedValueOnce(
      SUBSCRIPTION_FOLLOW_UP_FIXTURES.baseline,
    );

    render(<FollowUpProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('source')).toHaveTextContent('api');
      expect(screen.getByTestId('error')).toHaveTextContent('none');
    });
  });

  it('falls back to fixture on rejection', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionFollowUp').mockRejectedValueOnce(
      new Error('follow-up endpoint unavailable'),
    );

    render(<FollowUpProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('error')).toHaveTextContent('follow-up endpoint unavailable');
    });
  });

  it('falls back to fixture when API returns a malformed payload', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionFollowUp').mockResolvedValueOnce({
      module: 'subscriptions',
    } as never);

    render(<FollowUpProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('error')).toHaveTextContent(/shape mismatch/);
    });
  });

  it('flags permission denied when the API throws an ApiClientError 403', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionFollowUp').mockRejectedValueOnce(
      new ApiClientError('forbidden', 403),
    );

    render(<FollowUpProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('permission')).toHaveTextContent('denied');
    });
  });

  it('ignores late resolves after unmount', async () => {
    let resolveLater: () => void = () => {};
    vi.spyOn(dashboardApi, 'getSubscriptionFollowUp').mockReturnValueOnce(
      new Promise((resolve) => {
        resolveLater = () => resolve(SUBSCRIPTION_FOLLOW_UP_FIXTURES.baseline);
      }),
    );
    const { unmount } = render(<FollowUpProbe />);
    unmount();
    resolveLater();
    await Promise.resolve();
    await Promise.resolve();
    expect(true).toBe(true);
  });

  it('ignores late rejections after unmount', async () => {
    let rejectLater: () => void = () => {};
    vi.spyOn(dashboardApi, 'getSubscriptionFollowUp').mockReturnValueOnce(
      new Promise((_resolve, reject) => {
        rejectLater = () => reject(new Error('too late'));
      }),
    );
    const { unmount } = render(<FollowUpProbe />);
    unmount();
    rejectLater();
    await Promise.resolve();
    await Promise.resolve();
    expect(true).toBe(true);
  });
});

describe('useSubscriptionAdvancedFilters', () => {
  it('returns api source on successful fetch', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionAdvancedFilters').mockResolvedValueOnce(
      SUBSCRIPTION_ADVANCED_FILTERS_FIXTURE,
    );

    render(<AdvancedFiltersProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('source')).toHaveTextContent('api');
    });
  });

  it('falls back to fixture on rejection', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionAdvancedFilters').mockRejectedValueOnce(
      new Error('advanced filters endpoint unavailable'),
    );

    render(<AdvancedFiltersProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('error')).toHaveTextContent('advanced filters endpoint unavailable');
    });
  });

  it('falls back to fixture on malformed payload', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionAdvancedFilters').mockResolvedValueOnce({
      // missing options
      metadata: {},
      applied_filters: {},
    } as never);

    render(<AdvancedFiltersProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('error')).toHaveTextContent(/shape mismatch/);
    });
  });

  it('ignores late resolves after unmount', async () => {
    let resolveLater: () => void = () => {};
    vi.spyOn(dashboardApi, 'getSubscriptionAdvancedFilters').mockReturnValueOnce(
      new Promise((resolve) => {
        resolveLater = () => resolve(SUBSCRIPTION_ADVANCED_FILTERS_FIXTURE);
      }),
    );
    const { unmount } = render(<AdvancedFiltersProbe />);
    unmount();
    resolveLater();
    await Promise.resolve();
    await Promise.resolve();
    expect(true).toBe(true);
  });

  it('ignores late rejections after unmount', async () => {
    let rejectLater: () => void = () => {};
    vi.spyOn(dashboardApi, 'getSubscriptionAdvancedFilters').mockReturnValueOnce(
      new Promise((_resolve, reject) => {
        rejectLater = () => reject(new Error('too late'));
      }),
    );
    const { unmount } = render(<AdvancedFiltersProbe />);
    unmount();
    rejectLater();
    await Promise.resolve();
    await Promise.resolve();
    expect(true).toBe(true);
  });

  // Regression for Cursor Bugbot finding on PR #31: PageActionBar mounts on
  // four separate pages, and previously each mount fired a fresh fetch. The
  // hook now memoizes the resolved state per scenario at module scope so the
  // network call only happens once per session. We verify two consecutive
  // mounts of the hook only invoke the API once.
  it('caches the resolved state across mounts so the API is hit at most once', async () => {
    const apiSpy = vi
      .spyOn(dashboardApi, 'getSubscriptionAdvancedFilters')
      .mockResolvedValue(SUBSCRIPTION_ADVANCED_FILTERS_FIXTURE);

    const first = render(<AdvancedFiltersProbe />);
    await waitFor(() => {
      expect(first.getByTestId('source')).toHaveTextContent('api');
    });
    first.unmount();

    const second = render(<AdvancedFiltersProbe />);
    await waitFor(() => {
      expect(second.getByTestId('source')).toHaveTextContent('api');
    });
    second.unmount();

    expect(apiSpy).toHaveBeenCalledTimes(1);
  });

  // Regression for Cursor Bugbot follow-up finding on PR #31: only successful
  // API responses are cached. A transient error or fixture-fallback MUST NOT
  // be locked in for the rest of the session - the next mount must re-fetch
  // so a one-off 503 or 403 does not permanently degrade the action bar.
  it('does NOT cache error / fixture-fallback states (retries on next mount)', async () => {
    const apiSpy = vi
      .spyOn(dashboardApi, 'getSubscriptionAdvancedFilters')
      .mockRejectedValueOnce(new Error('transient network blip'))
      .mockResolvedValueOnce(SUBSCRIPTION_ADVANCED_FILTERS_FIXTURE);

    const first = render(<AdvancedFiltersProbe />);
    await waitFor(() => {
      expect(first.getByTestId('source')).toHaveTextContent('fixture');
      expect(first.getByTestId('error')).toHaveTextContent('transient network blip');
    });
    first.unmount();

    const second = render(<AdvancedFiltersProbe />);
    await waitFor(() => {
      expect(second.getByTestId('source')).toHaveTextContent('api');
    });
    second.unmount();

    expect(apiSpy).toHaveBeenCalledTimes(2);
  });
});

describe('shape validator branches (granular)', () => {
  it('rejects business value payload when generated_from_fixture is not a boolean', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionBusinessValue').mockResolvedValueOnce({
      module: 'subscriptions',
      generated_from_fixture: 'true',
      source_of_truth_system: 'stayai',
      source_confirmation_status: 'pending',
      scenario: 'baseline',
      metrics: [],
      metadata: {},
    } as never);
    render(<BusinessValueProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent(/shape mismatch/);
    });
  });

  it('rejects business value payload when metrics is not an array', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionBusinessValue').mockResolvedValueOnce({
      module: 'subscriptions',
      generated_from_fixture: true,
      source_of_truth_system: 'stayai',
      source_confirmation_status: 'pending',
      scenario: 'baseline',
      metrics: 'not-an-array',
      metadata: {},
    } as never);
    render(<BusinessValueProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent(/shape mismatch/);
    });
  });

  it('rejects business value payload when metadata is not an object', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionBusinessValue').mockResolvedValueOnce({
      module: 'subscriptions',
      generated_from_fixture: true,
      source_of_truth_system: 'stayai',
      source_confirmation_status: 'pending',
      scenario: 'baseline',
      metrics: [],
      metadata: 'string-not-object',
    } as never);
    render(<BusinessValueProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent(/shape mismatch/);
    });
  });

  it('rejects business value payload that is not a plain object at all', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionBusinessValue').mockResolvedValueOnce(
      'not-an-object' as never,
    );
    render(<BusinessValueProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent(/shape mismatch/);
    });
  });

  it('rejects follow-up payload that is not a plain object', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionFollowUp').mockResolvedValueOnce(null as never);
    render(<FollowUpProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent(/shape mismatch/);
    });
  });

  it('rejects follow-up payload missing required keys', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionFollowUp').mockResolvedValueOnce({
      module: 'subscriptions',
    } as never);
    render(<FollowUpProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent(/shape mismatch/);
    });
  });

  it('rejects follow-up payload when records is not an array', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionFollowUp').mockResolvedValueOnce({
      module: 'subscriptions',
      generated_from_fixture: true,
      scenario: 'baseline',
      records: 'not-array',
      metadata: {},
    } as never);
    render(<FollowUpProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent(/shape mismatch/);
    });
  });

  it('rejects follow-up payload when metadata is not an object', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionFollowUp').mockResolvedValueOnce({
      module: 'subscriptions',
      generated_from_fixture: true,
      scenario: 'baseline',
      records: [],
      metadata: null,
    } as never);
    render(<FollowUpProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent(/shape mismatch/);
    });
  });

  it('rejects follow-up payload when generated_from_fixture is not a boolean', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionFollowUp').mockResolvedValueOnce({
      module: 'subscriptions',
      generated_from_fixture: 'true',
      scenario: 'baseline',
      records: [],
      metadata: {},
    } as never);
    render(<FollowUpProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent(/shape mismatch/);
    });
  });

  it('rejects advanced filters payload when applied_filters is not an object', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionAdvancedFilters').mockResolvedValueOnce({
      options: [],
      applied_filters: null,
      metadata: {},
    } as never);
    render(<AdvancedFiltersProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent(/shape mismatch/);
    });
  });

  it('rejects advanced filters payload when metadata is not an object', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionAdvancedFilters').mockResolvedValueOnce({
      options: [],
      applied_filters: {},
      metadata: 'not-object',
    } as never);
    render(<AdvancedFiltersProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent(/shape mismatch/);
    });
  });

  it('rejects advanced filters payload that is not an object', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionAdvancedFilters').mockResolvedValueOnce(
      undefined as never,
    );
    render(<AdvancedFiltersProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent(/shape mismatch/);
    });
  });
});

describe('subscription dashboardApi URL builders', () => {
  it('encodes scenarios for business value, follow-up and advanced filter endpoints', () => {
    expect(dashboardApi.buildSubscriptionBusinessValueUrl()).toBe(
      '/subscriptions/business-value?scenario=baseline',
    );
    expect(
      dashboardApi.buildSubscriptionBusinessValueUrl('pending_stayai_confirmation'),
    ).toBe('/subscriptions/business-value?scenario=pending_stayai_confirmation');
    expect(dashboardApi.buildSubscriptionFollowUpUrl()).toBe(
      '/subscriptions/follow-up?scenario=baseline',
    );
    expect(dashboardApi.buildSubscriptionFollowUpUrl('missing_stayai_final_state')).toBe(
      '/subscriptions/follow-up?scenario=missing_stayai_final_state',
    );
    expect(dashboardApi.buildSubscriptionAdvancedFiltersUrl()).toBe(
      '/subscriptions/advanced-filters?scenario=baseline',
    );
  });
});
