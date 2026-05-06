# Cycle 006 Screenshot — Independent UX Issue Register (Cycle 007, Agent C)

- Audit owner: Cursor Agent C — Second UI/UX designer / independent UX auditor
- Cycle: 007
- Wave: 01
- Model used: Opus 4.7
- Date: 2026-05-06
- Source-of-truth lock (preserved on every recommendation):
  - Stay.ai owns subscription outcome truth.
  - Shopify is context only.
  - Synthflow is journey-event only.
  - Portal link sent is **not** portal completion.
  - Trust labels are system-calculated; the UI must never expose a manual elevation affordance.
  - Permissions are server-side explicit-deny.

---

## 0. Why this register exists and how it was built

PM rejected Cycle 006 because the dashboard, although visually polished, is still organized as one massive subscription page that a non-technical customer-support user cannot navigate. Agent B (Cycle 007) responded with an IA v2 spec and a safe additive prototype — a subnav and a Command Center page header at the top of `/subscriptions`. Agent B did **not** actually migrate any panels. The Cycle 006 visible UI is therefore still rendered live underneath the Cycle 007 prototype shell.

Agent C is no longer QA / governance during UI/UX recovery. Agent C is now the **second designer** on this cycle. This register is the foundation for that second-designer audit and is the input Agent D will use as a checklist when QA-ing Agent B's Cycle 008 implementation.

**98.5% confidence rule.** Anything I cannot rate as ultra-professional with at least 98.5% confidence is logged. The bar is "would a non-technical customer-support agent who has never seen Stay.ai's internal architecture be able to use this without help?"

**Evidence basis.** The Cycle 006 PM screenshot pack (`01-overview-page-polished.png` … `08-governance-page-polished.png`) is referenced in:

- `project-management/reports/cycle-006/agent-b-wave-01-cycle-006-report.md` §B7 (every shot enumerated and described).
- `project-management/reports/cycle-006/agent-c-wave-01-cycle-006-report.md` §C3 (visual scorecard).
- `project-management/reports/cycle-007/agent-b-wave-01-cycle-007-report.md` §"Source files reviewed" (notes the screenshots folder is empty in the current checkout — Agent B relied on the Cycle 006 report descriptions; Agent C is doing the same).

The screenshots PNGs are not present in this checkout, so this audit is grounded in the **code that actually renders them**, which I read end-to-end. That code has not changed since Cycle 006 except for Agent B's additive Cycle 007 prototype subnav + page header. Every issue logged below cites the exact file and line range that produces the visible UI in question, which means the audit is reproducible without the PNG files.

**Categories audited (per cycle prompt).** Layout organization · page density · navigation clarity · non-technical support-user comprehension · visual hierarchy · advanced filters · exports · drilldowns · metric clarity · business-value visibility · source-truth messaging · actionability · chart usefulness · table usefulness · terminology / jargon · accessibility / readability.

**Severity scale.**

| Severity | Meaning |
|---|---|
| **P0 / blocker** | Confuses or blocks a non-technical support user on first use. Must fix before Cycle 008 ships. |
| **P1 / high** | Reduces trust or causes a wrong interpretation of the data. Must fix in Cycle 008. |
| **P2 / medium** | Hurts ergonomics or polish but not interpretation. Fix in Cycle 008 or 009. |
| **P3 / low** | Cosmetic / nice-to-have. Optional. |

**Confidence column.** "Confidence that this issue is real and worth fixing." Lower confidence is still logged when below 98.5% (per the rule).

---

## 1. Cross-cutting structural issues (apply to multiple screenshots)

These are not tied to one screenshot; they're about how the pages are composed and how a support user navigates between them.

### S1.01 — One massive `/subscriptions` page is still rendered (P0)

- **Screenshot:** `02-subscription-analytics-page-polished.png`, `03-subscription-pending-stayai.png`, `04-subscription-missing-stayai.png`.
- **Category:** layout organization, page density, navigation clarity.
- **Confidence:** 99.5%.
- **Evidence:** `apps/dashboard-web/src/pages/SubscriptionAnalyticsPage.tsx` mounts, in a single vertical stack and in this order:
  1. `SubscriptionSubnav` (Cycle 007 prototype, 10 tabs, 9 disabled).
  2. `SubscriptionPageHeader` (Command Center prototype hero).
  3. The original Cycle 005 full-bleed `surface-ink` hero band (a second hero on the same page).
  4. `SubscriptionOutcomesView` (Cycle 005: status bar + 4 scenario chips + alerts + 6-card KPI grid + 3-card rate grid + funnel + metadata panel).
  5. `SourceHealthView` (its own multi-panel module).
  6. `SubscriptionAnalyticsView` (Cycle 002: another status bar + 2 scenario chips + final-state banner + alerts + overview grid + portal panel + Shopify panel + Synthflow panel + source-confirmation panel + metric metadata panel).
  7. `DashboardModulePage` (Cycle 001 module shell).
  8. A footer line "Legacy sections kept mounted for regression coverage".
- **Why this confuses support users:** the page reads as ≥6 different "subscription dashboards" stacked on top of each other. The same metrics are restated under different headings ("subscription contacts in scope" / "subscription contacts total" / "Stay.ai-confirmed retained outcome"). Density is extreme; the page is several viewport heights tall on a 1440px display.
- **Recommended fix (Agent B Cycle 008):** physically migrate panels into the 10 IA v2 subpages and unmount everything that does not belong on Command Center. The Cycle 002 view, source-health view, and Cycle 001 module shell must move to `/subscriptions/diagnostics` (or be retired) — they cannot remain stacked under Command Center "for regression coverage". Tests that depend on them should be retargeted.

### S1.02 — "Legacy sections kept mounted for regression coverage" footer is internal language in production UI (P0)

- **Screenshot:** `02-subscription-analytics-page-polished.png`.
- **Category:** terminology / jargon, non-technical support-user comprehension.
- **Confidence:** 99.5%.
- **Evidence:** `SubscriptionAnalyticsPage.tsx` lines 162–165 render `Legacy sections kept mounted for regression coverage` with `History` and `GitBranch` icons.
- **Support-user impact:** "regression coverage" and "GitBranch" are engineering vocabulary. A CS agent will assume the dashboard is broken or unfinished.
- **Fix:** delete this line. The Diagnostics drawer (per IA spec §10) is the right place; the entry-point label in the support UI must read "Open diagnostic / advanced view" with no engineering vocabulary.

### S1.03 — Two heroes on the same subpage (P0)

