# Subscription Analytics — Information Architecture v2

- Document owner: Cursor Agent B (Frontend / UI / UX)
- Cycle: 007
- Wave: 01
- Status: **Authoritative IA spec — supersedes the Cycle 006 single-page subscription module**
- Model used by author: Opus 4.7
- Source-of-truth lock: Stay.ai owns subscription outcome truth; Shopify is context only; portal link sent is never portal completion; trust labels are system-calculated.

---

## 1. Why this document exists

PM rejected Cycle 006 because the subscription dashboard, though visually polished, was still effectively one massive scrollable page that a non-technical customer-support user could not comprehend. Outcome KPIs, funnels, alerts, source health, contract-wired panels, and the legacy module shell were all rendered on `/subscriptions`, with no progressive disclosure, no advanced filtering, no real export UX, and no clear action path.

This document defines a **new information architecture (IA v2)** for the subscription module. IA v2 reorganizes subscription analytics into ten focused subpages (a "command center" plus nine drilldown views), introduces an advanced filter drawer, an export drawer, and a progressive-disclosure pattern that makes the most important answer visible first and pushes governance metadata into details panels.

This IA v2 is intentionally implementable in increments. Cycle 007 ships the spec, the navigation skeleton, and the safe shell preparation. Cycle 008+ migrates panels from the existing `/subscriptions` page into the new subpages without breaking contract tests or coverage.

---

## 2. Audience model — who reads each page

| Persona | Reads first | Drills into | Almost never opens |
|---|---|---|---|
| Customer-support lead (primary persona) | Command Center, Failure & Follow-Up Queue, Cancellation Intake | Outcome Summary, Cost Too High Funnel, Portal Performance | Containment Quality, Audit/Export internals |
| Retention / lifecycle manager | Outcome Summary, Cost Too High Funnel, Business Value | Non-Cancellation Actions, Portal Performance | Audit/Export internals |
| Operations / data analyst | Containment Quality, Source health, Failure & Follow-Up Queue | All subpages, advanced filter drawer | — |
| Executive / leadership | Command Center, Business Value / Cost Savings | Outcome Summary | — |
| Compliance / governance | Export & Audit | Containment Quality, Source health | — |

The IA is anchored on the **support lead** because PM's blocker was that "non-technical support users can't make sense of this". Every other persona is served by deeper subpages, drawers, or expand-to-show-metadata blocks.

---

## 3. Top-level dashboard navigation — minimal change

The global sidebar continues to use the three groups it already exposes (`Customer outcomes`, `Operations`, `Trust & governance`). The only change at the top level is that the `Subscriptions` item gains an expandable subnav. Other top-level routes (`overview`, `cancellations`, `retention`, `order_status`, `escalations`, `data_quality`, `governance`, `exports`) are unchanged in this cycle.

```
Customer outcomes
  └─ Subscriptions      ◄── expands to the 10 subpages defined in §4
Operations
Trust & governance
```

Why this is safe: only the subscription branch is restructured. The shared shell, filter strip, topbar, governance page, and other modules continue to render identically and their existing tests continue to pass.

---

## 4. Subscription module subpages (the ten required views)

Every subpage must satisfy these properties before it is considered IA-compliant:

1. **Single answerable question in the eyebrow + title.** "Are saves holding?" not "Subscription Analytics".
2. **Above-the-fold summary in <= 4 visible primitives.** Hero band + one KPI strip + one primary visual + one action card.
3. **Progressive disclosure** for governance metadata, raw IDs, formula text, and audit reference (see §6).
4. **Per-page export action** from the page header (see §5).
5. **Filter drawer parity** — every page renders filter chips and obeys the advanced filter drawer (see §5).
6. **Source-of-truth chips** rendered inline with the data they govern, not in a separate compliance block.
7. **Empty / pending / blocked / permission-denied states** rendered as friendly cards, not raw error text.

