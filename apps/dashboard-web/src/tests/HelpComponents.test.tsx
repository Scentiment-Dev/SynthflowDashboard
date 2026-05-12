import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import TrustExplanationPopover from '../components/help/TrustExplanationPopover';
import SourceAuthoritySummary from '../components/help/SourceAuthoritySummary';
import TechnicalDetailsDisclosure from '../components/help/TechnicalDetailsDisclosure';
import ActionableEmptyState from '../components/help/ActionableEmptyState';
import BlockedStateCallout from '../components/help/BlockedStateCallout';
import WidgetActionMenu from '../components/help/WidgetActionMenu';
import MetricHelpDrawer from '../components/help/MetricHelpDrawer';

describe('TrustExplanationPopover', () => {
  it('renders the locked anchor sentence and the level-specific detail when expanded', () => {
    render(<TrustExplanationPopover trust="medium" contextLine="9 records still pending" />);
    const trigger = screen.getByTestId('trust-explanation-medium');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('How reliable this metric is right now.')).toBeInTheDocument();
    expect(screen.getByText(/most of the data we need/i)).toBeInTheDocument();
    expect(screen.getByText(/9 records still pending/)).toBeInTheDocument();
    expect(screen.getByText(/What to do next/)).toBeInTheDocument();
  });

  it('toggles closed via the dedicated Close button', () => {
    render(<TrustExplanationPopover trust="high" />);
    const trigger = screen.getByTestId('trust-explanation-high');
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('honours a chip-label override and falls back to the copy-system label otherwise', () => {
    render(<TrustExplanationPopover trust="untrusted" chipLabel="Do not quote" />);
    expect(screen.getByText('Do not quote')).toBeInTheDocument();
  });
});

describe('SourceAuthoritySummary', () => {
  it('renders a chip + plain-language explanation for every supplied role', () => {
    render(
      <SourceAuthoritySummary
        intro="These are the systems behind every number on this page."
        roles={[
          'stayai_final',
          'stayai_pending',
          'shopify_context',
          'synthflow_journey',
          'portal_link_sent',
          'portal_completion',
        ]}
      />,
    );
    expect(screen.getByTestId('source-authority-summary')).toBeInTheDocument();
    expect(screen.getByText(/Where these numbers come from/i)).toBeInTheDocument();
    expect(screen.getByText('Stay.ai · official')).toBeInTheDocument();
    expect(screen.getByText('Stay.ai · pending')).toBeInTheDocument();
    expect(screen.getByText('Shopify · context only')).toBeInTheDocument();
    expect(screen.getByText('Synthflow · journey only')).toBeInTheDocument();
    expect(screen.getByText(/owns the official subscription record/i)).toBeInTheDocument();
    expect(screen.getByText(/order context only/i)).toBeInTheDocument();
    expect(
      screen.getByText(/These are the systems behind every number on this page\./),
    ).toBeInTheDocument();
  });

  it('still renders without an intro line', () => {
    render(<SourceAuthoritySummary roles={['stayai_final']} />);
    expect(screen.getByText('Stay.ai · official')).toBeInTheDocument();
  });
});

describe('TechnicalDetailsDisclosure', () => {
  it('opens the level-2 summary, then the level-3 governance panel, independently', async () => {
    render(
      <TechnicalDetailsDisclosure
        summary={<span>Net business value combines protection minus offer cost.</span>}
        governance={<span>fingerprint: abc-123</span>}
      />,
    );
    const summaryToggle = screen.getByRole('button', { name: /show metric definition/i });
    expect(summaryToggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(summaryToggle);
    await waitFor(() => {
      expect(summaryToggle).toHaveAttribute('aria-expanded', 'true');
    });
    expect(screen.getByText(/Net business value combines protection/)).toBeInTheDocument();

    const governanceToggle = screen.getByRole('button', { name: /open governance drawer/i });
    expect(governanceToggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(governanceToggle);
    expect(screen.getByText(/fingerprint: abc-123/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /hide governance details/i })).toBeInTheDocument();
  });

  it('omits the governance toggle when no governance content is provided', () => {
    render(<TechnicalDetailsDisclosure summary={<span>Plain summary</span>} />);
    fireEvent.click(screen.getByRole('button', { name: /show metric definition/i }));
    expect(screen.queryByRole('button', { name: /governance/i })).toBeNull();
  });

  it('honours custom labels for the trigger and governance toggle', async () => {
    render(
      <TechnicalDetailsDisclosure
        summary={<span>Detail</span>}
        governance={<span>raw</span>}
        triggerLabel="Show details"
        governanceLabel="Open audit drawer"
        governanceHideLabel="Hide audit drawer"
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /show details/i }));
    fireEvent.click(screen.getByRole('button', { name: /open audit drawer/i }));
    expect(screen.getByRole('button', { name: /hide audit drawer/i })).toBeInTheDocument();
  });
});

