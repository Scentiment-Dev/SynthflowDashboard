import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import StatusBanner from '../components/subscription-v2/StatusBanner';
import MetricDisclosure from '../components/subscription-v2/MetricDisclosure';
import StateChip from '../components/subscription-v2/StateChip';
import PageActionBar from '../components/subscription-v2/PageActionBar';
import KpiCard from '../components/subscription-v2/KpiCard';
import ComingSoonPage from '../components/subscription-v2/pages/ComingSoonPage';
import {
  BUSINESS_VALUE_STATE_LABEL,
  BUSINESS_VALUE_STATE_TONE,
  FRESHNESS_LABEL,
  FRESHNESS_TONE,
  PORTAL_STATE_LABEL,
  PRIORITY_LABEL,
  PRIORITY_TONE,
  SLA_LABEL,
  SLA_TONE,
  SOURCE_CONFIRMATION_LABEL,
  TRUST_CHIP_LABEL,
  TRUST_TONE,
  formatBusinessValue,
  formatFriendlyTimestamp,
  formatRelativeAge,
} from '../components/subscription-v2/copy';

beforeEach(() => {
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
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('subscription-v2 plain-language copy helpers', () => {
  it('translates business-value, trust, freshness, SLA, portal, priority enums into plain language', () => {
    expect(BUSINESS_VALUE_STATE_LABEL.confirmed).toBe('Confirmed');
    expect(BUSINESS_VALUE_STATE_LABEL.estimated).toBe('Estimated');
    expect(BUSINESS_VALUE_STATE_LABEL.pending).toBe('Pending Stay.ai');
    expect(BUSINESS_VALUE_STATE_LABEL.unknown).toBe('Unknown');
    expect(BUSINESS_VALUE_STATE_LABEL.blocked_by_data).toMatch(/Blocked/);
    expect(BUSINESS_VALUE_STATE_TONE.confirmed).toBe('success');
    expect(BUSINESS_VALUE_STATE_TONE.blocked_by_data).toBe('danger');

    expect(TRUST_CHIP_LABEL.high).toBe('High');
    expect(TRUST_TONE.high).toBe('success');
    expect(TRUST_TONE.untrusted).toBe('danger');

    expect(FRESHNESS_LABEL.fresh).toBe('On time');
    expect(FRESHNESS_TONE.stale).toBe('danger');

    expect(SLA_LABEL.on_track).toBe('On track');
    expect(SLA_TONE.breached).toBe('danger');

    expect(PORTAL_STATE_LABEL.portal_completed).toMatch(/Completion/);
    expect(PORTAL_STATE_LABEL.completion_unknown).toMatch(/unknown/i);

    expect(PRIORITY_LABEL.high).toBe('High priority');
    expect(PRIORITY_TONE.high).toBe('danger');

    expect(SOURCE_CONFIRMATION_LABEL.confirmed).toBe('Stay.ai · official');
    expect(SOURCE_CONFIRMATION_LABEL.missing).toBe('Stay.ai · not received');
  });

  it('formatBusinessValue handles usd, ratio, count, percent, missing, and NaN inputs', () => {
    expect(formatBusinessValue(86540, 'usd')).toBe('$86,540');
    expect(formatBusinessValue(4.3, 'ratio')).toBe('4.30×');
    expect(formatBusinessValue(4, 'ratio')).toBe('4×');
    expect(formatBusinessValue(1234, 'count')).toBe('1,234');
    expect(formatBusinessValue(75, 'percent')).toBe('75');
    expect(formatBusinessValue(123, 'days')).toBe('123');
    expect(formatBusinessValue(null, 'usd')).toBe('—');
    expect(formatBusinessValue(undefined, 'usd')).toBe('—');
    expect(formatBusinessValue(Number.NaN, 'usd')).toBe('—');
  });

  it('formatFriendlyTimestamp returns a "DD Mon at HH:MM UTC" string and falls back on bad input', () => {
    expect(formatFriendlyTimestamp('2026-05-06T12:00:00Z')).toMatch(
      /6 May at 12:00 UTC/,
    );
    expect(formatFriendlyTimestamp('not-a-date')).toBe('not-a-date');
  });

  it('formatRelativeAge returns "just now", minutes, hours, days, and falls back gracefully', () => {
    const now = new Date('2026-05-06T12:00:00Z');
    expect(formatRelativeAge('2026-05-06T12:00:10Z', now)).toBe('Updated just now');
    expect(formatRelativeAge('2026-05-06T11:30:00Z', now)).toBe('Updated 30 min ago');
    expect(formatRelativeAge('2026-05-06T09:00:00Z', now)).toMatch(/Updated 3 hr ago/);
    expect(formatRelativeAge('2026-05-04T12:00:00Z', now)).toBe('Updated 2 days ago');
    expect(formatRelativeAge('2026-05-05T12:00:00Z', now)).toBe('Updated 1 day ago');
    expect(formatRelativeAge('not-a-date', now)).toBe('Updated recently');
  });

  it('formatFriendlyTimestamp falls back to the raw iso when the Date toLocaleString throws', () => {
    const original = Date.prototype.toLocaleString;
    Date.prototype.toLocaleString = function fail() {
      throw new Error('locale data missing');
    };
    try {
      expect(formatFriendlyTimestamp('2026-05-06T12:00:00Z')).toBe(
        '2026-05-06T12:00:00Z',
      );
    } finally {
      Date.prototype.toLocaleString = original;
    }
  });

  it('formatRelativeAge falls back to "Updated recently" when the Date getTime throws', () => {
    const original = Date.prototype.getTime;
    Date.prototype.getTime = function fail() {
      throw new Error('time-zone db missing');
    };
    try {
      expect(formatRelativeAge('2026-05-06T11:30:00Z')).toBe('Updated recently');
    } finally {
      Date.prototype.getTime = original;
    }
  });
});

describe('StateChip', () => {
  it('exposes the tooltip via aria-label so screen readers hear plain-language tone', () => {
    render(<StateChip tone="warning" label="Pending Stay.ai" tooltip="Awaiting confirmation" />);
    const chip = screen.getByLabelText('Pending Stay.ai — Awaiting confirmation');
    expect(chip).toBeInTheDocument();
    expect(chip).toHaveAttribute('title', 'Awaiting confirmation');
  });

  it('falls back to label-only aria-label when no tooltip is provided', () => {
    render(<StateChip tone="success" label="Confirmed" />);
    expect(screen.getByLabelText('Confirmed')).toBeInTheDocument();
  });
});

describe('MetricDisclosure progressive disclosure', () => {
  it('starts collapsed and expands with summary, formula, owner, and timestamps when toggled', async () => {
    render(
      <MetricDisclosure
        summary="Net business value combines protection minus offer cost."
        formula="gross protected − offer cost + support avoided"
        formulaVersion="v0.7.0"
        owner="analytics"
        updatedAge="Updated 2 min ago"
        updatedTimestamp="6 May at 12:00 UTC"
      />,
    );

    const button = screen.getByRole('button', { name: /show metric definition/i });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(
      screen.queryByText(/Net business value combines protection minus offer cost\./i),
    ).toBeNull();

    fireEvent.click(button);

    await waitFor(() => {
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });
    expect(
      screen.getByText(/Net business value combines protection minus offer cost\./i),
    ).toBeInTheDocument();
    expect(screen.getByText(/How we calculate it/i)).toBeInTheDocument();
    expect(screen.getByText(/Formula version/i)).toBeInTheDocument();
    expect(screen.getByText(/analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/6 May at 12:00 UTC/)).toBeInTheDocument();
  });

  it('exposes a separate Level-3 governance panel that toggles independently', async () => {
    render(
      <MetricDisclosure
        summary="Headline summary"
        governance={<span>fingerprint: abc-123</span>}
      />,
    );
    const open = screen.getByRole('button', { name: /show metric definition/i });
    fireEvent.click(open);
    const governanceBtn = await screen.findByRole('button', {
      name: /open governance drawer/i,
    });
    expect(governanceBtn).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(governanceBtn);
    expect(screen.getByText(/fingerprint: abc-123/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /hide governance details/i }),
    ).toBeInTheDocument();
  });

  it('collapses again when toggled twice', () => {
    render(<MetricDisclosure summary="x" formula="y" />);
    const open = screen.getByRole('button', { name: /show metric definition/i });
    fireEvent.click(open);
    fireEvent.click(open);
    expect(open).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('StatusBanner canonical templates', () => {
  it('renders the loading template with a spinning icon', () => {
    render(<StatusBanner kind="loading" />);
    expect(screen.getByTestId('subscription-status-banner-loading')).toBeInTheDocument();
    expect(screen.getByText(/Loading the latest subscription numbers/i)).toBeInTheDocument();
  });

  it('renders the live template with a friendly age suffix', () => {
    render(<StatusBanner kind="live" updatedAge="Updated 3 min ago" />);
    expect(screen.getByText(/Live data loaded · Updated 3 min ago/)).toBeInTheDocument();
  });

  it('renders the live template with a default headline when no age is given', () => {
    render(<StatusBanner kind="live" />);
    expect(screen.getByText('Live data loaded.')).toBeInTheDocument();
  });

  it('renders the pending template with a count interpolation', () => {
    render(<StatusBanner kind="pending" pendingCount={5} />);
    expect(
      screen.getByText(/Stay\.ai has not yet confirmed 5 calls in this period/i),
    ).toBeInTheDocument();
  });

  it('renders the pending template with singular phrasing for count = 1', () => {
    render(<StatusBanner kind="pending" pendingCount={1} />);
    expect(
      screen.getByText(/Stay\.ai has not yet confirmed 1 call in this period/i),
    ).toBeInTheDocument();
  });

  it('falls back to the canonical pending headline when count is zero', () => {
    render(<StatusBanner kind="pending" pendingCount={0} />);
    expect(
      screen.getByText(/Stay\.ai has not yet confirmed every record in this period/i),
    ).toBeInTheDocument();
  });

  it('renders the missing template with a follow-up detail and an action slot', () => {
    render(
      <StatusBanner
        kind="missing"
        detail="Open data quality"
        action={<button type="button">Refresh</button>}
      />,
    );
    expect(
      screen.getByText(/We're not getting Stay.ai final results right now/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Open data quality/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
  });

  it('renders the empty, fixture_unreachable, fixture_malformed, and permission_denied templates', () => {
    const { rerender } = render(<StatusBanner kind="empty" />);
    expect(screen.getByText(/No subscription calls in this view yet/i)).toBeInTheDocument();
    rerender(<StatusBanner kind="fixture_unreachable" />);
    expect(
      screen.getByText(/Live data is temporarily unavailable\. Showing the last reviewed snapshot/i),
    ).toBeInTheDocument();
    rerender(<StatusBanner kind="fixture_malformed" />);
    expect(
      screen.getByText(/Live data is temporarily unavailable\. Please refresh in a few minutes/i),
    ).toBeInTheDocument();
    rerender(<StatusBanner kind="permission_denied" />);
    expect(
      screen.getByText(/We don't have permission to load live data here/i),
    ).toBeInTheDocument();
  });

  it('honours an explicit headline override', () => {
    render(<StatusBanner kind="empty" headline="Custom headline" />);
    expect(screen.getByText('Custom headline')).toBeInTheDocument();
  });
});

describe('PageActionBar integration seams', () => {
  it('renders disabled buttons with their plain-language reason as a tooltip', async () => {
    render(
      <MemoryRouter>
        <PageActionBar
          filterDisabledReason="Filter drawer ships in a follow-up PR."
          exportDisabledReason="Export drawer ships in a follow-up PR."
        />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('subscription-page-action-bar')).toBeInTheDocument();
    });
    const filterBtn = screen.getByRole('button', { name: /filter the data/i });
    const exportBtn = screen.getByRole('button', { name: /export this view/i });
    expect(filterBtn).toBeDisabled();
    expect(filterBtn).toHaveAttribute('title', 'Filter drawer ships in a follow-up PR.');
    expect(exportBtn).toBeDisabled();
    expect(exportBtn).toHaveAttribute('title', 'Export drawer ships in a follow-up PR.');
  });

  it('renders active filter chips and clears them via onClearFilter / onClearAllFilters', async () => {
    const onClearFilter = vi.fn();
    const onClearAll = vi.fn();
    render(
      <MemoryRouter>
        <PageActionBar
          activeFilters={[
            { id: 'date', label: 'Last 30 days' },
            { id: 'platform', label: 'Stay.ai' },
          ]}
          onClearFilter={onClearFilter}
          onClearAllFilters={onClearAll}
        />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('subscription-page-action-bar')).toBeInTheDocument();
    });
    const chip = screen.getByRole('button', { name: /Remove filter Last 30 days/i });
    fireEvent.click(chip);
    expect(onClearFilter).toHaveBeenCalledWith('date');
    fireEvent.click(screen.getByRole('button', { name: /clear all/i }));
    expect(onClearAll).toHaveBeenCalled();
    expect(screen.getByLabelText(/2 filters active/i)).toBeInTheDocument();
  });

  it('triggers the optional onOpenFilters and onExport handlers when enabled', async () => {
    const onOpen = vi.fn();
    const onExport = vi.fn();
    render(
      <MemoryRouter>
        <PageActionBar onOpenFilters={onOpen} onExport={onExport} />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('subscription-page-action-bar')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /filter the data/i }));
    fireEvent.click(screen.getByRole('button', { name: /export this view/i }));
    expect(onOpen).toHaveBeenCalled();
    expect(onExport).toHaveBeenCalled();
  });
});

describe('KpiCard L1 surface primitive', () => {
  it('renders the locked layout: label, value, sub-line, source/trust chips, and delta', () => {
    render(
      <KpiCard
        testId="kpi-test"
        label="Confirmed saves"
        value="142"
        valueSubline="of 280 retention attempts"
        sourceChipLabel="Stay.ai · official"
        sourceChipTone="brand"
        trustChipLabel="High"
        trustChipTone="success"
        trustChipTooltip="High confidence"
        delta={{ label: 'vs prior 28 days', direction: 'up' }}
      />,
    );
    const card = screen.getByTestId('kpi-test');
    expect(within(card).getByText('Confirmed saves')).toBeInTheDocument();
    expect(within(card).getByText('142')).toBeInTheDocument();
    expect(within(card).getByText(/of 280 retention attempts/i)).toBeInTheDocument();
    expect(within(card).getByText('Stay.ai · official')).toBeInTheDocument();
    expect(within(card).getByText(/vs prior 28 days/i)).toBeInTheDocument();
  });

  it('renders an optional state chip and disclosure slot', () => {
    render(
      <KpiCard
        testId="kpi-state"
        label="Net business value"
        value="$86,540"
        sourceChipLabel="Stay.ai · official"
        sourceChipTone="brand"
        stateChipLabel="Estimated"
        stateChipTone="info"
        stateChipTooltip="Provisional value"
        disclosure={<button type="button">Show metric definition</button>}
      />,
    );
    expect(screen.getByText('Estimated')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /show metric definition/i }),
    ).toBeInTheDocument();
  });

  it('renders as an interactive button when onClick is supplied and fires the handler', () => {
    const onClick = vi.fn();
    render(
      <KpiCard
        testId="kpi-interactive"
        label="Confirmed cancels"
        value="9"
        delta={{ label: 'vs prior 28 days', direction: 'down' }}
        action={<span>Drill down</span>}
        onClick={onClick}
      />,
    );
    const card = screen.getByTestId('kpi-interactive');
    expect(card.tagName).toBe('BUTTON');
    fireEvent.click(card);
    expect(onClick).toHaveBeenCalled();
    expect(screen.getByText(/Drill down/)).toBeInTheDocument();
  });

  it('supports the flat delta direction without delta sub-line copy', () => {
    render(
      <KpiCard
        testId="kpi-flat"
        label="Saves"
        value="0"
        delta={{ label: 'no change', direction: 'flat' }}
      />,
    );
    expect(screen.getByText(/no change/i)).toBeInTheDocument();
  });
});

