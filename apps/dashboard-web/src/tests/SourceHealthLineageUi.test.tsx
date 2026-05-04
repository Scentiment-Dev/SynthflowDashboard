import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import SourceHealthView from '../components/dashboard/sourceHealth/SourceHealthView';
import SourceHealthOverviewBar from '../components/dashboard/sourceHealth/SourceHealthOverviewBar';
import SourceHealthCard from '../components/dashboard/sourceHealth/SourceHealthCard';
import SourceHealthAlertsPanel from '../components/dashboard/sourceHealth/SourceHealthAlertsPanel';
import FreshnessStateLegend from '../components/dashboard/sourceHealth/FreshnessStateLegend';
import LineageConflictPanel from '../components/dashboard/sourceHealth/LineageConflictPanel';
import { SOURCE_HEALTH_FIXTURES } from '../data/sourceHealthFixtures';
import { useSubscriptionSourceHealth } from '../hooks/useSubscriptionSourceHealth';
import * as dashboardApi from '../services/dashboardApi';
import { ApiClientError } from '../services/apiClient';
import { buildSubscriptionSourceHealthUrl } from '../services/dashboardApi';
import {
  activeVisualStates,
  authorityLabel,
  conflictStatusLabel,
  conflictStatusTone,
  confirmationLabel,
  confirmationTone,
  dataQualityLabel,
  dataQualityTone,
  deriveSourceHealthAlerts,
  formatLastSeenRelative,
  freshnessLabel,
  freshnessTone,
  overallHealthLabel,
  overallHealthTone,
  SOURCE_SYSTEM_COPY,
  SOURCE_VISUAL_STATE_LIBRARY,
  trustLabelTone,
} from '../utils/sourceHealthState';
import type {
  SourceHealthScenario,
  SubscriptionSourceHealthResponse,
} from '../types/sourceHealth';

const baseline = SOURCE_HEALTH_FIXTURES.baseline;
const missingStayAi = SOURCE_HEALTH_FIXTURES.missing_stayai_final_state;
const failingQuality = SOURCE_HEALTH_FIXTURES.failing_quality_with_missing_stayai;
const conflicts = SOURCE_HEALTH_FIXTURES.conflicting_sources;

function clone(value: SubscriptionSourceHealthResponse): SubscriptionSourceHealthResponse {
  return JSON.parse(JSON.stringify(value)) as SubscriptionSourceHealthResponse;
}

function HookProbe({ scenario }: { scenario?: SourceHealthScenario }) {
  const state = useSubscriptionSourceHealth(scenario ?? 'baseline');
  return (
    <div>
      <p data-testid="hook-source">{state.source}</p>
      <p data-testid="hook-loading">{state.loading ? 'loading' : 'idle'}</p>
      <p data-testid="hook-error">{state.error ?? 'none'}</p>
      <p data-testid="hook-permission-denied">{state.permissionDenied ? 'denied' : 'allowed'}</p>
      <p data-testid="hook-overall">{state.data.overall_source_health}</p>
      <p data-testid="hook-scenario">{state.scenario}</p>
    </div>
  );
}

describe('source-health URL builder', () => {
  it('encodes scenario only when no source filter is provided', () => {
    expect(buildSubscriptionSourceHealthUrl()).toBe(
      '/subscriptions/source-health?scenario=baseline',
    );
    expect(buildSubscriptionSourceHealthUrl('conflicting_sources')).toBe(
      '/subscriptions/source-health?scenario=conflicting_sources',
    );
  });

  it('encodes scenario and repeats sources when provided', () => {
    expect(
      buildSubscriptionSourceHealthUrl('baseline', ['stay_ai', 'portal']),
    ).toBe('/subscriptions/source-health?scenario=baseline&sources=stay_ai&sources=portal');
  });

  it('omits sources when an empty array is passed', () => {
    expect(buildSubscriptionSourceHealthUrl('baseline', [])).toBe(
      '/subscriptions/source-health?scenario=baseline',
    );
  });
});

