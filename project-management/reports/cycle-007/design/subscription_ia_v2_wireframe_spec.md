# Subscription IA v2 — Wireframe & Component Spec

- Document owner: Cursor Agent B (Frontend / UI / UX)
- Cycle: 007
- Wave: 01
- Status: **Cycle 007 design + prototype reference**
- Companion to: `docs/07_dashboard_ui_ux/subscription_analytics_information_architecture_v2.md`
- Model used by author: Opus 4.7
- Source-of-truth lock: Stay.ai owns subscription outcome truth; Shopify is context only; portal link sent is never portal completion; trust labels are system-calculated.

This document holds the ASCII wireframes, component contracts, props, behavior rules, and acceptance scoring rubric for the subscription IA v2 redesign described in the IA document above.

---

## 0. Scope reminder

- IA v2 splits the single `/subscriptions` page into 10 subpages with a persistent subnav.
- The Advanced filter drawer and Export drawer are designed here (B2 / B3) but their full behavior implementation is deferred to Cycle 008.
- Cycle 007 ships only the **safe additive prototype**: a working subnav + per-subpage header, mounted at the top of the existing `/subscriptions` page so it can be screenshotted and reviewed without breaking any current test or contract.

---

## 1. Page-level wireframes

The wireframes below assume a `1440px` desktop viewport, the existing `lg:pl-72` sidebar, and the existing `surface-card` filter strip. Every subpage starts with the same pattern: `Topbar → Filter strip → SubscriptionSubnav → SubscriptionPageHeader → page body → optional Diagnostics link`.

### 1.1 Command Center (`/subscriptions`)

```
+--------------------------------------------------------------------------------+
| Topbar  [No-drift] [Stay.ai]  [Last 30 days ▾] [All platforms ▾] [Advanced ⚙ ] |
|                                                          [Export ⤓] [Reset]    |
+--------------------------------------------------------------------------------+
| Filter strip: [Date ▾] [Platform ▾] [Segment ▾]                                |
+--------------------------------------------------------------------------------+
| Subscription analytics                                                         |
| [● Command Center] [Outcomes] [Non-Cancel] [Cancel Intake] [Cost Too High]     |
| [Business Value] [Portal+Handoff] [Containment] [Follow-Up · 3 ⬤] [Export]     |
+--------------------------------------------------------------------------------+
| Hero · subscription analytics · command center                                 |
| ┌────────────────────────────────────────────────────────────────────────────┐ |
| │ Eyebrow: SUBSCRIPTION COMMAND CENTER                                       │ |
| │ Title:   What changed in subscriptions today?                              │ |
| │ Sub:     Confirmed saves are holding; 3 calls need a human follow-up.      │ |
| │ Actions: [Open follow-up queue →] [View business value →]                  │ |
| └────────────────────────────────────────────────────────────────────────────┘ |
|                                                                                |
| KPI strip (5 max)                                                              |
| ┌──────────┬──────────┬──────────┬──────────┬─────────────────────────┐         |
| │ Saves    │ Cancels  │ Pending  │ Portal % │ Net business value      │         |
| │ 142      │ 38       │ 9        │ 71%      │ $4,820 [confirmed]      │         |
| │ Stay.ai  │ Stay.ai  │ Stay.ai  │ Portal   │ Stay.ai · finance       │         |
| │ Confirmed│ Confirmed│ Pending  │ Confirmed│ Confirmed [▾ formula]   │         |
| └──────────┴──────────┴──────────┴──────────┴─────────────────────────┘         |
|                                                                                |
| Action panel · "What needs attention now"                                      |
| ┌────────────────────────────────────────────────────────────────────────────┐ |
| │ ⚠ Pending Stay.ai final state · 9 records         → Open Outcomes          │ |
| │ ⚠ Portal completion unknown · 4 contacts          → Open Portal + Handoff  │ |
| │ ⓘ Source-health degraded · Synthflow flow v3.4    → Open Source health     │ |
| └────────────────────────────────────────────────────────────────────────────┘ |
|                                                                                |
| Trend strip · 28-day saves vs cancels                                          |
| ┌────────────────────────────────────────────────────────────────────────────┐ |
| │      ▁▂▃▅▇█▇▆▅▄▅▆█▇▅▄▅▆▇█▇▆▅▄▃▂▁                                          │ |
| │   Last window 142 [+12 vs prior]  ·  Stay.ai · System-calculated           │ |
| └────────────────────────────────────────────────────────────────────────────┘ |
|                                                                                |
| ▾ Show governance metadata, formula versions, audit reference                  |
+--------------------------------------------------------------------------------+
| Diagnostics drawer entry point (small link, bottom-right):                     |
|   [Open diagnostics view (Cycle 001 / 002 panels)]                             |
+--------------------------------------------------------------------------------+
```

