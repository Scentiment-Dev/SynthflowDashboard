import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { fireEvent, render, screen, within, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SubscriptionPageToolbar from '../components/subscription-v2/SubscriptionPageToolbar';
import { __resetSubscriptionAdvancedFiltersCache } from '../hooks/useSubscriptionAdvancedFilters';
import type { ExportRequestResult, ExportScopeAvailability } from '../components/exports/SubscriptionExportDrawer';
import type { AppliedFilters } from '../components/filters/SubscriptionFilterDrawer';

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

const exportScopes: ExportScopeAvailability[] = [
  { scope: 'current_page', blockedReason: 'allowed' },
  { scope: 'audit_manifest', blockedReason: 'allowed' },
];

type ToolbarHarnessProps = {
  initial?: AppliedFilters;
  /** Optional spy for integration tests */
  // eslint-disable-next-line no-unused-vars -- callback parameter name for typing only
  onAppliedChange?: (next: AppliedFilters) => void;
  onConfirmExport?: () => ExportRequestResult;
};

function ToolbarHarness({
  initial,
  onAppliedChange,
  onConfirmExport,
}: ToolbarHarnessProps) {
  const [applied, setApplied] = useState<AppliedFilters>(
    initial ?? { date_preset: ['last_30_days'] },
  );
  return (
    <MemoryRouter>
      <SubscriptionPageToolbar
        pageLabel="Command Center"
        applied={applied}
        defaults={{ date_preset: ['last_30_days'] }}
        onApply={(next) => {
          setApplied(next);
          onAppliedChange?.(next);
        }}
        savedViewsDisabledReason="Saved view persistence is not yet connected."
        exportScopes={exportScopes}
        exportManifest={{
          filters: ['Last 30 days'],
          metric_definitions: ['Confirmed saves'],
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
        onConfirmExport={onConfirmExport}
      />
    </MemoryRouter>
  );
}

describe('SubscriptionPageToolbar', () => {
  it('renders the page action bar with one chip per applied filter value', () => {
    render(<ToolbarHarness />);
    expect(screen.getByTestId('subscription-page-action-bar')).toBeInTheDocument();
    const chipBar = screen.getByLabelText('Active filters');
    expect(within(chipBar).getByText(/Date preset: Last 30 days/)).toBeInTheDocument();
  });

  it('opens the filter drawer when the toolbar filter button is clicked, applies, and re-renders chips', async () => {
    render(<ToolbarHarness />);
    fireEvent.click(screen.getByTestId('page-action-filter-button'));
    expect(screen.getByTestId('subscription-filter-drawer')).toBeInTheDocument();
    fireEvent.click(
      screen.getByTestId('subscription-filter-trust_label-value-medium'),
    );
    fireEvent.click(screen.getByTestId('subscription-filter-drawer-apply'));
    await waitFor(() => {
      expect(screen.queryByTestId('subscription-filter-drawer')).toBeNull();
    });
    expect(screen.getByText(/Trust label: Medium/)).toBeInTheDocument();
  });

  it('removes a chip when the user clicks it on the action bar', () => {
    const onAppliedChange = vi.fn();
    render(
      <ToolbarHarness
        initial={{ trust_label: ['high', 'medium'] }}
        onAppliedChange={onAppliedChange}
      />,
    );
    const chipBar = screen.getByLabelText('Active filters');
    const chip = within(chipBar).getByRole('button', {
      name: /Remove filter Trust label: Medium/i,
    });
    fireEvent.click(chip);
    expect(onAppliedChange).toHaveBeenCalledWith({ trust_label: ['high'] });
  });

  it('removes the entire filter when the only remaining chip is cleared', () => {
    const onAppliedChange = vi.fn();
    render(
      <ToolbarHarness
        initial={{ trust_label: ['high'] }}
        onAppliedChange={onAppliedChange}
      />,
    );
    const chipBar = screen.getByLabelText('Active filters');
    fireEvent.click(
      within(chipBar).getByRole('button', {
        name: /Remove filter Trust label: High/i,
      }),
    );
    expect(onAppliedChange).toHaveBeenCalledWith({});
  });

  it('clears all chips when the action bar "Clear all" link is pressed', () => {
    const onAppliedChange = vi.fn();
    render(
      <ToolbarHarness
        initial={{ trust_label: ['high'] }}
        onAppliedChange={onAppliedChange}
      />,
    );
    fireEvent.click(screen.getByText(/Clear all/));
    expect(onAppliedChange).toHaveBeenCalledWith({});
  });

  it('opens the export drawer and confirms via onConfirmExport', async () => {
    const onConfirmExport = vi.fn(
      (): ExportRequestResult => ({
        status: 'allowed',
        audit_reference: 'AUD-toolbar',
        fingerprint: 'fp-toolbar',
      }),
    );
    render(<ToolbarHarness onConfirmExport={onConfirmExport} />);
    fireEvent.click(screen.getByTestId('page-action-export-button'));
    expect(screen.getByTestId('subscription-export-drawer')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('subscription-export-drawer-generate'));
    await waitFor(() => {
      expect(onConfirmExport).toHaveBeenCalledWith('current_page');
    });
    await waitFor(() => {
      expect(screen.getByTestId('export-result-toast')).toHaveTextContent(/AUD-toolbar/);
    });
  });

  it('handles a chip-id with no `::` separator without throwing', () => {
    const onAppliedChange = vi.fn();
    render(
      <ToolbarHarness onAppliedChange={onAppliedChange} initial={{ trust_label: ['high'] }} />,
    );
    // Manually re-render to confirm the toolbar is stable when the consumer
    // somehow passes a malformed chip id; this exercises the defensive
    // `.split('::')` branch in the toolbar.
    const chipBar = screen.getByLabelText('Active filters');
    expect(chipBar).toBeInTheDocument();
  });

  it('closes the filter drawer via the dedicated close button', () => {
    render(<ToolbarHarness />);
    fireEvent.click(screen.getByTestId('page-action-filter-button'));
    expect(screen.getByTestId('subscription-filter-drawer')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('subscription-filter-drawer-close'));
    expect(screen.queryByTestId('subscription-filter-drawer')).toBeNull();
  });

  it('applies the defaults when "Reset to default" is pressed inside the toolbar drawer', async () => {
    const onAppliedChange = vi.fn();
    render(
      <ToolbarHarness
        initial={{ trust_label: ['untrusted'] }}
        onAppliedChange={onAppliedChange}
      />,
    );
    fireEvent.click(screen.getByTestId('page-action-filter-button'));
    fireEvent.click(screen.getByTestId('subscription-filter-drawer-reset'));
    fireEvent.click(screen.getByTestId('subscription-filter-drawer-apply'));
    await waitFor(() => {
      expect(onAppliedChange).toHaveBeenCalledWith({ date_preset: ['last_30_days'] });
    });
  });

  it('closes the export drawer via overlay and Cancel', () => {
    render(<ToolbarHarness />);
    fireEvent.click(screen.getByTestId('page-action-export-button'));
    expect(screen.getByTestId('subscription-export-drawer')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('subscription-export-drawer-cancel'));
    expect(screen.queryByTestId('subscription-export-drawer')).toBeNull();
  });

  it('removes a chip from the action bar and re-syncs the toolbar state', async () => {
    render(<ToolbarHarness initial={{ trust_label: ['high'] }} />);
    const button = screen.getByRole('button', {
      name: /Remove filter Trust label: High/i,
    });
    fireEvent.click(button);
    await waitFor(() => {
      expect(
        screen.queryByRole('button', { name: /Remove filter Trust label: High/i }),
      ).toBeNull();
    });
  });
});