describe('useSubscriptionSourceHealth', () => {
  it('switches to api source on a valid contract response', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionSourceHealth').mockResolvedValueOnce(clone(baseline));
    render(<HookProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('api');
      expect(screen.getByTestId('hook-loading')).toHaveTextContent('idle');
      expect(screen.getByTestId('hook-error')).toHaveTextContent('none');
      expect(screen.getByTestId('hook-overall')).toHaveTextContent('healthy');
    });
  });

  it('falls back to fixture when API rejects with a generic error', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionSourceHealth').mockRejectedValueOnce(
      new Error('network down'),
    );
    render(<HookProbe scenario="missing_stayai_final_state" />);
    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('hook-error')).toHaveTextContent('network down');
      expect(screen.getByTestId('hook-permission-denied')).toHaveTextContent('allowed');
      expect(screen.getByTestId('hook-scenario')).toHaveTextContent('missing_stayai_final_state');
    });
  });

  it('marks state as permission denied for 403 responses', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionSourceHealth').mockRejectedValueOnce(
      new ApiClientError('forbidden', 403),
    );
    render(<HookProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('hook-permission-denied')).toHaveTextContent('denied');
    });
  });

  it('marks state as permission denied for 401 responses', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionSourceHealth').mockRejectedValueOnce(
      new ApiClientError('not authenticated', 401),
    );
    render(<HookProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('hook-permission-denied')).toHaveTextContent('denied');
    });
  });

  it('treats permission-keyword messages as denied even from generic errors', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionSourceHealth').mockRejectedValueOnce(
      new Error('Permission denied: source health scope'),
    );
    render(<HookProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('hook-permission-denied')).toHaveTextContent('denied');
    });
  });

  it('treats ApiClientError with non-permission status and unrelated message as not denied', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionSourceHealth').mockRejectedValueOnce(
      new ApiClientError('upstream timeout', 504),
    );
    render(<HookProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('hook-permission-denied')).toHaveTextContent('allowed');
    });
  });

  it('treats ApiClientError with non-permission status and empty message as not denied', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionSourceHealth').mockRejectedValueOnce(
      new ApiClientError('', 504),
    );
    render(<HookProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('hook-permission-denied')).toHaveTextContent('allowed');
    });
  });

  it('falls back to fixture when API returns the wrong shape', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionSourceHealth').mockResolvedValueOnce(
      { module: 'subscriptions' } as unknown as SubscriptionSourceHealthResponse,
    );
    render(<HookProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('hook-error')).toHaveTextContent(
        /subscription source health response shape mismatch/i,
      );
    });
  });

  it('falls back to fixture when sources field is not an array', async () => {
    const broken = clone(baseline);
    (broken as unknown as Record<string, unknown>).sources = 'not-an-array';
    vi.spyOn(dashboardApi, 'getSubscriptionSourceHealth').mockResolvedValueOnce(broken);
    render(<HookProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('hook-error')).toHaveTextContent(/shape mismatch/i);
    });
  });

  it('falls back to fixture when metadata is null', async () => {
    const broken = clone(baseline);
    (broken as unknown as Record<string, unknown>).metadata = null;
    vi.spyOn(dashboardApi, 'getSubscriptionSourceHealth').mockResolvedValueOnce(broken);
    render(<HookProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('fixture');
    });
  });

  it('falls back to fixture when generated_from_fixture is non-boolean', async () => {
    const broken = clone(baseline);
    (broken as unknown as Record<string, unknown>).generated_from_fixture = 'no';
    vi.spyOn(dashboardApi, 'getSubscriptionSourceHealth').mockResolvedValueOnce(broken);
    render(<HookProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('fixture');
    });
  });

  it('falls back to fixture when pending_or_unknown_final_outcome is non-boolean', async () => {
    const broken = clone(baseline);
    (broken as unknown as Record<string, unknown>).pending_or_unknown_final_outcome = 'no';
    vi.spyOn(dashboardApi, 'getSubscriptionSourceHealth').mockResolvedValueOnce(broken);
    render(<HookProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('fixture');
    });
  });

  it('coerces non-Error rejections into a string message', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionSourceHealth').mockRejectedValueOnce('boom');
    render(<HookProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('hook-error')).toHaveTextContent('boom');
    });
  });

  it('ignores late resolutions after unmount without throwing', async () => {
    let resolveResponse: () => void = () => {};
    const pending = new Promise<SubscriptionSourceHealthResponse>((resolve) => {
      resolveResponse = () => resolve(clone(baseline));
    });
    vi.spyOn(dashboardApi, 'getSubscriptionSourceHealth').mockReturnValueOnce(pending);
    const { unmount } = render(<HookProbe />);
    unmount();
    resolveResponse();
    await Promise.resolve();
    await Promise.resolve();
    expect(true).toBe(true);
  });

  it('ignores late rejections after unmount without throwing', async () => {
    let rejectResponse: (_reason?: unknown) => void = () => {};
    const pending = new Promise<SubscriptionSourceHealthResponse>((_resolve, reject) => {
      rejectResponse = (reason: unknown) => reject(reason);
    });
    vi.spyOn(dashboardApi, 'getSubscriptionSourceHealth').mockReturnValueOnce(pending);
    const { unmount } = render(<HookProbe />);
    unmount();
    rejectResponse(new Error('late failure'));
    await Promise.resolve();
    await Promise.resolve();
    expect(true).toBe(true);
  });

  it('falls back to fixture when a source entry has an unknown source_system', async () => {
    const broken = clone(baseline);
    broken.sources = broken.sources.map((source) =>
      source.source_system === 'shopify'
        ? ({ ...source, source_system: 'salesforce' } as unknown as typeof source)
        : source,
    );
    vi.spyOn(dashboardApi, 'getSubscriptionSourceHealth').mockResolvedValueOnce(broken);
    render(<HookProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('hook-error')).toHaveTextContent(/shape mismatch/i);
    });
  });

  it('falls back to fixture when a source entry omits a required key', async () => {
    const broken = clone(baseline);
    broken.sources = broken.sources.map((source) => {
      if (source.source_system !== 'portal') return source;
      const partial = { ...source } as Record<string, unknown>;
      delete partial.lineage_reference;
      return partial as unknown as typeof source;
    });
    vi.spyOn(dashboardApi, 'getSubscriptionSourceHealth').mockResolvedValueOnce(broken);
    render(<HookProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('hook-error')).toHaveTextContent(/shape mismatch/i);
    });
  });

  it('falls back to fixture when a numeric field is not a number on a source entry', async () => {
    const broken = clone(baseline);
    broken.sources = broken.sources.map((source) =>
      source.source_system === 'synthflow'
        ? ({ ...source, freshness_minutes: 'soon' } as unknown as typeof source)
        : source,
    );
    vi.spyOn(dashboardApi, 'getSubscriptionSourceHealth').mockResolvedValueOnce(broken);
    render(<HookProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('hook-error')).toHaveTextContent(/shape mismatch/i);
    });
  });

  it('falls back to fixture when missing_required_fields is not an array on a source entry', async () => {
    const broken = clone(baseline);
    broken.sources = broken.sources.map((source) =>
      source.source_system === 'stay_ai'
        ? ({ ...source, missing_required_fields: 'none' } as unknown as typeof source)
        : source,
    );
    vi.spyOn(dashboardApi, 'getSubscriptionSourceHealth').mockResolvedValueOnce(broken);
    render(<HookProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('hook-error')).toHaveTextContent(/shape mismatch/i);
    });
  });

  it('falls back to fixture when missing_required_fields contains a non-string entry', async () => {
    const broken = clone(baseline);
    broken.sources = broken.sources.map((source) =>
      source.source_system === 'shopify'
        ? ({ ...source, missing_required_fields: [42] } as unknown as typeof source)
        : source,
    );
    vi.spyOn(dashboardApi, 'getSubscriptionSourceHealth').mockResolvedValueOnce(broken);
    render(<HookProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('hook-error')).toHaveTextContent(/shape mismatch/i);
    });
  });

  it('falls back to fixture when a source entry is not a plain object', async () => {
    const broken = clone(baseline);
    (broken as unknown as Record<string, unknown>).sources = [null];
    vi.spyOn(dashboardApi, 'getSubscriptionSourceHealth').mockResolvedValueOnce(broken);
    render(<HookProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('hook-error')).toHaveTextContent(/shape mismatch/i);
    });
  });

  it('falls back to fixture when source_system is not a string on a source entry', async () => {
    const broken = clone(baseline);
    broken.sources = broken.sources.map((source, index) =>
      index === 0
        ? ({ ...source, source_system: 7 } as unknown as typeof source)
        : source,
    );
    vi.spyOn(dashboardApi, 'getSubscriptionSourceHealth').mockResolvedValueOnce(broken);
    render(<HookProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('hook-error')).toHaveTextContent(/shape mismatch/i);
    });
  });

  it('falls back to fixture when metadata omits a required string field', async () => {
    const broken = clone(baseline);
    delete (broken.metadata as Record<string, unknown>).fingerprint;
    vi.spyOn(dashboardApi, 'getSubscriptionSourceHealth').mockResolvedValueOnce(broken);
    render(<HookProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('hook-error')).toHaveTextContent(/shape mismatch/i);
    });
  });

  it('falls back to fixture when metadata audit_reference is not a string', async () => {
    const broken = clone(baseline);
    (broken.metadata as Record<string, unknown>).audit_reference = 42;
    vi.spyOn(dashboardApi, 'getSubscriptionSourceHealth').mockResolvedValueOnce(broken);
    render(<HookProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('hook-error')).toHaveTextContent(/shape mismatch/i);
    });
  });

  it('falls back to fixture when missing_required_fields key is omitted entirely', async () => {
    const broken = clone(baseline);
    broken.sources = broken.sources.map((source) => {
      if (source.source_system !== 'shopify') return source;
      const partial = { ...source } as Record<string, unknown>;
      delete partial.missing_required_fields;
      return partial as unknown as typeof source;
    });
    vi.spyOn(dashboardApi, 'getSubscriptionSourceHealth').mockResolvedValueOnce(broken);
    render(<HookProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('hook-error')).toHaveTextContent(/shape mismatch/i);
    });
  });

  it('falls back to fixture when source_authority_level is unknown', async () => {
    const broken = clone(baseline);
    broken.sources = broken.sources.map((source) =>
      source.source_system === 'stay_ai'
        ? ({ ...source, source_authority_level: 'super_authoritative' } as unknown as typeof source)
        : source,
    );
    vi.spyOn(dashboardApi, 'getSubscriptionSourceHealth').mockResolvedValueOnce(broken);
    render(<HookProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('hook-source')).toHaveTextContent('fixture');
      expect(screen.getByTestId('hook-error')).toHaveTextContent(/shape mismatch/i);
    });
  });
});