### 1.2 Outcome Summary (`/subscriptions/outcomes`)

```
+--------------------------------------------------------------------------------+
| Subnav: Command Center [● Outcomes] Non-Cancel ...                              |
+--------------------------------------------------------------------------------+
| Hero: SUBSCRIPTION OUTCOMES                                                    |
|       Did calls end in confirmed save / cancel / pending?                      |
|       [Export this view ⤓]                                                     |
+--------------------------------------------------------------------------------+
| Inline alert chips: [Pending Stay.ai · 9] [Portal unknown · 4] [Trust: high]   |
+--------------------------------------------------------------------------------+
| Outcome funnel (numbered)                                                      |
| 1 Subscription contacts → 2 Stay.ai matched → 3 Action requested →             |
| 4 Stay.ai confirmed save / cancel / pending → 5 Portal completion confirmed    |
+--------------------------------------------------------------------------------+
| KPI grid (max 6 cards, was 10+ in Cycle 006):                                  |
|   Confirmed saves · Confirmed cancels · Pending Stay.ai · Missing final state  |
|   Portal link sent · Portal completion confirmed                               |
+--------------------------------------------------------------------------------+
| ▾ Show metric definitions, formula version, fingerprint, audit reference       |
+--------------------------------------------------------------------------------+
```

### 1.3 Non-Cancellation Actions (`/subscriptions/non-cancellation`)

```
+--------------------------------------------------------------------------------+
| Hero: NON-CANCELLATION ACTIONS                                                 |
|       Are skip / pause / frequency-change / address-change / SKU-swap /        |
|       reactivate / one-time add-on completing?                                 |
+--------------------------------------------------------------------------------+
| 4 KPI cards: Skip % · Pause % · Frequency change % · Reactivate %              |
+--------------------------------------------------------------------------------+
| Sparkbar list (1 row per action type):                                         |
|   Skip            · req 84  · done 71  · 84.5%  · [Stay.ai] [Confirmed]        |
|   Pause           · req 32  · done 30  · 93.7%  · [Stay.ai] [Confirmed]        |
|   Frequency chg   · req 47  · done 41  · 87.2%  · [Stay.ai] [Confirmed]        |
|   Address change  · req 12  · done 11  · 91.6%  · [Stay.ai] [Confirmed]        |
|   SKU swap        · req 8   · done 7   · 87.5%  · [Stay.ai] [Confirmed]        |
|   Reactivate      · req 9   · done 8   · 88.8%  · [Stay.ai] [Confirmed]        |
|   One-time add-on · req 5   · done 4   · 80.0%  · [Stay.ai] [Confirmed]        |
+--------------------------------------------------------------------------------+
| Drilldown drawer (right): clicking a row shows recent calls (anonymized);      |
| RBAC-gated raw IDs hidden behind the governance drawer (Level 3).              |
+--------------------------------------------------------------------------------+
```

### 1.4 Cancellation Intake (`/subscriptions/cancellation-intake`)

