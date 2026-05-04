import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import SubscriptionOutcomesView from '../components/dashboard/subscriptionOutcomes/SubscriptionOutcomesView';
import SubscriptionOutcomeKpiGrid from '../components/dashboard/subscriptionOutcomes/SubscriptionOutcomeKpiGrid';
import SubscriptionOutcomeFunnel from '../components/dashboard/subscriptionOutcomes/SubscriptionOutcomeFunnel';
import SubscriptionOutcomeAlertsPanel from '../components/dashboard/subscriptionOutcomes/SubscriptionOutcomeAlertsPanel';
import SubscriptionOutcomeMetadataPanel from '../components/dashboard/subscriptionOutcomes/SubscriptionOutcomeMetadataPanel';
import { SUBSCRIPTION_OUTCOMES_FIXTURES } from '../data/subscriptionOutcomesFixtures';
import { useSubscriptionOutcomes } from '../hooks/useSubscriptionOutcomes';
import * as dashboardApi from '../services/dashboardApi';
import { ApiClientError } from '../services/apiClient';
import { buildSubscriptionOutcomesUrl } from '../services/dashboardApi';
import {
  buildSubscriptionOutcomeFunnel,
  buildSubscriptionOutcomeKpiCards,
  buildSubscriptionOutcomeRateCards,
  clampRatio,
  deriveSubscriptionOutcomeAlerts,
  formatCount,
  formatRatePercent,
  freshnessToneClasses,
  funnelStageBarClasses,
  funnelStageToneClasses,
  safeRatio,
  sourceConfirmationToneClasses,
  trustToneClasses,
} from '../utils/subscriptionOutcomesState';
import type {
  SubscriptionOutcomesResponse,
  SubscriptionOutcomesScenario,
} from '../types/subscriptionOutcomes';

const baseline = SUBSCRIPTION_OUTCOMES_FIXTURES.baseline;
const pending = SUBSCRIPTION_OUTCOMES_FIXTURES.pending_stayai_confirmation;
const missing = SUBSCRIPTION_OUTCOMES_FIXTURES.missing_stayai_final_state;
const empty = SUBSCRIPTION_OUTCOMES_FIXTURES.empty;

function probeFixture(): SubscriptionOutcomesResponse {
  return JSON.parse(JSON.stringify(baseline)) as SubscriptionOutcomesResponse;
}

function HookProbe({ scenario }: { scenario?: SubscriptionOutcomesScenario }) {
  const state = useSubscriptionOutcomes(scenario ?? 'baseline');
  return (
    <div>
      <p data-testid="hook-source">{state.source}</p>
      <p data-testid="hook-loading">{state.loading ? 'loading' : 'idle'}</p>
      <p data-testid="hook-error">{state.error ?? 'none'}</p>
      <p data-testid="hook-permission-denied">
        {state.permissionDenied ? 'denied' : 'allowed'}
      </p>
      <p data-testid="hook-confirmation">{state.data.source_confirmation_status}</p>
      <p data-testid="hook-scenario">{state.scenario}</p>
    </div>
  );
}

describe('subscription outcomes URL builder', () => {
  it('encodes scenario and points to /subscriptions/outcomes', () => {
    expect(buildSubscriptionOutcomesUrl()).toBe('/subscriptions/outcomes?scenario=baseline');
    expect(buildSubscriptionOutcomesUrl('pending_stayai_confirmation')).toBe(
      '/subscriptions/outcomes?scenario=pending_stayai_confirmation',
    );
    expect(buildSubscriptionOutcomesUrl('missing_stayai_final_state')).toBe(
      '/subscriptions/outcomes?scenario=missing_stayai_final_state',
    );
    expect(buildSubscriptionOutcomesUrl('empty')).toBe(
      '/subscriptions/outcomes?scenario=empty',
    );
  });
});