The ten required subpages, in left-to-right tab order:

| # | Subpage | Route | One-line purpose | Primary persona |
|---|---|---|---|---|
| 1 | Command Center / Overview | `/subscriptions` (default) | "What changed in subscriptions today?" | Support lead |
| 2 | Outcome Summary | `/subscriptions/outcomes` | "Did calls end in confirmed save / cancel / pending?" | Retention manager |
| 3 | Non-Cancellation Actions | `/subscriptions/non-cancellation` | "Are skip / pause / frequency-change / address-change / SKU-swap / reactivate / one-time add-on completing?" | Support lead |
| 4 | Cancellation Intake | `/subscriptions/cancellation-intake` | "Which cancel reasons are coming in and where is the path going?" | Retention manager |
| 5 | Cost Too High Retention Funnel | `/subscriptions/cost-too-high` | "Frequency change → 25% off → confirmed cancel: where do we lose them?" | Retention manager |
| 6 | Business Value / Cost Savings | `/subscriptions/business-value` | "Net business value: gross protected − offer cost + support avoided." | Executive |
| 7 | Portal + Handoff Performance | `/subscriptions/portal-handoff` | "Link sent vs confirmed completion vs failure — and where the handoff broke." | Support lead |
| 8 | Containment Quality | `/subscriptions/containment` | "True containment: contained without repeat contact." | Operations / data |
| 9 | Failure + Follow-Up Queue | `/subscriptions/follow-up` | "Who needs a human, and which were the failures?" | Support lead |
| 10 | Export + Audit | `/subscriptions/export-audit` | "Pull a governed export with manifest, fingerprint, and audit reference." | Compliance |

> Each subpage is its own React route component (Cycle 008+) and unmounts the others. None of them re-renders the entire subscription dataset. This is the structural fix for the "single massive scroll page" problem.

### 4.1 Per-subpage content blueprint

The blueprint below is condensed; the full wireframes live in
`project-management/reports/cycle-007/design/subscription_ia_v2_wireframe_spec.md`.

#### 4.1.1 Command Center (default `/subscriptions`)

- Hero band (existing `surface-ink`): "Subscription analytics command center" + 1 sentence mission.
- KPI strip (5 cards max): Confirmed saves, Confirmed cancels, Pending Stay.ai, Portal completion rate, Net business value.
- Action panel "What needs attention now" (3 rows max): pending Stay.ai count, follow-up queue count, source-health alert count — each row links to the subpage that resolves it.
- Trend strip: 28-day saves vs cancels small AreaChart, no axis cruft.
- Subnav row beneath the hero shows the 10 subpage tabs, current = `Command Center`.
- Footer card: "Looking for governance metadata?" → opens the metadata drawer (collapsed by default).

#### 4.1.2 Outcome Summary (`/subscriptions/outcomes`)

- Reuses Cycle 005 `SubscriptionOutcomesView`, but the heavy `MetadataPanel` and `AlertsPanel` collapse into:
  - Inline alert chips at the top (1-line summary).
  - A "Show metric definitions, formula version, fingerprint, audit reference" expander.
- Outcome funnel kept as the primary visual. Numbered stages, end-to-end summary chip.
- KPI grid retained but compressed to 6 cards (was 10+).
- "Open follow-up queue" CTA in the action card when `missing_stayai_final_state_total > 0`.

#### 4.1.3 Non-Cancellation Actions (`/subscriptions/non-cancellation`)

- 4 KPI cards: Skip completion rate, Pause completion rate, Frequency change completion rate, Reactivate completion rate.
- Single horizontal sparkbar list with one row per action type (Skip / Pause / Frequency change / Address change / SKU swap / Reactivate / One-time add-on), each row showing: requested → completed → completion rate → trust chip → source authority chip.
- Drilldown drawer: clicking any row opens a side drawer with the row's call examples (anonymized by default; raw IDs are gated by RBAC and the metadata expander).