```
+--------------------------------------------------------------------------------+
| Hero: CANCELLATION INTAKE                                                      |
|       Which cancel reasons are coming in and where is the path going?          |
+--------------------------------------------------------------------------------+
| KPI strip (3 cards): cancel volume · save rate · pending Stay.ai final state   |
+--------------------------------------------------------------------------------+
| Reason × outcome table (7 reasons):                                            |
|   Cost too high · count · share · save % · next step → [Cost Too High funnel]  |
|   Don't need it now · ...                                                      |
|   Product issue · ...                                                          |
|   Switching brand · ...                                                        |
|   Service issue · ...                                                          |
|   Other · ...                                                                  |
|   Unknown / not captured · ...                                                 |
+--------------------------------------------------------------------------------+
```

### 1.5 Cost Too High Retention Funnel (`/subscriptions/cost-too-high`)

```
+--------------------------------------------------------------------------------+
| Hero: COST TOO HIGH RETENTION FUNNEL                                           |
|       Frequency change → 25% off → confirmed cancellation if both declined.    |
+--------------------------------------------------------------------------------+
| Numbered funnel (sequence-strict):                                             |
|   1 Cancel intent · Cost Too High            · count · save % · [Stay.ai]      |
|   2 Frequency change offer presented         · count · accept % · [offer v]    |
|   3 25% off offer presented (if step 2 dec.) · count · accept % · [offer v]    |
|   4 Confirmed cancellation (if 2 & 3 dec.)   · count · share   · [Stay.ai]     |
+--------------------------------------------------------------------------------+
| Sequence integrity panel:                                                      |
|   ⚠ blocked_by_data — sequence joins missing for offer version <v3.4           |
|   ⓘ Out of order events: 0 · Missing offer step: 0                              |
+--------------------------------------------------------------------------------+
| Right column · business value mini-card                                        |
|   Offer cost burned: $312 [estimated]                                          |
|   Gross value protected: $1,840 [estimated]                                    |
|   Net: +$1,528 [estimated · awaiting Stay.ai confirmation]                     |
+--------------------------------------------------------------------------------+
```

### 1.6 Business Value / Cost Savings (`/subscriptions/business-value`)

```
+--------------------------------------------------------------------------------+
| Hero: BUSINESS VALUE / COST SAVINGS                                            |
|       Net business value = gross protected − offer cost + support avoided.     |
|       [Export this view ⤓]                                                     |
+--------------------------------------------------------------------------------+
| Headline card:                                                                 |
|   Net Business Value Impact: $4,820 [confirmed]                                |
|   = $7,210 gross − $1,540 offer + $1,150 support avoided                       |
+--------------------------------------------------------------------------------+
| Three-column layout, state-coloured by `BusinessValueState`:                    |
|                                                                                |
|   ┌─ Confirmed (emerald) ─┬─ Estimated (sky) ─┬─ Pending / Blocked (amber) ─┐ |
|   │ Confirmed saved rev   │ Revenue saved est │ Cost too high seq metrics   │ |
|   │ Confirmed cancel ct   │ Estimated churn   │ True subscription containment│ |
|   │ Confirmed business    │ Net retained /    │ (blocked_by_data)            │ |
|   │   value impact        │   recovered val   │                              │ |
|   │ Support cost avoided  │ Net saved rev     │                              │ |
|   │ Cost per contained    │ Estimated bus val │                              │ |
|   │   call                │   impact          │                              │ |
|   └───────────────────────┴───────────────────┴──────────────────────────────┘ |
|                                                                                |
| Each card: value · state chip · ▾ formula version, owner, generated-at         |
+--------------------------------------------------------------------------------+
```

### 1.7 Portal + Handoff Performance (`/subscriptions/portal-handoff`)

```
+--------------------------------------------------------------------------------+
| Hero: PORTAL + HANDOFF PERFORMANCE                                             |
|       Link sent vs confirmed completion vs failure mode.                       |
|       Locked rule: portal link sent is not portal completion.                  |
+--------------------------------------------------------------------------------+
| Funnel (numbered):                                                             |
|   1 Link sent → 2 Opened → 3 Portal start → 4 Portal completion confirmed      |
+--------------------------------------------------------------------------------+
| Failure modes (chips): bounce · opt-out · expired · completion unknown         |
+--------------------------------------------------------------------------------+
| Channel performance row:                                                       |
|   SMS · completion 78% · [Portal · Confirmed]                                  |
|   Email · completion 64% · [Portal · Confirmed]                                |
|   Portal direct · completion 81% · [Portal · Confirmed]                        |
+--------------------------------------------------------------------------------+
```