describe('useSubscriptionOutcomes', () => {
  it('switches to api source on a valid contract response', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionOutcomes').mockResolvedValueOnce(probeFixture());
    render(<HookProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('api');
      expect(screen.getByTestId('hook-loading')).toHaveTextContent('idle');
      expect(screen.getByTestId('hook-error')).toHaveTextContent('none');
      expect(screen.getByTestId('hook-confirmation')).toHaveTextContent('confirmed');
    });
  });

  it('falls back to fixture when the API rejects with a generic error', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionOutcomes').mockRejectedValueOnce(
      new Error('network down'),
    );
    render(<HookProbe scenario="missing_stayai_final_state" />);
    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('hook-error')).toHaveTextContent('network down');
      expect(screen.getByTestId('hook-permission-denied')).toHaveTextContent('allowed');
      expect(screen.getByTestId('hook-scenario')).toHaveTextContent(
        'missing_stayai_final_state',
      );
    });
  });

  it('marks state as permission denied when the API returns 403', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionOutcomes').mockRejectedValueOnce(
      new ApiClientError('forbidden', 403),
    );
    render(<HookProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('hook-permission-denied')).toHaveTextContent('denied');
    });
  });

  it('falls back to fixture when the API returns the wrong shape (missing keys)', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionOutcomes').mockResolvedValueOnce(
      { module: 'subscriptions' } as unknown as SubscriptionOutcomesResponse,
    );
    render(<HookProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('hook-error')).toHaveTextContent(
        /subscription outcomes response shape mismatch/i,
      );
    });
  });

  it('falls back to fixture when nested contract objects are null', async () => {
    const broken = JSON.parse(JSON.stringify(baseline)) as SubscriptionOutcomesResponse;
    (broken as unknown as Record<string, unknown>).metrics = null;
    vi.spyOn(dashboardApi, 'getSubscriptionOutcomes').mockResolvedValueOnce(broken);
    render(<HookProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('hook-error')).toHaveTextContent(
        /subscription outcomes response shape mismatch/i,
      );
    });
  });

  it('falls back to fixture when generated_from_fixture is non-boolean', async () => {
    const broken = JSON.parse(JSON.stringify(baseline)) as SubscriptionOutcomesResponse;
    (broken as unknown as Record<string, unknown>).generated_from_fixture = 'no';
    vi.spyOn(dashboardApi, 'getSubscriptionOutcomes').mockResolvedValueOnce(broken);
    render(<HookProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('hook-error')).toHaveTextContent(
        /subscription outcomes response shape mismatch/i,
      );
    });
  });

  it('falls back to fixture when a nested field is an array instead of object', async () => {
    const broken = JSON.parse(JSON.stringify(baseline)) as SubscriptionOutcomesResponse;
    (broken as unknown as Record<string, unknown>).metadata = [];
    vi.spyOn(dashboardApi, 'getSubscriptionOutcomes').mockResolvedValueOnce(broken);
    render(<HookProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('hook-error')).toHaveTextContent(
        /subscription outcomes response shape mismatch/i,
      );
    });
  });

  it('falls back to fixture when a required metric number is missing or non-finite', async () => {
    const broken = JSON.parse(JSON.stringify(baseline)) as SubscriptionOutcomesResponse;
    (broken.metrics as unknown as Record<string, unknown>).subscription_contacts_total =
      'not-a-number';
    vi.spyOn(dashboardApi, 'getSubscriptionOutcomes').mockResolvedValueOnce(broken);
    render(<HookProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('hook-error')).toHaveTextContent(
        /subscription outcomes response shape mismatch/i,
      );
    });
  });

  it('falls back to fixture when a required metric number is NaN', async () => {
    const broken = JSON.parse(JSON.stringify(baseline)) as SubscriptionOutcomesResponse;
    (broken.metrics as unknown as Record<string, unknown>).retention_rate = Number.NaN;
    vi.spyOn(dashboardApi, 'getSubscriptionOutcomes').mockResolvedValueOnce(broken);
    render(<HookProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('hook-error')).toHaveTextContent(
        /subscription outcomes response shape mismatch/i,
      );
    });
  });

  it('falls back to fixture when a required metadata string field is missing', async () => {
    const broken = JSON.parse(JSON.stringify(baseline)) as SubscriptionOutcomesResponse;
    (broken.metadata as unknown as Record<string, unknown>).freshness_status = 42;
    vi.spyOn(dashboardApi, 'getSubscriptionOutcomes').mockResolvedValueOnce(broken);
    render(<HookProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('hook-error')).toHaveTextContent(
        /subscription outcomes response shape mismatch/i,
      );
    });
  });

  it('falls back to fixture when metadata.metric_definitions is not an array of strings', async () => {
    const broken = JSON.parse(JSON.stringify(baseline)) as SubscriptionOutcomesResponse;
    (broken.metadata as unknown as Record<string, unknown>).metric_definitions = [
      'ok',
      123,
    ];
    vi.spyOn(dashboardApi, 'getSubscriptionOutcomes').mockResolvedValueOnce(broken);
    render(<HookProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('hook-error')).toHaveTextContent(
        /subscription outcomes response shape mismatch/i,
      );
    });
  });

  it('falls back to fixture when metadata.metric_definitions is missing entirely', async () => {
    const broken = JSON.parse(JSON.stringify(baseline)) as SubscriptionOutcomesResponse;
    (broken.metadata as unknown as Record<string, unknown>).metric_definitions = 'not-an-array';
    vi.spyOn(dashboardApi, 'getSubscriptionOutcomes').mockResolvedValueOnce(broken);
    render(<HookProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('hook-error')).toHaveTextContent(
        /subscription outcomes response shape mismatch/i,
      );
    });
  });

  it('falls back to fixture when metadata.filters is not a plain object', async () => {
    const broken = JSON.parse(JSON.stringify(baseline)) as SubscriptionOutcomesResponse;
    (broken.metadata as unknown as Record<string, unknown>).filters = ['date_range'];
    vi.spyOn(dashboardApi, 'getSubscriptionOutcomes').mockResolvedValueOnce(broken);
    render(<HookProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('hook-error')).toHaveTextContent(
        /subscription outcomes response shape mismatch/i,
      );
    });
  });

  it('coerces non-Error rejections into a string message', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionOutcomes').mockRejectedValueOnce('boom');
    render(<HookProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('hook-error')).toHaveTextContent('boom');
    });
  });

  it('ignores late resolutions after unmount without throwing', async () => {
    let resolveResponse: () => void = () => {};
    const pendingPromise = new Promise<SubscriptionOutcomesResponse>((resolve) => {
      resolveResponse = () => resolve(probeFixture());
    });
    vi.spyOn(dashboardApi, 'getSubscriptionOutcomes').mockReturnValueOnce(pendingPromise);
    const { unmount } = render(<HookProbe />);
    unmount();
    resolveResponse();
    await Promise.resolve();
    await Promise.resolve();
    expect(true).toBe(true);
  });

  it('ignores late rejections after unmount without throwing', async () => {
    let rejectResponse: (_reason?: unknown) => void = () => {};
    const pendingPromise = new Promise<SubscriptionOutcomesResponse>((_resolve, reject) => {
      rejectResponse = (errReason: unknown) => reject(errReason);
    });
    vi.spyOn(dashboardApi, 'getSubscriptionOutcomes').mockReturnValueOnce(pendingPromise);
    const { unmount } = render(<HookProbe />);
    unmount();
    rejectResponse(new Error('late failure'));
    await Promise.resolve();
    await Promise.resolve();
    expect(true).toBe(true);
  });
});

