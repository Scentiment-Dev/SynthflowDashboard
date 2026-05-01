import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import SubscriptionAnalyticsView from '../components/dashboard/subscription/SubscriptionAnalyticsView';
import SubscriptionFinalStateBanner from '../components/dashboard/subscription/SubscriptionFinalStateBanner';
import SubscriptionOverviewGrid from '../components/dashboard/subscription/SubscriptionOverviewGrid';
import PortalJourneyPanel from '../components/dashboard/subscription/PortalJourneyPanel';
import ShopifyContextPanel from '../components/dashboard/subscription/ShopifyContextPanel';
import SynthflowJourneyPanel from '../components/dashboard/subscription/SynthflowJourneyPanel';
import SourceConfirmationPanel from '../components/dashboard/subscription/SourceConfirmationPanel';
import SubscriptionMetricMetadataPanel from '../components/dashboard/subscription/SubscriptionMetricMetadataPanel';
import SubscriptionStateAlertsPanel from '../components/dashboard/subscription/SubscriptionStateAlertsPanel';
import { SUBSCRIPTION_ANALYTICS_FIXTURES } from '../data/subscriptionAnalyticsFixtures';
import { useSubscriptionAnalytics } from '../hooks/useSubscriptionAnalytics';
import * as dashboardApi from '../services/dashboardApi';
import { ApiClientError } from '../services/apiClient';
import {
  buildSubscriptionAnalyticsUrl,
} from '../services/dashboardApi';
import {
  deriveSubscriptionStateAlerts,
  finalStateLabel,
  finalStateTone,
  formatCount,
  formatRatio,
  sourceConfirmationTone,
  statusBadgeClasses,
  statusToneClasses,
} from '../utils/subscriptionAnalyticsState';
import type {
  SubscriptionAnalyticsResponse,
  SubscriptionAnalyticsScenario,
} from '../types/subscriptionAnalytics';

const baseline = SUBSCRIPTION_ANALYTICS_FIXTURES.baseline;
const missingStayai = SUBSCRIPTION_ANALYTICS_FIXTURES.missing_stayai_confirmation;

function probeFixture(): SubscriptionAnalyticsResponse {
  return JSON.parse(JSON.stringify(baseline)) as SubscriptionAnalyticsResponse;
}

function HookProbe({ scenario }: { scenario?: SubscriptionAnalyticsScenario }) {
  const state = useSubscriptionAnalytics(scenario ?? 'baseline');
  return (
    <div>
      <p data-testid="hook-source">{state.source}</p>
      <p data-testid="hook-loading">{state.loading ? 'loading' : 'idle'}</p>
      <p data-testid="hook-error">{state.error ?? 'none'}</p>
      <p data-testid="hook-permission-denied">{state.permissionDenied ? 'denied' : 'allowed'}</p>
      <p data-testid="hook-state">{state.data.final_subscription_state}</p>
      <p data-testid="hook-scenario">{state.scenario}</p>
    </div>
  );
}

describe('subscription analytics URL builder', () => {
  it('encodes scenario and points to the merged Cycle 002 endpoint', () => {
    expect(buildSubscriptionAnalyticsUrl()).toBe('/subscriptions/analytics?scenario=baseline');
    expect(buildSubscriptionAnalyticsUrl('missing_stayai_confirmation')).toBe(
      '/subscriptions/analytics?scenario=missing_stayai_confirmation',
    );
  });
});