describe('ComingSoonPage stub', () => {
  it('renders the eyebrow, title, what-it-will-show, why-blocked, alternative, and a fallback link', () => {
    render(
      <MemoryRouter>
        <ComingSoonPage
          eyebrow="Cancellation intake"
          title="Which cancel reasons are coming in?"
          whatItWillShow="Reason mix and trend over time."
          whyItIsBlocked="Backend join shipping in a follow-up cycle."
          whatToUseInstead="Use the diagnostics view for now."
          fallbackHref="/subscriptions"
          fallbackLabel="Back to Command Center"
        />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole('heading', { name: /Which cancel reasons are coming in\?/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Reason mix and trend over time/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Backend join shipping in a follow-up cycle/i)).toBeInTheDocument();
    expect(screen.getByText(/Use the diagnostics view for now/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to command center/i })).toHaveAttribute(
      'href',
      '/subscriptions',
    );
    expect(screen.getByText(/Coming soon/i)).toBeInTheDocument();
  });

  it('renders without optional why/instead sections when not provided', () => {
    render(
      <MemoryRouter>
        <ComingSoonPage
          eyebrow="Containment quality"
          title="Containment quality"
          whatItWillShow="True containment metric."
        />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: /containment quality/i })).toBeInTheDocument();
    expect(screen.queryByText(/Why we cannot ship it yet/i)).toBeNull();
    expect(screen.queryByText(/What to use today/i)).toBeNull();
  });
});