describe('subscription outcome state helpers', () => {
  it('clamps ratios to the [0,1] range and handles NaN/Infinity', () => {
    expect(clampRatio(0.5)).toBe(0.5);
    expect(clampRatio(-1)).toBe(0);
    expect(clampRatio(1.5)).toBe(1);
    expect(clampRatio(Number.NaN)).toBe(0);
    expect(clampRatio(Number.POSITIVE_INFINITY)).toBe(0);
  });

  it('formats rates as integer or one decimal percentages', () => {
    expect(formatRatePercent(0.5)).toBe('50%');
    expect(formatRatePercent(0.123)).toMatch(/12\.3%/);
    expect(formatRatePercent(-0.1)).toBe('0%');
    expect(formatRatePercent(2)).toBe('100%');
  });

  it('rounds to integer percent when the post-decimal rounding lands on a whole number', () => {
    // 9999/10000 -> 99.99% pre-rounding -> 100.0% rounded; should display as "100%".
    expect(formatRatePercent(9999 / 10000)).toBe('100%');
    expect(formatRatePercent(0.9995)).toBe('100%');
    expect(formatRatePercent(0.4994)).toBe('49.9%');
  });

  it('formats counts as locale-aware integers and falls back on non-finite values', () => {
    expect(formatCount(1234)).toBe('1,234');
    expect(formatCount(5)).toBe('5');
    expect(formatCount(Number.NaN)).toBe('0');
    expect(formatCount(Number.POSITIVE_INFINITY)).toBe('0');
  });

  it('produces safe ratios with n/a fallback for zero denominator', () => {
    expect(safeRatio(1, 2).display).toBe('50%');
    expect(safeRatio(1, 2).rate).toBe(0.5);
    expect(safeRatio(0, 0).display).toBe('n/a');
    expect(safeRatio(0, 0).rate).toBe(0);
  });

  it('returns trust tone classes for every trust label including default', () => {
    expect(trustToneClasses('high')).toContain('emerald');
    expect(trustToneClasses('medium')).toContain('sky');
    expect(trustToneClasses('low')).toContain('amber');
    expect(trustToneClasses('untrusted')).toContain('rose');
    expect(trustToneClasses('unexpected' as never)).toContain('rose');
  });

  it('returns freshness tone classes for stale, pending, fresh, and unknown values', () => {
    expect(freshnessToneClasses('stale')).toContain('rose');
    expect(freshnessToneClasses('expired')).toContain('rose');
    expect(freshnessToneClasses('overdue')).toContain('rose');
    expect(freshnessToneClasses('unknown')).toContain('amber');
    expect(freshnessToneClasses('pending')).toContain('amber');
    expect(freshnessToneClasses('lagging')).toContain('amber');
    expect(freshnessToneClasses('fresh')).toContain('emerald');
  });

  it('returns source-confirmation tone classes for every status including default', () => {
    expect(sourceConfirmationToneClasses('confirmed')).toContain('emerald');
    expect(sourceConfirmationToneClasses('pending')).toContain('amber');
    expect(sourceConfirmationToneClasses('missing')).toContain('rose');
    expect(sourceConfirmationToneClasses('unexpected')).toContain('rose');
  });

  it('returns funnel stage tone classes for every tone including default fallback', () => {
    expect(funnelStageToneClasses('primary')).toContain('slate');
    expect(funnelStageToneClasses('cancellation')).toContain('rose');
    expect(funnelStageToneClasses('retention')).toContain('emerald');
    expect(funnelStageToneClasses('context')).toContain('sky');
    expect(funnelStageToneClasses('unknown')).toContain('amber');
    expect(funnelStageToneClasses('unexpected' as never)).toContain('amber');
  });

  it('returns funnel stage bar classes for every tone including default fallback', () => {
    expect(funnelStageBarClasses('primary')).toContain('bg-slate-700');
    expect(funnelStageBarClasses('cancellation')).toContain('bg-rose-500');
    expect(funnelStageBarClasses('retention')).toContain('bg-emerald-500');
    expect(funnelStageBarClasses('context')).toContain('bg-sky-500');
    expect(funnelStageBarClasses('unknown')).toContain('bg-amber-500');
    expect(funnelStageBarClasses('unexpected' as never)).toContain('bg-amber-500');
  });
});