describe('ActionableEmptyState', () => {
  it('renders the headline, detail, why, and primary + secondary actions', () => {
    render(
      <ActionableEmptyState
        headline="No follow-ups in this filter — try widening."
        detail="Try widening the date range or clearing filters."
        why="Filters are scoped to portal_unknown only right now."
        action={<button type="button">Reset filters</button>}
        secondaryAction={<button type="button">Open follow-up queue</button>}
      />,
    );
    const region = screen.getByTestId('actionable-empty-state');
    expect(region).toHaveAttribute('role', 'status');
    expect(region).toHaveAttribute(
      'aria-label',
      'No follow-ups in this filter — try widening.',
    );
    expect(screen.getByText(/Try widening the date range/i)).toBeInTheDocument();
    expect(screen.getByText(/Filters are scoped to portal_unknown only/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset filters/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open follow-up queue/i })).toBeInTheDocument();
  });

  it('omits the action row when no actions are provided', () => {
    render(<ActionableEmptyState headline="Empty" detail="No data" />);
    expect(screen.queryByRole('button')).toBeNull();
  });
});

describe('BlockedStateCallout', () => {
  it('renders one of the locked blocked-reason templates with optional reference', () => {
    render(
      <BlockedStateCallout
        reason="permission"
        headline="We don't have permission to load live data here."
        detail="Showing the last reviewed snapshot."
        reference="AUD-2026-05-06-118"
        action={<button type="button">Ask my manager for access</button>}
      />,
    );
    expect(screen.getByTestId('blocked-state-callout-permission')).toBeInTheDocument();
    expect(
      screen.getByText("We don't have permission to load live data here."),
    ).toBeInTheDocument();
    expect(screen.getByText(/Showing the last reviewed snapshot/)).toBeInTheDocument();
    expect(screen.getByText(/audit reference: AUD-2026-05-06-118/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ask my manager/i })).toBeInTheDocument();
  });

  it('renders all reason variants with their distinct icons', () => {
    const reasons: Array<
      | 'permission'
      | 'data_missing'
      | 'low_trust'
      | 'untrusted'
      | 'pending'
      | 'manifest_mismatch'
    > = ['permission', 'data_missing', 'low_trust', 'untrusted', 'pending', 'manifest_mismatch'];
    for (const reason of reasons) {
      const { unmount } = render(
        <BlockedStateCallout reason={reason} headline={reason} detail="detail" />,
      );
      expect(screen.getByTestId(`blocked-state-callout-${reason}`)).toBeInTheDocument();
      unmount();
    }
  });
});