describe('Business Value page (B3)', () => {
  it('renders the headline metric, three state columns, and a metric disclosure', async () => {
    render(
      <MemoryRouter initialEntries={['/subscriptions/business-value']}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /Calls we saved — in dollars/i }),
      ).toBeInTheDocument();
    });

    expect(screen.getByTestId('business-value-column-confirmed')).toBeInTheDocument();
    expect(screen.getByTestId('business-value-column-estimated')).toBeInTheDocument();
    expect(screen.getByTestId('business-value-column-pending')).toBeInTheDocument();

    expect(
      screen.getByTestId('business-value-metric-confirmed_saved_revenue'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('business-value-metric-revenue_at_risk'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('business-value-metric-revenue_leakage_after_save'),
    ).toBeInTheDocument();
  });

  it('switches between baseline / pending / missing / empty scenarios via the scenario chips', async () => {
    render(
      <MemoryRouter initialEntries={['/subscriptions/business-value']}>
        <App />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('business-value-scenario-baseline')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('business-value-scenario-missing_stayai_final_state'));
    await waitFor(() => {
      expect(
        screen.getByTestId('subscription-status-banner-missing'),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('business-value-scenario-empty'));
    await waitFor(() => {
      expect(
        screen.queryByTestId('subscription-status-banner-missing'),
      ).toBeNull();
    });
  });
});

