import { fireEvent, render, screen, within } from '@testing-library/react';
import SubscriptionSubnav from '../components/subscription/SubscriptionSubnav';
import SubscriptionPageHeader from '../components/subscription/SubscriptionPageHeader';
import {
  SUBSCRIPTION_SUBNAV_ITEMS,
  findSubscriptionSubnavItem,
  type SubscriptionSubnavItem,
} from '../constants/subscriptionSubnav';

describe('SubscriptionSubnav (Cycle 007 IA v2 prototype)', () => {
  it('renders a labeled <nav> landmark with all 10 required subscription subpages', () => {
    render(<SubscriptionSubnav />);

    const nav = screen.getByRole('navigation', { name: /Subscription analytics/i });
    expect(nav).toBeInTheDocument();

    const buttons = within(nav).getAllByRole('button');
    expect(buttons).toHaveLength(SUBSCRIPTION_SUBNAV_ITEMS.length);
    expect(SUBSCRIPTION_SUBNAV_ITEMS).toHaveLength(10);
  });

  it('marks the active item with aria-current="page" and disables planned items', () => {
    render(<SubscriptionSubnav activeId="command-center" />);

    const activeButton = screen.getByRole('button', { name: /Command/i });
    expect(activeButton).toHaveAttribute('aria-current', 'page');
    expect(activeButton).not.toBeDisabled();
    expect(activeButton).not.toHaveAttribute('aria-selected');

    const plannedItem = SUBSCRIPTION_SUBNAV_ITEMS.find((item) => item.status === 'planned');
    expect(plannedItem).toBeDefined();
    const plannedButton = screen.getByRole('button', {
      name: new RegExp(plannedItem!.shortLabel ?? plannedItem!.label, 'i'),
    });
    expect(plannedButton).toBeDisabled();
    expect(plannedButton).toHaveAttribute('aria-disabled', 'true');
    expect(plannedButton).not.toHaveAttribute('aria-current');
  });

  it('does not call onSelect when a planned (disabled) item is clicked', () => {
    const onSelect = vi.fn();
    render(<SubscriptionSubnav activeId="command-center" onSelect={onSelect} />);

    const plannedItem = SUBSCRIPTION_SUBNAV_ITEMS.find((item) => item.status === 'planned')!;
    const plannedButton = screen.getByRole('button', {
      name: new RegExp(plannedItem.shortLabel ?? plannedItem.label, 'i'),
    });
    fireEvent.click(plannedButton);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('calls onSelect with the item when a non-planned, non-active item is clicked', () => {
    const onSelect = vi.fn();
    const items: SubscriptionSubnavItem[] = SUBSCRIPTION_SUBNAV_ITEMS.map((item) =>
      item.id === 'outcomes' ? { ...item, status: 'live' } : item,
    );
    render(<SubscriptionSubnav items={items} activeId="command-center" onSelect={onSelect} />);

    const liveButton = screen.getByRole('button', { name: /Outcomes/i });
    expect(liveButton).not.toBeDisabled();
    fireEvent.click(liveButton);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0]?.[0]).toMatchObject({ id: 'outcomes' });
  });

  it('renders the attention badge when attentionCount > 0', () => {
    const items: SubscriptionSubnavItem[] = SUBSCRIPTION_SUBNAV_ITEMS.map((item) =>
      item.id === 'follow-up' ? { ...item, status: 'live', attentionCount: 3 } : item,
    );
    render(<SubscriptionSubnav items={items} activeId="command-center" />);

    expect(screen.getByLabelText('3 need attention')).toBeInTheDocument();
  });

  it('renders the Planned status chip on planned items but not on the active item', () => {
    render(<SubscriptionSubnav activeId="command-center" />);

    const plannedChips = screen.getAllByText('Planned');
    expect(plannedChips.length).toBeGreaterThan(0);

    const activeButton = screen.getByRole('button', { name: /Command/i });
    expect(within(activeButton).queryByText('Prototype')).toBeNull();
    expect(within(activeButton).queryByText('Planned')).toBeNull();
  });

  it('renders the Prototype and Live status chips on non-active items', () => {
    const items: SubscriptionSubnavItem[] = SUBSCRIPTION_SUBNAV_ITEMS.map((item) => {
      if (item.id === 'outcomes') {
        return { ...item, status: 'live' };
      }
      if (item.id === 'containment') {
        return { ...item, status: 'live' };
      }
      return item;
    });
    render(<SubscriptionSubnav items={items} activeId="containment" />);

    expect(screen.getByText('Prototype')).toBeInTheDocument();
    expect(screen.getByText('Live')).toBeInTheDocument();
  });

  it('falls back to item.label when shortLabel is not provided', () => {
    const items: SubscriptionSubnavItem[] = SUBSCRIPTION_SUBNAV_ITEMS.map((item) =>
      item.id === 'outcomes' ? { ...item, shortLabel: undefined } : item,
    );
    render(<SubscriptionSubnav items={items} activeId="command-center" />);

    expect(screen.getByRole('button', { name: /Outcome Summary/i })).toBeInTheDocument();
  });

  it('renders the attention badge on the active item using the active style', () => {
    const items: SubscriptionSubnavItem[] = SUBSCRIPTION_SUBNAV_ITEMS.map((item) =>
      item.id === 'command-center' ? { ...item, attentionCount: 5 } : item,
    );
    render(<SubscriptionSubnav items={items} activeId="command-center" />);

    const badge = screen.getByLabelText('5 need attention');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('bg-white/20');
  });

  it('exposes a stable lookup helper for subnav items', () => {
    expect(findSubscriptionSubnavItem('command-center')).toMatchObject({
      id: 'command-center',
      status: 'prototype',
    });
    expect(findSubscriptionSubnavItem('outcomes')?.status).toBe('planned');
    // @ts-expect-error verify lookup returns undefined for unknown id at runtime.
    expect(findSubscriptionSubnavItem('not-a-real-tab')).toBeUndefined();
  });
});

describe('SubscriptionPageHeader (Cycle 007 IA v2 prototype)', () => {
  it('renders eyebrow, title, description, meta, and actions when all provided', () => {
    render(
      <SubscriptionPageHeader
        id="hdr"
        eyebrow="EYEBROW"
        title="One question?"
        description={<span>Description text</span>}
        meta={<span data-testid="meta-chip">meta</span>}
        actions={<button type="button">Do thing</button>}
      />,
    );

    expect(screen.getByText('EYEBROW')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /One question\?/i })).toHaveAttribute('id', 'hdr');
    expect(screen.getByText('Description text')).toBeInTheDocument();
    expect(screen.getByTestId('meta-chip')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Do thing/i })).toBeInTheDocument();
  });

  it('renders without optional description, meta, and actions', () => {
    render(<SubscriptionPageHeader eyebrow="X" title="Y" />);

    expect(screen.getByText('X')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Y/i })).toBeInTheDocument();
  });
});