- **Screenshot:** `02-subscription-analytics-page-polished.png`.
- **Category:** visual hierarchy, layout organization.
- **Confidence:** 99.5%.
- **Evidence:** `SubscriptionAnalyticsPage.tsx` renders `SubscriptionPageHeader` (Cycle 007 prototype hero) and immediately below it the Cycle 005 `surface-ink` hero band (`section aria-labelledby="subscription-hero-heading"`, lines 71–120). Both are full-width, both have eyebrow + display title + subcopy.
- **Support-user impact:** the eye doesn't know which is the page title. The Cycle 005 hero says "Stay.ai subscription outcome intelligence" while the Cycle 007 prototype hero says "What changed in subscriptions today?" — two different page promises.
- **Fix (per IA wireframe spec §2.2):** "The header is the only hero on a subpage — no other component may use surface-ink hero treatment on the same subpage." Cycle 008 must remove the Cycle 005 `surface-ink` band from Command Center.

### S1.04 — Two sets of "scenario chips" on the same page expose implementation state to end users (P0)

- **Screenshot:** `02-subscription-analytics-page-polished.png`, `03-subscription-pending-stayai.png`, `04-subscription-missing-stayai.png`.
- **Category:** non-technical support-user comprehension, terminology / jargon.
- **Confidence:** 99.0%.
- **Evidence:**
  - `SubscriptionOutcomesView.tsx` lines 16–41 + 160–188 — 4 toggle buttons: `Baseline`, `Pending Stay.ai`, `Missing Stay.ai final state`, `Empty`. Tooltip helpers say "Stay.ai-confirmed mix of cancellation, retention, and pending outcomes" and similar.
  - `SubscriptionAnalyticsView.tsx` lines 17–28 + 93–121 — 2 toggle buttons: `Baseline`, `Missing Stay.ai confirmation`. Tooltip: "No Stay.ai final state — UI must show blocked outcomes and low trust."
- **Support-user impact:** these are demo-state toggles. A non-technical agent will think they are real filters that change the dashboard's data. The word "scenario" has no business meaning to them. The two views also disagree on the option set (4 vs 2 scenarios).
- **Fix:** scenario toggles must not exist in production UI. Move them behind a Diagnostics drawer (RBAC-gated) for QA, or remove them entirely once `analytics-api` returns deterministic data. Cycle 008 must hide them from Support, Retention, and Executive personas.

### S1.05 — "Cycle 002 contract-wired view" and "Cycle 001 dashboard module shell" section titles are internal-process language (P0)

- **Screenshot:** `02-subscription-analytics-page-polished.png`.
- **Category:** terminology / jargon.
- **Confidence:** 99.5%.
- **Evidence:** `SubscriptionAnalyticsPage.tsx` lines 138–146 / 148–160 use `SectionHeader` titles "Cycle 002 contract-wired subscription view" and "Cycle 001 dashboard module shell" with descriptions like "Retained alongside the elevated outcome view above for backward compatibility." This is exactly the "Wave N / Agent X" anti-pattern banned by IA spec §11.
- **Support-user impact:** customers see internal cycle numbers and the words "contract-wired" and "module shell". The dashboard reads like an internal release note, not a product.
- **Fix:** retire both labels. If these panels must remain in Cycle 008 they must move to Diagnostics with neutral copy (e.g. "Subscription source detail", "Module shell — diagnostic only"). The phrase "Cycle 00N" or "Wave 00N" is banned in any production-visible label.

### S1.06 — `analytics-api`, `contract`, `fixture`, `shape mismatch` are exposed as user-facing strings (P0)

- **Screenshot:** `02-subscription-analytics-page-polished.png`, `03-subscription-pending-stayai.png`, `04-subscription-missing-stayai.png`.
- **Category:** terminology / jargon, non-technical support-user comprehension.
- **Confidence:** 99.5%.
- **Evidence:**
  - `SubscriptionOutcomesView.tsx` lines 117–158 — "Loading subscription outcomes from analytics-api…", "Live API contract loaded", "rendering shared-contract preview only", "Contract preview from fixture (analytics-api unreachable / shape mismatch / analytics-api returned a malformed contract)".
  - `SubscriptionAnalyticsView.tsx` lines 50–91 — same pattern, repeated.
- **Support-user impact:** every one of these strings is engineering vocabulary. When the API is degraded, the user sees "shape mismatch" and "analytics-api unreachable" — they have no way to act on this. They will assume the dashboard is broken and stop using it.
- **Fix:** introduce a small "system status" chip that reads, in order of severity:
  - Live: "Live data — refreshed N min ago".
  - Fallback (no permission): "We don't have the right access yet — showing the last reviewed snapshot."
  - Fallback (API down): "Live data temporarily unavailable — showing the last reviewed snapshot."
  - Fallback (data drift): "Live data temporarily unavailable — please refresh in a few minutes."
- Server-side details (`shape mismatch`, exception messages) belong in the Diagnostics drawer (governance Level 3), not in the page chrome.

### S1.07 — There is no global advanced filter drawer (P0)

- **Screenshots:** all eight.
- **Category:** advanced filters, navigation clarity.
- **Confidence:** 99.5%.
- **Evidence:** `Topbar.tsx` lines 59–86 only show three chip-rendered filters (Date / Platform / Segment) plus a "Reset filters" button. There is no "Advanced filters" button. `SubscriptionAnalyticsPage.tsx` shows only a *disabled, prototype* "Advanced filters · planned" pill on the Cycle 007 page header. None of the dimensions required by the cycle prompt (cancellation reason, offer version, trust label, repeat contact, value range, portal state, …) are reachable.
- **Support-user impact:** the support lead cannot answer "which calls were Cost Too High that we saved" or "which calls had low trust" with the dashboard as-shipped. They must export and filter in Excel, which violates the entire cycle premise.
- **Fix:** ship the Advanced filter drawer per IA wireframe spec §3 in Cycle 008. Backend gaps (Agent A matrix) render as "Filter not yet available — backend contract in progress" — the drawer itself must exist.

### S1.08 — There is no real export UX (P0)

- **Screenshots:** all eight.
- **Category:** exports, actionability.
- **Confidence:** 99.5%.
- **Evidence:** the only "Export" affordance on `/subscriptions` is the disabled prototype "Export this view · planned" button on the Cycle 007 page header (`SubscriptionAnalyticsPage.tsx` lines 58–66). The Cycle 006 `ExportReadinessPanel` only renders on the Governance page.
- **Support-user impact:** the cycle prompt explicitly requires "What can I export for my manager?" as a workflow. As shipped this workflow does not exist. The user cannot get a CSV to a manager without engineering help.
- **Fix:** ship the Export drawer (IA wireframe spec §4). Cycle 008 must include at least: page-header "Export this view", per-widget kebab "Export this widget", per-row "Export selected rows", and `/subscriptions/export-audit`. RBAC server-side explicit-deny rules apply.

### S1.09 — There is no follow-up queue, even though the IA promises "3 needs attention" (P0)