describe('Follow-Up Queue page (B4)', () => {
  it('renders the operator table with at least one row and supports row selection', async () => {
    render(
      <MemoryRouter initialEntries={['/subscriptions/follow-up']}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('follow-up-table')).toBeInTheDocument();
    });

    const selectAll = screen.getByLabelText(/Select all visible follow-ups/i);
    fireEvent.click(selectAll);
    await waitFor(() => {
      expect(screen.getByTestId('follow-up-bulk-actions')).toBeInTheDocument();
    });

    const exportSelected = screen.getByRole('button', { name: /export selected/i });
    expect(exportSelected).toBeDisabled();
    expect(exportSelected).toHaveAttribute(
      'title',
      'Export drawer ships in a follow-up PR. Use Export & Audit for now.',
    );
  });

  it('switches reason chips and falls back to a clear-filters CTA when the queue is empty', async () => {
    render(
      <MemoryRouter initialEntries={['/subscriptions/follow-up']}>
        <App />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('follow-up-reason-all')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('follow-up-reason-low_trust'));
    fireEvent.click(screen.getByTestId('follow-up-reason-portal_unknown'));
    fireEvent.click(screen.getByTestId('follow-up-reason-pending_stayai'));

    const scenarioSelect = screen.getByLabelText(/Follow-up queue scenario/i);
    fireEvent.change(scenarioSelect, { target: { value: 'empty' } });
    await waitFor(() => {
      expect(
        screen.getAllByText(/No follow-ups in this filter — try widening/i).length,
      ).toBeGreaterThan(0);
    });
    fireEvent.click(screen.getByRole('button', { name: /clear filters/i }));
  });

  it('shows the missing-data banner when the missing-stayai scenario is active', async () => {
    render(
      <MemoryRouter initialEntries={['/subscriptions/follow-up']}>
        <App />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByLabelText(/Follow-up queue scenario/i)).toBeInTheDocument();
    });
    fireEvent.change(screen.getByLabelText(/Follow-up queue scenario/i), {
      target: { value: 'missing_stayai_final_state' },
    });
    await waitFor(() => {
      expect(
        screen.getByTestId('subscription-status-banner-missing'),
      ).toBeInTheDocument();
    });
  });
});