describe('source-health derivation helpers', () => {
  it('returns expected tones for every overall, freshness, quality, confirmation, conflict, trust bucket', () => {
    expect(overallHealthTone('healthy')).toBe('success');
    expect(overallHealthTone('warning')).toBe('warning');
    expect(overallHealthTone('degraded')).toBe('danger');
    expect(overallHealthTone('unknown')).toBe('neutral');

    expect(freshnessTone('fresh')).toBe('success');
    expect(freshnessTone('stale')).toBe('warning');
    expect(freshnessTone('unknown')).toBe('warning');

    expect(dataQualityTone('passing')).toBe('success');
    expect(dataQualityTone('warning')).toBe('warning');
    expect(dataQualityTone('failing')).toBe('danger');
    expect(dataQualityTone('unknown' as unknown as 'passing')).toBe('neutral');

    expect(confirmationTone('confirmed')).toBe('success');
    expect(confirmationTone('pending')).toBe('warning');
    expect(confirmationTone('missing')).toBe('danger');

    expect(conflictStatusTone('none')).toBe('success');
    expect(conflictStatusTone('pending')).toBe('warning');
    expect(conflictStatusTone('conflict_detected')).toBe('danger');
    expect(conflictStatusTone('unknown')).toBe('neutral');

    expect(trustLabelTone('high')).toBe('success');
    expect(trustLabelTone('medium')).toBe('warning');
    expect(trustLabelTone('low')).toBe('danger');
    expect(trustLabelTone('untrusted')).toBe('danger');
  });

  it('returns labels for every status enumeration', () => {
    expect(overallHealthLabel('healthy')).toMatch(/Healthy/);
    expect(overallHealthLabel('warning')).toMatch(/Warning/);
    expect(overallHealthLabel('degraded')).toMatch(/Degraded/);
    expect(overallHealthLabel('unknown')).toMatch(/Unknown/);

    expect(conflictStatusLabel('none')).toMatch(/No cross-source conflicts/);
    expect(conflictStatusLabel('pending')).toMatch(/Pending/);
    expect(conflictStatusLabel('conflict_detected')).toMatch(/Conflict detected/);
    expect(conflictStatusLabel('unknown')).toMatch(/unknown/i);

    expect(freshnessLabel('fresh')).toBe('Fresh');
    expect(freshnessLabel('stale')).toBe('Stale');
    expect(freshnessLabel('unknown')).toBe('Unknown');

    expect(dataQualityLabel('passing')).toBe('Passing');
    expect(dataQualityLabel('warning')).toBe('Warning');
    expect(dataQualityLabel('failing')).toBe('Failing');

    expect(confirmationLabel('confirmed')).toBe('Confirmed');
    expect(confirmationLabel('pending')).toBe('Pending');
    expect(confirmationLabel('missing')).toBe('Missing');

    expect(authorityLabel('authoritative_final_state')).toMatch(/Authoritative/);
    expect(authorityLabel('journey_event_authoritative')).toMatch(/Journey/);
    expect(authorityLabel('context_only')).toMatch(/Context/);
    expect(authorityLabel('completion_signal')).toMatch(/Completion/);
    expect(
      authorityLabel('not_a_real_authority' as unknown as 'authoritative_final_state'),
    ).toMatch(/Authority unknown/);
  });

  it('formats freshness durations into human strings', () => {
    expect(formatLastSeenRelative(0)).toMatch(/less than/);
    expect(formatLastSeenRelative(30)).toBe('30m ago');
    expect(formatLastSeenRelative(90)).toBe('1.5h ago');
    expect(formatLastSeenRelative(60 * 24 * 2)).toBe('2d ago');
    expect(formatLastSeenRelative(-1)).toBe('unknown');
    expect(formatLastSeenRelative(Number.NaN)).toBe('unknown');
  });
});