- **Screenshot:** `02-subscription-analytics-page-polished.png`.
- **Category:** actionability, navigation clarity.
- **Confidence:** 99.5%.
- **Evidence:** the `SubscriptionSubnav` shows a `Follow-Up · 3` attention badge (hard-coded in `apps/dashboard-web/src/constants/subscriptionSubnav.ts` `attentionCount: 3`). Clicking it does nothing because the tab is `status: 'planned'` (disabled).
- **Support-user impact:** the dashboard advertises "3 calls need a human" and offers no way to act on it. The promise of an action queue is the single most important Workflow #1 ("What happened with subscription calls today?" → "Open follow-up queue") and it is unreachable.
- **Fix:** ship `/subscriptions/follow-up` with at least a read-only operator table in Cycle 008. Until then, the badge must be removed from the prototype subnav so the dashboard does not advertise an action it cannot deliver.

### S1.10 — Active filter chips, saved views, comparison period — all unimplemented anywhere (P0)

- **Screenshots:** all eight.
- **Category:** advanced filters, source-truth messaging.
- **Confidence:** 99.0%.
- **Evidence:** the topbar shows filter values as static chips but no chip is keyboard-removable; there is no "Active filters · N" pill, no "Save view", no "Compare to previous period", no "Compare to previous year".
- **Support-user impact:** the user cannot see what they filtered to or compare today vs last week. Workflow #4 ("Which customers need follow-up?") and #5 ("Which offer path is working?") both depend on save / comparison.
- **Fix:** Cycle 008 ships chip strip, saved views drawer entry, and comparison-period control per IA spec §3 / §3.3 / §3.4.

### S1.11 — Top-level page titles are still flat / generic / engineering-flavoured (P1)

- **Screenshot:** all eight.
- **Category:** terminology / jargon, non-technical support-user comprehension, visual hierarchy.
- **Confidence:** 98.5%.
- **Evidence:** `Topbar.tsx` lines 6–16 expose `PAGE_META` titles — "Cross-platform support intelligence" (overview), "Stay.ai subscription outcome intelligence" (subscription), "Source freshness, contracts, and trust" (data quality), "RBAC, exports, and audit controls" (governance).
- **Support-user impact:** "RBAC", "contracts", "intelligence" are jargon. None of these answer "what am I looking at and what can I do?".
- **Fix:** retitle to questions or operator-facing answers per the plain-language copy guide (`docs/07_dashboard_ui_ux/subscription_plain_language_copy_system.md`):
  - Overview → "Today across all support channels".
  - Subscription → "Subscription calls today".
  - Cancellations → "Confirmed cancellations".
  - Retention → "Calls we saved".
  - Data quality → "How fresh is our data?".
  - Governance → "Who can see and export what".

### S1.12 — Sidebar footer shows internal version + "no-drift" (P2)

- **Screenshot:** all eight (sidebar visible everywhere).
- **Category:** terminology / jargon.
- **Confidence:** 98.5%.
- **Evidence:** `Sidebar.tsx` lines 116–122 — `v0.9 · cycle 006` + green pill `no-drift`.
- **Support-user impact:** "cycle 006" and "no-drift" are internal vocabulary. CS agents have no idea what "no-drift" means.
- **Fix:** remove `cycle 006` text in Cycle 008. Replace `no-drift` with "Source-of-truth lock" + a tooltip "Metrics shown follow the Stay.ai source-of-truth rules". The version chip can move to a footer hover-only tooltip.

### S1.13 — Topbar "No-drift enforced" pill (P2)

- **Screenshot:** all eight.
- **Category:** terminology / jargon.
- **Confidence:** 98.5%.
- **Evidence:** `Topbar.tsx` lines 60–63 render a pill `No-drift enforced`.
- **Support-user impact:** "No-drift" is an internal data-engineering term. It does not communicate that the dashboard's metrics match the registry; users will read it as a railway notice.
- **Fix:** replace with "Trusted definitions on" with a tooltip "These metrics use the same definitions as the official rulebook."

### S1.14 — Eyebrow + section header repetition fatigue (P2)

- **Screenshots:** all eight.
- **Category:** visual hierarchy, accessibility / readability.
- **Confidence:** 98.5%.
- **Evidence:** every section uses an `eyebrow` (`uppercase tracking-[0.18em] – tracking-[0.28em]`) followed by a `display-title`. On `/subscriptions` there are 5+ eyebrows visible at once (subnav · subnav, IA v2 prototype, Outcome intelligence · Stay.ai authoritative, Outcome KPIs, Outcome funnel, Outcome guards, Metric metadata · audit trail, Source health, Contract-wired view, Module shell). `index.css` defines `eyebrow` tracking at `0.32em` which is very tight typographic territory.
- **Support-user impact:** the page reads as "important things shouting at me" with no clear hierarchy. The eye scans labels rather than data.
- **Fix:** Cycle 008 — at most **two** eyebrows visible above the fold per subpage (one in the page header, one over the primary visual). Treat eyebrow as an honour, not a default.

### S1.15 — Color usage is busy: violet, indigo, emerald, rose, amber, sky, cyan, slate all on the subscription page (P2)

- **Screenshot:** `02-subscription-analytics-page-polished.png`.
- **Category:** visual hierarchy, accessibility / readability.
- **Confidence:** 98.5%.
- **Evidence:** the KPI tone map uses `primary` (slate), `cancellation` (rose), `retention` (emerald), `context` (sky), `unknown` (amber), `pending` (amber), `missing` (rose). The rate-card uses violet→indigo gradient. The funnel uses the same multi-tone palette. The Cycle 005 hero uses violet + cyan ambient glows. The status bar uses emerald / amber / rose pills. There are 8+ accent colours visible at once.
- **Support-user impact:** the user cannot tell what colour means. Rose = bad? Or rose = cancellation (which is a normal outcome)? Emerald = good? Or emerald = "live API"?
- **Fix:** Cycle 008 — adopt a single semantic palette: emerald = confirmed/healthy, amber = pending/needs attention, rose = blocked/danger only. Outcome categories (cancel / save / pending) get neutral slate cards with a single accent colour for the headline figure. Document this in `docs/07_dashboard_ui_ux/subscription_plain_language_copy_system.md` as a "tone glossary".

---

## 2. Screenshot 01 — Overview page (`01-overview-page-polished.png`)

### S2.01 — Overview page title "Cross-platform support intelligence" doesn't tell a CS agent what to do (P1)

- **Category:** non-technical support-user comprehension, terminology / jargon.
- **Confidence:** 98.5%.
- **Evidence:** `Topbar.tsx` `PAGE_META['/overview']`.
- **Support-user impact:** vague.
- **Fix:** "Today across all support channels" / "What changed in support today?".

### S2.02 — Overview hero treatment is identical to subscription page (P2)

