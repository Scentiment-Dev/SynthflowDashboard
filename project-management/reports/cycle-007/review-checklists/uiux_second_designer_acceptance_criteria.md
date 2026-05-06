# UI/UX Second-Designer Acceptance Criteria — Cycle 007 / Cycle 008

- Document owner: Cursor Agent C — Second UI/UX designer / independent UX auditor
- Cycle: 007 (this audit) → drives Cycle 008 implementation
- Wave: 01
- Status: **Authoritative acceptance criteria for Agent B's Cycle 008 subscription IA migration.** Agent D uses this as the QA checklist input; PM uses it as the gate.
- Companion to:
  - `project-management/reports/cycle-007/uiux-audit/cycle-006-screenshot-issue-register.md` (Cycle 006 issue register)
  - `docs/07_dashboard_ui_ux/support_user_subscription_workflows_v2.md` (8 support-user workflows)
  - `docs/07_dashboard_ui_ux/subscription_plain_language_copy_system.md` (plain-language copy guide)
  - `docs/07_dashboard_ui_ux/subscription_analytics_information_architecture_v2.md` (Agent B IA primary)
  - `project-management/reports/cycle-007/design/subscription_ia_v2_wireframe_spec.md` (Agent B wireframe primary)
- Source-of-truth lock (locked rules — every check below preserves them):
  - Stay.ai owns subscription outcome truth.
  - Shopify is context only.
  - Synthflow is journey-event only.
  - Portal link sent is **not** portal completion.
  - Trust labels are system-calculated.
  - Permissions are server-side explicit-deny.

---

## 0. How to use this document

This is the **gate** between Cycle 007 design and Cycle 008 implementation.

1. **Agent B (frontend / IA)** uses §1 — §6 as the build checklist. Every box must be checked before opening the Cycle 008 PR.
2. **Agent D (QA / release)** uses §1 — §6 as the QA checklist; failed boxes are blockers. Agent D appends evidence (DOM snapshots, axe scans, manual UX-session notes) to a sibling `cycle-008-uiux-second-designer-evidence.md` (this file does **not** track evidence; it tracks pass/fail state).
3. **Cursor Bugbot + Codecov** still gate the PR mechanically (95% coverage, no Bugbot-blocking issues).
4. **PM** uses §7 as the merge decision summary; if any **P0** check fails, the PR is rejected.

Severity legend (matches issue register):

| Severity | Meaning |
|---|---|
| **P0 / blocker** | Must pass to merge Cycle 008. |
| **P1 / high** | Must pass to merge Cycle 008 unless explicitly waived in writing by PM. |
| **P2 / medium** | Should pass; if waived, must be tracked into Cycle 009 backlog. |
| **P3 / low** | Optional polish. |

Each check has a **trace** column linking back to the issue register entry, the workflow it derives from, or the IA / copy guide section.

---

## 1. Structural acceptance — IA v2 must be physically real

These are the structural fixes that the Cycle 007 prototype only spec'd. Cycle 008 must **ship them in code**.