describe('buildSubscriptionOutcomeKpiCards / buildSubscriptionOutcomeRateCards', () => {
  it('builds a card per metric with the right value', () => {
    const cards = buildSubscriptionOutcomeKpiCards(baseline.metrics);
    expect(cards.find((card) => card.id === 'subscription_contacts_total')?.value).toBe(4);
    expect(cards.find((card) => card.id === 'confirmed_retained_total')?.value).toBe(1);
    expect(cards.find((card) => card.id === 'subscription_outcome_unknown_total')?.value).toBe(1);
  });

  it('builds rate cards using actual numerator/denominator from contract', () => {
    const rates = buildSubscriptionOutcomeRateCards(baseline.metrics);
    const retention = rates.find((card) => card.id === 'retention_rate');
    expect(retention?.numerator).toBe(1);
    expect(retention?.denominator).toBe(1);
    expect(retention?.rate).toBe(1);

    const cancellation = rates.find((card) => card.id === 'cancellation_confirmation_rate');
    expect(cancellation?.rate).toBe(0.5);
  });

  it('returns rate=0 when denominator is zero', () => {
    const rates = buildSubscriptionOutcomeRateCards(empty.metrics);
    rates.forEach((card) => {
      expect(card.rate).toBe(0);
      expect(card.denominator).toBe(0);
    });
  });
});