- **Category:** visual hierarchy, navigation clarity.
- **Confidence:** 98.5%.
- **Evidence:** Cycle 006 Agent B report §B6 — every page now uses the same `surface-ink` hero band.
- **Support-user impact:** the user cannot tell which module they are looking at — every page reads as "the priority module".
- **Fix:** subscription module keeps the boldest treatment. Other modules use a lighter `surface-card` hero.

### S2.03 — KPI trend deltas described as "Awaiting first confirmed window" (P1)

- **Category:** metric clarity, terminology / jargon.
- **Confidence:** 98.5%.
- **Evidence:** Cycle 006 Agent B report §B3.
- **Support-user impact:** "first confirmed window" is jargon.
- **Fix:** "We need at least one full week of data before we can show a trend."

### S2.04 — Em-dash `—` placeholder + "Preview value · awaiting live contract" eyebrow on starter cards (P1)

- **Category:** metric clarity, terminology / jargon.
- **Confidence:** 98.5%.
- **Evidence:** Cycle 006 Agent B report §B3.
- **Support-user impact:** "live contract" is engineering vocabulary; the user does not know what the dash means.
- **Fix:** "Live data starts here once the source is wired" + a small `?` tooltip.

### S2.05 — No "needs attention" panel on Overview (P1)

- **Category:** actionability.
- **Confidence:** 98.5%.
- **Evidence:** Cycle 006 Agent B report — Overview page is metrics-only; no action queue.
- **Support-user impact:** the executive sees green numbers and the support lead doesn't know what's broken.
- **Fix:** add an "Across the day" action card that aggregates the 3-5 most pressing items from each module's follow-up queue. Each row links to the owning subpage.

---

## 3. Screenshot 02 — Subscription analytics page (`02-subscription-analytics-page-polished.png`)

The bulk of the audit lives here because this is the priority module and the largest source of confusion.

### S3.01 — KPI grid mixes counts and rates on one canvas with mixed visual treatments (P0)

- **Category:** chart usefulness, visual hierarchy.
- **Confidence:** 99.5%.
- **Evidence:** `SubscriptionOutcomeKpiGrid.tsx` lines 75–192 — first a 6-card count grid (`grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4`) with tone-coloured backgrounds and progress bars; then a separate 3-card rate-card grid with violet gradient backgrounds, a fragment-blurred ambient glow, formula chips, and a "Stay.ai-confirmed ratio" eyebrow.
- **Support-user impact:** the user cannot tell which is "the headline" vs "the detail". Two unrelated visual systems compete on the same panel.
- **Fix:** one headline card (Net Confirmed Saves), one supporting strip (≤4 cards), one trend mini-chart. The rate cards belong on `/subscriptions/outcomes` Level 2, not on Command Center.

### S3.02 — KPI cards print `subscription_contacts_total` and `confirmed_stayai_match` style metric IDs as `data-testid` attributes that bleed into screenshots in the form of class `outcome-rate-formula-…` (P2)

- **Category:** terminology / jargon, accessibility.
- **Confidence:** 98.5%.
- **Evidence:** `SubscriptionOutcomeKpiGrid.tsx` lines 87 and 178; `SubscriptionOutcomeMetadataPanel.tsx` lines 82, 101, 109, 120.
- **Support-user impact:** these are not user-facing on render but they leak into copy/paste, screen readers, and accessibility scans. They make the dashboard feel like a code preview.
- **Fix:** keep `data-testid` for tests but ensure the visible label is always the human one ("Confirmed saves") and never the raw metric ID.

### S3.03 — "Stay.ai-confirmed ratio" sub-eyebrow under every rate card is information bordering on noise (P1)

- **Category:** terminology / jargon, visual hierarchy.
- **Confidence:** 98.5%.
- **Evidence:** `SubscriptionOutcomeKpiGrid.tsx` lines 148–152.
- **Support-user impact:** the user has already seen the headline "Stay.ai final authority" pill above the panel. Repeating "Stay.ai-confirmed ratio" three more times burns visual budget.
- **Fix:** authority chip on the panel header is enough; remove the per-card sub-eyebrow.

### S3.04 — Formula text (`(N / D)`) shown as monospace chip on every rate card is registry leakage (P1)

- **Category:** terminology / jargon, business-value visibility.
- **Confidence:** 98.5%.
- **Evidence:** `SubscriptionOutcomeKpiGrid.tsx` lines 177–185 — "Authority: …", "(83 / 142)" rendered in a violet monospace box on the page surface.
- **Support-user impact:** users do not need to see the algebra to read the rate. Showing it raises the cognitive bar for no benefit and clashes with progressive-disclosure rule (formula belongs in Level 2 expander).
- **Fix:** keep "(N / D)" as a hover tooltip; expose it under "▾ Show metric definition" on Outcome Summary.

### S3.05 — "Subscription contacts in scope: 245" headline has unclear unit (P1)

- **Category:** metric clarity.
- **Confidence:** 98.5%.
- **Evidence:** `SubscriptionOutcomesView.tsx` lines 70 + 102–106.
- **Support-user impact:** "contacts" is ambiguous: does it mean calls, customers, distinct subscriptions, distinct phone numbers?
- **Fix:** "245 subscription calls in this view" + a `?` tooltip "One row per call where the customer asked about their subscription".

### S3.06 — Funnel restates "Source authority: Stay.ai" on every stage row (P2)

- **Category:** terminology / jargon, source-truth messaging.
- **Confidence:** 98.5%.
- **Evidence:** `SubscriptionOutcomeFunnel.tsx` lines 70–73.
- **Support-user impact:** the panel header already shows "Stay.ai-final stages: N". Restating "Source authority: Stay.ai" four times below it adds visual weight without information.
- **Fix:** show the authority chip once per panel; only mark stages whose authority differs (e.g. Synthflow request, Shopify context).

### S3.07 — Funnel encodes share twice (text + bar) (P2)

- **Category:** chart usefulness.
- **Confidence:** 98.5%.
- **Evidence:** `SubscriptionOutcomeFunnel.tsx` lines 86–107.
- **Support-user impact:** redundant; takes two reads to make sure they agree.
- **Fix:** keep the bar as the primary affordance; render share % as a tooltip on hover, not as a chip on every row.

### S3.08 — Funnel `aria-valuenow` on a `role="presentation"` element (P2)

- **Category:** accessibility.
- **Confidence:** 98.5%.
- **Evidence:** `SubscriptionOutcomeFunnel.tsx` lines 100–106 — bar uses `role="presentation"` and `aria-valuenow`. `aria-valuenow` is meaningful only on `progressbar` / `meter` roles.
- **Support-user impact:** screen-reader users get the role removed but a stray `aria-valuenow`. Lighthouse / axe will flag.
- **Fix:** either drop `aria-valuenow` or change the role to `progressbar` with `aria-valuemin/max/now` and an accessible name.

### S3.09 — Outcome alerts panel uses two-column grid for short messages (P3)

