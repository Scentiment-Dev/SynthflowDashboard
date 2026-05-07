import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import SubscriptionFilterDrawer, {
  buildActiveChips,
  countActiveFilterValues,
  type AppliedFilters,
  type SavedView,
} from '../components/filters/SubscriptionFilterDrawer';
import { SUBSCRIPTION_ADVANCED_FILTERS_FIXTURE } from '../data/subscriptionAdvancedFiltersFixtures';
import type { SubscriptionAdvancedFilterApiState } from '../types/subscriptionFilters';

const baseState: SubscriptionAdvancedFilterApiState = {
  data: SUBSCRIPTION_ADVANCED_FILTERS_FIXTURE,
  loading: false,
  error: null,
  source: 'fixture',
  permissionDenied: false,
};

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('test fixture')));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('SubscriptionFilterDrawer helpers', () => {
  it('countActiveFilterValues counts values across keys', () => {
    expect(countActiveFilterValues({})).toBe(0);
    expect(countActiveFilterValues({ a: ['x'] })).toBe(1);
    expect(countActiveFilterValues({ a: ['x', 'y'], b: ['z'] })).toBe(3);
  });

  it('buildActiveChips renders plain-language chips for known + unknown filter ids', () => {
    const chips = buildActiveChips(
      { date_preset: ['last_30_days'], unknown_dim: ['weird'] },
      SUBSCRIPTION_ADVANCED_FILTERS_FIXTURE.options,
    );
    expect(chips).toHaveLength(2);
    expect(chips[0].label).toContain('Date preset');
    expect(chips[0].label).toContain('Last 30 days');
    expect(chips[1].label).toContain('unknown_dim');
    expect(chips[1].label).toContain('weird');
  });
});