describe('deriveSourceHealthAlerts', () => {
  it('emits portal-pending and pending-final alerts for a baseline response when not loading', () => {
    const alerts = deriveSourceHealthAlerts(baseline, {
      error: null,
      permissionDenied: false,
      loading: false,
      source: 'api',
    });
    const ids = alerts.map((alert) => alert.id);
    expect(ids).toContain('portal_link_sent_completion_missing');
    expect(ids).not.toContain('missing_stay_ai_final');
    expect(ids).not.toContain('rbac_unavailable');
  });

  it('emits loading and rbac alerts when loading from fixture with an error', () => {
    const loadingAlerts = deriveSourceHealthAlerts(baseline, {
      error: 'network down',
      permissionDenied: false,
      loading: true,
      source: 'fixture',
    });
    const loadingIds = loadingAlerts.map((alert) => alert.id);
    expect(loadingIds).toContain('loading');
    expect(loadingIds).toContain('rbac_unavailable');

    const settled = deriveSourceHealthAlerts(baseline, {
      error: 'network down',
      permissionDenied: false,
      loading: false,
      source: 'fixture',
    });
    expect(settled.map((alert) => alert.id)).toContain('fixture_preview');
  });

  it('emits permission denied alert when explicitly permission denied', () => {
    const alerts = deriveSourceHealthAlerts(baseline, {
      error: 'Forbidden',
      permissionDenied: true,
      loading: false,
      source: 'fixture',
    });
    expect(alerts.some((alert) => alert.id === 'permission_denied')).toBe(true);
    expect(alerts.some((alert) => alert.id === 'rbac_unavailable')).toBe(false);
  });

  it('emits missing-stay-ai, stale, and pending-final alerts for the missing scenario', () => {
    const alerts = deriveSourceHealthAlerts(missingStayAi, {
      error: null,
      permissionDenied: false,
      loading: false,
      source: 'api',
    });
    const ids = alerts.map((alert) => alert.id);
    expect(ids).toContain('missing_stay_ai_final');
    expect(ids).toContain('stale_stay_ai');
    expect(ids).toContain('pending_or_unknown_final_outcome');
    expect(ids).toContain('context_only_without_stay_ai_final');
  });

  it('emits failing-quality alerts and synthflow incomplete alerts for the failing scenario', () => {
    const alerts = deriveSourceHealthAlerts(failingQuality, {
      error: null,
      permissionDenied: false,
      loading: false,
      source: 'api',
    });
    const ids = alerts.map((alert) => alert.id);
    expect(ids).toContain('quality_failing_synthflow');
    expect(ids).toContain('synthflow_journey_incomplete');
    expect(ids).toContain('missing_stay_ai_final');
  });

  it('emits per-source conflict alerts and overall conflict alert for the conflicting scenario', () => {
    const alerts = deriveSourceHealthAlerts(conflicts, {
      error: null,
      permissionDenied: false,
      loading: false,
      source: 'api',
    });
    const ids = alerts.map((alert) => alert.id);
    expect(ids).toContain('conflict_stay_ai');
    expect(ids).toContain('conflict_synthflow');
    expect(ids).toContain('conflict_shopify');
    expect(ids).toContain('conflict_status_overall');
  });

  it('emits a missing-source alert when a required source feed is omitted', () => {
    const data = clone(baseline);
    data.sources = data.sources.filter((source) => source.source_system !== 'portal');
    const alerts = deriveSourceHealthAlerts(data, {
      error: null,
      permissionDenied: false,
      loading: false,
      source: 'api',
    });
    expect(alerts.map((alert) => alert.id)).toContain('missing_source_portal');
  });

  it('emits unknown-freshness and synthflow-singular conflict copy when applicable', () => {
    const data = clone(baseline);
    data.sources = data.sources.map((source) =>
      source.source_system === 'synthflow'
        ? { ...source, freshness_status: 'unknown', conflict_count: 1 }
        : source,
    );
    const alerts = deriveSourceHealthAlerts(data, {
      error: null,
      permissionDenied: false,
      loading: false,
      source: 'api',
    });
    const synthflowConflict = alerts.find((alert) => alert.id === 'conflict_synthflow');
    expect(synthflowConflict?.title).toMatch(/1 conflict/);
    expect(synthflowConflict?.title).not.toMatch(/conflicts/);
    expect(alerts.map((alert) => alert.id)).toContain('unknown_freshness_synthflow');
  });

  it('uses fallback warnings when contract omits explicit warning copy', () => {
    const data = clone(missingStayAi);
    data.missing_stay_ai_final_state_warning = null;
    data.portal_completion_warning = null;
    const alerts = deriveSourceHealthAlerts(data, {
      error: null,
      permissionDenied: false,
      loading: false,
      source: 'api',
    });
    const missing = alerts.find((alert) => alert.id === 'missing_stay_ai_final');
    const portal = alerts.find(
      (alert) => alert.id === 'portal_link_sent_completion_missing',
    );
    expect(missing?.detail).toMatch(/pending or unknown/i);
    expect(portal?.detail).toMatch(/Portal completion/i);
  });

  it('falls back to generic failing-quality copy when no missing_required_fields present', () => {
    const data = clone(baseline);
    data.sources = data.sources.map((source) =>
      source.source_system === 'shopify'
        ? { ...source, data_quality_status: 'failing', missing_required_fields: [] }
        : source,
    );
    const alerts = deriveSourceHealthAlerts(data, {
      error: null,
      permissionDenied: false,
      loading: false,
      source: 'api',
    });
    const shopifyFailing = alerts.find((alert) => alert.id === 'quality_failing_shopify');
    expect(shopifyFailing?.detail).toMatch(/Data quality checks are failing/);
  });

  it('does not emit fixture-preview alert for an api response with no error and no fixture flag', () => {
    const data = clone(baseline);
    data.generated_from_fixture = false;
    const alerts = deriveSourceHealthAlerts(data, {
      error: null,
      permissionDenied: false,
      loading: false,
      source: 'api',
    });
    expect(alerts.some((alert) => alert.id === 'fixture_preview')).toBe(false);
  });
});