- **Category:** layout organization.
- **Confidence:** 98.5%.
- **Evidence:** `SubscriptionOutcomeAlertsPanel.tsx` lines 87 — `grid md:grid-cols-2`.
- **Support-user impact:** alerts that should read top-to-bottom in priority order get rebalanced into a two-column flow that loses ordering for assistive tech users.
- **Fix:** single-column list ordered by severity (`danger` → `warning` → `info`).

### S3.10 — Metadata panel renders fingerprint, audit reference, metric IDs, formula version inline on the page surface, breaking IA progressive-disclosure rule (P0)

- **Category:** visual hierarchy, business-value visibility, source-truth messaging.
- **Confidence:** 99.0%.
- **Evidence:** `SubscriptionOutcomeMetadataPanel.tsx` whole file — a `surface-card` with a 2-column grid of `Metric ID` (mono), `Formula version`, `Owner`, `Generated at`, `Scenario`, `Fingerprint` (mono break-all), `Audit reference` (mono break-all), `Metric definitions` chips, `Filters applied` chips. The IA spec §6 explicitly says Level 1 is at most "1 trust chip + 1 source chip + 1 freshness chip when warning"; the current panel renders 9+ governance items as Level 1.
- **Support-user impact:** the support user cannot read the fingerprint and has no use for it. It crowds the page and signals "this is a developer view".
- **Fix:** the panel's content moves to a `▾ Show metric definitions, formula version, fingerprint, audit reference` expander (Level 2) and a `Open governance drawer` link to a Level 3 drawer (per IA wireframe spec §5).

### S3.11 — `Generated at` timestamp shown as raw ISO `2026-05-05T19:21:03+00:00` (P1)

- **Category:** non-technical support-user comprehension.
- **Confidence:** 98.5%.
- **Evidence:** `SubscriptionOutcomeMetadataPanel.tsx` line 92 — `{metadata.timestamp}` printed as-is.
- **Support-user impact:** ISO timestamps are not friendly. Time-zone is unclear.
- **Fix:** "Updated 12 minutes ago · 5 May at 14:21 ET" with a hover for the raw ISO.

### S3.12 — `metric_id` shown as `subscription_outcomes_v3.2` (P1)

- **Category:** terminology / jargon.
- **Confidence:** 98.5%.
- **Evidence:** `SubscriptionOutcomeMetadataPanel.tsx` line 78.
- **Support-user impact:** the user does not need the metric ID at Level 1.
- **Fix:** human label "Subscription outcomes — version 3.2" inside the Level 2 expander, raw ID inside Level 3 drawer.

### S3.13 — `Scenario: pending_stayai_confirmation` shown as a metadata field (P1)

- **Category:** non-technical support-user comprehension, terminology / jargon.
- **Confidence:** 99.0%.
- **Evidence:** `SubscriptionOutcomeMetadataPanel.tsx` line 95 — `{data.scenario}` printed as `mono`.
- **Support-user impact:** "pending_stayai_confirmation" is a developer state name, exposed on the page surface.
- **Fix:** translate to "Stay.ai final state has not arrived for these calls yet — see the Pending Confirmation rule below" and only show it inside Level 2.

### S3.14 — Fingerprint and audit reference shown as full strings (P1)

- **Category:** business-value visibility, source-truth messaging.
- **Confidence:** 99.0%.
- **Evidence:** `SubscriptionOutcomeMetadataPanel.tsx` lines 99–113 — "Fingerprint" rendered with `block break-all rounded-xl border border-slate-200 bg-slate-50/80 p-3 font-mono text-[11px]` and audit reference rendered as `break-all font-mono text-sm`.
- **Support-user impact:** these are signals that the dashboard is "for engineers". They also break the page rhythm with monospace blocks.
- **Fix:** truncate to first/last 4 chars at Level 1 with copy-to-clipboard; full string lives in Level 3 drawer.

### S3.15 — Authority chip duplicated in 3 places (P2)

- **Category:** source-truth messaging.
- **Confidence:** 98.5%.
- **Evidence:** the same Stay.ai chip appears on:
  - `SubscriptionOutcomesView` header (line 99 — "Stay.ai final authority").
  - `SubscriptionOutcomeKpiGrid` header (line 70 — "Stay.ai final authority").
  - `SubscriptionOutcomeMetadataPanel` header (line 70 — "Source authority: <data.source_of_truth_system>").
- **Support-user impact:** the source-of-truth lock becomes wallpaper instead of an authority signal.
- **Fix:** one authority chip per subpage (in the page header). Cards reference it through inline source chips ("Stay.ai · Confirmed", "Synthflow · journey only", "Shopify · context only").

### S3.16 — Cycle 002 view's `SubscriptionFinalStateBanner` overlaps semantically with the Cycle 005 alerts panel (P1)

- **Category:** layout organization, source-truth messaging.
- **Confidence:** 98.5%.
- **Evidence:** both panels render Stay.ai final-state language; `SubscriptionAnalyticsView.tsx` line 123 mounts `SubscriptionFinalStateBanner` and `SubscriptionStateAlertsPanel` immediately above the overview grid; the Cycle 005 outcomes view mounts `SubscriptionOutcomeAlertsPanel` only ~600px above.
- **Support-user impact:** the user is told the same warning twice with different copy and different visual languages.
- **Fix:** Cycle 008 — pick one. The "Stay.ai final state pending" state belongs on Outcome Summary, not Command Center.

### S3.17 — `PortalJourneyPanel`, `ShopifyContextPanel`, `SynthflowJourneyPanel`, `SourceConfirmationPanel`, `SubscriptionMetricMetadataPanel` are all rendered together with no progressive disclosure (P0)

- **Category:** layout organization, page density, business-value visibility.
- **Confidence:** 99.5%.
- **Evidence:** `SubscriptionAnalyticsView.tsx` lines 124–132.
- **Support-user impact:** five extra context-only panels stacked under Command Center pad the page beyond two viewports and dilute the hero metric.
- **Fix:** move portal / Shopify / Synthflow panels to `/subscriptions/portal-handoff` (portal) and `/subscriptions/diagnostics` (Shopify / Synthflow journey context). Source-confirmation panel rolls into the page header authority chip + L2 expander.

### S3.18 — Source-health view (full module) embedded inside `/subscriptions` page (P0)

- **Category:** layout organization, navigation clarity.
- **Confidence:** 99.5%.
- **Evidence:** `SubscriptionAnalyticsPage.tsx` lines 124–136 mount `SourceHealthView` (the entire `/data-quality` page worth of content) under a `SectionHeader` saying "Source health, freshness, and lineage".
- **Support-user impact:** Source health is a different module. Mounting it inside subscriptions leads users to think it's a sub-tool of subscriptions and breaks the global IA. There are now **two** entry points to source health (the sidebar "Data quality" link and this in-page section).
- **Fix:** remove. Surface source-health as a chip on Command Center ("Source health: 1 source degraded → open Data quality") and remove the embedded `SourceHealthView` mount entirely.

