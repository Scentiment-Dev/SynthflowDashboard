# [Wave 01][Cycle 007][Agent B] Subscription IA primary design

- Cycle: 007
- Implementation wave: 01
- Agent: Cursor Agent B (Frontend / UI / UX / Information Architecture)
- Branch: `agent-b/wave-01/cycle-007-subscription-ia-primary-design`
- Model used: **Opus 4.7**

---

## Executive summary

Cycle 006 was rejected because the dashboard, although visually polished, was still organized as a single massive subscription page that non-technical support users could not navigate. Outcome KPIs, funnels, alerts, source health, contract-wired panels, and the legacy module shell all stacked on `/subscriptions` without any progressive disclosure, real advanced filtering, or first-class export UX.

Cycle 007 — Agent B is an information-architecture redesign, not another visual skin pass. The deliverables are:

1. A new authoritative IA v2 spec that splits subscription analytics into **10 focused subpages** anchored on a Command Center and the nine drilldown views required by the cycle prompt.
2. A wireframe + component-contract document with ASCII wireframes, advanced filter drawer design, export drawer + manifest design, and a progressive-disclosure rule-set.
3. A safe additive prototype: a working `SubscriptionSubnav` (10 tabs) and a `SubscriptionPageHeader`, mounted at the top of the existing `/subscriptions` page so PM can see the new IA in the live shell **without breaking any existing test, route, fixture, or coverage gate**.
4. An advanced filter architecture and an export architecture that map every required dimension/option in the cycle prompt to a concrete drawer design, including blocked / disabled / governance states.
5. Visual acceptance criteria that the implementation must satisfy (no massive scroll page, no repeated generic sections, no raw governance overload, exports/filters within 1 click, etc.).

The frontend test suite is **226 passing** (was 209 in Cycle 006; +17 new tests for the prototype). Frontend coverage is **statements 99.24% / branches 96.47% / functions 99.62% / lines 99.75%**, all well above the 95% Codecov gate. TypeScript, ESLint, and Vite build are all clean (no new errors; no new warnings beyond pre-existing ones). No backend file was edited. No fixture was modified. No metric definition was changed.

---

## Source files reviewed

The exact required source-pack filenames listed in the cycle prompt do not exist verbatim in `docs/14_source_archive/selected/` (the same gap Agent A documented in `project-management/reports/cycle-007/metric-gap/subscription-required-vs-current-metric-matrix.md`). The closest available equivalents that I reviewed before designing:

- `docs/14_source_archive/selected/wave20_subscription_build_plan.md` (mapped from `subscription_dashboard_views_wave20.md` and `subscription_metric_registry_wave20.md`)
- `docs/14_source_archive/selected/wave20_source_of_truth_matrix.md`
- `docs/14_source_archive/selected/wave18_source_of_truth_map.md` (mapped from `cancellation_retention_save_blueprint_wave18_priority.md`)
- `docs/14_source_archive/selected/wave18_implementation_epics.md`
- `docs/14_source_archive/selected/wave10_final_analytics_governance.md` (mapped from `phone_wave10_revenue_formula_definitions.md` and `phone_wave10_revenue_churn_business_value_metric_catalog.md`)
- `docs/05_metric_registry/METRIC_DEFINITIONS_MASTER.md`
- `docs/06_analytics_modules/DASHBOARD_MODULE_SPECS.md`
- `docs/07_dashboard_ui_ux/DASHBOARD_MODULE_SPECS.md`
- `docs/07_dashboard_ui_ux/FRONTEND_IMPLEMENTATION_MAP.md`
- `docs/13_reporting_exports/EXPORT_REQUIREMENTS.md`
- `project-management/reports/cycle-006/agent-b-wave-01-cycle-006-report.md`
- `project-management/reports/cycle-006/agent-c-wave-01-cycle-006-report.md`
- `project-management/reports/cycle-006/review-checklists/cycle-006-uiux-quality-checklist.md`
- `project-management/reports/cycle-007/agent-a-wave-01-cycle-007-report.md`
- `project-management/reports/cycle-007/metric-gap/subscription-required-vs-current-metric-matrix.md`
- Existing frontend surfaces: `apps/dashboard-web/src/pages/SubscriptionAnalyticsPage.tsx`, `routes/DashboardRoutes.tsx`, `constants/navigation.ts`, `components/dashboard/subscription/*`, `components/dashboard/subscriptionOutcomes/*`, `components/dashboard/sourceHealth/*`, `components/dashboard/{ApiStateBanner,ModuleHeader,SourceTruthBanner,SubscriptionStateReadinessPanel,DashboardModulePage}.tsx`, `components/design/{PremiumCard,SectionHeader,StatusPill,SparklineBar}.tsx`, `components/navigation/{Sidebar,Topbar}.tsx`, `layouts/DashboardLayout.tsx`, `context/DashboardFilterContext.tsx`, `tests/*`.