describe('Command Center page (B2)', () => {
  it('renders the IA v2 hero, KPI grid, and an attention-now panel without legacy stack', async () => {
    render(
      <MemoryRouter initialEntries={['/subscriptions']}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /What changed in subscriptions today\?/i }),
      ).toBeInTheDocument();
    });
    expect(screen.getByTestId('command-center-kpi-saves')).toBeInTheDocument();
    expect(screen.getByTestId('command-center-kpi-cancels')).toBeInTheDocument();
    expect(screen.getByTestId('command-center-kpi-pending')).toBeInTheDocument();
    expect(screen.getByTestId('command-center-kpi-portal')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /How calls are moving through the subscription flow/i }),
    ).toBeInTheDocument();
    // Source-of-truth lock chip is in plain language, not engineering vocab.
    expect(screen.queryByText(/no-drift/i)).toBeNull();
  });
});

describe('Coming Soon subnav routes', () => {
  it.each([
    ['/subscriptions/non-cancellation', /Non-Cancellation Actions/i],
    ['/subscriptions/cancellation-intake', /Cancellation Intake/i],
    ['/subscriptions/cost-too-high', /Cost Too High/i],
    ['/subscriptions/portal-handoff', /Portal Handoff/i],
    ['/subscriptions/containment', /Containment/i],
    ['/subscriptions/export-audit', /Export & Audit/i],
  ])('renders ComingSoonPage for %s', async (path, headingPattern) => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getAllByText(/Coming soon/i).length).toBeGreaterThan(0);
    });
    expect(
      screen.getAllByRole('heading', { name: headingPattern }).length,
    ).toBeGreaterThan(0);
  });
});