describe('activeVisualStates', () => {
  it('lists fresh, portal-pending, context-only-available for baseline', () => {
    const states = activeVisualStates(baseline);
    expect(states).toContain('fresh');
    expect(states).toContain('pending_source_confirmation');
    expect(states).toContain('portal_link_sent_completion_missing');
    expect(states).toContain('context_only_available');
    expect(states).not.toContain('stale');
    expect(states).not.toContain('missing_source');
  });

  it('lists stale, missing-stay-ai, and pending states for the missing scenario', () => {
    const states = activeVisualStates(missingStayAi);
    expect(states).toContain('stale');
    expect(states).toContain('missing_stay_ai_final');
    expect(states).toContain('pending_source_confirmation');
  });

  it('lists conflict-detected and synthflow-incomplete for conflicts and failing scenarios', () => {
    expect(activeVisualStates(conflicts)).toContain('conflict_detected');
    expect(activeVisualStates(failingQuality)).toContain('synthflow_journey_incomplete');
  });

  it('lists missing_source when a required source is dropped from the contract response', () => {
    const data = clone(baseline);
    data.sources = data.sources.filter((source) => source.source_system !== 'shopify');
    const states = activeVisualStates(data);
    expect(states).toContain('missing_source');
  });

  it('lists unknown_freshness when a source freshness is unknown', () => {
    const data = clone(baseline);
    data.sources = data.sources.map((source) =>
      source.source_system === 'shopify'
        ? { ...source, freshness_status: 'unknown' }
        : source,
    );
    expect(activeVisualStates(data)).toContain('unknown_freshness');
  });
});