| ID | Severity | Check | Trace | Pass/fail |
|---|---|---|---|---|
| **A1.01** | P0 | `/subscriptions` Command Center renders **only** the Command Center wireframe content (page header + ≤5 KPI cards + "What needs attention now" panel + 28-day trend strip + Diagnostics drawer entry-point link). No Cycle 005 `surface-ink` hero band. No `SubscriptionOutcomesView`. No `SourceHealthView`. No `SubscriptionAnalyticsView`. No `DashboardModulePage`. | S1.01, S1.03, S3.17, S3.18 | ☐ |
| **A1.02** | P0 | The "Legacy sections kept mounted for regression coverage" footer is removed from `SubscriptionAnalyticsPage.tsx`. | S1.02 | ☐ |
| **A1.03** | P0 | All 10 IA v2 subpage routes exist and render: `/subscriptions`, `/subscriptions/outcomes`, `/subscriptions/non-cancellation`, `/subscriptions/cancellation-intake`, `/subscriptions/cost-too-high`, `/subscriptions/business-value`, `/subscriptions/portal-handoff`, `/subscriptions/containment`, `/subscriptions/follow-up`, `/subscriptions/export-audit`. | S10.01–S10.09 | ☐ |
| **A1.04** | P1 | `/subscriptions/diagnostics` exists (RBAC-gated) and is the only place legacy Cycle 002 / Cycle 001 panels are mounted. The Diagnostics drawer entry-point link from Command Center routes here. | S10.10 | ☐ |
| **A1.05** | P0 | `SubscriptionSubnav` reflects the live status of every tab (no hard-coded `Coming soon` for tabs that ship). `Coming soon` chip replaces `Planned`. | S3.19 | ☐ |
| **A1.06** | P0 | Legacy Cycle 002 / 005 / 001 panels are physically un-mounted from the Command Center route. Tests that referenced them are retargeted to `/subscriptions/diagnostics` or to the new canonical subpage. No `data-testid` from a legacy panel is reachable on `/subscriptions`. | S1.01, S3.17, S3.18 | ☐ |
| **A1.07** | P0 | Each KPI card on Command Center is a `<Link>` (or `<button>` with router navigate) to its canonical drilldown. | S3.21, W1.A3 | ☐ |
| **A1.08** | P1 | Funnel stages on `/subscriptions/outcomes` link to upstream / downstream subpages. | S3.22 | ☐ |
| **A1.09** | P0 | Each subpage above the fold (1440×900) renders ≤1 hero, ≤5 KPI cards, ≤1 primary visual, ≤1 action panel — counted in the DOM. | IA §4 acceptance criteria | ☐ |
| **A1.10** | P0 | Total scroll height on Command Center ≤ 2 viewport heights at 1440×900. (Workflow W1.A7.) | W1.A7 | ☐ |

---

## 2. Filter and export acceptance — first-class affordances