describe('useSubscriptionAnalytics', () => {
  it('switches to api source on a valid contract response', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionAnalytics').mockResolvedValueOnce(probeFixture());

    render(<HookProbe />);

    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('api');
      expect(screen.getByTestId('hook-loading')).toHaveTextContent('idle');
      expect(screen.getByTestId('hook-error')).toHaveTextContent('none');
      expect(screen.getByTestId('hook-state')).toHaveTextContent('retained');
    });
  });

  it('falls back to fixture when the API rejects with a generic error', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionAnalytics').mockRejectedValueOnce(
      new Error('network down'),
    );

    render(<HookProbe scenario="missing_stayai_confirmation" />);

    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('hook-error')).toHaveTextContent('network down');
      expect(screen.getByTestId('hook-permission-denied')).toHaveTextContent('allowed');
      expect(screen.getByTestId('hook-scenario')).toHaveTextContent('missing_stayai_confirmation');
    });
  });

  it('marks state as permission denied when the API returns 403', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionAnalytics').mockRejectedValueOnce(
      new ApiClientError('forbidden', 403),
    );

    render(<HookProbe />);

    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('hook-permission-denied')).toHaveTextContent('denied');
    });
  });

  it('marks state as permission denied when the API returns 401 without a permission keyword', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionAnalytics').mockRejectedValueOnce(
      new ApiClientError('not authenticated', 401),
    );

    render(<HookProbe />);

    await waitFor(() => {
      expect(screen.getByTestId('hook-permission-denied')).toHaveTextContent('denied');
    });
  });

  it('treats messages mentioning permission denied as denied even from generic errors', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionAnalytics').mockRejectedValueOnce(
      new Error('Permission denied: subscription scope'),
    );

    render(<HookProbe />);

    await waitFor(() => {
      expect(screen.getByTestId('hook-permission-denied')).toHaveTextContent('denied');
    });
  });

  it('treats ApiClientError with non-permission status and unrelated message as not denied', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionAnalytics').mockRejectedValueOnce(
      new ApiClientError('upstream timeout', 504),
    );

    render(<HookProbe />);

    await waitFor(() => {
      expect(screen.getByTestId('hook-permission-denied')).toHaveTextContent('allowed');
    });
  });

  it('falls back to fixture when the API returns the wrong shape', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionAnalytics').mockResolvedValueOnce(
      { module: 'subscriptions' } as unknown as SubscriptionAnalyticsResponse,
    );

    render(<HookProbe />);

    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('hook-error')).toHaveTextContent(
        /subscription analytics response shape mismatch/i,
      );
    });
  });

  it('falls back to fixture when nested contract objects are null', async () => {
    const baselineForBroken = JSON.parse(
      JSON.stringify(SUBSCRIPTION_ANALYTICS_FIXTURES.baseline),
    ) as SubscriptionAnalyticsResponse;
    (baselineForBroken as unknown as Record<string, unknown>).subscription_overview = null;
    vi.spyOn(dashboardApi, 'getSubscriptionAnalytics').mockResolvedValueOnce(baselineForBroken);

    render(<HookProbe />);

    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('hook-error')).toHaveTextContent(
        /subscription analytics response shape mismatch/i,
      );
    });
  });

  it('falls back to fixture when generated_from_fixture is missing or non-boolean', async () => {
    const broken = JSON.parse(
      JSON.stringify(SUBSCRIPTION_ANALYTICS_FIXTURES.baseline),
    ) as SubscriptionAnalyticsResponse;
    (broken as unknown as Record<string, unknown>).generated_from_fixture = 'no';
    vi.spyOn(dashboardApi, 'getSubscriptionAnalytics').mockResolvedValueOnce(broken);

    render(<HookProbe />);

    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('hook-error')).toHaveTextContent(
        /subscription analytics response shape mismatch/i,
      );
    });
  });

  it('falls back to fixture when a nested contract field is an array instead of object', async () => {
    const broken = JSON.parse(
      JSON.stringify(SUBSCRIPTION_ANALYTICS_FIXTURES.baseline),
    ) as SubscriptionAnalyticsResponse;
    (broken as unknown as Record<string, unknown>).portal_journey = [];
    vi.spyOn(dashboardApi, 'getSubscriptionAnalytics').mockResolvedValueOnce(broken);

    render(<HookProbe />);

    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('hook-error')).toHaveTextContent(
        /subscription analytics response shape mismatch/i,
      );
    });
  });

  it('coerces non-Error rejections into a string message', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionAnalytics').mockRejectedValueOnce('boom');

    render(<HookProbe />);

    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('hook-error')).toHaveTextContent('boom');
    });
  });

  it('ignores late resolutions after unmount without throwing', async () => {
    let resolveResponse: () => void = () => {};
    const pending = new Promise<SubscriptionAnalyticsResponse>((resolve) => {
      resolveResponse = () => resolve(probeFixture());
    });
    vi.spyOn(dashboardApi, 'getSubscriptionAnalytics').mockReturnValueOnce(pending);

    const { unmount } = render(<HookProbe />);
    unmount();
    resolveResponse();
    await Promise.resolve();
    await Promise.resolve();

    expect(true).toBe(true);
  });

  it('ignores late rejections after unmount without throwing', async () => {
    let rejectResponse: (_reason?: unknown) => void = () => {};
    const pending = new Promise<SubscriptionAnalyticsResponse>((_resolve, reject) => {
      rejectResponse = (errReason: unknown) => reject(errReason);
    });
    vi.spyOn(dashboardApi, 'getSubscriptionAnalytics').mockReturnValueOnce(pending);

    const { unmount } = render(<HookProbe />);
    unmount();
    rejectResponse(new Error('late failure'));
    await Promise.resolve();
    await Promise.resolve();

    expect(true).toBe(true);
  });
});