describe('buildSubscriptionOutcomeFunnel', () => {
  it('returns eight stages with proportional shares relative to subscription contacts', () => {
    const stages = buildSubscriptionOutcomeFunnel(baseline.metrics);
    expect(stages).toHaveLength(8);
    expect(stages[0].id).toBe('subscription_contact');
    expect(stages[0].count).toBe(4);
    expect(stages[0].share).toBe(1);

    const finalStage = stages.find((stage) => stage.id === 'stayai_final_confirmation');
    expect(finalStage?.count).toBe(2);
    expect(finalStage?.share).toBeCloseTo(0.5, 5);

    const unknownStage = stages.find((stage) => stage.id === 'unknown_pending');
    expect(unknownStage?.count).toBe(baseline.metrics.subscription_outcome_unknown_total);
    expect(unknownStage?.share).toBeCloseTo(
      baseline.metrics.subscription_outcome_unknown_total /
        baseline.metrics.subscription_contacts_total,
      5,
    );
  });

  it('does not double-count pending or missing Stay.ai sub-categories into stage 8', () => {
    const data = JSON.parse(JSON.stringify(baseline)) as SubscriptionOutcomesResponse;
    data.metrics.subscription_contacts_total = 10;
    data.metrics.subscription_outcome_unknown_total = 1;
    data.metrics.pending_stayai_confirmation_total = 1;
    data.metrics.missing_stayai_final_state_total = 1;
    const stages = buildSubscriptionOutcomeFunnel(data.metrics);
    const unknownStage = stages.find((stage) => stage.id === 'unknown_pending');
    expect(unknownStage?.count).toBe(1);
    expect(unknownStage?.share).toBeCloseTo(0.1, 5);
  });

  it('returns zero shares when total subscription contacts is zero', () => {
    const stages = buildSubscriptionOutcomeFunnel(empty.metrics);
    stages.forEach((stage) => {
      expect(stage.share).toBe(0);
      expect(stage.count).toBe(0);
    });
  });
});

describe('deriveSubscriptionOutcomeAlerts', () => {
  it('emits portal-link unknown completion alert for the baseline confirmed scenario', () => {
    const alerts = deriveSubscriptionOutcomeAlerts(baseline, {
      loading: false,
      error: null,
      source: 'api',
      permissionDenied: false,
    });
    const ids = alerts.map((alert) => alert.id);
    expect(ids).toContain('portal_link_unknown_completion');
    expect(ids).not.toContain('low_trust');
    expect(ids).not.toContain('missing_stayai_final_state');
    expect(ids).not.toContain('rbac_unavailable');
    expect(ids).not.toContain('fixture_preview');
  });

  it('emits loading + rbac alerts when loading from fixture with an error', () => {
    const loading = deriveSubscriptionOutcomeAlerts(baseline, {
      loading: true,
      error: 'network down',
      source: 'fixture',
      permissionDenied: false,
    });
    const ids = loading.map((alert) => alert.id);
    expect(ids).toContain('loading');
    expect(ids).toContain('rbac_unavailable');

    const settled = deriveSubscriptionOutcomeAlerts(baseline, {
      loading: false,
      error: 'network down',
      source: 'fixture',
      permissionDenied: false,
    });
    expect(settled.map((alert) => alert.id)).toContain('fixture_preview');
  });

  it('emits permission denied alert and skips rbac fallback when explicitly denied', () => {
    const alerts = deriveSubscriptionOutcomeAlerts(baseline, {
      loading: false,
      error: 'forbidden',
      source: 'fixture',
      permissionDenied: true,
    });
    expect(alerts.some((alert) => alert.id === 'permission_denied')).toBe(true);
    expect(alerts.some((alert) => alert.id === 'rbac_unavailable')).toBe(false);
  });

  it('emits missing stay.ai, low trust, stale and shopify alerts for the missing scenario', () => {
    const alerts = deriveSubscriptionOutcomeAlerts(missing, {
      loading: false,
      error: null,
      source: 'api',
      permissionDenied: false,
    });
    const ids = alerts.map((alert) => alert.id);
    expect(ids).toContain('missing_stayai_final_state');
    expect(ids).toContain('low_trust');
    expect(ids).toContain('stale_source');
    expect(ids).toContain('shopify_context_only');
    expect(ids).toContain('synthflow_journey_incomplete');
    expect(ids).toContain('portal_link_unknown_completion');
  });

  it('emits pending alerts for the pending scenario', () => {
    const alerts = deriveSubscriptionOutcomeAlerts(pending, {
      loading: false,
      error: null,
      source: 'api',
      permissionDenied: false,
    });
    const ids = alerts.map((alert) => alert.id);
    expect(ids).toContain('pending_stayai_confirmation');
    expect(ids).toContain('low_trust');
    expect(ids).toContain('shopify_context_only');
  });

  it('emits empty + pending freshness alerts when applicable', () => {
    const data = JSON.parse(JSON.stringify(baseline)) as SubscriptionOutcomesResponse;
    data.metrics.subscription_contacts_total = 0;
    data.metrics.synthflow_subscription_journeys_total = 0;
    data.metrics.shopify_context_available_total = 0;
    data.metadata.freshness_status = 'unknown';
    const alerts = deriveSubscriptionOutcomeAlerts(data, {
      loading: false,
      error: null,
      source: 'api',
      permissionDenied: false,
    });
    const ids = alerts.map((alert) => alert.id);
    expect(ids).toContain('empty_outcomes');
    expect(ids).toContain('pending_freshness');
    expect(ids).not.toContain('shopify_context_only');
    expect(ids).not.toContain('synthflow_journey_incomplete');
  });

  it('emits export/audit unavailable alert when required metadata fields are missing', () => {
    const data = JSON.parse(JSON.stringify(baseline)) as SubscriptionOutcomesResponse;
    data.metadata.fingerprint = '';
    data.metadata.audit_reference = '';
    data.metadata.formula_version = '';
    const alerts = deriveSubscriptionOutcomeAlerts(data, {
      loading: false,
      error: null,
      source: 'api',
      permissionDenied: false,
    });
    expect(alerts.some((alert) => alert.id === 'export_audit_unavailable')).toBe(true);
  });

  it('does not emit fixture preview alert when api response with no error and no fixture flag', () => {
    const data = JSON.parse(JSON.stringify(baseline)) as SubscriptionOutcomesResponse;
    data.generated_from_fixture = false;
    const alerts = deriveSubscriptionOutcomeAlerts(data, {
      loading: false,
      error: null,
      source: 'api',
      permissionDenied: false,
    });
    expect(alerts.some((alert) => alert.id === 'fixture_preview')).toBe(false);
  });
});