### 1.8 Containment Quality (`/subscriptions/containment`)

```
+--------------------------------------------------------------------------------+
| Hero: CONTAINMENT QUALITY                                                      |
|       True containment: contained without repeat contact.                      |
+--------------------------------------------------------------------------------+
| Headline card:                                                                 |
|   True subscription containment rate: — [blocked_by_data]                      |
|   Reason: repeat-contact join not yet shipped (see Cycle 008 plan)             |
+--------------------------------------------------------------------------------+
| Repeat-contact heatmap rows (sparkbars):                                       |
|   1-day repeat · ▁▂▃▂▁▁▂                                                       |
|   7-day repeat · ▁▂▂▃▂▂▁                                                       |
|   30-day repeat · ▁▂▃▃▂▂▁                                                      |
+--------------------------------------------------------------------------------+
| ▾ Why drop-off / abandoned calls are excluded (locked rule)                    |
+--------------------------------------------------------------------------------+
```

### 1.9 Failure + Follow-Up Queue (`/subscriptions/follow-up`)

```
+--------------------------------------------------------------------------------+
| Hero: FAILURE + FOLLOW-UP QUEUE                                                |
|       Who needs a human? 3 contacts in queue.                                  |
+--------------------------------------------------------------------------------+
| Filter chips (subset of Advanced drawer):                                       |
|   [Missing Stay.ai final state] [Portal unknown] [Low trust] [Match conf low]  |
+--------------------------------------------------------------------------------+
| Operator table:                                                                |
|   ⏳ Contact A · cost too high · pending Stay.ai · 2h ago · [Review] [Escalate]│
|   ⚠ Contact B · portal unknown · 4h ago · [Review] [Escalate]                  |
|   ⚠ Contact C · low trust · 6h ago · [Review] [Escalate]                       |
| Bulk: [Mark reviewed] [Escalate selected] [Export selected ⤓]                  |
+--------------------------------------------------------------------------------+
```

### 1.10 Export + Audit (`/subscriptions/export-audit`)

```
+--------------------------------------------------------------------------------+
| Hero: EXPORT + AUDIT                                                           |
|       Pull a governed export with manifest, fingerprint, and audit reference.  |
+--------------------------------------------------------------------------------+
| Export drawer body, expanded inline (see §4 for full drawer spec):              |
|   Scope: [Current page ▾]   Format: [PDF + CSV ▾]                              |
|   Filters applied: [Date 30d] [Platform: All] [Cancel reason: Cost Too High]   |
|   Manifest preview:                                                            |
|     · Metric definitions (12)                                                  |
|     · Trust labels per metric (high · 9, medium · 3)                           |
|     · Freshness state per source (Stay.ai fresh, Synthflow degraded)           |
|     · Formula versions (subscription_outcomes v3.2, business_value v0.4)       |
|     · Owner: Analytics                                                         |
|     · Timestamp: 2026-05-05T19:21Z                                             |
|     · Fingerprint: 9f4c-...-7a21                                               |
|     · Audit reference: AUD-2026-05-05-118                                      |
|   [Generate export]   [Cancel]                                                 |
|                                                                                |
|   ⚠ Export blocked: low trust on `business_value` — Admin override required    |
+--------------------------------------------------------------------------------+
| Export queue                                                                   |
|   • EXP-118 · Outcomes · ready    · 2 min ago   [Download] [Manifest]          |
|   • EXP-117 · Cost Too High · running                                          |
|   • EXP-116 · Containment · blocked (sequence joins missing)                   |
+--------------------------------------------------------------------------------+
```

---

## 2. Component contract — Cycle 007 prototype

These are the only components that ship in the Cycle 007 PR. Everything else is deferred to Cycle 008 with a stable API specified here so other agents can plan around it.

### 2.1 `SubscriptionSubnav`