describe('SubscriptionFilterDrawer rendering', () => {
  it('does not render when closed', () => {
    render(
      <SubscriptionFilterDrawer
        open={false}
        onClose={() => {}}
        state={baseState}
        applied={{}}
        onApply={() => {}}
      />,
    );
    expect(screen.queryByTestId('subscription-filter-drawer')).toBeNull();
  });

  it('opens with all enabled filter dimensions grouped by IA section', () => {
    render(
      <SubscriptionFilterDrawer
        open
        onClose={() => {}}
        state={baseState}
        applied={{}}
        onApply={() => {}}
      />,
    );
    expect(screen.getByTestId('subscription-filter-drawer')).toBeInTheDocument();
    expect(screen.getByText('Filter the data')).toBeInTheDocument();
    expect(screen.getByText('Advanced filters')).toBeInTheDocument();
    expect(screen.getByText('Date and comparison')).toBeInTheDocument();
    expect(screen.getByText('Outcome')).toBeInTheDocument();
    expect(screen.getByText('Cancellation and retention')).toBeInTheDocument();
    expect(screen.getByText('Customer / subscription')).toBeInTheDocument();
    expect(screen.getByText('Product / SKU')).toBeInTheDocument();
    expect(screen.getByText('Value and risk')).toBeInTheDocument();
    expect(screen.getByText('Source and trust')).toBeInTheDocument();
    expect(screen.getByText('Flow / version')).toBeInTheDocument();
    expect(screen.getByText('Portal / handoff')).toBeInTheDocument();
    expect(screen.getByText('Saved views')).toBeInTheDocument();
    expect(screen.getByTestId('subscription-filter-date_preset')).toBeInTheDocument();
    expect(screen.getByTestId('subscription-filter-saved_view')).toBeInTheDocument();
    expect(
      screen.getByTestId('subscription-filter-date_preset-data-dependency'),
    ).toHaveTextContent(/Accurate call timestamps/);
    expect(screen.getByTestId('subscription-filter-trust_label')).toBeInTheDocument();
  });

  it('renders disabled filter dimensions with the plain-language reason and "Not yet wired" badge', () => {
    render(
      <SubscriptionFilterDrawer
        open
        onClose={() => {}}
        state={baseState}
        applied={{}}
        onApply={() => {}}
      />,
    );
    const offerVersion = screen.getByTestId('subscription-filter-offer_version');
    expect(offerVersion).toHaveAttribute('data-disabled', 'true');
    expect(within(offerVersion).getByText(/Not yet wired/)).toBeInTheDocument();
    expect(
      screen.getByTestId('subscription-filter-offer_version-reason'),
    ).toHaveTextContent(/Offer-version dimension is not yet wired/);
  });

  it('renders the active-chip strip and lets the user remove a chip', () => {
    const onApply = vi.fn();
    const applied: AppliedFilters = {
      date_preset: ['last_30_days'],
      cancellation_reason: ['cost_too_high', 'product_issue'],
    };
    render(
      <SubscriptionFilterDrawer
        open
        onClose={() => {}}
        state={baseState}
        applied={applied}
        onApply={onApply}
      />,
    );
    const chipStrip = screen.getByTestId('subscription-filter-drawer-active-chips');
    expect(chipStrip).toBeInTheDocument();
    const removeBtn = within(chipStrip).getByRole('button', {
      name: /Remove filter Cancellation reason: Cost too high/i,
    });
    fireEvent.click(removeBtn);
    expect(within(chipStrip).queryByText(/Cost too high/)).toBeNull();
  });

  it('toggles values inside a filter group via the value buttons', () => {
    const onApply = vi.fn();
    render(
      <SubscriptionFilterDrawer
        open
        onClose={() => {}}
        state={baseState}
        applied={{}}
        onApply={onApply}
      />,
    );
    fireEvent.click(
      screen.getByTestId('subscription-filter-trust_label-value-high'),
    );
    fireEvent.click(
      screen.getByTestId('subscription-filter-trust_label-value-medium'),
    );
    fireEvent.click(screen.getByTestId('subscription-filter-drawer-apply'));
    expect(onApply).toHaveBeenCalledWith({ trust_label: ['high', 'medium'] });
  });

  it('calls onApply with cleared filters when "Clear all" is pressed', () => {
    const onApply = vi.fn();
    const onClearAll = vi.fn();
    render(
      <SubscriptionFilterDrawer
        open
        onClose={() => {}}
        state={baseState}
        applied={{ trust_label: ['high'] }}
        onApply={onApply}
        onClearAll={onClearAll}
      />,
    );
    fireEvent.click(screen.getByTestId('subscription-filter-drawer-clear'));
    fireEvent.click(screen.getByTestId('subscription-filter-drawer-apply'));
    expect(onClearAll).toHaveBeenCalledTimes(1);
    expect(onApply).toHaveBeenCalledWith({});
  });

  it('calls onReset and replaces the draft with defaults when "Reset to default" is pressed', () => {
    const onApply = vi.fn();
    const onReset = vi.fn();
    const defaults: AppliedFilters = { date_preset: ['last_7_days'] };
    render(
      <SubscriptionFilterDrawer
        open
        onClose={() => {}}
        state={baseState}
        applied={{ trust_label: ['high'] }}
        defaults={defaults}
        onApply={onApply}
        onReset={onReset}
      />,
    );
    fireEvent.click(screen.getByTestId('subscription-filter-drawer-reset'));
    fireEvent.click(screen.getByTestId('subscription-filter-drawer-apply'));
    expect(onReset).toHaveBeenCalledTimes(1);
    expect(onApply).toHaveBeenCalledWith(defaults);
  });

  it('renders saved-views placeholder when no views and explicit not-yet-connected reason', () => {
    render(
      <SubscriptionFilterDrawer
        open
        onClose={() => {}}
        state={baseState}
        applied={{}}
        onApply={() => {}}
        savedViewsDisabledReason="Saved view persistence is not yet connected."
      />,
    );
    expect(screen.getByTestId('saved-views-empty')).toHaveTextContent(
      /not yet connected/i,
    );
    expect(screen.getByTestId('saved-views-save')).toBeDisabled();
  });

  it('lets the user save a view when the persistence is connected', () => {
    const onSaveView = vi.fn();
    render(
      <SubscriptionFilterDrawer
        open
        onClose={() => {}}
        state={baseState}
        applied={{ trust_label: ['high'] }}
        onApply={() => {}}
        onSaveView={onSaveView}
      />,
    );
    fireEvent.click(screen.getByTestId('saved-views-save'));
    fireEvent.change(screen.getByTestId('saved-views-name-input'), {
      target: { value: 'My CSL view' },
    });
    fireEvent.click(screen.getByTestId('saved-views-confirm'));
    expect(onSaveView).toHaveBeenCalledWith('My CSL view');
  });

  it('does not call onSaveView when the name is blank', () => {
    const onSaveView = vi.fn();
    render(
      <SubscriptionFilterDrawer
        open
        onClose={() => {}}
        state={baseState}
        applied={{}}
        onApply={() => {}}
        onSaveView={onSaveView}
      />,
    );
    fireEvent.click(screen.getByTestId('saved-views-save'));
    fireEvent.click(screen.getByTestId('saved-views-confirm'));
    expect(onSaveView).not.toHaveBeenCalled();
  });

  it('renders saved-view chips that replace the draft when clicked', () => {
    const onApply = vi.fn();
    const savedViews: SavedView[] = [
      { id: 'pending', name: 'Pending Stay.ai', applied: { trust_label: ['low'] } },
    ];
    render(
      <SubscriptionFilterDrawer
        open
        onClose={() => {}}
        state={baseState}
        applied={{}}
        onApply={onApply}
        savedViews={savedViews}
      />,
    );
    fireEvent.click(screen.getByTestId('saved-view-pending'));
    fireEvent.click(screen.getByTestId('subscription-filter-drawer-apply'));
    expect(onApply).toHaveBeenCalledWith({ trust_label: ['low'] });
  });

  it('closes via overlay, close button, and Escape', () => {
    const onClose = vi.fn();
    render(
      <SubscriptionFilterDrawer
        open
        onClose={onClose}
        state={baseState}
        applied={{}}
        onApply={() => {}}
      />,
    );
    fireEvent.click(screen.getByTestId('subscription-filter-drawer-overlay'));
    expect(onClose).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByTestId('subscription-filter-drawer-close'));
    expect(onClose).toHaveBeenCalledTimes(2);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it('renders an unobtrusive error banner when the filter catalog cannot be reached', () => {
    render(
      <SubscriptionFilterDrawer
        open
        onClose={() => {}}
        state={{ ...baseState, error: 'subscription advanced filters response shape mismatch' }}
        applied={{}}
        onApply={() => {}}
      />,
    );
    expect(screen.getByTestId('subscription-filter-drawer-error')).toHaveTextContent(
      /temporarily unavailable/,
    );
  });

  it('renders an "options unavailable" microcopy line when an enabled dimension has no allowed values', () => {
    const state: SubscriptionAdvancedFilterApiState = {
      ...baseState,
      data: {
        ...SUBSCRIPTION_ADVANCED_FILTERS_FIXTURE,
        options: [
          {
            ...SUBSCRIPTION_ADVANCED_FILTERS_FIXTURE.options[0],
            allowed_values: [],
          },
        ],
      },
    };
    render(
      <SubscriptionFilterDrawer
        open
        onClose={() => {}}
        state={state}
        applied={{}}
        onApply={() => {}}
      />,
    );
    expect(screen.getByText(/No options available right now/)).toBeInTheDocument();
  });
});
