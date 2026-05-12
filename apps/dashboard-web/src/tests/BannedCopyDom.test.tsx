import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useState } from 'react';
import {
  BANNED_USER_FACING_STRINGS,
  scanForBannedStrings,
} from '../lib/plainLanguageCopy';
import SubscriptionFilterDrawer, {
  type AppliedFilters,
} from '../components/filters/SubscriptionFilterDrawer';
import SubscriptionExportDrawer from '../components/exports/SubscriptionExportDrawer';
import SubscriptionPageToolbar from '../components/subscription-v2/SubscriptionPageToolbar';
import { SUBSCRIPTION_ADVANCED_FILTERS_FIXTURE } from '../data/subscriptionAdvancedFiltersFixtures';
import { __resetSubscriptionAdvancedFiltersCache } from '../hooks/useSubscriptionAdvancedFilters';
import type { SubscriptionAdvancedFilterApiState } from '../types/subscriptionFilters';
import type { ExportScopeAvailability } from '../components/exports/SubscriptionExportDrawer';

beforeEach(() => {
  __resetSubscriptionAdvancedFiltersCache();
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: vi.fn().mockResolvedValue({}),
    }),
  );
});

afterEach(() => {
  __resetSubscriptionAdvancedFiltersCache();
  vi.unstubAllGlobals();
});

const filterState: SubscriptionAdvancedFilterApiState = {
  data: SUBSCRIPTION_ADVANCED_FILTERS_FIXTURE,
  loading: false,
  error: null,
  source: 'fixture',
  permissionDenied: false,
};

const exportScopes: ExportScopeAvailability[] = [
  { scope: 'current_page', blockedReason: 'allowed' },
  { scope: 'audit_manifest', blockedReason: 'allowed' },
  { scope: 'selected_rows', blockedReason: 'no_rows_selected' },
];

function ToolbarHarness() {
  const [applied, setApplied] = useState<AppliedFilters>({ date_preset: ['last_30_days'] });
  return (
    <MemoryRouter>
      <SubscriptionPageToolbar
        pageLabel="Command Center"
        applied={applied}
        defaults={{ date_preset: ['last_30_days'] }}
        onApply={setApplied}
        savedViewsDisabledReason="Saved view persistence is not yet connected."
        exportScopes={exportScopes}
        exportManifest={{
          filters: ['Last 30 days'],
          metric_definitions: ['Confirmed saves divided by retention attempts'],
          trust_labels: ['high'],
          freshness: 'fresh',
          formula_versions: ['v1.0.0'],
          owner: 'analytics',
          timestamp: '2026-05-06T12:00:00Z',
          fingerprint: 'fp-abc',
          audit_reference: 'AUD-1',
          requester_role: 'support_agent',
          permission_decision: 'allow',
          source_confirmation_status: 'confirmed',
          included_widgets: ['KPI strip'],
          excluded_widgets: [],
        }}
      />
    </MemoryRouter>
  );
}

describe('Cycle 008 banned-string scan — Agent C reusable surfaces', () => {
  it('keeps banned engineering vocabulary out of the rendered Filter Drawer DOM', () => {
    const { container } = render(
      <SubscriptionFilterDrawer
        open
        onClose={() => {}}
        state={filterState}
        applied={{}}
        onApply={() => {}}
        savedViewsDisabledReason="Saved view persistence is not yet connected."
      />,
    );
    const text = (container.textContent ?? '').toLowerCase();
    const hits = scanForBannedStrings(text);
    expect(hits, `banned strings appeared in filter drawer: ${JSON.stringify(hits)}`).toEqual([]);
  });

  it('keeps banned engineering vocabulary out of the rendered Export Drawer DOM', () => {
    const { container } = render(
      <SubscriptionExportDrawer
        open
        onClose={() => {}}
        pageLabel="Command Center"
        scopes={exportScopes}
        manifest={{
          filters: ['Last 30 days'],
          metric_definitions: ['Confirmed saves divided by retention attempts'],
          trust_labels: ['high'],
          freshness: 'fresh',
          formula_versions: ['v1.0.0'],
          owner: 'analytics',
          timestamp: '2026-05-06T12:00:00Z',
          fingerprint: 'fp-abc',
          audit_reference: 'AUD-1',
          requester_role: 'support_agent',
          permission_decision: 'allow',
          source_confirmation_status: 'confirmed',
          included_widgets: ['KPI strip'],
          excluded_widgets: [],
        }}
      />,
    );
    const text = (container.textContent ?? '').toLowerCase();
    const hits = scanForBannedStrings(text);
    expect(hits, `banned strings appeared in export drawer: ${JSON.stringify(hits)}`).toEqual([]);
  });

  it('keeps banned engineering vocabulary out of the SubscriptionPageToolbar DOM', () => {
    const { container } = render(<ToolbarHarness />);
    const text = (container.textContent ?? '').toLowerCase();
    const hits = scanForBannedStrings(text);
    expect(hits, `banned strings appeared in toolbar: ${JSON.stringify(hits)}`).toEqual([]);
  });

  it('confirms the banned-string list is non-empty so the scanner cannot silently no-op', () => {
    expect(BANNED_USER_FACING_STRINGS.length).toBeGreaterThan(5);
  });
});
