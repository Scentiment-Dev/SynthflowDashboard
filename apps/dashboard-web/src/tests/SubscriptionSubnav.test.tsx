import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SubscriptionSubnav from '../components/subscription/SubscriptionSubnav';
import SubscriptionPageHeader from '../components/subscription/SubscriptionPageHeader';
import {
  SUBSCRIPTION_SUBNAV_ITEMS,
  findSubscriptionSubnavItem,
  type SubscriptionSubnavItem,
} from '../constants/subscriptionSubnav';

function renderSubnav(props: Parameters<typeof SubscriptionSubnav>[0] = {}) {
  return render(
    <MemoryRouter initialEntries={['/subscriptions']}>
      <SubscriptionSubnav {...props} />
    </MemoryRouter>,
  );
}

describe('SubscriptionSubnav (Cycle 008 IA v2)', () => {
  it('renders a labeled <nav> landmark with all 10 required subscription subpages as links', () => {
    renderSubnav();

    const nav = screen.getByRole('navigation', { name: /Subscription analytics/i });
    expect(nav).toBeInTheDocument();

    const links = within(nav).getAllByRole('link');
    expect(links).toHaveLength(SUBSCRIPTION_SUBNAV_ITEMS.length);
    expect(SUBSCRIPTION_SUBNAV_ITEMS).toHaveLength(10);
  });

  it('marks the active item with aria-current="page" when activeId is provided explicitly', () => {
    renderSubnav({ activeId: 'command-center' });

    const activeLink = screen.getByRole('link', { name: /Command/i });
    expect(activeLink).toHaveAttribute('aria-current', 'page');
  });

  it('renders Coming soon chips on planned items but never on the active item', () => {
    renderSubnav({ activeId: 'command-center' });

    const plannedChips = screen.getAllByText('Coming soon');
    expect(plannedChips.length).toBeGreaterThan(0);

    const activeLink = screen.getByRole('link', { name: /Command/i });
    expect(within(activeLink).queryByText('Coming soon')).toBeNull();
  });

  it('calls onSelect when an item link is clicked', () => {
    const onSelect = vi.fn();
    renderSubnav({ activeId: 'command-center', onSelect });

    const link = screen.getByRole('link', { name: /Outcomes/i });
    fireEvent.click(link);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0]?.[0]).toMatchObject({ id: 'outcomes' });
  });

  it('renders the attention badge when attentionCount > 0', () => {
    const items: SubscriptionSubnavItem[] = SUBSCRIPTION_SUBNAV_ITEMS.map((item) =>
      item.id === 'follow-up' ? { ...item, attentionCount: 3 } : item,
    );
    renderSubnav({ items });

    expect(screen.getByLabelText('3 need attention')).toBeInTheDocument();
  });

  it('falls back to item.label when shortLabel is not provided', () => {
    const items: SubscriptionSubnavItem[] = SUBSCRIPTION_SUBNAV_ITEMS.map((item) =>
      item.id === 'outcomes' ? { ...item, shortLabel: undefined } : item,
    );
    renderSubnav({ items });

    expect(screen.getByRole('link', { name: /Outcome Summary/i })).toBeInTheDocument();
  });

  it('renders the attention badge on the active item using the active style', () => {
    const items: SubscriptionSubnavItem[] = SUBSCRIPTION_SUBNAV_ITEMS.map((item) =>
      item.id === 'command-center' ? { ...item, attentionCount: 5 } : item,
    );
    renderSubnav({ items, activeId: 'command-center' });

    const badge = screen.getByLabelText('5 need attention');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('bg-white/20');
  });

  it('exposes a stable lookup helper for subnav items', () => {
    expect(findSubscriptionSubnavItem('command-center')).toMatchObject({
      id: 'command-center',
      status: 'live',
    });
    expect(findSubscriptionSubnavItem('non-cancellation')?.status).toBe('planned');
    // @ts-expect-error verify lookup returns undefined for unknown id at runtime.
    expect(findSubscriptionSubnavItem('not-a-real-tab')).toBeUndefined();
  });

  it('does not surface engineering vocabulary on the page surface', () => {
    renderSubnav();
    const nav = screen.getByRole('navigation', { name: /Subscription analytics/i });

    // The Cycle 007 prototype subnav surfaced "IA v2", "Cycle 007 prototype",
    // and a markdown path. Cycle 008 must hide all of that from production UI.
    expect(within(nav).queryByText(/IA v2/i)).toBeNull();
    expect(within(nav).queryByText(/Cycle 007/i)).toBeNull();
    expect(within(nav).queryByText(/docs\//)).toBeNull();
  });
});

describe('SubscriptionPageHeader (Cycle 008)', () => {
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