### S3.19 — Subnav prototype description leaks engineering language ("IA v2 prototype · Cycle 007 prototype") (P0)

- **Category:** terminology / jargon.
- **Confidence:** 99.5%.
- **Evidence:** `SubscriptionSubnav.tsx` lines 42–45 and 99–108 render "IA v2 · 10 focused subpages · Cycle 007 prototype" and "Planned tabs ship in Cycle 008 once their backend contracts and panel migrations land. See the IA spec under docs/07_dashboard_ui_ux/subscription_analytics_information_architecture_v2.md."
- **Support-user impact:** the subnav literally points the user at a markdown spec path. CS agents will see a file path in the dashboard.
- **Fix:** the subnav has no helper paragraph or chip in production. Tab status indicator becomes a small "Coming soon" pill (no "Planned"), no file paths.

### S3.20 — `SubscriptionPageHeader` actions show two grey "planned" buttons (P1)

- **Category:** actionability, layout organization.
- **Confidence:** 99.0%.
- **Evidence:** `SubscriptionAnalyticsPage.tsx` lines 47–68.
- **Support-user impact:** users learn that the page header buttons don't work and stop trying.
- **Fix:** in Cycle 007 ship the buttons as functional or do not render them at all. Disabled-with-tooltip is acceptable for one cycle but not for two.

### S3.21 — KPI cards do not link anywhere (P1)

- **Category:** drilldowns, actionability.
- **Confidence:** 98.5%.
- **Evidence:** `SubscriptionOutcomeKpiGrid.tsx` lines 84–129 — `<article>` only.
- **Support-user impact:** the user expects clicking "Confirmed saves: 142" to take them to a list. It doesn't.
- **Fix:** every KPI card should be a link to its canonical subpage drilldown (e.g. Confirmed saves → `/subscriptions/outcomes` filtered to Save).

### S3.22 — Funnel stages do not link to Cancellation Intake / Cost Too High / Portal+Handoff (P1)

- **Category:** drilldowns.
- **Confidence:** 98.5%.
- **Evidence:** `SubscriptionOutcomeFunnel.tsx` `<li>` only.
- **Fix:** stages link to the subpage that owns the upstream/downstream of that step.

### S3.23 — No business value visible on Command Center despite Agent A shipping `/subscriptions/business-value` (P0)

- **Category:** business-value visibility.
- **Confidence:** 99.0%.
- **Evidence:** `SubscriptionAnalyticsPage.tsx` does not import or render any business-value contract. The fixture-backed contract from `agent-a-wave-01-cycle-007-report.md` ships in `services/analytics-api` but never reaches the UI.
- **Support-user impact:** Workflow #3 ("How much money did we save?") is not answered anywhere in the dashboard.
- **Fix:** Cycle 008 — render Net Business Value (Confirmed) as the 5th KPI on Command Center plus a dedicated `/subscriptions/business-value` subpage per IA spec §4.1.6.

### S3.24 — No Cost Too High funnel — even though it's the highest-value retention sequence (P0)

- **Category:** business-value visibility, chart usefulness, drilldowns.
- **Confidence:** 99.0%.
- **Evidence:** the page does not implement the cancellation-reason → frequency-change → 25%-off → confirmed-cancel sequence visualization. Only the generic outcome funnel is shipped.
- **Support-user impact:** Workflow #5 ("Which offer path is working?") cannot be answered.
- **Fix:** Cycle 008 ships `/subscriptions/cost-too-high` per IA spec §4.1.5.

### S3.25 — No way to see Stay.ai pending records (P1)

- **Category:** actionability, source-truth messaging.
- **Confidence:** 98.5%.
- **Evidence:** the alerts panel surfaces "Pending Stay.ai final state · N records" but no link to the records.
- **Fix:** the alert row becomes a CTA → `/subscriptions/follow-up?filter=pending_stayai_final_state`.

### S3.26 — No table on `/subscriptions` (P1)

- **Category:** table usefulness, drilldowns.
- **Confidence:** 98.5%.
- **Evidence:** the page renders zero tables; only KPI cards and a funnel.
- **Support-user impact:** Workflows #4 and #6 ("Which customers need follow-up?", "Which outcomes are pending Stay.ai confirmation?") need a row-level table.
- **Fix:** Cycle 008 — operator-facing `FollowUpTable` on `/subscriptions/follow-up` per IA spec §4.1.9.

---

## 4. Screenshot 03 — Subscription "Pending Stay.ai" scenario (`03-subscription-pending-stayai.png`)

This is the same Cycle 005 view rendered with `pending_stayai_confirmation`. Most issues are inherited from §3; what's specific to this state:

### S4.01 — "Pending Stay.ai final state" copy assumes the user knows what Stay.ai is and what "final state" means (P0)

- **Category:** non-technical support-user comprehension, terminology / jargon, source-truth messaging.
- **Confidence:** 99.5%.
- **Evidence:** `SubscriptionOutcomesView.tsx` lines 26–34 ("Stay.ai final state pending — outcomes blocked from finalization."), and re-quoted in alerts and metadata.
- **Support-user impact:** new CS agents are not on-boarded to "Stay.ai is the source of truth". They cannot interpret "final state" as "the official save/cancel outcome".
- **Fix:** copy guide rule (`docs/07_dashboard_ui_ux/subscription_plain_language_copy_system.md`):
  - "Stay.ai final state pending" → "We do not yet have official subscription confirmation."
  - "outcomes blocked from finalization" → "We can't confirm save or cancel for these calls until Stay.ai sends us the final result."
  - First mention of "Stay.ai" on a page gets a tooltip "Stay.ai = the system that owns the official subscription record."

### S4.02 — "Source confirmation: pending_stayai_match" shown as a metadata pill (P1)

- **Category:** terminology / jargon.
- **Confidence:** 99.0%.
- **Evidence:** `SubscriptionOutcomeMetadataPanel.tsx` lines 63–68 + `sourceConfirmationToneClasses`.
- **Support-user impact:** `pending_stayai_match` is a code-style enum value rendered in the chip.
- **Fix:** translate to "Awaiting Stay.ai" / "Confirmed by Stay.ai" / "Stay.ai confirmation missing".

### S4.03 — KPI tone "pending" uses amber `bg-amber-50 text-amber-900` (P2)

- **Category:** accessibility / readability.
- **Confidence:** 98.5%.
- **Evidence:** `SubscriptionOutcomeKpiGrid.tsx` line 18 + utils.
- **Support-user impact:** amber-on-amber-50 has acceptable contrast but the reader cannot tell whether amber means "pending" (waiting) or "warning" (alarming). Two unrelated semantics share one colour on the same page.
- **Fix:** pending = neutral slate with a clock icon; amber = warning only.