```ts
type SubscriptionSubnavItem = {
  id:
    | 'command-center'
    | 'outcomes'
    | 'non-cancellation'
    | 'cancellation-intake'
    | 'cost-too-high'
    | 'business-value'
    | 'portal-handoff'
    | 'containment'
    | 'follow-up'
    | 'export-audit';
  label: string;
  href: string;            // future route, e.g. '/subscriptions/outcomes'
  attentionCount?: number; // optional badge count; only set when >0
  status?: 'planned' | 'prototype' | 'live'; // Cycle 007 marks all as 'planned'
                                              // except 'command-center' which is 'prototype'
};

type SubscriptionSubnavProps = {
  items: SubscriptionSubnavItem[];
  activeId: SubscriptionSubnavItem['id'];   // controlled
  onSelect?: (item: SubscriptionSubnavItem) => void;
};
```

Behavior rules:

- Renders as a horizontal pill bar inside a `surface-card` wrapper directly below the topbar/filter strip.
- On `sm`, the bar scrolls horizontally (`overflow-x-auto`) without showing a scrollbar.
- Items with `status === 'planned'` render with a muted "Planned" chip and act as `<button type="button" disabled>` — they do **not** navigate in Cycle 007.
- Items with `status === 'prototype'` render normally and use `NavLink` (Cycle 007 only mounts `command-center`).
- Items with `attentionCount > 0` render a small `StatusPill` with the count.
- Active item uses the existing `surface-ink` style for visual consistency with the global sidebar's active state.
- Accessible: `role="navigation"`, `aria-label="Subscription analytics"`, items get `aria-current="page"` when active.

### 2.2 `SubscriptionPageHeader`

```ts
type SubscriptionPageHeaderProps = {
  eyebrow: string;             // e.g. 'SUBSCRIPTION COMMAND CENTER'
  title: string;               // single answerable question
  description?: string;        // 1-line answer/summary
  actions?: ReactNode;         // primary CTAs (e.g. Open follow-up queue)
  meta?: ReactNode;            // optional: small chip strip (source authority etc.)
};
```

Behavior rules:

- Always renders as a single `surface-card` block with eyebrow → title → description → actions, in that exact order.
- Title uses the existing `display-title` class.
- Actions render right-aligned at `lg+`, stacked at `sm`.
- The header is the **only** hero on a subpage — no other component may use `surface-ink` hero treatment on the same subpage.

---

## 3. Advanced filter drawer — full spec

### 3.1 Drawer structure

```
+----- Advanced filters ------------------------------------+ X |
|                                                               |
| Saved views: [Default] [+ Save current view]                  |
|                                                               |
| ▼ Time                                                        |
|   Date range:        [Last 30 days ▾]                         |
|   Custom range:      [from] [to]                              |
|   Comparison:        ( ) None  (●) Previous period  ( ) YoY   |
|   Stay.ai freshness: [Any ▾]   API state: [Any ▾]             |
|                                                               |
| ▼ Subscription outcome dimensions                             |
|   Cancellation reason: [☐ Cost too high ☐ Don't need it now …]|
|   Subscription status: [Any ▾]                                |
|   Outcome:             [☐ Save ☐ Cancel ☐ Pending]            |
|   Escalation state:    [Any ▾]                                |
|   Repeat contact:      [Any ▾]                                |
|                                                               |
| ▼ Source / version dimensions                                 |
|   Offer type:          [Any ▾]    Offer version: [Any ▾]      |
|   Product / SKU:       [search…]                              |
|   Trust label:         [☐ High ☐ Medium ☐ Low ☐ Untrusted]    |
|   Match confidence:    [Any ▾]                                |
|   Synthflow flow ver:  [Any ▾]                                |
|   Stay.ai action ver:  [Any ▾]                                |
|   Stay.ai offer ver:   [Any ▾]                                |
|   Current vs Future:   ( ) Current  ( ) Future  (●) Compare   |
|   Portal state:        [☐ Sent ☐ Opened ☐ Started ☐ Completed]|
|   Value range:         [from $] – [to $]                       |
|                                                               |
+----- Footer (sticky) -----------------------------------------+
| [Reset]                          [Cancel] [Save view] [Apply] |
+---------------------------------------------------------------+
```