| ID | Severity | Check | Trace | Pass/fail |
|---|---|---|---|---|
| **A2.01** | P0 | Topbar exposes an "Advanced filters" button (right-aligned, between filter chips and "Reset filters"). Click opens the Advanced filter drawer. | S1.07, IA §3 | ☐ |
| **A2.02** | P0 | The Advanced filter drawer renders all dimensions in IA §3.1 and §8.1, grouped into the three accordion sections (Time / Subscription outcome dimensions / Source + version dimensions). | IA §3.1, §8.1 | ☐ |
| **A2.03** | P0 | Filter dimensions whose backend contract is not yet ready (per Agent A's matrix) render as **disabled with tooltip** "Filter not yet available — backend contract in progress". | IA §3.2 | ☐ |
| **A2.04** | P1 | "Save view" persists the active filter set under a user-named view; saved views render as chips at the top of the drawer. (Backend persistence is Cycle 008+ unless Agent A delivers it.) | IA §3.4 | ☐ |
| **A2.05** | P0 | Active filter chip strip is visible directly below the topbar / page header on every subpage; each chip is keyboard-removable and an "Active filters · N" pill opens the drawer. | IA §3.3 | ☐ |
| **A2.06** | P0 | Comparison-period control (none / previous period / previous year) is reachable from the drawer. Selection annotates KPI cards with a ` (vs prior 28d) ` delta. | IA §3.1, W2.A4 | ☐ |
| **A2.07** | P0 | "Export this view" button exists in the page header on every subpage. | S1.08, IA §5 | ☐ |
| **A2.08** | P0 | Per-widget kebab `⋮` exists on every chart, KPI strip, and table; the menu offers "Export this widget", "Show metric definition", and "Open in subpage" when applicable. | IA wireframe §4.3 | ☐ |
| **A2.09** | P0 | Per-row table selection exposes a sticky "Export selected rows" affordance. | IA wireframe §4.4 | ☐ |
| **A2.10** | P0 | The Export drawer always renders the manifest preview (active filters, metric defs, trust labels, freshness, formula versions, owner, timestamp, fingerprint, audit reference) before the user can generate. | IA §5.3 | ☐ |
| **A2.11** | P0 | All 5 export blocked states (insufficient permission, low trust, missing source confirmation, freshness stale, manifest mismatch) render with the exact messages in IA wireframe §4.2. | IA wireframe §4.2 | ☐ |
| **A2.12** | P0 | A manifest mismatch with the live registry **rejects** the export with the manifest-mismatch blocked-state copy. | W7.A3 | ☐ |
| **A2.13** | P0 | Every export emits a server-side audit row; the UI returns a confirmation toast with the audit reference and the manifest fingerprint. | W7.A5 | ☐ |
| **A2.14** | P1 | RBAC: CS Agent can export filtered table rows (CSV) but not full subpage PDFs. Data Analyst / Admin can export everything. Server-side explicit-deny is the source of truth. | IA §5.4 | ☐ |

---

## 3. Workflow acceptance — the eight required user journeys

These are sourced from `support_user_subscription_workflows_v2.md` and are restated as acceptance gates here.

### 3.1 Workflow W1 — "What happened with subscription calls today?"

| ID | Severity | Check | Trace | Pass/fail |
|---|---|---|---|---|
| **A3.W1.01** | P0 | Page header eyebrow + title match §3.1 of the copy guide ("Subscription analytics" / "What changed in subscriptions today?"). | Copy §3.1 | ☐ |
| **A3.W1.02** | P0 | KPI strip has exactly 5 cards in the order: Confirmed saves · Confirmed cancels · Pending Stay.ai · Portal completion · Net business value. | W1.A2 | ☐ |
| **A3.W1.03** | P0 | "What needs attention now" panel shows ≤3 rows; each row is one sentence + one CTA button; CTAs deep-link to the resolving subpage. | W1.A4 | ☐ |
| **A3.W1.04** | P0 | Trend strip shows the 28-day saves vs cancels area chart with a delta vs prior 28d; no axis cruft. | W1.A5 | ☐ |
| **A3.W1.05** | P0 | Above-the-fold height ≤ 720 px on a 1440×900 viewport (after the global topbar + filter strip + subnav). | W1.A6 | ☐ |
| **A3.W1.06** | P0 | First time-to-answer for a CSL who has never used the dashboard ≤ 30 s in a moderated UX session. (Min. 3 participants.) | W1.A1 | ☐ |

### 3.2 Workflow W2 — "How many cancellations were saved?"

| ID | Severity | Check | Trace | Pass/fail |
|---|---|---|---|---|
| **A3.W2.01** | P0 | Page header eyebrow + title match the copy guide ("Subscription outcomes" / "Did the call end in save / cancel / pending?"). | Copy §3.1 | ☐ |
| **A3.W2.02** | P0 | Save rate is the largest typographic element on the subpage (≥40 px display). It carries a Stay.ai authority chip and a system-calculated trust chip. | W2.A2, W2.A3 | ☐ |
| **A3.W2.03** | P0 | Outcome funnel has ≤6 stages. KPI grid has ≤6 cards (vs 10+ in Cycle 006). | W2.A1 | ☐ |
| **A3.W2.04** | P1 | Comparison-period control reflects on every KPI card with a delta annotation. | W2.A4 | ☐ |
| **A3.W2.05** | P1 | When the save rate cannot be confirmed, the page renders an `Estimated` chip with a tooltip explaining what's missing (uses copy §2.6). | W2.A5 | ☐ |

### 3.3 Workflow W3 — "How much money did we save?"

| ID | Severity | Check | Trace | Pass/fail |
|---|---|---|---|---|
| **A3.W3.01** | P0 | `/subscriptions/business-value` exists and renders Agent A's `GET /subscriptions/business-value` contract. | S10.05, S3.23 | ☐ |
| **A3.W3.02** | P0 | Headline "Net Business Value Impact" is the largest visual element on the subpage; the formula is rendered as 3 chips (`gross protected`, `−offer cost`, `+support avoided`), not algebra. | W3.A1 | ☐ |
| **A3.W3.03** | P0 | Every sub-metric carries a state chip from the copy guide §2.6 (Confirmed / Estimated / Pending Stay.ai / Unknown / Blocked — data missing). No metric renders without a state. | W3.A2 | ☐ |
| **A3.W3.04** | P0 | Sub-metrics with `blocked_by_data` render an em-dash + a friendly explanation; never `0` or `N/A`. | W3.A3 | ☐ |
| **A3.W3.05** | P0 | The page never shows raw `BusinessValueState` enum values (`confirmed_stayai_match`, etc.). | W3.A4 | ☐ |
| **A3.W3.06** | P0 | "Export this view" generates a CSV + PDF + manifest covering every state chip and every formula version. | W3.A5 | ☐ |

### 3.4 Workflow W4 — "Which customers need follow-up?"

| ID | Severity | Check | Trace | Pass/fail |
|---|---|---|---|---|
| **A3.W4.01** | P0 | `/subscriptions/follow-up` exists and renders the operator table with at minimum these columns: Contact (anonymized), Reason, Age, Trust, Source, Next step. | S10.08, W4.A1 | ☐ |
| **A3.W4.02** | P0 | Every "Next step" is a verb-led action ("Open call", "Confirm in Stay.ai", "Resend portal link", "Escalate to lead"). | W4.A2 | ☐ |
| **A3.W4.03** | P0 | Bulk action bar (Mark reviewed / Escalate / Export selected) is sticky at the table footer and appears as soon as ≥1 row is selected. | W4.A3 | ☐ |
| **A3.W4.04** | P0 | "Export selected" opens the Export drawer scoped to selected rows. | W4.A4 | ☐ |
| **A3.W4.05** | P0 | Scenario chips are not exposed on this page (no demo-state toggles on operator views). | W4.A5, S1.04 | ☐ |
| **A3.W4.06** | P1 | Default sort: age desc; secondary: trust asc. | W4.Q1 | ☐ |

### 3.5 Workflow W5 — "Which offer path is working?"

| ID | Severity | Check | Trace | Pass/fail |
|---|---|---|---|---|
| **A3.W5.01** | P0 | `/subscriptions/cost-too-high` exists with the 4-stage numbered funnel (cancel intent → frequency change offer → 25% off offer → confirmed cancellation). | S10.04, W5.A1 | ☐ |
| **A3.W5.02** | P0 | Each stage carries an offer-version chip when applicable. | W5.A2 | ☐ |
| **A3.W5.03** | P0 | Sequence integrity panel surfaces `blocked_by_data` count and out-of-order events. | W5.A4 | ☐ |
| **A3.W5.04** | P0 | "Offer cost vs gross value protected" mini-card with state chips appears on the right column. | W5.A3 | ☐ |
| **A3.W5.05** | P1 | "By offer version" toggle pivots the funnel on offer version. | W5 §7.4 | ☐ |

### 3.6 Workflow W6 — "Which outcomes are pending Stay.ai confirmation?"

| ID | Severity | Check | Trace | Pass/fail |
|---|---|---|---|---|
| **A3.W6.01** | P0 | "Pending Stay.ai · N" CTA on Command Center deep-links to `/subscriptions/follow-up?filter=pending_stayai_final_state`. | W6.A1, X8 | ☐ |
| **A3.W6.02** | P0 | Each row in the prefiltered queue shows Age (asc-sortable). | W6.A2 | ☐ |
| **A3.W6.03** | P0 | "Confirm in Stay.ai" writes a server-side audit row and the UI shows a confirmation toast with the audit reference. | W6.A3 | ☐ |
| **A3.W6.04** | P1 | When Stay.ai source is degraded, the page shows the "Stay.ai is responding slowly today…" banner + freshness chip. | W6.A4 | ☐ |

### 3.7 Workflow W7 — "What can I export for my manager?"

| ID | Severity | Check | Trace | Pass/fail |
|---|---|---|---|---|
| **A3.W7.01** | P0 | Export drawer reachable from page header, per-widget kebab, per-row selection, and topbar — max 1 click on any subpage. | W7.A1, X4 | ☐ |
| **A3.W7.02** | P0 | Manifest preview is always visible while the drawer is open. | W7.A2 | ☐ |
| **A3.W7.03** | P0 | Manifest mismatch causes the export to be rejected with the canonical blocked-state message. | W7.A3, A2.12 | ☐ |
| **A3.W7.04** | P1 | RBAC: CS Agent gets CSV-only; Data Analyst / Admin get everything. Server-side explicit-deny is the source of truth. | W7.A4 | ☐ |
| **A3.W7.05** | P0 | Every export emits an audit row and confirmation toast with the audit reference and manifest fingerprint. | W7.A5 | ☐ |

### 3.8 Workflow W8 — "Why can / can't I trust this metric?"

| ID | Severity | Check | Trace | Pass/fail |
|---|---|---|---|---|
| **A3.W8.01** | P0 | Every metric on every subpage carries a trust chip. | W8.A1, X3 | ☐ |
| **A3.W8.02** | P0 | Trust chip is keyboard-focusable; tooltip exposes the plain-language text from copy §2.4. | W8.A2 | ☐ |
| **A3.W8.03** | P0 | Clicking the chip opens the Level 2 expander; "Open governance drawer" inside the expander opens the Level 3 drawer. | W8.A3 | ☐ |
| **A3.W8.04** | P0 | The UI never offers a manual elevation affordance. | W8.A4, locked rule | ☐ |
| **A3.W8.05** | P1 | When trust is low / untrusted, the recommended action is one of: "Open data quality" / "Ask my manager for access" / "Wait for Stay.ai confirmation". | W8.A5 | ☐ |

---

## 4. Plain-language copy acceptance

These checks ensure every production-visible string conforms to the copy guide.

| ID | Severity | Check | Trace | Pass/fail |
|---|---|---|---|---|
| **A4.01** | P0 | No banned string from copy §2.13 appears in production-visible UI. Verified by grep against `apps/dashboard-web/src/**/*.{ts,tsx}` (excluding test files) for the union of banned terms listed in copy §2.13 (`Cycle 00`, `Wave 00`, `analytics-api`, `shape mismatch`, `fixture`, `IA v2 prototype`, `regression coverage`, `RBAC`, `MetadataDisclosure`, `GovernanceDrawer`, `BusinessValueState`, `starter`, `skeleton`). | Copy §2.13 | ☐ |
| **A4.02** | P0 | Every state chip uses the plain-language text from copy §2.6 (Business Value), §2.4 (Trust), §2.5 (Freshness). | Copy §2.4–§2.6 | ☐ |
| **A4.03** | P0 | Cancellation reasons / non-cancellation actions / portal states render the user-facing labels from copy §2.7–§2.10. | Copy §2.7–§2.10 | ☐ |
| **A4.04** | P0 | Topbar `PAGE_META` matches copy §3.1 verbatim. | Copy §3.1 | ☐ |
| **A4.05** | P0 | Sidebar removes `v0.9 · cycle 006` and `no-drift` per copy §3.2 / §2.13. | Copy §2.2, §3.2 | ☐ |
| **A4.06** | P0 | Topbar `No-drift enforced` is replaced with `Trusted definitions on` + tooltip. | Copy §2.2 | ☐ |
| **A4.07** | P0 | Every status banner uses one of the templates in copy §2.15 (Empty / Permission denied / Stay.ai missing / Stay.ai pending / API unreachable / Manifest mismatch). | Copy §2.15 | ☐ |
| **A4.08** | P0 | Every CTA uses a verb from copy §2.14 (no "Submit" / "Continue" / "OK"). | Copy §2.14 | ☐ |
| **A4.09** | P0 | Level 1 surfaces never expose metric IDs / formulas / fingerprints / audit references / ISO timestamps. | Copy §6.1, §6.4 | ☐ |
| **A4.10** | P1 | Level 2 expander uses friendly formula + owner + friendly time + freshness rule. | Copy §6.2 | ☐ |
| **A4.11** | P1 | Level 3 drawer is the only place raw IDs / fingerprints / ISO timestamps / lineage appear. | Copy §6.3 | ☐ |
| **A4.12** | P0 | Every metric on every subpage carries a Stay.ai / Shopify-context-only / Synthflow-journey-only / Portal authority chip. | Copy §2.3 | ☐ |
| **A4.13** | P1 | Every subpage includes a `?` "Help with this page" button that opens the workflow's plain-language explainer. | Copy §8 | ☐ |
| **A4.14** | P0 | First mention of "Stay.ai" on a page renders the info tooltip from copy §0 / §1.3. | Copy §1.3 | ☐ |
| **A4.15** | P0 | First mention of "Shopify" / "Synthflow" on a page carries the parenthetical "(context only)" / "(journey only)". | Copy §1.4–§1.5 | ☐ |

---

## 5. Anti-pattern acceptance — the Cycle 006 rejection list

These checks formally close the Cycle 006 rejection items. Each maps to an issue in the issue register.

| ID | Severity | Check | Issue ref | Pass/fail |
|---|---|---|---|---|
| **A5.01** | P0 | The single-massive-`/subscriptions`-page anti-pattern is gone (subnav + page header is the **only** Command Center content; no stacked legacy panels). | S1.01 | ☐ |
| **A5.02** | P0 | "Legacy sections kept mounted for regression coverage" footer line is removed. | S1.02 | ☐ |
| **A5.03** | P0 | No two heroes on the same subpage. | S1.03 | ☐ |
| **A5.04** | P0 | Scenario chip rows are removed from production UI (CS / RM / EXEC personas never see them). | S1.04 | ☐ |
| **A5.05** | P0 | "Cycle 002 contract-wired view" / "Cycle 001 dashboard module shell" labels are gone. | S1.05 | ☐ |
| **A5.06** | P0 | `analytics-api` / `contract` / `fixture` / `shape mismatch` / `shared-contract preview` strings do not appear in user-facing copy. | S1.06 | ☐ |
| **A5.07** | P0 | Subnav prototype description ("IA v2 prototype · Cycle 007 prototype" / markdown spec path) is removed. | S3.19 | ☐ |
| **A5.08** | P0 | Page-header `Advanced filters · planned` and `Export this view · planned` placeholders are replaced with functional buttons. | S3.20 | ☐ |
| **A5.09** | P0 | Embedded `SourceHealthView` mount inside `/subscriptions` is removed. | S3.18 | ☐ |
| **A5.10** | P0 | Stacked legacy Cycle 002 sub-panels (Portal / Shopify / Synthflow / SourceConfirmation / MetricMetadata) are unmounted from `/subscriptions`. | S3.17 | ☐ |
| **A5.11** | P0 | Metadata panel governance fields are demoted to Level 2 / Level 3 disclosure (no fingerprint / audit reference / metric ID / ISO timestamp on page surface). | S3.10–S3.14 | ☐ |
| **A5.12** | P0 | Authority chip rendered once per subpage (no triple-duplication). | S3.15 | ☐ |
| **A5.13** | P1 | Color palette reduced to a single semantic palette (emerald = healthy; amber = pending / warning; rose = blocked / danger). | S1.15 | ☐ |
| **A5.14** | P1 | Eyebrow visibility above the fold capped at 2 per subpage. | S1.14 | ☐ |
| **A5.15** | P0 | Cancellation page splits intake reasons from outcomes via `/subscriptions/cancellation-intake`. | S6.01 | ☐ |
| **A5.16** | P1 | Retention page links to `/subscriptions/cost-too-high`. | S7.02 | ☐ |
| **A5.17** | P1 | Data quality page uses plain-language freshness chip text. | S8.02 | ☐ |
| **A5.18** | P1 | Permission matrix table uses human role names. | S9.02 | ☐ |
| **A5.19** | P1 | Operations action queue ("Things to fix today") is added to data quality page. | S8.04 | ☐ |
| **A5.20** | P0 | Hard-fail Stay.ai missing state replaces Command Center with the tinted full-width banner; KPIs render em-dash. | S5.01, X9 | ☐ |

---

## 6. Accessibility, performance, and engineering hygiene

| ID | Severity | Check | Trace | Pass/fail |
|---|---|---|---|---|
| **A6.01** | P0 | axe scan on every subpage produces zero `serious` or `critical` violations. | (industry standard) | ☐ |
| **A6.02** | P0 | Lighthouse a11y score ≥95 on every subpage. | (industry standard) | ☐ |
| **A6.03** | P0 | No `aria-valuenow` on `role="presentation"` elements (funnel bar). | S3.08 | ☐ |
| **A6.04** | P1 | Color contrast: every chip and every body string ≥ 4.5:1 contrast (large display text ≥ 3:1). | S1.15 | ☐ |
| **A6.05** | P1 | All chips and CTAs are keyboard-focusable, with visible focus rings. | (locked) | ☐ |
| **A6.06** | P1 | Screen-reader audit on the follow-up table: row selection announced; bulk action announced. | W4 | ☐ |
| **A6.07** | P1 | Lighthouse perf score ≥85 on Command Center. | (locked) | ☐ |
| **A6.08** | P0 | Frontend Codecov ≥95% on statements / branches / functions / lines. | Codecov gate | ☐ |
| **A6.09** | P0 | Cursor Bugbot completes with no blocking findings on the Cycle 008 PR head. | Bugbot gate | ☐ |
| **A6.10** | P0 | TypeScript / ESLint / Vite build complete with no new errors and no new warnings beyond those documented in Cycle 007 baseline. | (locked) | ☐ |

---

## 7. Merge decision summary (PM gate)

A Cycle 008 PR is mergeable only if:

1. **Every P0 box** in §1 — §6 is checked **PASS**.
2. **At most 5 P1 boxes** are explicitly waived in writing by PM, and each waiver is added as a Cycle 009 backlog item.
3. **Every P0 anti-pattern** (§5.01–§5.12, §5.20) is closed.
4. **All eight workflows** (§3.1–§3.8) pass their P0 acceptance criteria.
5. **Codecov 95%** + **Cursor Bugbot pass** + **TypeScript / ESLint / Vite build clean**.
6. **Moderated UX session** with ≥3 customer-support agents (or equivalents) confirms W1.A1 (≤30 s time-to-answer) and W2.A1, W3, W4 (≤2 minute total cumulative time-to-answer for first 4 workflows).

If any of #1–#5 fails, the PR is rejected and Cycle 009 absorbs the gap. If #6 cannot be scheduled, PM may waive provisionally with an explicit "must run within 14 days of merge" follow-up task assigned to Agent C / Agent D.

---

## 8. Specific challenges and recommendations to Agent B (Cycle 008)

This section names the lift Agent B should plan for; it is **not** a check, it is a "do this with eyes open" set of warnings.

### 8.1 Migration risk — physically un-mounting legacy panels will break tests

The Cycle 005 / 002 / 001 panels are still referenced by 226 frontend tests (per Cycle 007 Agent B report). A naive unmount will cascade test failures.

**Recommended approach:**

1. Migrate one subpage at a time, in this order: **Outcomes → Follow-Up → Business Value → Cost Too High → Cancellation Intake → Portal+Handoff → Containment → Non-Cancellation → Export+Audit → Diagnostics**.
2. Each migration unmounts the legacy panel from `/subscriptions` and re-mounts it on its canonical subpage **in the same PR** so that tests can be retargeted by file path, not by feature flag.
3. Tests that depend on a legacy panel's `data-testid` get retargeted to the new subpage's route in the same PR; the assertion stays the same.
4. **Diagnostics** is shipped last and is the safety net for any remaining legacy panel that has not yet been migrated.

### 8.2 Disabled-with-tooltip is risky if it lasts more than one cycle

The Cycle 007 prototype used `disabled` placeholders for Advanced filters and Export. That was acceptable for one cycle. Doing it for two is not.

**Recommendation:** Cycle 008 ships at least a **read-only** Advanced filter drawer (it shows the dimensions, opens, applies a few filters that have backend support) and a **functional** Export drawer (PDF + CSV + manifest, even if some metrics are `blocked_by_data`). If a dimension's backend is not ready, that single dimension is disabled with the tooltip — not the entire drawer.

### 8.3 Hard-fail Stay.ai missing state is the easiest place to fail

The hard-fail state replaces Command Center with a tinted full-width banner. The temptation will be to render the existing KPI strip with em-dashes; that's not enough. The user must read the page and immediately know "the dashboard is unreliable today, contact data engineering". The banner must dominate the page above the fold.

**Recommendation:** ship the hard-fail state as a **separate `<HardFailBanner />` component** that fully replaces the page body when `source_confirmation_status === 'missing_stayai_final_state'`. Test it explicitly with a snapshot test.

### 8.4 Plain-language copy is non-trivial in a localized i18n future

The copy guide is currently English-only. Cycle 008 is allowed to ship English-only, but the strings should be funnelled through a single `lib/copy.ts` module so that a future i18n cycle can replace them in one place.

### 8.5 Don't reskin the legacy KPI grid — design the new one from scratch

The temptation will be to reuse `SubscriptionOutcomeKpiGrid` (Cycle 005) as the Command Center KPI strip. That component:

- Mixes 6 count cards and 3 rate cards on one canvas (issue S3.01).
- Uses a 7-tone palette (issue S1.15).
- Renders formula text on the page surface (issue S3.04).

These are blockers for Command Center. Either heavily refactor it, or build a new `CommandCenterKpiStrip` component that strictly enforces ≤5 count cards + 1 trust chip + 1 source chip + 1 delta + click-to-drilldown.

### 8.6 Trust label tooltips need real text, not "lorem"

The copy guide §2.4 has the four locked tooltip strings. Ship them on the actual chip rendering, not in a comment.

### 8.7 The follow-up queue is the highest-leverage page Agent B can ship

It addresses Workflows W1, W4, W6, and partially W2. If Cycle 008 ships only one new subpage with full functionality, it should be `/subscriptions/follow-up`. Everything else can ship as a placeholder + IA-correct shell with `blocked_by_data` content.

### 8.8 Independent-designer disagreements with Agent B's IA spec (none-to-few)

I reviewed the IA spec and the wireframe spec carefully. My disagreements are minor and bounded:

- **Disagreement 1 (minor):** The wireframe spec proposes "Compare to previous year" as a comparison option. Subscription analytics has at most 30 days of history in this checkout (Cycle 007). YoY comparison should ship as **disabled-with-tooltip** for the first quarter and become live only when ≥1 year of data exists. (Not blocking the spec; just a state-handling note.)
- **Disagreement 2 (minor):** The wireframe spec proposes RBAC distinction "CS Agent can export CSV but not PDF". I'd argue CS Agent (Tier 1) should not export PDF *of the whole subpage*, but should be able to export a PDF of *their own follow-up queue* for printing and notes. PM to confirm. Tracked as PMQ2.
- **Disagreement 3 (more substantive):** The wireframe spec keeps a "Trust label" filter dimension. I'd remove it — trust labels are system-calculated, and filtering by trust label invites the question "why don't I just elevate trust?". Better to render trust as a **read-only chip on every metric** with a separate "Hide low-trust metrics" toggle on each subpage. PM to confirm.

These are documented as `Open questions for PM` in the workflows v2 doc (PMQ1–PMQ5) and do not block Cycle 008 implementation.

### 8.9 The "Help with this page" `?` button is the accessibility lever

A `?` button on every subpage that opens a 1-paragraph plain-language explainer is the cheapest way to make the dashboard usable for first-time CS agents. It does not require backend work and reuses copy already written in `support_user_subscription_workflows_v2.md` and `subscription_plain_language_copy_system.md`. Do not skip it.

---

## 9. Cross-references

- Cycle 006 issue register: `project-management/reports/cycle-007/uiux-audit/cycle-006-screenshot-issue-register.md`.
- Plain-language copy guide: `docs/07_dashboard_ui_ux/subscription_plain_language_copy_system.md`.
- Workflows v2: `docs/07_dashboard_ui_ux/support_user_subscription_workflows_v2.md`.
- IA v2 spec: `docs/07_dashboard_ui_ux/subscription_analytics_information_architecture_v2.md`.
- IA v2 wireframe spec: `project-management/reports/cycle-007/design/subscription_ia_v2_wireframe_spec.md`.
- Cycle 007 Agent A backend matrix: `project-management/reports/cycle-007/metric-gap/subscription-required-vs-current-metric-matrix.md`.
- Cycle 007 Agent B IA primary design report: `project-management/reports/cycle-007/agent-b-wave-01-cycle-007-report.md`.