### S4.04 — Page is materially identical to baseline in scenario "pending" — only counts shift (P1)

- **Category:** visual hierarchy, actionability.
- **Confidence:** 98.5%.
- **Evidence:** the only state-specific UI is the alerts panel and the metadata pill.
- **Support-user impact:** the user does not understand that a meaningful number of calls are "stuck"; the page looks like a normal day with slightly different numbers.
- **Fix:** when `pending > threshold`, the page header switches to a tinted "Action needed today" treatment and surfaces a CTA. Per Workflow #6 (Pending Stay.ai Triage).

---

## 5. Screenshot 04 — Subscription "Missing Stay.ai final state" scenario (`04-subscription-missing-stayai.png`)

### S5.01 — `Missing Stay.ai final state` is a hard-fail state but reads as a normal scenario chip (P0)

- **Category:** source-truth messaging, actionability, visual hierarchy.
- **Confidence:** 99.5%.
- **Evidence:** the chip and the hero band copy do not visually escalate the state. The Cycle 002 final-state banner exists below but is one of several panels.
- **Support-user impact:** an entire dataset is unconfirmable, but the page still renders KPIs as if they were live.
- **Fix:** when scenario is hard-fail, the entire Command Center swaps to a single full-width banner "We're not getting Stay.ai final results right now. Numbers below cannot be trusted until this is fixed." + a "Contact data engineering" CTA + audit reference. KPI cards switch to em-dash or grey "—" with the missing-data state label per IA spec §6.

### S5.02 — Empty / blocked state is rendered with "rendering shared-contract preview only" copy (P0)

- **Category:** terminology / jargon.
- **Confidence:** 99.5%.
- **Evidence:** `SubscriptionOutcomesView.tsx` lines 138–143.
- **Support-user impact:** "shared-contract preview" is meaningless to a non-engineer. It also looks like a developer leak.
- **Fix:** "We don't have permission to load live data here. We're showing a frozen sample so you can see the layout. Ask your manager for access." per copy guide.

### S5.03 — `permission_denied` and `error` paths use the same banner template with different copy (P1)

- **Category:** non-technical support-user comprehension.
- **Confidence:** 98.5%.
- **Evidence:** `SubscriptionOutcomesView.tsx` lines 135–158.
- **Support-user impact:** the user cannot tell whether they need IT (network), their manager (permissions), or to wait (data drift). All three currently look the same.
- **Fix:** three distinct banners (with different icons and CTAs) per copy guide §"system status" rules.

---

## 6. Screenshot 05 — Cancellation analytics page (`05-cancellation-page-polished.png`)

Read against `apps/dashboard-web/src/pages/CancellationAnalyticsPage.tsx` (not changed by Cycle 007). Per Cycle 006 Agent B report this page uses the same shell + hero pattern as overview.

### S6.01 — Cancellation page does not split intake reasons from outcomes (P0)

- **Category:** business-value visibility, chart usefulness.
- **Confidence:** 98.5%.
- **Evidence:** the IA v2 spec calls for a separate `/subscriptions/cancellation-intake` view; the current page renders a generic module shell with a single funnel and KPIs.
- **Support-user impact:** Workflow #5 ("Which offer path is working?") and Workflow #1 ("What happened with subscription calls today?") cannot be answered without a reason breakdown.
- **Fix:** Cycle 008 ships `/subscriptions/cancellation-intake` per IA spec §4.1.4. Repurpose `/cancellations` into a top-level cancellation overview that links to the subscription-specific intake subpage.

### S6.02 — Confirmed cancellation outcome page does not surface "save attempts that failed" (P1)

- **Category:** business-value visibility.
- **Confidence:** 98.5%.
- **Evidence:** the page only renders confirmed cancellations, not the cost-of-loss or which offers were declined.
- **Fix:** add a "Where we lost them" section linking to `/subscriptions/cost-too-high`.

### S6.03 — No reason taxonomy filter (P1)

- **Category:** advanced filters.
- **Confidence:** 98.5%.
- **Evidence:** the topbar exposes only date / platform / segment.
- **Fix:** Advanced filter drawer dimension "Cancellation reason" per IA §8.1.

---

## 7. Screenshot 06 — Retention page (`06-retention-page-polished.png`)

### S7.01 — "Save rate and retention journey" title is meta-language (P1)

- **Category:** terminology / jargon.
- **Confidence:** 98.5%.
- **Evidence:** `Topbar.tsx` `PAGE_META['/retention']`.
- **Fix:** "Calls we saved" / "Where we kept the subscription".

### S7.02 — Retention page does not link to Cost Too High retention funnel (P1)

- **Category:** drilldowns, navigation clarity.
- **Confidence:** 98.5%.
- **Fix:** primary card "Cost Too High retention path" → `/subscriptions/cost-too-high`.

### S7.03 — Retention page does not surface offer-cost vs revenue protected (P1)

- **Category:** business-value visibility.
- **Confidence:** 98.5%.
- **Fix:** add a "Net business value protected" tile sourced from Agent A's `/subscriptions/business-value` contract.

---

## 8. Screenshot 07 — Data quality page (`07-data-quality-page-polished.png`)

### S8.01 — Page title "Source freshness, contracts, and trust" includes "contracts" (P1)

- **Category:** terminology / jargon.
- **Confidence:** 98.5%.
- **Evidence:** `Topbar.tsx` `PAGE_META['/data-quality']`.
- **Fix:** "How fresh is our data?" with a sub-line "Source freshness, version status, and trust labels".

### S8.02 — Source health alerts use technical state names (e.g. `degraded`, `stale`) (P1)

- **Category:** terminology / jargon.
- **Confidence:** 98.5%.
- **Evidence:** `SourceHealthAlertsPanel`, `FreshnessStateLegend` (per Cycle 006 Agent B report §B6).
- **Fix:** plain-language copy per `subscription_plain_language_copy_system.md`:
  - `fresh` → "On time".
  - `warning` → "Slightly delayed".
  - `degraded` → "Behind schedule".
  - `stale` → "Too old to trust" (with the threshold).

### S8.03 — `LineageConflictPanel` renders raw lineage breadcrumbs (P1)

- **Category:** terminology / jargon.
- **Confidence:** 98.5%.
- **Fix:** breadcrumb shown only when expanded (Level 2). Default Level 1 is "Conflict found between Stay.ai and Synthflow on N records."

### S8.04 — There is no operator action queue on data quality (P1)

- **Category:** actionability.
- **Confidence:** 98.5%.
- **Fix:** add "Things to fix today" with rows like "Refresh Synthflow webhook · Last received 2h ago" → opens runbook link.

---

## 9. Screenshot 08 — Governance page (`08-governance-page-polished.png`)