#### 4.1.4 Cancellation Intake (`/subscriptions/cancellation-intake`)

- Cancel reason taxonomy table: 7 reasons with count, share, save rate, primary next-step.
- Reason "Cost Too High" links to `/subscriptions/cost-too-high`.
- Top bar shows aggregated cancel volume, save rate, and an alert chip if any reason is missing Stay.ai confirmation.
- Action card: "Open the Cost Too High funnel" / "Open the follow-up queue".

#### 4.1.5 Cost Too High Retention Funnel (`/subscriptions/cost-too-high`)

- Numbered funnel: cancel intent (Cost Too High) → frequency change offer → 25% off offer → confirmed cancellation if both declined.
- Per-stage offer version chip (offer type + offer version), source authority, save count, decline count.
- "Sequence integrity" panel that flags out-of-order or missing offer steps and renders the `blocked_by_data` state when sequence joins are missing.
- Business-value impact mini-card on the right: offer cost burned vs gross value protected.

#### 4.1.6 Business Value / Cost Savings (`/subscriptions/business-value`)

- Renders `GET /subscriptions/business-value` (Agent A Cycle 007 stub).
- Three columns: Confirmed (green), Estimated (blue), Pending / Unknown / Blocked (amber/grey).
- Headline metric: Net Business Value Impact = gross_value_protected − offer_cost + support_cost_avoided.
- Sub-cards: Gross value protected, Offer cost (broken down: discount, free shipping, incentive), Support cost avoided, Cost per contained call, Net value per contained call, Automation ROI, Retention ROI, Estimated churn prevented, Confirmed churn prevented, Revenue at risk, High-value churn risk count, Revenue leakage after save.
- Each card carries a state chip (`confirmed`, `estimated`, `pending`, `unknown`, `blocked_by_data`) and an inline expander for formula version + owner + generated-at.
- "Export this view" action in the page header (CSV + PDF + manifest).

#### 4.1.7 Portal + Handoff Performance (`/subscriptions/portal-handoff`)

- Funnel: link sent → opened → portal start → portal completion confirmed.
- Failure mode breakdown: bounce, opt-out, expired, completion unknown.
- Locked rule chip is always visible: "Portal link sent is not portal completion".
- Handoff performance row: SMS / email / portal channel completion rates with a trust chip per channel.

#### 4.1.8 Containment Quality (`/subscriptions/containment`)

- True containment rate KPI card (currently `missing` per Agent A Cycle 007 matrix; the panel must render the `blocked_by_data` state cleanly while the data contract is built).
- Repeat-contact heatmap (1 / 7 / 30 day windows) — small inline `SparklineBar` rows, not a big chart.
- Abandoned/drop-off exclusion explainer (one paragraph, collapsed inside an expander).

#### 4.1.9 Failure + Follow-Up Queue (`/subscriptions/follow-up`)

- Operator-facing table with a single "needs human" badge per row.
- Filterable by failure reason: missing Stay.ai final state, portal completion unknown, low trust, low match confidence, source-health degraded.
- Bulk actions: mark reviewed, escalate, export selected rows. RBAC-gated; the UI shows the gated state when permission is denied.

#### 4.1.10 Export + Audit (`/subscriptions/export-audit`)

- Dedicated subpage that surfaces the export drawer "expanded".
- Renders the export manifest preview, the fingerprint, the audit reference, the formula versions of every metric included, the active filter set, and the trust/freshness state at the time of export.
- Export queue list with status (`queued`, `running`, `ready`, `blocked`), each row linking to its manifest.

---

## 5. Subscription subnav strategy

The subnav is a **persistent secondary navigation** that renders directly under the topbar whenever the user is inside any `/subscriptions/...` route.

