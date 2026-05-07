import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SubscriptionExportDrawer, {
  type ExportManifestPreview,
  type ExportRequestResult,
  type ExportScopeAvailability,
} from '../components/exports/SubscriptionExportDrawer';

const baseManifest: ExportManifestPreview = {
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
};

const allowedScopes: ExportScopeAvailability[] = [
  { scope: 'current_page', blockedReason: 'allowed' },
  { scope: 'audit_manifest', blockedReason: 'allowed' },
  { scope: 'selected_rows', blockedReason: 'no_rows_selected' },
];

describe('SubscriptionExportDrawer', () => {
  it('does not render when closed', () => {
    render(
      <SubscriptionExportDrawer
        open={false}
        onClose={() => {}}
        pageLabel="Command Center"
        scopes={allowedScopes}
        manifest={baseManifest}
      />,
    );
    expect(screen.queryByTestId('subscription-export-drawer')).toBeNull();
  });

  it('renders every export scope with an Available / Blocked chip and shows the blocked reason inline', () => {
    render(
      <SubscriptionExportDrawer
        open
        onClose={() => {}}
        pageLabel="Command Center"
        scopes={allowedScopes}
        manifest={baseManifest}
      />,
    );
    expect(screen.getByTestId('subscription-export-drawer')).toBeInTheDocument();
    expect(screen.getByText('Export this view')).toBeInTheDocument();
    expect(screen.getByText('Command Center')).toBeInTheDocument();
    expect(screen.getByTestId('export-scope-current_page')).toHaveAttribute(
      'data-blocked',
      'false',
    );
    expect(screen.getByTestId('export-scope-selected_rows')).toHaveAttribute(
      'data-blocked',
      'true',
    );
    expect(screen.getByTestId('export-scope-selected_rows-reason')).toHaveTextContent(
      /at least one row/,
    );
  });

  it('always shows the manifest preview with every documented field', () => {
    render(
      <SubscriptionExportDrawer
        open
        onClose={() => {}}
        pageLabel="Command Center"
        scopes={allowedScopes}
        manifest={baseManifest}
      />,
    );
    const preview = screen.getByTestId('export-manifest-preview');
    expect(preview).toBeInTheDocument();
    expect(screen.getByTestId('export-manifest-field-filters')).toHaveTextContent(/Last 30 days/);
    expect(screen.getByTestId('export-manifest-field-metric_definitions')).toHaveTextContent(
      /Confirmed saves/,
    );
    expect(screen.getByTestId('export-manifest-field-trust_labels')).toHaveTextContent(/high/);
    expect(screen.getByTestId('export-manifest-field-fingerprint')).toHaveTextContent(/fp-abc/);
    expect(screen.getByTestId('export-manifest-field-audit_reference')).toHaveTextContent(
      /AUD-1/,
    );
    expect(screen.getByTestId('export-manifest-field-excluded_widgets')).toHaveTextContent(/—/);
  });

  it('disables the generate button and renders the blocked-callout when only blocked scopes exist', () => {
    const blockedOnly: ExportScopeAvailability[] = [
      { scope: 'current_page', blockedReason: 'permission' },
      { scope: 'selected_rows', blockedReason: 'no_rows_selected' },
    ];
    render(
      <SubscriptionExportDrawer
        open
        onClose={() => {}}
        pageLabel="Command Center"
        scopes={blockedOnly}
        manifest={baseManifest}
        defaultScope="current_page"
      />,
    );
    expect(screen.getByTestId('export-blocked-callout')).toHaveTextContent(
      /Your role doesn't allow this export/,
    );
    expect(screen.getByTestId('subscription-export-drawer-generate')).toBeDisabled();
  });

  it('renders the success result toast with the audit reference and fingerprint after a confirmed export', async () => {
    const onConfirm = vi.fn(
      (): ExportRequestResult => ({
        status: 'allowed',
        audit_reference: 'AUD-9',
        fingerprint: 'fp-success',
      }),
    );
    render(
      <SubscriptionExportDrawer
        open
        onClose={() => {}}
        pageLabel="Command Center"
        scopes={allowedScopes}
        manifest={baseManifest}
        onConfirm={onConfirm}
      />,
    );
    fireEvent.click(screen.getByTestId('subscription-export-drawer-generate'));
    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledWith('current_page');
    });
    expect(screen.getByTestId('export-result-toast')).toHaveTextContent(/Export ready\./);
    expect(screen.getByTestId('export-result-toast')).toHaveTextContent(/AUD-9/);
    expect(screen.getByTestId('export-result-toast')).toHaveTextContent(/fp-success/);
  });

  it('renders the pending result toast with the audit-reference next-step copy', async () => {
    const onConfirm = vi.fn(
      (): ExportRequestResult => ({
        status: 'pending',
        audit_reference: 'AUD-pending',
      }),
    );
    render(
      <SubscriptionExportDrawer
        open
        onClose={() => {}}
        pageLabel="Command Center"
        scopes={allowedScopes}
        manifest={baseManifest}
        onConfirm={onConfirm}
      />,
    );
    fireEvent.click(screen.getByTestId('subscription-export-drawer-generate'));
    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalled();
    });
    expect(screen.getByTestId('export-result-toast')).toHaveTextContent(/audit reference/i);
  });

  it('renders the blocked result toast when the backend rejects with a blocked-reason payload', async () => {
    const onConfirm = vi.fn(
      (): Promise<ExportRequestResult> =>
        Promise.resolve({ status: 'blocked', blockedReason: 'manifest_mismatch' }),
    );
    render(
      <SubscriptionExportDrawer
        open
        onClose={() => {}}
        pageLabel="Command Center"
        scopes={allowedScopes}
        manifest={baseManifest}
        onConfirm={onConfirm}
      />,
    );
    fireEvent.click(screen.getByTestId('subscription-export-drawer-generate'));
    await waitFor(() => {
      expect(screen.getByTestId('export-result-toast')).toBeInTheDocument();
    });
    expect(screen.getByTestId('export-result-toast')).toHaveTextContent(/metric definition has changed/i);
  });

  it('shows the fallback blocked toast when the backend rejects without a specific reason', async () => {
    const onConfirm = vi.fn(
      (): Promise<ExportRequestResult> => Promise.resolve({ status: 'blocked' }),
    );
    render(
      <SubscriptionExportDrawer
        open
        onClose={() => {}}
        pageLabel="Command Center"
        scopes={allowedScopes}
        manifest={baseManifest}
        onConfirm={onConfirm}
      />,
    );
    fireEvent.click(screen.getByTestId('subscription-export-drawer-generate'));
    await waitFor(() => {
      expect(screen.getByTestId('export-result-toast')).toBeInTheDocument();
    });
    expect(screen.getByTestId('export-result-toast')).toHaveTextContent(/Refresh and try again/);
  });

  it('honours the defaultScope prop and lets the user re-select via radio inputs', async () => {
    const onConfirm = vi.fn(
      (): ExportRequestResult => ({ status: 'allowed', audit_reference: 'A' }),
    );
    render(
      <SubscriptionExportDrawer
        open
        onClose={() => {}}
        pageLabel="Command Center"
        scopes={allowedScopes}
        manifest={baseManifest}
        defaultScope="audit_manifest"
        onConfirm={onConfirm}
      />,
    );
    expect(
      (screen.getByTestId('export-scope-audit_manifest-input') as HTMLInputElement).checked,
    ).toBe(true);
    fireEvent.click(screen.getByTestId('export-scope-current_page-input'));
    fireEvent.click(screen.getByTestId('subscription-export-drawer-generate'));
    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledWith('current_page');
    });
  });

  it('closes via overlay, cancel, close button, and Escape', () => {
    const onClose = vi.fn();
    render(
      <SubscriptionExportDrawer
        open
        onClose={onClose}
        pageLabel="Command Center"
        scopes={allowedScopes}
        manifest={baseManifest}
      />,
    );
    fireEvent.click(screen.getByTestId('subscription-export-drawer-overlay'));
    fireEvent.click(screen.getByTestId('subscription-export-drawer-close'));
    fireEvent.click(screen.getByTestId('subscription-export-drawer-cancel'));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(4);
  });

  it('falls back to the first listed scope when nothing is allowed and no defaultScope', () => {
    render(
      <SubscriptionExportDrawer
        open
        onClose={() => {}}
        pageLabel="Command Center"
        scopes={[{ scope: 'filtered_csv', blockedReason: 'backend_not_connected' }]}
        manifest={baseManifest}
      />,
    );
    expect(
      (screen.getByTestId('export-scope-filtered_csv-input') as HTMLInputElement).checked,
    ).toBe(true);
    expect(screen.getByTestId('export-blocked-callout')).toBeInTheDocument();
  });

  it('renders success toast without audit reference lines when the backend omits them', async () => {
    const onConfirm = vi.fn((): ExportRequestResult => ({ status: 'allowed' }));
    render(
      <SubscriptionExportDrawer
        open
        onClose={() => {}}
        pageLabel="Command Center"
        scopes={allowedScopes}
        manifest={baseManifest}
        onConfirm={onConfirm}
      />,
    );
    fireEvent.click(screen.getByTestId('subscription-export-drawer-generate'));
    await waitFor(() => {
      expect(screen.getByTestId('export-result-toast')).toHaveTextContent(/Export ready/);
    });
    expect(screen.getByTestId('export-result-toast')).not.toHaveTextContent(/audit reference:/);
  });

  it('shows Generating while an async onConfirm is in flight', async () => {
    const bridge: { resolve?: any } = {};
    const pending = new Promise<ExportRequestResult>((resolve) => {
      bridge.resolve = resolve;
    });
    const onConfirm = vi.fn(() => pending);
    render(
      <SubscriptionExportDrawer
        open
        onClose={() => {}}
        pageLabel="Command Center"
        scopes={allowedScopes}
        manifest={baseManifest}
        onConfirm={onConfirm}
      />,
    );
    fireEvent.click(screen.getByTestId('subscription-export-drawer-generate'));
    expect(screen.getByTestId('subscription-export-drawer-generate')).toHaveTextContent(/Generating/);
    bridge.resolve!({ status: 'allowed', audit_reference: 'late' });
    await waitFor(() => {
      expect(screen.getByTestId('export-result-toast')).toHaveTextContent(/late/);
    });
  });

  it('shows a blocked toast when onConfirm rejects (network or server failure)', async () => {
    const onConfirm = vi.fn(() => Promise.reject(new Error('simulated network failure')));
    render(
      <SubscriptionExportDrawer
        open
        onClose={() => {}}
        pageLabel="Command Center"
        scopes={allowedScopes}
        manifest={baseManifest}
        onConfirm={onConfirm}
      />,
    );
    fireEvent.click(screen.getByTestId('subscription-export-drawer-generate'));
    await waitFor(() => {
      expect(screen.getByTestId('export-result-toast')).toBeInTheDocument();
    });
    expect(screen.getByTestId('export-result-toast')).toHaveTextContent(/could not finish/i);
    expect(screen.getByTestId('export-result-toast')).toHaveTextContent(/unavailable/i);
    expect(onConfirm).toHaveBeenCalledWith('current_page');
  });

  it('shows a blocked toast when onConfirm throws synchronously', async () => {
    const onConfirm = vi.fn(() => {
      throw new Error('simulated sync failure');
    });
    render(
      <SubscriptionExportDrawer
        open
        onClose={() => {}}
        pageLabel="Command Center"
        scopes={allowedScopes}
        manifest={baseManifest}
        onConfirm={onConfirm}
      />,
    );
    fireEvent.click(screen.getByTestId('subscription-export-drawer-generate'));
    await waitFor(() => {
      expect(screen.getByTestId('export-result-toast')).toBeInTheDocument();
    });
    expect(screen.getByTestId('export-result-toast')).toHaveTextContent(/could not finish/i);
  });

  it('clears the export result toast when the drawer is closed and reopened', async () => {
    const onConfirm = vi.fn((): ExportRequestResult => ({ status: 'allowed', audit_reference: 'X1' }));
    const { rerender } = render(
      <SubscriptionExportDrawer
        open
        onClose={() => {}}
        pageLabel="Command Center"
        scopes={allowedScopes}
        manifest={baseManifest}
        onConfirm={onConfirm}
      />,
    );
    fireEvent.click(screen.getByTestId('subscription-export-drawer-generate'));
    await waitFor(() => {
      expect(screen.getByTestId('export-result-toast')).toHaveTextContent(/X1/);
    });
    rerender(
      <SubscriptionExportDrawer
        open={false}
        onClose={() => {}}
        pageLabel="Command Center"
        scopes={allowedScopes}
        manifest={baseManifest}
        onConfirm={onConfirm}
      />,
    );
    rerender(
      <SubscriptionExportDrawer
        open
        onClose={() => {}}
        pageLabel="Command Center"
        scopes={allowedScopes}
        manifest={baseManifest}
        onConfirm={onConfirm}
      />,
    );
    expect(screen.queryByTestId('export-result-toast')).toBeNull();
  });

  it('does not call onConfirm when no scope is allowed and the user clicks generate (defensive)', async () => {
    const onConfirm = vi.fn(
      (): ExportRequestResult => ({ status: 'allowed' }),
    );
    render(
      <SubscriptionExportDrawer
        open
        onClose={() => {}}
        pageLabel="Command Center"
        scopes={[{ scope: 'current_page', blockedReason: 'permission' }]}
        manifest={baseManifest}
        onConfirm={onConfirm}
      />,
    );
    const button = screen.getByTestId('subscription-export-drawer-generate');
    expect(button).toBeDisabled();
    fireEvent.click(button);
    await waitFor(() => {
      expect(onConfirm).not.toHaveBeenCalled();
    });
  });
});