describe('SubscriptionOutcomeAlertsPanel', () => {
  it('renders empty-state confirmation when there are no alerts', () => {
    render(<SubscriptionOutcomeAlertsPanel alerts={[]} />);
    expect(
      screen.getByText(/All Stay.ai-controlled subscription outcomes are clear/i),
    ).toBeInTheDocument();
  });

  it('renders an alert per level with stable test ids', () => {
    render(
      <SubscriptionOutcomeAlertsPanel
        alerts={[
          { id: 'info-row', level: 'info', title: 'Info row', detail: 'just info' },
          { id: 'warn-row', level: 'warning', title: 'Warn row', detail: 'careful' },
          { id: 'danger-row', level: 'danger', title: 'Danger row', detail: 'blocked' },
        ]}
      />,
    );
    expect(screen.getByTestId('outcome-alert-info-row')).toBeInTheDocument();
    expect(screen.getByTestId('outcome-alert-warn-row')).toBeInTheDocument();
    expect(screen.getByTestId('outcome-alert-danger-row')).toBeInTheDocument();
  });
});

describe('SubscriptionOutcomeKpiGrid', () => {
  it('renders a tile for every required outcome KPI with its formatted count', () => {
    const cards = buildSubscriptionOutcomeKpiCards(baseline.metrics);
    const rateCards = buildSubscriptionOutcomeRateCards(baseline.metrics);
    render(<SubscriptionOutcomeKpiGrid cards={cards} rateCards={rateCards} />);
    const grid = screen.getByTestId('subscription-outcome-kpi-grid');
    [
      'subscription_contacts_total',
      'subscription_action_requests_total',
      'cancellation_requests_total',
      'confirmed_cancellations_total',
      'save_or_retention_attempts_total',
      'confirmed_retained_total',
      'non_cancellation_actions_total',
      'pending_stayai_confirmation_total',
      'missing_stayai_final_state_total',
      'portal_link_sent_total',
      'portal_completion_confirmed_total',
      'shopify_context_available_total',
      'synthflow_subscription_journeys_total',
      'subscription_outcome_unknown_total',
    ].forEach((id) => {
      expect(within(grid).getByTestId(`outcome-kpi-${id}`)).toBeInTheDocument();
    });
    expect(within(grid).getByTestId('outcome-rate-retention_rate')).toBeInTheDocument();
    expect(
      within(grid).getByTestId('outcome-rate-cancellation_confirmation_rate'),
    ).toBeInTheDocument();
    expect(within(grid).getByTestId('outcome-rate-portal_completion_rate')).toBeInTheDocument();
    expect(
      within(grid).getByTestId('outcome-rate-formula-portal_completion_rate'),
    ).toHaveTextContent('portal_completion_confirmed_total / portal_link_sent_total');
  });

  it('renders n/a for rate cards when denominator is zero', () => {
    const cards = buildSubscriptionOutcomeKpiCards(empty.metrics);
    const rateCards = buildSubscriptionOutcomeRateCards(empty.metrics);
    render(<SubscriptionOutcomeKpiGrid cards={cards} rateCards={rateCards} />);
    const retentionRate = screen.getByTestId('outcome-rate-retention_rate');
    expect(within(retentionRate).getByText('n/a')).toBeInTheDocument();
  });
});