```
+----------------------------------------------------------------------------------+
| Topbar (route-aware page title, no-drift chips, advanced filter button, export)  |
+----------------------------------------------------------------------------------+
| Subscription analytics · subnav                                                  |
| [Command Center] [Outcomes] [Non-Cancel] [Cancel Intake] [Cost Too High]         |
| [Business Value] [Portal + Handoff] [Containment] [Follow-Up] [Export & Audit]   |
+----------------------------------------------------------------------------------+
```

Implementation rules:

- Subnav is a `nav role` element with horizontal scroll on small breakpoints (`sm`) and pills wrapping at `md+`.
- Each tab shows a single-word label with a tiny tone chip when there is unread/attention state (e.g. "Follow-Up · 3 new").
- The current tab uses the existing `surface-ink` style of the global sidebar's active state for consistency.
- The default landing route inside `/subscriptions` is the **Command Center**; the legacy `/subscriptions` URL is preserved for backward compatibility (Cycle 008 will introduce `/subscriptions/<sub>` routes, with `/subscriptions` rendering Command Center).

---

## 6. Progressive disclosure pattern

To eliminate the Cycle 006 "raw governance metadata everywhere" overload, IA v2 uses one canonical disclosure pattern.

### 6.1 Level 1 — Always visible

- 1 KPI value
- 1 trust chip (e.g. "Confirmed")
- 1 source authority chip (e.g. "Stay.ai")
- 1 freshness chip when freshness is `warning` or `stale`
- Action link (if any) or expander affordance

### 6.2 Level 2 — One click expander (collapsed by default)

- Metric definition (1-2 sentences)
- Formula (1 line)
- Formula version
- Owner
- Generated at
- Last sync, freshness state

### 6.3 Level 3 — "Open governance drawer"

- Full audit reference
- Metric ID and fingerprint
- Source confirmation status
- Filters applied at calculation time
- Export manifest reference
- Lineage breadcrumb

This is the rule that demotes the "wall of metadata" pattern that PM rejected.

---

## 7. Cross-cutting components introduced by IA v2

These are the new shared primitives the subpages depend on. They are listed here so Agent C and Agent D can coordinate around them. Cycle 007 ships the **prototype** of `SubscriptionSubnav` and `SubscriptionPageHeader` only; the rest follow in Cycle 008.

| Component | Path (proposed) | Purpose |
|---|---|---|
| `SubscriptionSubnav` | `apps/dashboard-web/src/components/subscription/SubscriptionSubnav.tsx` | Persistent secondary nav for the 10 subpages. **Shipped in Cycle 007 prototype.** |
| `SubscriptionPageHeader` | `apps/dashboard-web/src/components/subscription/SubscriptionPageHeader.tsx` | Per-subpage hero with eyebrow, title, single-question subtitle, action slot. **Shipped in Cycle 007 prototype.** |
| `MetadataDisclosure` | `apps/dashboard-web/src/components/subscription/MetadataDisclosure.tsx` | Level-2 expander wrapper. (Cycle 008.) |
| `GovernanceDrawer` | `apps/dashboard-web/src/components/subscription/GovernanceDrawer.tsx` | Level-3 drawer. (Cycle 008.) |
| `AdvancedFilterDrawer` | `apps/dashboard-web/src/components/subscription/AdvancedFilterDrawer.tsx` | The advanced filter UX defined in §8. (Cycle 008.) |
| `ExportDrawer` | `apps/dashboard-web/src/components/subscription/ExportDrawer.tsx` | The export UX defined in §9. (Cycle 008.) |
| `FollowUpTable` | `apps/dashboard-web/src/components/subscription/FollowUpTable.tsx` | Operator-facing table with bulk actions. (Cycle 008.) |
| `BusinessValueGrid` | `apps/dashboard-web/src/components/subscription/BusinessValueGrid.tsx` | Renders Agent A's `/subscriptions/business-value` contract. (Cycle 008.) |

Where Cycle 008 introduces a new path, the legacy Cycle 002 / 005 components remain in place and are progressively retired once each subpage achieves parity.