describe('deriveSubscriptionStateAlerts', () => {
  it('emits expected alerts for fully-confirmed baseline values when not loading and api source', () => {
    const alerts = deriveSubscriptionStateAlerts(baseline, {
      error: null,
      permissionDenied: false,
      loading: false,
      source: 'api',
    });
    const ids = alerts.map((alert) => alert.id);
    expect(ids).toContain('portal_link_unknown_completion');
    expect(ids).not.toContain('low_trust');
    expect(ids).not.toContain('missing_stayai_final_state');
    expect(ids).not.toContain('rbac_unavailable');
  });

  it('emits loading and rbac alerts when loading from fixture with an error', () => {
    const loadingAlerts = deriveSubscriptionStateAlerts(baseline, {
      error: 'network down',
      permissionDenied: false,
      loading: true,
      source: 'fixture',
    });
    const loadingIds = loadingAlerts.map((alert) => alert.id);
    expect(loadingIds).toContain('loading');
    expect(loadingIds).toContain('rbac_unavailable');

    const settledAlerts = deriveSubscriptionStateAlerts(baseline, {
      error: 'network down',
      permissionDenied: false,
      loading: false,
      source: 'fixture',
    });
    expect(settledAlerts.map((alert) => alert.id)).toContain('fixture_preview');
  });

  it('emits permission denied alert when explicitly permission denied', () => {
    const alerts = deriveSubscriptionStateAlerts(baseline, {
      error: 'Forbidden',
      permissionDenied: true,
      loading: false,
      source: 'fixture',
    });
    expect(alerts.some((alert) => alert.id === 'permission_denied')).toBe(true);
    expect(alerts.some((alert) => alert.id === 'rbac_unavailable')).toBe(false);
  });

  it('emits missing stay.ai, low trust and stale alerts for the missing scenario', () => {
    const alerts = deriveSubscriptionStateAlerts(missingStayai, {
      error: null,
      permissionDenied: false,
      loading: false,
      source: 'api',
    });
    const ids = alerts.map((alert) => alert.id);
    expect(ids).toContain('missing_stayai_final_state');
    expect(ids).toContain('low_trust');
    expect(ids).toContain('stale');
    expect(ids).toContain('shopify_without_stayai_final');
    expect(ids).toContain('synthflow_journey_incomplete');
    expect(ids).toContain('final_state_not_confirmed');
  });

  it('emits empty, pending freshness and pending source alerts when applicable', () => {
    const data = JSON.parse(JSON.stringify(baseline)) as SubscriptionAnalyticsResponse;
    data.subscription_overview.subscription_overview_count = 0;
    data.metric_metadata.freshness = 'pending';
    data.source_confirmation.source_confirmation_status = 'pending';
    data.metric_metadata.trust_label = 'untrusted';

    const alerts = deriveSubscriptionStateAlerts(data, {
      error: null,
      permissionDenied: false,
      loading: false,
      source: 'api',
    });
    const ids = alerts.map((alert) => alert.id);
    expect(ids).toContain('empty');
    expect(ids).toContain('pending_freshness');
    expect(ids).toContain('pending_source_confirmation');
    expect(ids).toContain('low_trust');
  });

  it('emits audit and export blocked alerts when metadata is missing', () => {
    const data = JSON.parse(JSON.stringify(baseline)) as SubscriptionAnalyticsResponse;
    data.metric_metadata.fingerprint = '';
    data.metric_metadata.audit_reference = '';
    data.metric_metadata.formula_version = '';

    const alerts = deriveSubscriptionStateAlerts(data, {
      error: null,
      permissionDenied: false,
      loading: false,
      source: 'api',
    });
    const ids = alerts.map((alert) => alert.id);
    expect(ids).toContain('audit_unavailable');
    expect(ids).toContain('export_pending_metadata');
  });

  it('does not emit fixture preview alert for an api response with no error and no fixture flag', () => {
    const data = JSON.parse(JSON.stringify(baseline)) as SubscriptionAnalyticsResponse;
    data.generated_from_fixture = false;
    const alerts = deriveSubscriptionStateAlerts(data, {
      error: null,
      permissionDenied: false,
      loading: false,
      source: 'api',
    });
    expect(alerts.some((alert) => alert.id === 'fixture_preview')).toBe(false);
  });

  it('handles defensive missing status_breakdown without throwing', () => {
    const data = JSON.parse(JSON.stringify(baseline)) as SubscriptionAnalyticsResponse;
    (data.synthflow_journey as unknown as Record<string, unknown>).status_breakdown = undefined;
    const alerts = deriveSubscriptionStateAlerts(data, {
      error: null,
      permissionDenied: false,
      loading: false,
      source: 'api',
    });
    expect(alerts).toBeDefined();
  });
});