describe('SourceHealthOverviewBar', () => {
  it('renders overall health, conflict status, and final-confirmed badge for healthy baseline', () => {
    const data = { ...baseline, generated_from_fixture: false };
    render(<SourceHealthOverviewBar data={data} />);
    expect(screen.getByTestId('source-health-overview-bar')).toBeInTheDocument();
    expect(screen.getByText(/Overall: Healthy/i)).toBeInTheDocument();
    expect(screen.getByTestId('source-health-overview-final-confirmed')).toBeInTheDocument();
    expect(
      screen.queryByTestId('source-health-overview-fixture-tag'),
    ).not.toBeInTheDocument();
  });

  it('renders pending-final badge and fixture badge for missing scenario fixture', () => {
    render(<SourceHealthOverviewBar data={missingStayAi} />);
    expect(screen.getByTestId('source-health-overview-pending-final')).toBeInTheDocument();
    expect(screen.getByTestId('source-health-overview-fixture-tag')).toBeInTheDocument();
  });
});

describe('SourceHealthAlertsPanel', () => {
  it('renders the empty-state confirmation message when no alerts are active', () => {
    render(<SourceHealthAlertsPanel alerts={[]} />);
    expect(
      screen.getByText(/All Stay.ai-controlled source-health checks are clear/i),
    ).toBeInTheDocument();
  });

  it('renders an alert per row with stable test ids for every level', () => {
    render(
      <SourceHealthAlertsPanel
        alerts={[
          { id: 'info-row', level: 'info', title: 'Info row', detail: 'just info' },
          { id: 'warn-row', level: 'warning', title: 'Warn row', detail: 'careful' },
          { id: 'danger-row', level: 'danger', title: 'Danger row', detail: 'blocked' },
        ]}
      />,
    );
    expect(screen.getByTestId('source-health-alert-info-row')).toBeInTheDocument();
    expect(screen.getByTestId('source-health-alert-warn-row')).toBeInTheDocument();
    expect(screen.getByTestId('source-health-alert-danger-row')).toBeInTheDocument();
  });
});