describe('SubscriptionOutcomeFunnel', () => {
  it('renders all eight funnel stages with bar widths and counts', () => {
    const stages = buildSubscriptionOutcomeFunnel(baseline.metrics);
    render(<SubscriptionOutcomeFunnel stages={stages} />);
    const funnel = screen.getByTestId('subscription-outcome-funnel');
    stages.forEach((stage) => {
      expect(within(funnel).getByTestId(`funnel-stage-${stage.id}`)).toBeInTheDocument();
      expect(within(funnel).getByTestId(`funnel-stage-bar-${stage.id}`)).toBeInTheDocument();
      expect(within(funnel).getByTestId(`funnel-stage-count-${stage.id}`)).toBeInTheDocument();
    });
  });

  it('renders the funnel safely when every stage count is zero', () => {
    const stages = buildSubscriptionOutcomeFunnel(empty.metrics);
    render(<SubscriptionOutcomeFunnel stages={stages} />);
    expect(screen.getByTestId('subscription-outcome-funnel')).toBeInTheDocument();
    expect(screen.getByText(/Total subscription contacts: 0/i)).toBeInTheDocument();
  });

  it('renders without throwing when given an empty stages array', () => {
    render(<SubscriptionOutcomeFunnel stages={[]} />);
    expect(screen.getByTestId('subscription-outcome-funnel')).toBeInTheDocument();
    expect(screen.getByText(/Total subscription contacts: 0/i)).toBeInTheDocument();
  });
});

describe('SubscriptionOutcomeMetadataPanel', () => {
  it('renders trust, freshness, source confirmation chips and required audit fields', () => {
    render(<SubscriptionOutcomeMetadataPanel metadata={baseline.metadata} data={baseline} />);
    expect(screen.getByTestId('outcome-metadata-trust')).toHaveTextContent(
      `Trust: ${baseline.metadata.trust_label}`,
    );
    expect(screen.getByTestId('outcome-metadata-freshness')).toHaveTextContent(
      `Freshness: ${baseline.metadata.freshness_status}`,
    );
    expect(screen.getByTestId('outcome-metadata-source-confirmation')).toHaveTextContent(
      `Source confirmation: ${baseline.metadata.source_confirmation_status}`,
    );
    expect(screen.getByTestId('outcome-metadata-fingerprint')).toHaveTextContent(
      baseline.metadata.fingerprint,
    );
    expect(screen.getByTestId('outcome-metadata-audit-reference')).toHaveTextContent(
      baseline.metadata.audit_reference,
    );
    expect(screen.getByTestId('outcome-metadata-formula-version')).toHaveTextContent(
      baseline.metadata.formula_version,
    );
    baseline.metadata.metric_definitions.forEach((definition) => {
      expect(screen.getByText(definition)).toBeInTheDocument();
    });
  });

  it('renders the empty-filters fallback when no filters are reported', () => {
    const data = JSON.parse(JSON.stringify(baseline)) as SubscriptionOutcomesResponse;
    data.metadata.filters = {};
    render(<SubscriptionOutcomeMetadataPanel metadata={data.metadata} data={data} />);
    expect(screen.getByText(/No filters reported/i)).toBeInTheDocument();
  });

  it('renders array filter values joined with comma', () => {
    const data = JSON.parse(JSON.stringify(baseline)) as SubscriptionOutcomesResponse;
    data.metadata.filters = { platforms: ['stayai', 'synthflow'] };
    render(<SubscriptionOutcomeMetadataPanel metadata={data.metadata} data={data} />);
    expect(screen.getByText(/stayai, synthflow/i)).toBeInTheDocument();
  });
});