---

## 8. Advanced filter architecture (summary; full spec in wireframe doc §3)

The dashboard currently exposes only date range, platform, and segment in `DashboardFilterContext`. IA v2 introduces a dedicated **Advanced filter drawer**, opened from the topbar's "Advanced filters" button (right-aligned, next to "Reset filters").

### 8.1 Filter dimensions (required)

- Date presets and custom range
- Comparison period (none / previous period / previous year)
- Cancellation reason (7 official reasons)
- Offer type and offer version
- Subscription status
- Product / SKU
- Match confidence
- Portal state (taxonomy: link sent / opened / started / completed / failed / unknown)
- Save / Cancel / Pending outcome
- Escalation state
- Repeat contact (within 1d / 7d / 30d)
- Value range
- Trust label
- Synthflow flow version
- Stay.ai action / offer version
- Stay.ai freshness / API state
- Current vs Future flow state (compare current production flow to a candidate flow)

### 8.2 Drawer behavior

- Opens from the right; max width 480px on desktop; full-width sheet on `sm`.
- Sticky footer with **Apply**, **Reset**, **Save view**, **Cancel** buttons.
- Filters are grouped into three accordion sections so the drawer is never visually full:
  1. **Time** (date range, custom range, comparison period, freshness/API state).
  2. **Subscription outcome dimensions** (cancellation reason, subscription status, save/cancel/pending outcome, escalation state, repeat contact).
  3. **Source / version dimensions** (offer type, offer version, product/SKU, trust label, match confidence, flow version, Stay.ai action/offer version, current vs future flow state, portal state, value range).