### S9.01 — Page title "RBAC, exports, and audit controls" is the wrong audience-of-one phrasing (P1)

- **Category:** terminology / jargon.
- **Confidence:** 98.5%.
- **Fix:** "Who can see and export what" with sub "Roles, exports, and audit trail".

### S9.02 — Permission matrix table shows raw role IDs (P1)

- **Category:** terminology / jargon.
- **Confidence:** 98.5%.
- **Evidence:** `apps/dashboard-web/src/components/governance/PermissionMatrixTable.tsx` (per Cycle 006 §B6).
- **Fix:** human role names ("CS Agent · Tier 1", "CS Lead", "Retention Manager", "Data Analyst", "Admin") with hover for the underlying role ID.

### S9.03 — Audit evidence table is the only place export readiness lives (P1)

- **Category:** exports, navigation clarity.
- **Confidence:** 98.5%.
- **Fix:** the export drawer is the canonical UX. Governance keeps the audit table and references the drawer.

### S9.04 — Governance hero copy does not differentiate from subscription hero (P2)

- **Category:** visual hierarchy.
- **Confidence:** 98.5%.
- **Fix:** governance hero uses a less-aggressive treatment so the subscription module remains the visual lead.

---

## 10. Subpages that should exist but don't yet (Cycle 008 work)

These are not screenshots — they're the absences. Logged here because their absence is itself a UX defect.

For each entry below: **Category** = layout organization, navigation clarity, page density. **Confidence** = 99.5% (P1 entries 99.0%). **Fix** = Cycle 008 must ship at least a minimal version of each subpage (per IA spec §4 / wireframe spec §1). It is acceptable to ship some subpages with `blocked_by_data` placeholder content as long as the route exists and the subnav can navigate to it.

| ID | Subpage | Severity | Notes |
|---|---|---|---|
| S10.01 | `/subscriptions/outcomes` | P0 | Has no canonical home yet — still rendered inline on `/subscriptions`. |
| S10.02 | `/subscriptions/non-cancellation` | P0 | Does not exist; skip / pause / frequency-change / SKU-swap / reactivate / one-time add-on visibility absent. |
| S10.03 | `/subscriptions/cancellation-intake` | P0 | Does not exist; reason taxonomy view absent. |
| S10.04 | `/subscriptions/cost-too-high` | P0 | Does not exist; highest-value retention sequence absent. |
| S10.05 | `/subscriptions/business-value` | P0 | Does not exist; Agent A's `/subscriptions/business-value` contract is not surfaced anywhere. |
| S10.06 | `/subscriptions/portal-handoff` | P0 | Does not exist; portal completion vs link-sent confusion is not resolvable. |
| S10.07 | `/subscriptions/containment` | P0 | Does not exist; true containment KPI invisible. |
| S10.08 | `/subscriptions/follow-up` | P0 | Does not exist; subnav advertises "3 needs attention" attention badge but tab is disabled. |
| S10.09 | `/subscriptions/export-audit` | P0 | Does not exist; governed export with manifest is absent. |
| S10.10 | `/subscriptions/diagnostics` | P1 | Does not exist; legacy Cycle 001 / Cycle 002 panels still mount on `/subscriptions` and pollute Command Center. |

---

## 11. What I deliberately did not log (and why)

| Pattern | Decision | Rationale |
|---|---|---|
| Sidebar group ordering | Keep | "Customer outcomes / Operations / Trust & governance" is sensible and matches the persona model. |
| Cycle 005 `surface-ink` hero treatment as a *primitive* | Keep | The token system itself is good; the issue is using it twice on the same page (logged S1.03). |
| Em-dash placeholder pattern for missing values | Keep | Standard UX; only the *copy* "Preview value · awaiting live contract" must change (logged S2.04). |
| Outcome funnel concept | Keep | Funnel is the right visualization; only redundancy and link-out are defects. |
| Stay.ai source-of-truth lock | Keep | Locked rule. Issues are about *how* it's surfaced, not *whether*. |
| Trust labels system-calculated rule | Keep | Locked rule; never expose manual elevation. |

---

## 12. Summary

- Total unique issues logged: **77** (S1.01–S1.15 = 15, S2.01–S2.05 = 5, S3.01–S3.26 = 26, S4.01–S4.04 = 4, S5.01–S5.03 = 3, S6.01–S6.03 = 3, S7.01–S7.03 = 3, S8.01–S8.04 = 4, S9.01–S9.04 = 4, S10.01–S10.10 = 10). CSV row counts agree.
- P0 (blocker): **30** — must ship in Cycle 008.
- P1 (high): **34**.
- P2 (medium): **12**.
- P3 (low): **1**.
- Confidence floor: **98.5%** on every entry, several at 99.0–99.5%.

The single most important conclusion: **the rejection in Cycle 006 was structurally correct. The subscription page is still one massive page; the Cycle 007 prototype subnav is not enough.** Cycle 008 must:

1. Migrate panels into the 10 subpages (delete the legacy stack from `/subscriptions`).
2. Ship the Advanced filter drawer with backend-gap-aware disabled states.
3. Ship the Export drawer with manifest preview.
4. Ship the Follow-Up Queue.
5. Apply the plain-language copy guide system-wide (`docs/07_dashboard_ui_ux/subscription_plain_language_copy_system.md`).
6. Replace progressive-disclosure violations on the metadata panel.

Items 1–6 are tracked as the Agent B acceptance criteria in `project-management/reports/cycle-007/review-checklists/uiux_second_designer_acceptance_criteria.md`.

---

## 13. Cross-references

- Cycle 006 Agent B build report: `project-management/reports/cycle-006/agent-b-wave-01-cycle-006-report.md`
- Cycle 006 Agent C UI/UX gate report: `project-management/reports/cycle-006/agent-c-wave-01-cycle-006-report.md`
- Cycle 007 Agent B IA primary design: `project-management/reports/cycle-007/agent-b-wave-01-cycle-007-report.md`
- Cycle 007 Agent A backend metric-gap matrix: `project-management/reports/cycle-007/metric-gap/subscription-required-vs-current-metric-matrix.md`
- IA v2 spec: `docs/07_dashboard_ui_ux/subscription_analytics_information_architecture_v2.md`
- IA v2 wireframe spec: `project-management/reports/cycle-007/design/subscription_ia_v2_wireframe_spec.md`
- Plain-language copy system (Cycle 007 Agent C): `docs/07_dashboard_ui_ux/subscription_plain_language_copy_system.md`
- Support-user workflows v2 (Cycle 007 Agent C): `docs/07_dashboard_ui_ux/support_user_subscription_workflows_v2.md`
- Acceptance criteria for Agent B implementation (Cycle 007 Agent C): `project-management/reports/cycle-007/review-checklists/uiux_second_designer_acceptance_criteria.md`