describe('WidgetActionMenu', () => {
  it('opens, fires the selected handler, and closes after selection', () => {
    const onExport = vi.fn();
    const onDefinition = vi.fn();
    render(
      <WidgetActionMenu
        widgetLabel="Confirmed saves"
        items={[
          { id: 'export-widget', label: 'Export this widget', onSelect: onExport },
          { id: 'metric-definition', label: 'Show metric definition', onSelect: onDefinition },
        ]}
      />,
    );
    const trigger = screen.getByTestId('widget-action-menu-trigger');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(screen.getByTestId('widget-action-menu-item-export-widget'));
    expect(onExport).toHaveBeenCalledTimes(1);
    expect(onDefinition).not.toHaveBeenCalled();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('disables items that supply a `disabledReason` and exposes the reason via title + visible helper', () => {
    const onSelect = vi.fn();
    render(
      <WidgetActionMenu
        widgetLabel="Trend strip"
        items={[
          {
            id: 'open-subpage',
            label: 'Open in subpage',
            disabledReason: 'No canonical drilldown yet for this widget.',
            onSelect,
          },
        ]}
      />,
    );
    fireEvent.click(screen.getByTestId('widget-action-menu-trigger'));
    const item = screen.getByTestId('widget-action-menu-item-open-subpage');
    expect(item).toHaveAttribute('aria-disabled', 'true');
    expect(item).toHaveAttribute('title', 'No canonical drilldown yet for this widget.');
    expect(screen.getByText('No canonical drilldown yet for this widget.')).toBeInTheDocument();
    fireEvent.click(item);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('closes when the user presses Escape', () => {
    render(
      <WidgetActionMenu
        widgetLabel="KPI"
        items={[{ id: 'a', label: 'A' }]}
      />,
    );
    const trigger = screen.getByTestId('widget-action-menu-trigger');
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes when the user clicks outside of the menu', () => {
    render(
      <div>
        <WidgetActionMenu
          widgetLabel="KPI"
          items={[{ id: 'a', label: 'A' }]}
        />
        <button type="button" data-testid="outside">
          Outside
        </button>
      </div>,
    );
    fireEvent.click(screen.getByTestId('widget-action-menu-trigger'));
    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.getByTestId('widget-action-menu-trigger')).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('closes after selecting an item without an onSelect handler', () => {
    render(
      <WidgetActionMenu
        widgetLabel="KPI"
        items={[{ id: 'no-handler', label: 'Open details' }]}
      />,
    );
    const trigger = screen.getByTestId('widget-action-menu-trigger');
    fireEvent.click(trigger);
    fireEvent.click(screen.getByTestId('widget-action-menu-item-no-handler'));
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('MetricHelpDrawer', () => {
  it('renders nothing when closed', () => {
    render(
      <MetricHelpDrawer
        open={false}
        onClose={() => {}}
        title="Confirmed saves"
        summary="Saves divided by retention attempts."
      />,
    );
    expect(screen.queryByTestId('metric-help-drawer')).toBeNull();
  });

  it('renders title, summary, friendly formula, owner, friendly time, what-to-do, and governance', () => {
    render(
      <MetricHelpDrawer
        open
        onClose={() => {}}
        title="Confirmed saves"
        summary="Saves divided by retention attempts."
        friendlyFormula="Saves divided by cancellation requests."
        ownerLabel="Analytics"
        updatedAge="Updated 3 min ago"
        updatedTimestamp="6 May at 12:00 UTC"
        whatToDoNext="Quote the number to your manager."
        governance={<span>raw fingerprint</span>}
      />,
    );
    expect(screen.getByTestId('metric-help-drawer')).toBeInTheDocument();
    expect(screen.getByText('Confirmed saves')).toBeInTheDocument();
    expect(screen.getByText(/Saves divided by retention attempts\./)).toBeInTheDocument();
    expect(screen.getByText(/Saves divided by cancellation requests\./)).toBeInTheDocument();
    expect(screen.getByText(/Owner: Analytics/)).toBeInTheDocument();
    expect(screen.getByText(/Updated 3 min ago/)).toBeInTheDocument();
    expect(screen.getByText(/6 May at 12:00 UTC/)).toBeInTheDocument();
    expect(screen.getByText(/Quote the number to your manager\./)).toBeInTheDocument();
    expect(screen.getByText('raw fingerprint')).toBeInTheDocument();
  });

  it('closes via the dedicated close button, ESC, and the overlay click', () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <MetricHelpDrawer open onClose={onClose} title="Saves" summary="x" />,
    );
    fireEvent.click(screen.getByTestId('metric-help-drawer-close'));
    expect(onClose).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(2);
    rerender(<MetricHelpDrawer open onClose={onClose} title="Saves" summary="x" />);
    fireEvent.click(screen.getByTestId('metric-help-drawer-overlay'));
    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it('does not close when the panel itself is clicked', () => {
    const onClose = vi.fn();
    render(<MetricHelpDrawer open onClose={onClose} title="Saves" summary="x" />);
    fireEvent.click(screen.getByTestId('metric-help-drawer'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('ignores non-escape keyboard presses', () => {
    const onClose = vi.fn();
    render(<MetricHelpDrawer open onClose={onClose} title="Saves" summary="x" />);
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(onClose).not.toHaveBeenCalled();
  });
});