describe('SourceHealthCard', () => {
  it('renders Stay.ai card with final-truth badge and no missing-fields callout', () => {
    const stayAi = baseline.sources.find((source) => source.source_system === 'stay_ai')!;
    render(<SourceHealthCard source={stayAi} />);
    expect(screen.getByTestId('source-health-card-stay_ai')).toBeInTheDocument();
    expect(
      screen.getByTestId('source-health-card-stay_ai-final-truth-badge'),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId('source-health-card-stay_ai-missing-fields'),
    ).not.toBeInTheDocument();
  });

  it('renders Shopify card with non-final badge and context-only authority', () => {
    const shopify = baseline.sources.find((source) => source.source_system === 'shopify')!;
    render(<SourceHealthCard source={shopify} />);
    expect(
      screen.getByTestId('source-health-card-shopify-non-final-badge'),
    ).toBeInTheDocument();
    expect(
      within(screen.getByTestId('source-health-card-shopify-authority')).getByText(/Context/i),
    ).toBeInTheDocument();
  });

  it('renders Portal card with missing-fields callout and pending confirmation', () => {
    const portal = baseline.sources.find((source) => source.source_system === 'portal')!;
    render(<SourceHealthCard source={portal} />);
    expect(
      screen.getByTestId('source-health-card-portal-missing-fields'),
    ).toHaveTextContent(/confirmed_completion_event_id/);
    expect(
      within(screen.getByTestId('source-health-card-portal-confirmation')).getByText(
        /Pending/i,
      ),
    ).toBeInTheDocument();
  });

  it('renders conflict warning tone when conflict_count is greater than zero', () => {
    const stayAiConflict = conflicts.sources.find(
      (source) => source.source_system === 'stay_ai',
    )!;
    render(<SourceHealthCard source={stayAiConflict} />);
    expect(
      screen.getByTestId('source-health-card-stay_ai-conflicts'),
    ).toHaveTextContent(/Stay.ai authority preserved/);
  });
});

describe('FreshnessStateLegend', () => {
  it('marks active states differently from inactive states', () => {
    render(<FreshnessStateLegend activeStates={['fresh', 'pending_source_confirmation']} />);
    SOURCE_VISUAL_STATE_LIBRARY.forEach((meta) => {
      const node = screen.getByTestId(`freshness-state-${meta.id}`);
      const expected =
        meta.id === 'fresh' || meta.id === 'pending_source_confirmation' ? 'true' : 'false';
      expect(node).toHaveAttribute('data-active', expected);
    });
    expect(screen.getByTestId('freshness-state-legend-active-count')).toHaveTextContent('2 active');
  });

  it('keeps legend tones consistent with the card-level freshness/quality tone helpers', () => {
    // Regression guard for Bugbot Medium (PR #18 r3183212901): the legend tone for
    // 'stale' and 'unknown_freshness' must match the card-level freshnessTone helper so
    // operators can correlate card colors with legend entries.
    const staleMeta = SOURCE_VISUAL_STATE_LIBRARY.find((meta) => meta.id === 'stale');
    const unknownMeta = SOURCE_VISUAL_STATE_LIBRARY.find(
      (meta) => meta.id === 'unknown_freshness',
    );
    const freshMeta = SOURCE_VISUAL_STATE_LIBRARY.find((meta) => meta.id === 'fresh');
    expect(staleMeta?.tone).toBe(freshnessTone('stale'));
    expect(unknownMeta?.tone).toBe(freshnessTone('unknown'));
    expect(freshMeta?.tone).toBe(freshnessTone('fresh'));
  });
});