### 3.2 Behavior

- Opens from the topbar `Advanced filters ⚙` button (right-aligned, between filter chips and `Reset filters`).
- Drawer width: 480px desktop; 100vw on `sm` (full-screen sheet).
- Each accordion section is independently collapsible; defaults open if any of its filters is non-default.
- "Apply" closes the drawer and updates the URL query string.
- "Save view" prompts for a name and persists locally + (Cycle 008+) to backend `/subscriptions/saved-views`.
- "Reset" returns every dimension to default.
- Disabled-with-tooltip rule for fields whose backend contract is not yet ready (per Agent A Cycle 007 matrix). Tooltip text: "Filter not yet available — backend contract in progress".
- Accessible: focus trapped inside drawer, escape closes, returns focus to opener button.

### 3.3 Active-filter chip strip (in topbar / under page header)

```
[Cost too high ✕] [Offer v3.4 ✕] [Trust: high ✕] [Active filters · 3 ▾] [Clear all]
```

- Each chip is keyboard-removable (`Backspace` while focused removes the filter and announces "filter removed").
- "Active filters · N" pill opens the drawer to the relevant section.

### 3.4 Saved views

- Saved view chips render at the top of the drawer.
- Selecting a chip applies that filter set and closes the drawer.
- The currently active view is shown as a pill in the topbar next to "Reset filters". Default view chip is named `Default`.

---

## 4. Export drawer — full spec

### 4.1 Drawer structure

```
+----- Export ----------------------------------------------+ X |
|                                                               |
| Scope:   ( ) Current page                                     |
|          ( ) Selected widget: [Outcome funnel]                |
|          ( ) Selected rows: 12                                |
|          (●) Custom: [select widgets ▾]                       |
|                                                               |
| Format:  [☐ PDF snapshot] [☐ CSV bundle] [☐ Audit manifest]    |
|                                                               |
| Manifest preview                                              |
| ┌───────────────────────────────────────────────────────────┐ |
| │ Filters:           [Date 30d] [Cancel reason: Cost Too High]│ |
| │ Metric defs:       12 metrics                              │ |
| │ Trust labels:      high · 9, medium · 3                    │ |
| │ Freshness:         Stay.ai fresh, Synthflow degraded       │ |
| │ Formula versions:  outcomes v3.2 · business_value v0.4     │ |
| │ Owner:             Analytics                               │ |
| │ Timestamp:         2026-05-05T19:21Z                       │ |
| │ Fingerprint:       9f4c-...-7a21                           │ |
| │ Audit reference:   AUD-2026-05-05-118                      │ |
| └───────────────────────────────────────────────────────────┘ |
|                                                               |
| ⚠ Blocked: low trust on `business_value` — Admin override     |
|   required. Permission: server-side explicit deny.            |
|                                                               |
+----- Footer (sticky) -----------------------------------------+
| [Cancel]                                       [Generate export] |
+---------------------------------------------------------------+
```

### 4.2 Blocked states (must render, must be explicit)

| Reason | Display |
|---|---|
| Insufficient permission (server-side deny) | "Export blocked: your role cannot export this scope. Audit reference logged." |
| Low trust gate | "Export blocked: one or more metrics are at low trust. Admin override required." |
| Missing source confirmation | "Export blocked: Stay.ai final state pending. Wait for confirmation or contact owner." |
| Freshness stale beyond hard-fail | "Export blocked: source data older than hard-fail threshold." |
| Manifest mismatch with metric registry | "Export blocked: a metric definition has changed since this view was rendered. Refresh and try again." |

### 4.3 Per-widget kebab → "Export this widget"

Every chart, KPI strip, and table must render a kebab menu (`⋮`) in its header with at minimum:

- "Export this widget" → opens drawer scoped to widget.
- "Show metric definition" → opens governance drawer to widget's metric.
- "Open in subpage" (when widget is rendered in a non-canonical subpage) → routes to its canonical subpage.