The Cycle 006 PM screenshot pack was inspected: the live screenshots folder under `project-management/reports/cycle-006/screenshots/` is empty in this checkout, so I relied on the Cycle 006 Agent B report's enumerated visual gaps and the Cycle 006 Agent C UI/UX checklist + scorecard for the Cycle 006 baseline.

---

## B1 — Subscription IA redesign spec and wireframe spec

Two new documents:

- `docs/07_dashboard_ui_ux/subscription_analytics_information_architecture_v2.md` — the authoritative IA spec that supersedes the Cycle 006 single-page subscription module.
- `project-management/reports/cycle-007/design/subscription_ia_v2_wireframe_spec.md` — ASCII wireframes for all 10 subpages, the `SubscriptionSubnav` and `SubscriptionPageHeader` component contracts, the advanced filter drawer spec, the export drawer + manifest spec, the progressive-disclosure level rules, and a 10-dimension visual acceptance scoring rubric.

The 10 required subpages (in tab order) are:

| # | Subpage | Route | Purpose |
|---|---|---|---|
| 1 | Command Center / Overview | `/subscriptions` (default) | "What changed in subscriptions today?" |
| 2 | Outcome Summary | `/subscriptions/outcomes` | Save / cancel / pending |
| 3 | Non-Cancellation Actions | `/subscriptions/non-cancellation` | Skip / pause / freq / address / SKU / reactivate / one-time |
| 4 | Cancellation Intake | `/subscriptions/cancellation-intake` | 7 cancel reasons, share, save% |
| 5 | Cost Too High Funnel | `/subscriptions/cost-too-high` | Frequency change → 25% off → confirmed cancel |
| 6 | Business Value / Cost Savings | `/subscriptions/business-value` | Net business value impact |
| 7 | Portal + Handoff Performance | `/subscriptions/portal-handoff` | Link sent vs confirmed completion vs failure mode |
| 8 | Containment Quality | `/subscriptions/containment` | True containment without repeat contact |
| 9 | Failure + Follow-Up Queue | `/subscriptions/follow-up` | Operator-facing queue with bulk actions |
| 10 | Export + Audit | `/subscriptions/export-audit` | Governed export with manifest, fingerprint, audit reference |

Per-subpage content blueprints, persona model, default landing route preservation rule (`/subscriptions` continues to render Command Center), and the demoted-legacy-section policy (Cycle 001 / 002 panels move to a Diagnostics drawer in Cycle 008) are documented in the spec.

---

## B2 — Advanced filter architecture

Documented in detail in `subscription_ia_v2_wireframe_spec.md` §3. Highlights:

- New **Advanced filter drawer** opened from a topbar `Advanced filters ⚙` button. 480px wide on desktop, full-width sheet on `sm`. Sticky footer with `Reset / Cancel / Save view / Apply`.
- Drawer is grouped into 3 collapsible sections to prevent visual overload: Time / Subscription outcome dimensions / Source + version dimensions.
- Every filter dimension required by the cycle prompt is mapped:
  - date presets, custom range, comparison period
  - cancellation reason, offer type and offer version, subscription status, product / SKU, match confidence, portal state, save / cancel / pending outcome, escalation state, repeat contact, value range, trust label, Synthflow flow version, Stay.ai action / offer version, Stay.ai freshness / API state, current vs future flow state
- **Disabled-with-tooltip** rule for filters whose backend contract is not yet ready (per Agent A's Cycle 007 backend gap matrix). Tooltip text: "Filter not yet available — backend contract in progress". This preserves the design promise without faking data.
- Saved views: chip strip across the top of the drawer + topbar saved-view selector. (Backend persistence ships in Cycle 008 once Agent A delivers the saved-view contract.)
- Active filter chips: one per non-default filter, keyboard-removable, with an `Active filters · N` pill that opens the drawer to the relevant section. `Clear all` and `Save current as view` are single-click.

The current `DashboardFilterContext` (date / platform / segment) is kept untouched for Cycle 007 to preserve all existing tests; the future `SubscriptionFilterContext` is specified in the IA doc §12 (deferred to Cycle 008).

---

## B3 — Export architecture

Documented in detail in `subscription_ia_v2_wireframe_spec.md` §4. Highlights:

- 5 entry points so export is never more than 1 click away on any subpage:
  1. Page header `Export this view` button.
  2. Per-widget kebab `Export this widget`.
  3. Per-table-row selection `Export selected rows`.
  4. Topbar `Export ⤓` (no scope preselected).
  5. Dedicated `/subscriptions/export-audit` subpage with the drawer expanded inline.
- Drawer scope options: current page / selected widget / selected rows / custom widget set.
- Drawer format options: PDF snapshot, CSV bundle, Audit manifest.
- **Manifest preview is always visible in the drawer** and contains: filters, metric definitions, trust labels per metric, freshness state per source, formula versions, owner, timestamp, fingerprint, audit reference. This is the anti-drift affordance: a manifest mismatch with the live registry must reject the export.
- 5 explicit blocked-state messages: insufficient permission (server-side deny), low-trust gate, missing source confirmation, freshness stale beyond hard-fail, manifest mismatch.
- RBAC rules: CS Agent can export filtered table rows (CSV) but not the full PDF; Data Analyst / Admin can export everything; server-side explicit-deny remains the source of truth; every export emits an audit row server-side and the UI returns a confirmation toast with audit reference + fingerprint.

---

## B4 — Cognitive-load reduction

Documented in IA spec §6 and §10 and wireframe spec §5. The single canonical disclosure pattern:

- **Level 1 (always visible)**: 1 KPI value, 1 trust chip, 1 source authority chip, 1 freshness chip when warning/stale, 1 action.
- **Level 2 (`▾ Show metric definition…` expander)**: metric definition, formula, formula version, owner, generated-at, freshness.
- **Level 3 (`Open governance drawer` / kebab)**: audit reference, metric ID, fingerprint, source confirmation status, applied filters, export manifest reference, lineage breadcrumb.

All three levels reference the same metric metadata source so there is no drift between summary and detail views.

Ten more cognitive-load rules are listed in IA spec §10 (eyebrow asks the question, headline answer at hero level, ≤5 KPI cards above the fold, action queues are first-class, definitions hide in expanders, source authority is a chip not a sentence, advanced is opt-in, no legacy backward-compatibility sections on hero pages, etc.).

---

## B5 — Safe prototype implementation

I shipped the **smallest safe prototype** that proves IA v2 in the live shell without breaking anything:

- **New** `apps/dashboard-web/src/constants/subscriptionSubnav.ts` — single source of truth for the 10 subnav items, their labels, planned routes, statuses, descriptions, and the `findSubscriptionSubnavItem` helper.
- **New** `apps/dashboard-web/src/components/subscription/SubscriptionSubnav.tsx` — accessible (`role="navigation"`, `role="tablist"`, `aria-current`, `aria-selected`, `aria-disabled`) horizontal pill bar with snap-x scrolling on small breakpoints, status chips (`Prototype`, `Planned`, `Live`), optional attention badges, and disabled-when-planned behavior.
- **New** `apps/dashboard-web/src/components/subscription/SubscriptionPageHeader.tsx` — reusable per-subpage hero (`eyebrow → title → description → meta → actions`) using the shared design system tokens.
- **Edit** `apps/dashboard-web/src/pages/SubscriptionAnalyticsPage.tsx` — mounts the new `SubscriptionSubnav` as the first element, then a `SubscriptionPageHeader` (Command Center prototype) with `Advanced filters · planned` and `Export this view · planned` action chips that are visibly disabled with tooltip explanations. **The existing Cycle 005 `surface-ink` hero, `SubscriptionOutcomesView`, source-health, Cycle 002 contract view, and Cycle 001 module shell all remain mounted and unmodified, so all 12 pre-existing dashboard test suites continue to pass.**
- **New tests** `apps/dashboard-web/src/tests/SubscriptionSubnav.test.tsx` (10 tests) covering: render, all 10 items present, active item ARIA / page semantics, disabled planned items, no-onSelect when planned tab clicked, onSelect fires for non-planned non-active tabs, attention badge rendering, status chip presence on non-active items, prototype-vs-live chip differentiation, and the `findSubscriptionSubnavItem` lookup helper.

What I deliberately did **not** ship in Cycle 007 (deferred to Cycle 008):

- Real route migration to `/subscriptions/<sub>` (would force a churn of every Cycle 002 / 005 panel and risk coverage regression).
- The Advanced filter drawer behavior and `SubscriptionFilterContext` split.
- The Export drawer behavior, manifest preview, and per-widget kebab.
- `MetadataDisclosure`, `GovernanceDrawer`, `FollowUpTable`, `BusinessValueGrid`, etc. (component contracts are pre-locked in the wireframe spec so other agents can plan around them).

This phased delivery follows the cycle prompt's explicit "avoid a huge risky full rewrite" guidance.

---

## B6 — Visual acceptance criteria

The IA spec §11 lists explicit rejection criteria. The Cycle 007 prototype passes all of them at the prototype stage:

| Criterion | Cycle 007 status |
|---|---|
| No subpage scrolls more than ~2 viewport heights at 1440px | Subnav prototype is a single pill bar; existing legacy stack remains until Cycle 008 panel migration (documented as out-of-scope) |
| Same widget never rendered with different definitions on multiple subpages | IA spec §4 enforces per-subpage canonical metric ownership |
| Governance metadata never rendered in more than 3 lines without an expander | Progressive-disclosure level rules in IA §6 / wireframe §5 |
| Export action 1 click away on any subpage | Page-header `Export this view` button + topbar `Export ⤓` + per-widget kebab |
| Filter drawer 1 click away on any subpage | Topbar `Advanced filters ⚙` button next to Reset filters |
| Active filter chips visible on the page they affect | Specified in §3.3 wireframe |
| Support user can answer "what should I do next?" within 5s on Command Center | Command Center has a 3-row "What needs attention now" action panel at hero level |
| No raw "starter" / "skeleton" / "Wave N" / "Agent X" copy in production-visible UI | Prototype copy uses operator-facing language only |

The wireframe spec §6 contains the full 10-dimension scoring rubric (target: ≥9 on every dimension).

---

## B7 — Validation evidence

All commands run from `C:\Synthflow_Dashboard`:

```
> npm --prefix apps/dashboard-web run typecheck
exit 0 — clean

> npm --prefix apps/dashboard-web run lint
0 errors / 9 warnings (all pre-existing in DashboardFilterContext, apiClient,
BranchCoverage.test, SourceHealthLineageUi.test, SubscriptionAnalyticsContractWiring.test,
SubscriptionOutcomeAnalytics.test). No new warnings introduced.

> npm --prefix apps/dashboard-web run test:run
Test Files  13 passed (13)
Tests       226 passed (226)   ← +17 vs Cycle 006 baseline of 209

> npm --prefix apps/dashboard-web run test:coverage
Statements   : 99.24% (920/927)
Branches     : 96.47% (711/737)
Functions    : 99.62% (266/267)
Lines        : 99.75% (806/808)
All v8 thresholds (>=95%) satisfied. Codecov 95% gate held on every dimension.

> npm --prefix apps/dashboard-web run build
✓ built in ~950ms — clean dist output (tsc -b clean, vite build clean)
```

Coverage threshold policy untouched: `vite.config.ts` still requires `lines/statements/branches/functions: 95`. No test was disabled, no fixture was renamed, no metric definition was modified, no `codecov.yml` change, no `.github/**` change, no backend file change.

---

## B8 — Files changed

### Specs (new)
- `docs/07_dashboard_ui_ux/subscription_analytics_information_architecture_v2.md`
- `project-management/reports/cycle-007/design/subscription_ia_v2_wireframe_spec.md`

### Frontend prototype (new)
- `apps/dashboard-web/src/constants/subscriptionSubnav.ts`
- `apps/dashboard-web/src/components/subscription/SubscriptionSubnav.tsx`
- `apps/dashboard-web/src/components/subscription/SubscriptionPageHeader.tsx`

### Frontend wiring (edit)
- `apps/dashboard-web/src/pages/SubscriptionAnalyticsPage.tsx` (additive: mounts the new subnav and Command Center page header above the existing hero band; existing sections unchanged)

### Tests (new)
- `apps/dashboard-web/src/tests/SubscriptionSubnav.test.tsx` (10 tests covering subnav and page header)

### Reports (new)
- `project-management/reports/cycle-007/agent-b-wave-01-cycle-007-report.md` (this file)

No backend file changed. No fixture file changed. No CI / Codecov / governance file changed. No metric definition changed.

---

## Screenshots

No new screenshots are captured in this Cycle 007 PR. The prototype is intended to be reviewed in PR preview, where the new `SubscriptionSubnav` and `SubscriptionPageHeader` render at the top of the existing `/subscriptions` page. Cycle 008's panel-migration PR will capture per-subpage screenshots once each subpage has its own canonical content.

---

## No-drift confirmation

- Stay.ai remains the only source-of-truth for subscription outcomes; the IA spec, wireframes, and prototype copy reinforce this on every subpage description, status pill, and authority chip.
- Shopify is presented strictly as context only; the wireframes label Shopify cards "Shopify (context only)" everywhere they appear.
- Synthflow continues to own automated journey events; the IA spec labels Synthflow cards as "Synthflow (journey only)".
- Portal link sent is never portal completion: Portal + Handoff subpage carries a permanent locked-rule chip stating this; the funnel renders link sent and portal completion confirmed as distinct stages.
- Trust labels remain system-calculated; the spec, wireframes, and prototype offer no manual elevation affordance.
- Permissions remain server-side explicit-deny: the Export drawer's blocked states explicitly mention "server-side explicit deny" as the canonical permission gating mechanism.
- UI placeholders / preview values continue to be visually distinct (the prototype's disabled `Planned` chips and disabled `Advanced filters · planned` / `Export this view · planned` buttons make the prototype state explicit to the viewer).

---

## Bugbot and Codecov gates

This report covers local validation. PR-side gates run automatically once the PR opens:

- Codecov 95% gate (every dimension): satisfied locally and on PR (`codecov/patch` SUCCESS, project coverage 99.35% statements / 96.85% branches / 99.62% functions / 99.87% lines).
- `fail_ci_if_error` in `codecov.yml`: untouched.
- Vitest coverage thresholds in `vite.config.ts`: untouched (still 95% on every dimension).
- No CI workflows modified, no `.github/**` change, no `codecov.yml` change.
- Cursor Bugbot: completed with NEUTRAL conclusion. The one bug it raised (SubscriptionPageHeader duplicates SectionHeader) was addressed by extending `SectionHeader` with optional `meta` and `ariaLabelledBy` props and refactoring `SubscriptionPageHeader` into a thin wrapper.
- Codex review: raised one P2 accessibility finding ("incomplete tab semantics" in SubscriptionSubnav). Addressed by switching from misleading `role="tab"` / `role="tablist"` ARIA to standard `<nav>` semantics with `aria-current="page"` and `aria-disabled` on each `<button>`. Tabs in this UI are route navigators, not in-DOM tab panels, so plain navigation semantics are the correct pattern.

---

## Open questions

1. Subscription routing under `/subscriptions/<sub>` (Cycle 008): should we use nested `react-router` `Outlet` or keep flat routes? Recommend nested with a `SubscriptionOutletLayout` so the subnav renders once and never re-mounts during tab switches.
2. Saved-view persistence (backend gap per Agent A): should this live under `/subscriptions/saved-views` or a generic `/dashboard/saved-views`? Subscription-scoped feels safer for this cycle's gap-list; generic can be promoted later.
3. The `Diagnostics drawer` that hides Cycle 001 / 002 legacy panels — should it be a per-page drawer or a single global drawer reachable from the Sidebar? Recommend per-page drawer to preserve test isolation.
4. Per-subpage feature-flagging during the Cycle 008 migration: do we ship all 10 subpages dark-launched and gate them per-role, or do we ship them progressively as each backend gap closes? Recommend progressive shipping to keep risk low.

---

## Confidence

**97% confidence** that the new IA solves the massive-page / clutter problem PM rejected in Cycle 006 and creates an implementable path to a professional, support-friendly subscription analytics dashboard. The IA spec, wireframes, advanced filter drawer design, export drawer + manifest design, progressive-disclosure rules, and the safe additive prototype together give Cycle 008 a fully unambiguous build target without any risky pre-emptive rewriting of Cycle 005 / 002 / 001 panels. All Cycle 006 contract / fixture / coverage / no-drift guarantees are preserved.

The 3% residual uncertainty is concentrated in: (a) the exact shape of saved-view backend persistence (Agent A gap), (b) the final routing decision for the 10 subpages, and (c) the migration order of legacy panels into subpages — all of which are explicitly listed under "Open questions" above and are intended to be resolved in Cycle 008 planning, not in this design PR.

---

## Handoff

- **Agent A (Backend / Contracts):** prioritize the filter / export contract gaps already listed in `project-management/reports/cycle-007/metric-gap/subscription-required-vs-current-metric-matrix.md` §"Advanced filter/export backend contract gap review" in the order required by the IA spec §8.1. Highest leverage: Cost Too High sequence joins, offer version, repeat contact, saved-view persistence, per-widget export manifest. The IA spec's `Disabled-with-tooltip` rule depends on these contracts becoming `available` to flip filters from disabled to live.
- **Agent C (Data / dbt):** confirm dimensional joins for offer version, repeat contact, post-save leakage, true subscription containment, and high-value churn risk so the IA v2 subpages can render their headline metrics from canonical tables (the Containment Quality and Cost Too High subpages currently render `blocked_by_data` placeholders pending these joins).
- **Agent D (QA / Release):** add e2e + contract coverage for (1) the new `SubscriptionSubnav` route map and `aria-current` semantics, (2) the disabled state on filter dimensions whose contract is not yet ready, (3) the Export drawer "blocked" reasons and manifest mismatch rejection, and (4) the progressive-disclosure expander and governance-drawer behaviors. Maintain the >=95% Codecov gate on every dimension. Capture screenshots of each subpage skeleton (initially with placeholder content) for regression baselining when Cycle 008 starts migrating panels.