- Saved views: chip strip across the top of the drawer + topbar saved-view selector.
- Unknown / blocked filters (ones whose backend contract is not yet ready per Agent A's matrix) render as **disabled with a tooltip explaining why** rather than being hidden — this preserves the design's promise without faking data.

### 8.3 Active filter chips

- Whenever any filter is non-default, the topbar shows an "Active filters (N)" pill that opens the drawer to the relevant section.
- Each active filter renders as a chip below the topbar with a per-chip clear button.
- "Clear all" and "Save current as view" are single-click actions.

---

## 9. Export architecture (summary; full spec in wireframe doc §4)

Cycle 006 buried export UX inside a single "Export readiness" panel. IA v2 promotes export to a first-class action on every subpage.

### 9.1 Export entry points

| Entry point | Behavior |
|---|---|
| Page header "Export this view" button | Opens the **Export drawer** with the current page preselected. |
| Per-widget kebab menu → "Export this widget" | Opens the drawer scoped to that widget/chart. |
| Per-table row selection → "Export selected rows" | Opens the drawer scoped to the selected row set. |
| Topbar "Export" affordance | Opens the drawer with no scope preselected; the user picks. |
| `/subscriptions/export-audit` subpage | Renders the drawer expanded inline with the audit queue. |

### 9.2 Export options (drawer body)

- Export current page (PDF snapshot + CSV bundle).
- Export selected widget/chart (PNG + CSV).
- Export filtered table rows (CSV).
- Export PDF snapshot (visual fidelity for compliance).
- Export audit manifest only.
- "Export blocked" state with a clear reason: insufficient permissions, low trust gate, missing source confirmation, freshness stale beyond hard-fail, or licensing.

### 9.3 Manifest preview (always visible in the drawer)

- Active filters
- Metric definitions of every metric included
- Trust labels per metric
- Freshness state per source
- Formula versions
- Owner
- Timestamp
- Fingerprint
- Audit reference

The manifest preview is the **anti-drift** affordance: an export that would produce a row whose metric definition does not match the live registry must be visibly rejected with a "manifest mismatch" message, not silently completed.

### 9.4 RBAC + governance

- `CS Agent` role: can export filtered table rows (CSV) but not the full subpage PDF.
- `Data Analyst` and `Admin` roles: can export everything.
- Server-side explicit-deny remains the source of truth; the drawer renders the gated state when the API enforces the policy.
- Every export emits an audit row server-side; the UI shows a confirmation toast with the audit reference and the manifest fingerprint.

---

## 10. Cognitive-load reduction patterns (B4)

To stop reading like a "wall of equally-important boxes":

1. **Eyebrow asks the question.** "Are confirmed saves holding?" not "Save Rate".
2. **Headline answer at hero level.** One number with one trust chip.
3. **At most 5 KPI cards above the fold per subpage.**
4. **Action queues are first-class.** A subpage that surfaces a problem must surface the recommended action.
5. **Definitions hide in expanders.** Never inline a 12-row metadata grid.
6. **Source authority is a chip, not a sentence.** `Stay.ai`, `Stay.ai · Synthflow`, `Shopify (context only)`, `Synthflow (journey only)`.
7. **Advanced is opt-in.** Advanced filters and audit metadata live behind drawers.
8. **No more legacy backward-compatibility sections on hero pages.** Cycle 001 module shell and Cycle 002 contract-wired view move to a "Diagnostics" drawer reachable only from the Command Center "Diagnostics" link, not stacked under every other subpage.

---

## 11. Visual acceptance criteria (B6)

The IA v2 implementation is rejected if any of the following is true:

- A subpage scrolls more than ~2 viewport heights at 1440px.
- The same widget appears on more than one subpage with different definitions.
- Governance metadata is rendered in more than 3 lines without an expander.
- Export action is more than 1 click away on any subpage.
- Filter drawer is more than 1 click away on any subpage.
- Active filters are not visible as chips on the page they affect.
- A non-technical support user cannot answer "what should I do next?" within 5 seconds of landing on Command Center.
- Any subpage uses raw "starter" / "skeleton" / "Wave N" / "Agent X" copy in production-visible UI.

---

## 12. Out of scope for Cycle 007

To avoid a risky full rewrite, the following work is **deferred** to Cycle 008+:

- Migrating Cycle 002 / 005 panels into individual subpage routes.
- Implementing the Advanced filter drawer behavior (only the design + topbar entry-point is specified here).
- Implementing the Export drawer behavior (only the design + manifest schema reference is specified here).
- Backend filter-set persistence and saved-view contracts (per Agent A Cycle 007 matrix gap list).
- Splitting `DashboardFilterContext` into `SubscriptionFilterContext`.

Cycle 007 ships:

- This IA spec.
- The wireframe spec (`project-management/reports/cycle-007/design/subscription_ia_v2_wireframe_spec.md`).
- A safe, additive prototype of `SubscriptionSubnav` + `SubscriptionPageHeader` mounted at the top of the existing `SubscriptionAnalyticsPage` so PM can see the subnav working end-to-end without breaking any existing test, route, or coverage gate.

---

## 13. Handoff

- **Agent A (Backend / Contracts):** prioritize the filter/export contract gaps already enumerated in `project-management/reports/cycle-007/metric-gap/subscription-required-vs-current-metric-matrix.md` §"Advanced filter/export backend contract gap review", in the order required by §8.1 above. Cost Too High sequence joins, offer version, repeat contact, and saved-view persistence are the highest leverage.
- **Agent C (Data / dbt):** confirm dimensional joins for offer version, repeat contact, post-save leakage, true subscription containment, and high-value churn risk so the IA v2 subpages can render their headline metrics from canonical tables.
- **Agent D (QA / Release):** add e2e + contract coverage for (1) the new `SubscriptionSubnav` route map, (2) the disabled state on filter dimensions whose contract is not yet ready, (3) the export drawer "blocked" reasons, and (4) the progressive-disclosure expander behaviors. Maintain >= 95% coverage gate. Capture screenshots of each subpage skeleton (initially with placeholder content) for regression baselining when Cycle 008 starts migrating panels.