### 4.4 Per-row "Export selected" (table widgets)

- Tables with row selection support gain a sticky "Export selected" affordance in their footer when at least one row is selected.
- The drawer opens with `Scope = Selected rows`.

---

## 5. Progressive disclosure — implementation rules

| Level | Trigger | Component | Rule |
|---|---|---|---|
| L1 always visible | render | KPI card, chip stack | <= 1 KPI value, 1 trust chip, 1 source chip, 1 freshness chip when warning/stale, 1 action |
| L2 expander | click `▾ Show metric definition…` | `MetadataDisclosure` | Renders metric definition (1-2 sentences), formula (1 line), formula version, owner, generated-at, freshness |
| L3 drawer | click `Open governance drawer` or kebab `Show metric definition` | `GovernanceDrawer` | Renders audit reference, metric ID, fingerprint, source confirmation status, applied filters, export manifest reference, lineage breadcrumb |

All three levels reference the **same data source** so there is exactly one source of truth for metric metadata per metric; nothing diverges.

---

## 6. Visual acceptance scoring rubric

The Cycle 007 PR (and Cycle 008 follow-up that migrates panels) is scored against the following rubric. Target: 9+ on every dimension.

| Dimension | What "9" looks like |
|---|---|
| Question clarity | Eyebrow + title on every subpage states a single answerable question |
| Above-the-fold density | <= 5 KPI cards, no more than 2 panels visible without scroll |
| Action path clarity | Every problem surfaced in the page surfaces a clickable next step |
| Source authority visibility | Every metric carries Stay.ai / Shopify-context-only / Synthflow-journey-only / Portal chip inline |
| Trust label visibility | Every metric carries trust chip; low/untrusted produce a danger row |
| Filter ergonomics | Active filter chips visible; advanced drawer 1 click away |
| Export ergonomics | Page-level Export 1 click away; per-widget Export 2 clicks away |
| Governance restraint | No raw audit/fingerprint/lineage on the page surface; lives in expander or drawer |
| Persona fit | Support lead can answer "what should I do next?" within 5s of landing on Command Center |
| No-drift compliance | Stay.ai final authority, Shopify context only, portal-link != completion, system-calculated trust labels — all preserved |

---

## 7. Cycle 007 prototype — what actually ships in code

The PR ships only these prototype changes to keep risk minimal and coverage above 95%:

1. New: `apps/dashboard-web/src/components/subscription/SubscriptionSubnav.tsx`
2. New: `apps/dashboard-web/src/components/subscription/SubscriptionPageHeader.tsx`
3. New: `apps/dashboard-web/src/constants/subscriptionSubnav.ts` — the single source of truth for the 10 subnav items, their labels, planned routes, and statuses.
4. Edit: `apps/dashboard-web/src/pages/SubscriptionAnalyticsPage.tsx` — mount the subnav as the first element after the existing hero band, and add a `SubscriptionPageHeader` directly under the subnav as a `Command Center` example. **Do not remove or hide the existing Cycle 002 / 005 sections in this cycle.** They remain behind the new prototype header so all current tests continue to pass.
5. New tests: `apps/dashboard-web/src/tests/SubscriptionSubnav.test.tsx` covering: render, active item, planned-item disabled state, attention badge, prototype/live status rendering, and accessibility (`role="navigation"`, `aria-label`, `aria-current`).

Acceptance for the prototype:

- All 10 subnav items render, with `command-center` active by default and the rest disabled with the `Planned` chip.
- Existing tests in `App.test.tsx`, `SubscriptionShellStates.test.tsx`, `SubscriptionAnalyticsContractWiring.test.tsx`, `SubscriptionOutcomeAnalytics.test.tsx`, `SourceHealthLineageUi.test.tsx`, and `BranchCoverage.test.tsx` continue to pass without modification.
- Coverage gate (>=95% on statements/branches/functions/lines) holds.
- No backend file is edited.
- No fixture is renamed and no metric definition is changed.