describe('LineageConflictPanel', () => {
  it('renders one row per source with finalize/cannot-finalize badges and warnings for missing scenario', () => {
    render(<LineageConflictPanel data={missingStayAi} />);
    expect(screen.getByTestId('lineage-conflict-panel')).toBeInTheDocument();
    expect(screen.getByTestId('lineage-row-stay_ai-can-finalize')).toBeInTheDocument();
    expect(screen.getByTestId('lineage-row-shopify-cannot-finalize')).toBeInTheDocument();
    expect(screen.getByTestId('lineage-conflict-panel-missing-stay-ai')).toHaveTextContent(
      /pending or unknown/i,
    );
    expect(screen.getByTestId('lineage-conflict-panel-portal-warning')).toBeInTheDocument();
    expect(screen.getByTestId('lineage-conflict-panel-shopify-warning')).toBeInTheDocument();
  });

  it('renders conflict notes per source when conflict_count is greater than zero', () => {
    render(<LineageConflictPanel data={conflicts} />);
    expect(
      screen.getByTestId('lineage-row-stay_ai-conflict-note'),
    ).toHaveTextContent(/2 cross-source conflicts/);
    expect(
      screen.getByTestId('lineage-row-shopify-conflict-note'),
    ).toHaveTextContent(/1 cross-source conflict/);
  });

  it('omits portal and stay-ai warning blocks when contract returns nulls', () => {
    const data = clone(baseline);
    data.portal_completion_warning = null;
    data.missing_stay_ai_final_state_warning = null;
    render(<LineageConflictPanel data={data} />);
    expect(
      screen.queryByTestId('lineage-conflict-panel-portal-warning'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('lineage-conflict-panel-missing-stay-ai'),
    ).not.toBeInTheDocument();
  });
});

describe('SourceHealthView integration', () => {
  it('renders fixture preview status bar and key sections by default', async () => {
    render(<SourceHealthView />);
    await waitFor(() => {
      expect(screen.getByTestId('source-health-view')).toBeInTheDocument();
      expect(screen.getByTestId('source-health-overview-bar')).toBeInTheDocument();
      expect(screen.getByTestId('source-health-card-grid')).toBeInTheDocument();
      expect(screen.getByTestId('source-health-card-stay_ai')).toBeInTheDocument();
      expect(screen.getByTestId('source-health-card-synthflow')).toBeInTheDocument();
      expect(screen.getByTestId('source-health-card-shopify')).toBeInTheDocument();
      expect(screen.getByTestId('source-health-card-portal')).toBeInTheDocument();
      expect(screen.getByTestId('freshness-state-legend')).toBeInTheDocument();
      expect(screen.getByTestId('lineage-conflict-panel')).toBeInTheDocument();
      expect(
        within(screen.getByTestId('source-health-status-bar')).getByText(
          /Contract preview from fixture/i,
        ),
      ).toBeInTheDocument();
    });
  });

  it('switches scenario on click and re-derives contract state', async () => {
    render(<SourceHealthView />);
    await waitFor(() => {
      expect(screen.getByText(/Overall: Healthy/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('source-health-scenario-missing_stayai_final_state'));
    await waitFor(() => {
      expect(screen.getByText(/Overall: Warning/i)).toBeInTheDocument();
      expect(
        screen.getByTestId('source-health-alert-missing_stay_ai_final'),
      ).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('source-health-scenario-conflicting_sources'));
    await waitFor(() => {
      expect(
        screen.getByTestId('source-health-alert-conflict_status_overall'),
      ).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('source-health-scenario-failing_quality_with_missing_stayai'));
    await waitFor(() => {
      expect(
        screen.getByTestId('source-health-alert-quality_failing_synthflow'),
      ).toBeInTheDocument();
    });
  });

  it('shows the live API status bar when getSubscriptionSourceHealth resolves with valid data', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionSourceHealth').mockResolvedValue(clone(baseline));
    render(<SourceHealthView />);
    await waitFor(() => {
      expect(screen.getByText(/Live API contract loaded/i)).toBeInTheDocument();
    });
  });

  it('renders the loading status bar while the API call is pending', () => {
    vi.spyOn(dashboardApi, 'getSubscriptionSourceHealth').mockImplementation(
      () => new Promise(() => {}),
    );
    render(<SourceHealthView />);
    expect(
      within(screen.getByTestId('source-health-status-bar')).getByText(
        /Loading source-health contract/i,
      ),
    ).toBeInTheDocument();
  });

  it('renders the permission-denied status bar when a 403 surfaces', async () => {
    vi.spyOn(dashboardApi, 'getSubscriptionSourceHealth').mockRejectedValue(
      new ApiClientError('forbidden', 403),
    );
    render(<SourceHealthView />);
    await waitFor(() => {
      expect(screen.getByText(/Permission denied by server/i)).toBeInTheDocument();
      expect(screen.getByTestId('source-health-alert-permission_denied')).toBeInTheDocument();
    });
  });
});

describe('SubscriptionAnalyticsPage routing with source-health view', () => {
  it('mounts the source-health section above the subscription analytics view', async () => {
    render(
      <MemoryRouter initialEntries={['/subscriptions']}>
        <App />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('source-health-view')).toBeInTheDocument();
      expect(screen.getByTestId('subscription-final-state-banner')).toBeInTheDocument();
    });
  });
});

describe('SOURCE_SYSTEM_COPY metadata', () => {
  it('marks Stay.ai as final subscription truth and others as not', () => {
    expect(SOURCE_SYSTEM_COPY.stay_ai.authority.finalSubscriptionTruth).toBe(true);
    expect(SOURCE_SYSTEM_COPY.synthflow.authority.finalSubscriptionTruth).toBe(false);
    expect(SOURCE_SYSTEM_COPY.shopify.authority.finalSubscriptionTruth).toBe(false);
    expect(SOURCE_SYSTEM_COPY.portal.authority.finalSubscriptionTruth).toBe(false);
  });
});