describe('subscription analytics state helpers', () => {
  it('formats counts with locale-aware separators', () => {
    expect(formatCount(0)).toBe('0');
    expect(formatCount(12345)).toBe(new Intl.NumberFormat().format(12345));
  });

  it('formats ratios for normal, integer and zero denominators', () => {
    expect(formatRatio(0, 0)).toBe('n/a');
    expect(formatRatio(50, 100)).toBe('50%');
    expect(formatRatio(33, 100)).toBe('33%');
    expect(formatRatio(2, 7)).toMatch(/%$/);
  });

  it('formats ratios that are integers despite floating-point noise as whole percentages', () => {
    expect(formatRatio(3, 10)).toBe('30%');
    expect(formatRatio(7, 10)).toBe('70%');
    expect(formatRatio(9, 10)).toBe('90%');
    expect(formatRatio(1, 3)).toMatch(/^33\.\d%$/);
  });

  it('returns the right tone for every final subscription state', () => {
    expect(finalStateTone('retained')).toBe('success');
    expect(finalStateTone('saved')).toBe('success');
    expect(finalStateTone('active')).toBe('success');
    expect(finalStateTone('cancelled')).toBe('neutral');
    expect(finalStateTone('pending')).toBe('warning');
    expect(finalStateTone('unknown')).toBe('danger');
  });

  it('renders human labels for every final subscription state', () => {
    expect(finalStateLabel('retained')).toMatch(/Retained/);
    expect(finalStateLabel('saved')).toMatch(/Saved/);
    expect(finalStateLabel('active')).toMatch(/Active/);
    expect(finalStateLabel('cancelled')).toMatch(/Cancelled/);
    expect(finalStateLabel('pending')).toMatch(/Pending/);
    expect(finalStateLabel('unknown')).toMatch(/Unknown/);
  });

  it('returns tones for every source confirmation status', () => {
    expect(sourceConfirmationTone('confirmed')).toBe('success');
    expect(sourceConfirmationTone('pending')).toBe('warning');
    expect(sourceConfirmationTone('missing')).toBe('danger');
  });

  it('returns class strings for every status tone', () => {
    expect(statusToneClasses('success')).toContain('emerald');
    expect(statusToneClasses('warning')).toContain('amber');
    expect(statusToneClasses('danger')).toContain('rose');
    expect(statusToneClasses('neutral')).toContain('slate');
    expect(statusBadgeClasses('success')).toContain('emerald');
    expect(statusBadgeClasses('warning')).toContain('amber');
    expect(statusBadgeClasses('danger')).toContain('rose');
    expect(statusBadgeClasses('neutral')).toContain('slate');
  });
});