describe('SubscriptionOutcomesView integration', () => {
  it('renders the cycle 005 section with status bar and all panels by default', async () => {
    render(<SubscriptionOutcomesView />);
    await waitFor(() => {
      expect(screen.getByTestId('subscription-outcome-analytics-section')).toBeInTheDocument();
      expect(screen.getByTestId('subscription-outcome-status-bar')).toBeInTheDocument();
      expect(screen.getByTestId('subscription-outcome-kpi-grid')).toBeInTheDocument();
      expect(screen.getByTestId('subscription-outcome-funnel')).toBeInTheDocument();
      expect(screen.getByTestId('subscription-outcome-metadata-panel')).toBeInTheDocument();
      expect(screen.getByTestId('subscription-outcome-alerts-panel')).toBeInTheDocument();
      expect(
        within(screen.getByTestId('subscription-outcome-status-bar')).getByText(
          /Contract preview from fixture/i,
        ),
      ).toBeInTheDocument();
    });
  });

  it('switches scenario on click and re-derives contract state', async () => {
    render(<SubscriptionOutcomesView />);
    await waitFor(() => {
      expect(screen.getByTestId('subscription-outcome-status-bar')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('outcome-scenario-missing_stayai_final_state'));
    await waitFor(() => {
      expect(screen.getByTestId('outcome-alert-missing_stayai_final_state')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('outcome-scenario-empty'));
    await waitFor(() => {
      expect(screen.getByTestId('outcome-alert-empty_outcomes')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('outcome-scenario-pending_stayai_confirmation'));
    await waitFor(() => {
      expect(
        screen.getByTestId('outcome-alert-pending_stayai_confirmation'),
      ).toBeInTheDocument();
    });
  });

  it('shows the live API status bar when getSubscriptionOutcomes resolves with valid data', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionOutcomes').mockResolvedValue(probeFixture());
    render(<SubscriptionOutcomesView />);
    await waitFor(() => {
      expect(screen.getByText(/Live API contract loaded/i)).toBeInTheDocument();
    });
  });

  it('renders the loading status bar while the API call is pending', () => {
    vi.spyOn(dashboardApi, 'getSubscriptionOutcomes').mockImplementation(
      () => new Promise(() => {}),
    );
    render(<SubscriptionOutcomesView />);
    expect(
      within(screen.getByTestId('subscription-outcome-status-bar')).getByText(
        /Loading subscription outcomes/i,
      ),
    ).toBeInTheDocument();
  });

  it('renders the permission-denied status bar when a 403 surfaces from the API', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionOutcomes').mockRejectedValue(
      new ApiClientError('forbidden', 403),
    );
    render(<SubscriptionOutcomesView />);
    await waitFor(() => {
      expect(screen.getByText(/Permission denied by server/i)).toBeInTheDocument();
      expect(screen.getByTestId('outcome-alert-permission_denied')).toBeInTheDocument();
    });
  });

  it('renders the generic API-error status bar when an unrelated error surfaces', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionOutcomes').mockRejectedValue(
      new Error('upstream connection reset'),
    );
    render(<SubscriptionOutcomesView />);
    await waitFor(() => {
      expect(
        within(screen.getByTestId('subscription-outcome-status-bar')).getByText(
          /upstream connection reset/i,
        ),
      ).toBeInTheDocument();
    });
  });
});

describe('SubscriptionAnalyticsPage routing with cycle 005 outcomes', () => {
  it('mounts the cycle 005 outcome section above the cycle 002 contract view', async () => {
    render(
      <MemoryRouter initialEntries={['/subscriptions']}>
        <App />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('subscription-outcome-analytics-section')).toBeInTheDocument();
      expect(screen.getByTestId('subscription-final-state-banner')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', {
          name: /Cycle 005 subscription outcome analytics/i,
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', {
          name: /Cycle 002 contract-wired subscription view/i,
        }),
      ).toBeInTheDocument();
    });
  });
});