describe('SubscriptionFinalStateBanner', () => {
  it('renders Stay.ai final state with confirmed badge for baseline', () => {
    render(<SubscriptionFinalStateBanner data={baseline} />);
    expect(screen.getByTestId('subscription-final-state-banner')).toBeInTheDocument();
    expect(screen.getByText(/Retained \(Stay.ai confirmed\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Source confirmation: confirmed/i)).toBeInTheDocument();
    expect(screen.getByText(/Source-of-truth system: stayai/i)).toBeInTheDocument();
    expect(screen.getByText(/Contract preview \(fixture\)/i)).toBeInTheDocument();
  });

  it('hides the fixture badge when the response is sourced from the live API', () => {
    const data = { ...baseline, generated_from_fixture: false };
    render(<SubscriptionFinalStateBanner data={data} />);
    expect(screen.queryByText(/Contract preview \(fixture\)/i)).not.toBeInTheDocument();
  });

  it('shows missing-state messaging for the missing scenario', () => {
    render(<SubscriptionFinalStateBanner data={missingStayai} />);
    expect(screen.getByText(/Unknown — Stay.ai final state missing/i)).toBeInTheDocument();
    expect(screen.getByText(/Source confirmation: missing/i)).toBeInTheDocument();
  });
});

describe('SubscriptionOverviewGrid', () => {
  it('renders all six overview tiles with formatted counts', () => {
    render(<SubscriptionOverviewGrid overview={baseline.subscription_overview} />);
    const grid = screen.getByTestId('subscription-overview-grid');
    expect(within(grid).getByText(/Subscriptions in scope/i)).toBeInTheDocument();
    expect(within(grid).getByText(/Cancellation requests/i)).toBeInTheDocument();
    expect(within(grid).getByText(/Confirmed cancellations/i)).toBeInTheDocument();
    expect(within(grid).getByText(/Save \/ retention attempts/i)).toBeInTheDocument();
    expect(within(grid).getByText(/Confirmed retained subscriptions/i)).toBeInTheDocument();
    expect(within(grid).getByText(/Pending Stay.ai confirmation/i)).toBeInTheDocument();
    expect(within(grid).getByText('120')).toBeInTheDocument();
    expect(within(grid).getByText('34')).toBeInTheDocument();
  });
});

describe('PortalJourneyPanel', () => {
  it('shows portal link sent vs confirmed completion with locked rule', () => {
    render(<PortalJourneyPanel portal={baseline.portal_journey} />);
    const panel = screen.getByTestId('portal-journey-panel');
    expect(within(panel).getAllByText(/Portal link sent/i).length).toBeGreaterThan(0);
    expect(within(panel).getByText(/Confirmed portal completion/i)).toBeInTheDocument();
    expect(within(panel).getByText(/Portal link sent ≠ portal completion/i)).toBeInTheDocument();
    expect(within(panel).getByText('16')).toBeInTheDocument();
    expect(within(panel).getByText('10')).toBeInTheDocument();
    expect(within(panel).getByTestId('portal-journey-summary')).toHaveTextContent('6');
  });

  it('falls back to n/a ratio when no links were sent', () => {
    render(
      <PortalJourneyPanel
        portal={{ portal_link_sent_count: 0, confirmed_portal_completion_count: 0 }}
      />,
    );
    const panel = screen.getByTestId('portal-journey-panel');
    expect(within(panel).getByText(/n\/a/i)).toBeInTheDocument();
  });
});

describe('ShopifyContextPanel', () => {
  it('always communicates context-only role and disallowed finalization', () => {
    render(<ShopifyContextPanel shopify={baseline.shopify_context} />);
    const panel = screen.getByTestId('shopify-context-panel');
    expect(within(panel).getByText(/Context only — finalization not allowed/i)).toBeInTheDocument();
    expect(within(panel).getByText(/context_only/i)).toBeInTheDocument();
    expect(within(panel).getByText(/false/i)).toBeInTheDocument();
  });
});

describe('SynthflowJourneyPanel', () => {
  it('renders all known status tiles with the total event count', () => {
    render(<SynthflowJourneyPanel journey={baseline.synthflow_journey} />);
    const panel = screen.getByTestId('synthflow-journey-panel');
    expect(within(panel).getByText(/148 events/i)).toBeInTheDocument();
    expect(within(panel).getByTestId('synthflow-status-completed')).toBeInTheDocument();
    expect(within(panel).getByTestId('synthflow-status-unresolved')).toBeInTheDocument();
    expect(within(panel).getByTestId('synthflow-status-transferred')).toBeInTheDocument();
    expect(within(panel).getByTestId('synthflow-status-abandoned')).toBeInTheDocument();
  });

  it('renders an unknown extra status without crashing', () => {
    render(
      <SynthflowJourneyPanel
        journey={{
          journey_event_count: 5,
          status_breakdown: { completed: 3, custom_state: 2 },
        }}
      />,
    );
    expect(screen.getByTestId('synthflow-status-custom_state')).toBeInTheDocument();
  });
});

describe('SourceConfirmationPanel', () => {
  it('renders confirmed/pending/missing tiles for baseline', () => {
    render(<SourceConfirmationPanel sourceConfirmation={baseline.source_confirmation} />);
    expect(screen.getByTestId('source-confirmation-confirmed')).toBeInTheDocument();
    expect(screen.getByTestId('source-confirmation-pending')).toBeInTheDocument();
    expect(screen.getByTestId('source-confirmation-missing')).toBeInTheDocument();
    expect(screen.getByText(/Status: confirmed/i)).toBeInTheDocument();
  });

  it('renders missing-status tile and zero-total ratios safely', () => {
    render(
      <SourceConfirmationPanel
        sourceConfirmation={{
          source_of_truth_system: 'stayai',
          source_confirmation_status: 'missing',
          confirmed_records_count: 0,
          pending_records_count: 0,
          missing_records_count: 0,
        }}
      />,
    );
    expect(screen.getByText(/Status: missing/i)).toBeInTheDocument();
    expect(screen.getAllByText(/n\/a/i).length).toBeGreaterThan(0);
  });
});

describe('SubscriptionMetricMetadataPanel', () => {
  it('renders fingerprint, audit reference and definition chips', () => {
    render(<SubscriptionMetricMetadataPanel metadata={baseline.metric_metadata} />);
    expect(screen.getByTestId('metric-metadata-fingerprint')).toHaveTextContent(
      baseline.metric_metadata.fingerprint,
    );
    expect(screen.getByTestId('metric-metadata-audit-reference')).toHaveTextContent(
      baseline.metric_metadata.audit_reference,
    );
    baseline.metric_metadata.metric_definitions.forEach((definition) => {
      expect(screen.getByText(definition)).toBeInTheDocument();
    });
  });

  it('renders an empty filters fallback when no filters are reported', () => {
    const data = JSON.parse(JSON.stringify(baseline)) as SubscriptionAnalyticsResponse;
    data.metric_metadata.filters = {};
    render(<SubscriptionMetricMetadataPanel metadata={data.metric_metadata} />);
    expect(screen.getByText(/No filters reported/i)).toBeInTheDocument();
  });
});

describe('SubscriptionStateAlertsPanel', () => {
  it('renders an empty-state confirmation message when no alerts are active', () => {
    render(<SubscriptionStateAlertsPanel alerts={[]} />);
    expect(
      screen.getByText(/All Stay.ai-controlled subscription states are clear/i),
    ).toBeInTheDocument();
  });

  it('renders alerts for each level with stable test ids', () => {
    render(
      <SubscriptionStateAlertsPanel
        alerts={[
          { id: 'info-row', level: 'info', title: 'Info row', detail: 'just info' },
          { id: 'warn-row', level: 'warning', title: 'Warn row', detail: 'careful' },
          { id: 'danger-row', level: 'danger', title: 'Danger row', detail: 'blocked' },
        ]}
      />,
    );
    expect(screen.getByTestId('subscription-alert-info-row')).toBeInTheDocument();
    expect(screen.getByTestId('subscription-alert-warn-row')).toBeInTheDocument();
    expect(screen.getByTestId('subscription-alert-danger-row')).toBeInTheDocument();
  });
});

describe('SubscriptionAnalyticsView integration', () => {
  it('renders fixture preview status bar and key contract sections by default', async () => {
    render(<SubscriptionAnalyticsView />);
    await waitFor(() => {
      expect(screen.getByTestId('subscription-final-state-banner')).toBeInTheDocument();
      expect(screen.getByTestId('subscription-overview-grid')).toBeInTheDocument();
      expect(screen.getByTestId('portal-journey-panel')).toBeInTheDocument();
      expect(screen.getByTestId('shopify-context-panel')).toBeInTheDocument();
      expect(screen.getByTestId('synthflow-journey-panel')).toBeInTheDocument();
      expect(screen.getByTestId('source-confirmation-panel')).toBeInTheDocument();
      expect(screen.getByTestId('subscription-metric-metadata-panel')).toBeInTheDocument();
      expect(
        within(screen.getByTestId('subscription-analytics-status-bar')).getByText(
          /Contract preview from fixture/i,
        ),
      ).toBeInTheDocument();
    });
  });

  it('switches scenario on click and re-derives contract state', async () => {
    render(<SubscriptionAnalyticsView />);
    await waitFor(() => {
      expect(screen.getByText(/Retained \(Stay.ai confirmed\)/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Missing Stay.ai confirmation/i }));
    await waitFor(() => {
      expect(screen.getByText(/Unknown — Stay.ai final state missing/i)).toBeInTheDocument();
      expect(screen.getByTestId('subscription-alert-missing_stayai_final_state')).toBeInTheDocument();
    });
  });

  it('shows the live API status bar when getSubscriptionAnalytics resolves with valid data', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionAnalytics').mockResolvedValue(probeFixture());
    render(<SubscriptionAnalyticsView />);
    await waitFor(() => {
      expect(screen.getByText(/Live API contract loaded/i)).toBeInTheDocument();
    });
  });

  it('renders the loading status bar while the API call is pending', () => {
    vi.spyOn(dashboardApi, 'getSubscriptionAnalytics').mockImplementation(
      () => new Promise(() => {}),
    );
    render(<SubscriptionAnalyticsView />);
    expect(
      within(screen.getByTestId('subscription-analytics-status-bar')).getByText(
        /Loading subscription analytics contract/i,
      ),
    ).toBeInTheDocument();
  });

  it('renders the permission-denied status bar when a 403 surfaces', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionAnalytics').mockRejectedValue(
      new ApiClientError('forbidden', 403),
    );
    render(<SubscriptionAnalyticsView />);
    await waitFor(() => {
      expect(screen.getByText(/Permission denied by server/i)).toBeInTheDocument();
      expect(screen.getByTestId('subscription-alert-permission_denied')).toBeInTheDocument();
    });
  });
});

describe('SubscriptionAnalyticsPage routing', () => {
  it('keeps the cycle-001 module shell mounted alongside the cycle-002 contract view', async () => {
    render(
      <MemoryRouter initialEntries={['/subscriptions']}>
        <App />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('subscription-final-state-banner')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: /Subscription Analytics/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: /Subscription shell state readiness/i }),
      ).toBeInTheDocument();
    });
  });
});
