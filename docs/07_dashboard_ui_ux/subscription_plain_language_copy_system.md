# Subscription Plain-Language Copy System

- Document owner: Cursor Agent C — Second UI/UX designer / independent UX auditor
- Cycle: 007
- Wave: 01
- Status: **Authoritative copy guide for Cycle 008 implementation.** Every production-visible string in subscription analytics must conform to this guide.
- Companion to: `docs/07_dashboard_ui_ux/subscription_analytics_information_architecture_v2.md`
- Companion to: `docs/07_dashboard_ui_ux/support_user_subscription_workflows_v2.md`
- Source-of-truth lock: Stay.ai owns subscription outcome truth; Shopify is context only; Synthflow is journey-event only; portal link sent is **not** portal completion; trust labels are system-calculated.

---

## 0. Why this document exists

PM rejected Cycle 006 because the dashboard is unusable by non-technical customer-support agents — even though it was visually polished. The single biggest contributor is **the copy itself**. Strings like `analytics-api unreachable`, `shape mismatch`, `pending_stayai_match`, `subscription_outcomes_v3.2`, `confirmed_stayai_match`, `Wave 4 frontend skeleton`, `Cycle 002 contract-wired view`, `Legacy sections kept mounted for regression coverage`, `IA v2 prototype`, `No-drift enforced`, `RBAC` — these are engineering vocabulary on the page surface.

This guide is the operational rulebook for translating those concepts into language a non-technical CS agent can read in ≤5 seconds.

The guide is normative: any production-visible string that disagrees with this guide is a **defect** and is logged in the Cycle 006 screenshot issue register (`project-management/reports/cycle-007/uiux-audit/cycle-006-screenshot-issue-register.md`).

---

## 1. Core principles

1. **Question-then-answer.** Page eyebrow asks the question; page title or KPI gives the answer. Never lead with a noun ("Subscription Analytics"). Lead with what you'll learn ("What changed in subscriptions today?").
2. **One thought per chip.** Each pill, chip, or status badge says **one** thing. Never "Trust: high · Source: Stay.ai · Freshness: fresh" all in one chip — three chips.
3. **Stay.ai = the system that owns the official subscription record.** First mention on a page renders an info tooltip with that exact wording. Subsequent mentions can drop the tooltip.
4. **Shopify (context only).** Shopify is *always* labelled "(context only)" the first time it appears on a page. Every subsequent mention must keep the parenthetical when the user could mistake it for the source of truth.
5. **Synthflow (journey only).** Same parenthetical rule. Synthflow events are the call-flow steps, not the outcome.
6. **Portal link sent ≠ portal completion.** This phrase is locked. Any UI that shows portal data must visually distinguish "link sent" from "completion confirmed" and never lump them.
7. **Time first, jargon never.** ISO timestamps render as "Updated N min ago · 5 May at 14:21 ET". Time-zone is always shown in a friendly form.
8. **Trust labels are system-calculated.** Never expose a manual elevation affordance. The chip text is "High / Medium / Low / Untrusted" — never the system enum.
9. **State chips use plain words.** `confirmed → "Confirmed"`, `estimated → "Estimated"`, `pending → "Pending Stay.ai"`, `unknown → "Unknown"`, `blocked_by_data → "Blocked — data missing"`. The user never sees the snake_case enum.
10. **Action-oriented CTAs.** Buttons are verbs: "Open follow-up queue", "Confirm in Stay.ai", "Resend portal link", "Export this view", "Ask my manager for access". Never "Submit", "Continue", "OK".
11. **Counts before percentages.** "142 saves (78.9%)" — never "78.9% (142 saves)". Counts give human anchor; percentage refines.
12. **Currency in the user's locale, with the source.** "$4,820 (Confirmed)" not "USD 4820.00".
13. **No internal vocabulary.** Banned strings: `Cycle 00N`, `Wave 00N`, `Agent X`, `analytics-api`, `contract`, `fixture`, `shape mismatch`, `shared-contract preview`, `IA v2 prototype`, `regression coverage`, `RBAC`, `MetadataDisclosure`, `GovernanceDrawer`, `BusinessValueState`, `formula version` (Level 2 only — see §6), `fingerprint` (Level 3 only — see §6), `audit reference` (Level 3 only).
14. **Apologise once when the system fails.** Status banners use a single sentence and a single CTA. No paragraphs of error text.

---

## 2. Translation table — required for Cycle 008

The left column is the current Cycle 006 user-visible string (sourced from the audit). The right column is the Cycle 008 replacement.

### 2.0 Anchor translations (the three the cycle prompt locks verbatim)

These three translations are quoted verbatim from the Cycle 007 Agent C prompt and are the gold-standard anchors that every other entry in this guide must match in tone, length, and audience. They are reproduced verbatim so Cycle 008 implementations and Agent D QA can match them character-for-character if they appear on a page surface.

| Concept | Cycle 008 plain-language string (locked) |
|---|---|
| Stay.ai final state missing | "We do not yet have official subscription confirmation." |
| Portal link sent != completion | "The customer received the link, but we have not confirmed they finished the action." |
| Trust label | "How reliable this metric is right now." |

These three strings reappear inside the larger translation tables below (§2.1 System status, §2.4 Trust labels, §2.7 Subscription outcome state, §2.10 Portal states) so they are usable both as anchors and as direct lookups.

### 2.1 System status / API state

| Cycle 006 string | Cycle 008 replacement | Notes |
|---|---|---|
| "Loading subscription outcomes from analytics-api…" | "Loading the latest subscription numbers…" | The user does not need to know the service name. |
| "Live API contract loaded." | "Live data loaded · refreshed N min ago" | Friendly wall-clock anchor. |
| "Stay.ai source confirmation: confirmed_stayai_match" | "Stay.ai has confirmed this period · all official outcomes are in" | Plain language; enum hidden. |
| "Stay.ai source confirmation: pending_stayai_match" | "Stay.ai has not yet confirmed N calls in this period" | Number is the key signal. |
| "Stay.ai source confirmation: missing_stayai_final_state" | "Stay.ai has not sent any final outcomes for this period yet" | Clear next-step. |
| "Permission denied by server: rendering shared-contract preview only. UI does not bypass server-side authorization." | "We don't have permission to load live data here. Showing the last reviewed snapshot. Ask your manager for access." | One sentence, one CTA. |
| "Contract preview from fixture (analytics-api unreachable: …)" | "Live data is temporarily unavailable. Showing the last reviewed snapshot." + Retry button | Engineering string moved to Level 3. |
| "Contract preview from fixture (analytics-api returned a malformed contract)" | "Live data is temporarily unavailable. Please refresh in a few minutes." + Retry button | Drift state. |

### 2.2 Source-of-truth and authority

| Cycle 006 string | Cycle 008 replacement | Notes |
|---|---|---|
| "Stay.ai source of truth" | "Stay.ai · source of truth" + tooltip | First-mention tooltip: "Stay.ai is the system that owns the official subscription record." |
| "Stay.ai final authority" | "Stay.ai · official outcome" | "Final" is meaningful internally; "official" works for users. |
| "Stay.ai-confirmed retained outcome" | "Confirmed by Stay.ai" | Compact. |
| "Stay.ai-confirmed mix of cancellation, retention, and pending outcomes" | (Hidden — scenario toggle removed in production) | See workflow W4 / W6 acceptance criteria. |
| "Outcome intelligence · Stay.ai authoritative" | (Removed) | Replaced with question eyebrow per workflow W2. |
| "Source authority: Stay.ai" (per funnel row) | (Removed; rendered once at panel level) | See issue S3.06. |
| "No-drift enforced" | "Trusted definitions on" + tooltip | Tooltip: "These metrics use the same definitions as the official rulebook." |
| "Source-of-truth lock active" | "Source-of-truth lock" (no "active" — implied) | Tighter chip. |
| "Stay.ai-anchored subscription intelligence for the post-call experience team" | "Stay.ai-anchored subscription analytics for support and retention" | Operator-facing audience. |
| "Stay.ai-confirmed ratio" | (Removed; authority shown once in panel header) | See S3.03. |

### 2.3 Source labels (always inline with metrics)

| Source role | Plain-language label | Where it must appear |
|---|---|---|
| Stay.ai (final authority) | "Stay.ai · official" | Inline with confirmed outcome metrics. |
| Stay.ai (final authority, pending) | "Stay.ai · pending" | Inline with pending records. |
| Synthflow (journey events) | "Synthflow · journey only" | Inline with call-flow stage metrics. |
| Shopify (orders / context) | "Shopify · context only" | Inline with revenue / order context cards. |
| Portal (link delivery) | "Portal · link sent" | Inline with link-delivery metrics. |
| Portal (completion confirmed) | "Portal · completion confirmed" | Inline with completion metrics. |

### 2.4 Trust labels

The phrase "Trust label" itself never appears on the page surface. When a user hovers or focuses any trust chip, the first sentence of the tooltip is always the locked anchor: **"How reliable this metric is right now."** The state-specific elaboration follows on a second line.

| System enum | Chip text | Plain-language tooltip (line 1 = anchor; line 2 = state) |
|---|---|---|
| `high` | "High" | "How reliable this metric is right now." / "We have official confirmation from Stay.ai and the source is fresh." |
| `medium` | "Medium" | "How reliable this metric is right now." / "We have most of the data we need. A few records are still pending or partly estimated." |
| `low` | "Low" | "How reliable this metric is right now." / "Some of this data is missing or out of date. Treat the number as a rough guide." |
| `untrusted` | "Untrusted" | "How reliable this metric is right now." / "We cannot trust this number right now. Open the data quality page for details." |

### 2.5 Freshness states

| System enum | Chip text | Plain-language tooltip |
|---|---|---|
| `fresh` | "On time" | "Data refreshed within the expected window." |
| `warning` | "Slightly delayed" | "Refresh is a little behind schedule, but the data is still usable." |
| `degraded` | "Behind schedule" | "Refresh is meaningfully behind. Treat new numbers cautiously." |
| `stale` | "Too old to trust" | "Data is older than our trust threshold. Open data quality." |
| `unknown` | "Status unknown" | "We don't have a freshness reading yet. Check data quality." |

Severity colour mapping (locks Cycle 008 palette):

- `fresh` → emerald.
- `warning` → amber.
- `degraded` → amber + outline.
- `stale` → rose.
- `unknown` → slate.

### 2.6 Business-value state chips

Locked to Agent A's `BusinessValueState` enum.

| System enum | Chip text | Tooltip |
|---|---|---|
| `confirmed` | "Confirmed" | "Stay.ai has confirmed the outcome and the financial figures are validated." |
| `estimated` | "Estimated" | "Stay.ai has confirmed the outcome but the financial figures use modelled support cost or revenue." |
| `pending` | "Pending Stay.ai" | "We do not yet have official subscription confirmation, so this number is provisional." |
| `unknown` | "Unknown" | "We can't compute this metric from the data we currently have." |
| `blocked_by_data` | "Blocked — data missing" | "A required join (e.g. offer version) is not yet built. See Cycle 008 plan." |

### 2.7 Subscription outcome state

| Cycle 006 / system label | Cycle 008 replacement |
|---|---|
| "Stay.ai final state pending" | "We do not yet have official subscription confirmation." |
| "Stay.ai final state missing" | "We do not yet have official subscription confirmation." (anchor — same plain-language sentence the prompt locks; the page header escalates to a hard-fail banner per §2.15.3 when the state is fully missing rather than just pending) |
| "Outcomes blocked from finalization" | "We can't confirm save or cancel for these calls until Stay.ai sends us the final result." |
| "Subscription contacts in scope" | "Subscription calls in this view" + tooltip "One row per call where the customer asked about their subscription." |
| "Subscription outcome KPIs" | "Subscription outcomes" |
| "Subscription outcome funnel" | "How calls move through the subscription flow" |
| "Subscription outcome state controls" | (Removed; replaced by inline alert chips) |

### 2.8 Cancellation reasons (locked taxonomy)

| Internal enum | User-facing label |
|---|---|
| `cost_too_high` | "Cost too high" |
| `dont_need_now` | "Don't need it now" |
| `product_issue` | "Product issue" |
| `switching_brand` | "Switching to another brand" |
| `service_issue` | "Service issue" |
| `other` | "Other reason" |
| `unknown` / `not_captured` | "Reason not captured" |

### 2.9 Non-cancellation actions

| Internal label | User-facing label |
|---|---|
| `skip` | "Skip a delivery" |
| `pause` | "Pause subscription" |
| `frequency_change` | "Change frequency" |
| `address_change` | "Change address" |
| `sku_swap` | "Swap product (SKU change)" |
| `reactivate` | "Reactivate subscription" |
| `one_time_addon` | "Add a one-time item" |

### 2.10 Portal states

The locked rule "Portal link sent ≠ portal completion" surfaces on every page that shows portal data. The canonical user-facing explainer (anchor from §2.0) is: **"The customer received the link, but we have not confirmed they finished the action."** This sentence appears as the tooltip / sub-line on any "Link sent" chip and as the locked-rule banner on `/subscriptions/portal-handoff`.

| System enum | User-facing label | Tooltip / sub-line (when applicable) |
|---|---|---|
| `link_sent` | "Link sent" | "The customer received the link, but we have not confirmed they finished the action." |
| `link_opened` | "Link opened" | "The customer opened the link. We have not confirmed they finished the action." |
| `portal_started` | "Portal started" | "The customer started the portal flow. We have not confirmed they finished the action." |
| `portal_completed` | "Completion confirmed" | "The customer finished the action. This is the only state that counts as portal completion." |
| `link_failed_bounce` | "Link failed (bounced)" | "The link did not reach the customer (delivery bounce). Try a different channel." |
| `link_failed_optout` | "Link failed (opted out)" | "The customer opted out of this channel. Use a different channel or skip outreach." |
| `link_failed_expired` | "Link expired" | "The link timed out before the customer used it. Resend the portal link." |
| `completion_unknown` | "Completion unknown" | "We have no signal that the customer finished the action. Treat as not completed." |

### 2.11 Permissions and RBAC

| Cycle 006 string | Cycle 008 replacement |
|---|---|
| "RBAC, exports, and audit controls" (page title) | "Who can see and export what" |
| "RBAC denial" | "Permission denied" |
| "Server-side explicit deny" (system status) | (Hidden in Level 1; kept in Level 3 governance drawer.) |
| "Permission denied by server: rendering shared-contract preview only" | "We don't have permission to load live data here. Showing the last reviewed snapshot. Ask your manager for access." |
| "Server-side explicit-deny remains the source of truth" (per spec) | "Your role decides what you can see. The check happens on the server. Audit reference is logged." |

### 2.12 Governance metadata (Levels 1 / 2 / 3)

| System enum | Level 1 (page surface) | Level 2 (▾ expander) | Level 3 (drawer) |
|---|---|---|---|
| Metric ID (`subscription_outcomes_v3.2`) | not shown | "Subscription outcomes — version 3.2" | "subscription_outcomes_v3.2" (raw, monospace) |
| Formula | not shown | "(N / D) where N = … and D = …" | full formula text |
| Formula version | not shown | "v3.2 (May 2026)" | "subscription_outcomes_v3.2" |
| Owner | not shown | "Owner: Analytics" | "Owner: Analytics · contact #analytics" |
| Generated at | not shown ("Updated N min ago" only) | "5 May at 14:21 ET" | "2026-05-05T19:21:03+00:00" |
| Audit reference | not shown | not shown | "AUD-2026-05-05-118" |
| Fingerprint | not shown | not shown | "9f4c-…-7a21" with copy-to-clipboard |
| Filters applied | not shown (active filter chips elsewhere) | "Date 30d · Cancel reason: Cost Too High" | full filter object |
| Lineage breadcrumb | not shown | not shown | breadcrumb tree |
| Source confirmation status | shown via inline chip ("Stay.ai · official" / "Stay.ai · pending") | "Stay.ai confirmation: pending for X of Y" | raw enum |

### 2.13 Internal vocabulary banned in production UI (zero-tolerance list)

| Banned string | Replacement |
|---|---|
| "Cycle 00N", "Wave 00N", "Agent A/B/C/D" | (Remove; do not surface.) |
| "starter", "skeleton", "scaffold" | "Live data starts here once the source is wired" |
| "regression coverage", "regression test", "test suite" | (Remove from page surface.) |
| "GitBranch icon · Legacy sections kept mounted for regression coverage" | (Remove the entire footer line.) |
| "Cycle 002 contract-wired subscription view" | (Move panel to Diagnostics with neutral title "Subscription source detail") |
| "Cycle 001 dashboard module shell" | (Move to Diagnostics with neutral title "Module shell — diagnostic only") |
| "IA v2 prototype" | (Hide.) |
| "Subscription analytics · subnav" | (Hide. The subnav itself is enough; no helper paragraph.) |
| "10 focused subpages · Cycle 007 prototype" | (Hide.) |
| "See the IA spec under docs/07_dashboard_ui_ux/subscription_analytics_information_architecture_v2.md" | (Hide. Never surface markdown paths in product UI.) |
| "Phone Support Analytics" (sidebar wordmark) | "Subscription analytics" or product brand decision (PM to confirm). |
| "build 0.9 · cycle 006" (footer) | (Hide. Replace with build hash on hover only, or remove.) |
| "v0.9 · cycle 006" (sidebar) | (Hide.) |
| "no-drift" (sidebar pill) | "Source-of-truth lock" |
| "No-drift enforced" (topbar pill) | "Trusted definitions on" |
| "Awaiting first confirmed window" | "We need at least one full week of data before we can show a trend." |
| "Preview value · awaiting live contract" | "Live data starts here once the source is wired" |
| "starter baseline" | "No data yet" |
| "Stay.ai-confirmed retained outcome with low pending counts" (scenario tooltip) | (Removed; scenarios are not user-facing.) |

### 2.14 CTAs (canonical verbs)

| Action | CTA text |
|---|---|
| Drill into followup queue | "Open follow-up queue" |
| Confirm a record in Stay.ai | "Confirm in Stay.ai" (deep-link external; copy ID fallback) |
| Re-send portal link | "Resend portal link" |
| Mark records reviewed (bulk) | "Mark reviewed" |
| Escalate to lead (bulk) | "Escalate" |
| Generate a governed export | "Export this view" / "Export this widget" / "Export selected rows" |
| Apply advanced filters | "Apply filters" |
| Save current filters as a view | "Save view" |
| Reset all filters | "Reset filters" |
| Open metric definition | "Show metric definition" |
| Open governance drawer | "Open governance drawer" |
| Refresh data | "Refresh" |
| Open data quality | "Open data quality" |
| Open diagnostics drawer | "Open diagnostic view" |
| Permission denied recovery | "Ask my manager for access" |

### 2.15 Empty / blocked / pending / permission-denied states (templates)

These templates are the **only** templates the dashboard may use for these states. Variations require a copy-system update.

#### 2.15.1 Empty state

```
[icon · neutral]
No subscription calls in this view yet.

Try [widening the date range] or [clearing filters].
```

#### 2.15.2 Permission-denied state

```
[icon · key]
We don't have permission to load live data here.
Showing the last reviewed snapshot.

[Ask my manager for access]
```

#### 2.15.3 Stay.ai missing (hard fail)

```
[icon · alert]
We're not getting Stay.ai final results right now.
The numbers below cannot be trusted until this is fixed.

[Open data quality] · audit reference: AUD-…
```

#### 2.15.4 Stay.ai pending (soft pending)

```
[icon · clock]
Stay.ai has not yet confirmed N calls in this period.
We are showing provisional numbers — they may change.

[Open follow-up queue]
```

#### 2.15.5 API unreachable (transient)

```
[icon · cloud-off]
Live data is temporarily unavailable.
Showing the last reviewed snapshot.

[Refresh]   · last refresh attempt: 2 min ago
```

#### 2.15.6 Manifest mismatch (export blocked)

```
[icon · ban]
Export blocked: a metric definition has changed since this view was rendered.
Refresh and try again.

[Refresh and retry]
```

---

## 3. Page-level copy mapping

### 3.1 Topbar `PAGE_META`

The Cycle 006 `PAGE_META` map (`apps/dashboard-web/src/components/navigation/Topbar.tsx`) renders eyebrow + title for every page. Cycle 008 must use these:

| Route | Eyebrow | Title |
|---|---|---|
| `/overview` | Today, across support | What changed in support today? |
| `/subscriptions` | Subscription analytics | What changed in subscriptions today? |
| `/subscriptions/outcomes` | Subscription outcomes | Did the call end in save / cancel / pending? |
| `/subscriptions/non-cancellation` | Non-cancellation actions | Are skip / pause / frequency-change / SKU swap completing? |
| `/subscriptions/cancellation-intake` | Cancellation intake | Which cancel reasons are coming in? |
| `/subscriptions/cost-too-high` | Cost Too High retention | Frequency change → 25% off → confirmed cancel — where do we lose them? |
| `/subscriptions/business-value` | Business value | Calls we saved — in dollars |
| `/subscriptions/portal-handoff` | Portal handoff | Link sent vs confirmed completion vs failure |
| `/subscriptions/containment` | Containment quality | True containment: contained without repeat contact |
| `/subscriptions/follow-up` | Follow-up queue | Calls that need a human |
| `/subscriptions/export-audit` | Governed exports | Pull a governed export |
| `/cancellations` | Confirmed cancellations | Where customers actually cancelled |
| `/retention` | Calls we saved | Where we kept the subscription |
| `/data-quality` | Data quality | How fresh is our data? |
| `/governance` | Governance | Who can see and export what |
| `/exports` | Exports | Recent exports and audit trail |

### 3.2 Sidebar (Cycle 008 cleanup)

| Element | Cycle 006 | Cycle 008 |
|---|---|---|
| Wordmark line 1 | "Scentiment" | "Scentiment" (kept) |
| Wordmark line 2 | "Phone Support Analytics" | "Subscription analytics" (PM to confirm brand) |
| Hero subline | "Stay.ai-anchored subscription intelligence for the post-call experience team." | "Stay.ai-anchored subscription analytics for support and retention." |
| Pulsing chip | "Source-of-truth lock active" | "Source-of-truth lock" (no "active") |
| Footer pill | "v0.9 · cycle 006 · no-drift" | (Hidden by default; visible to Admin only as a small "Build · {hash}" tooltip on hover.) |
| Subscription nav badge | "Priority" | "Priority" (kept; user-friendly) |

### 3.3 Footer (`DashboardLayout`)

Cycle 008:

```
Scentiment internal analytics ·
Stay.ai owns subscription outcome truth ·
Shopify is context only ·
Trust labels are system-calculated.
```

(no version chip on the production footer — version moves to a tooltip per §2.13.)

---

## 4. Component-level copy contracts

### 4.1 `SubscriptionPageHeader`

- `eyebrow` is one of the eyebrows in §3.1.
- `title` is the question or operator-facing answer in §3.1.
- `description` (optional) is **at most one sentence**. No promotional language ("the first fully elevated"). No internal vocabulary ("Cycle 007 prototype").
- `meta` chips: at most three: source authority, trust mode, freshness mode.
- `actions`: max two buttons; both must be functional in Cycle 008 (no `planned` placeholders).

### 4.2 `SubscriptionSubnav`

- No helper paragraph below the tab strip. The tab strip is enough.
- No "IA v2 prototype" / "10 focused subpages · Cycle 007 prototype" eyebrow.
- Each tab label is the short label from the IA spec (`Command Center`, `Outcomes`, `Non-Cancel`, `Cancel Intake`, `Cost Too High`, `Business Value`, `Portal & Handoff`, `Containment`, `Follow-Up`, `Export & Audit`).
- Tabs that aren't ready show a `Coming soon` chip (not `Planned`).
- Tabs with attention render an attention badge only when the underlying queue is non-empty (no hard-coded badge).

### 4.3 KPI cards

- Card structure: value (largest), value sub-label, source chip, trust chip, optional delta.
- Card title in eyebrow style is the metric's plain-language name.
- No formula text on the card surface.
- No `data-testid` value visible to the eye (it's still a `data-testid`, just don't render it as text).
- Card is a clickable link to the canonical drilldown.

### 4.4 Funnel stages

- Stage label is the plain-language step name from §2.10 / §2.7.
- Authority chip rendered once per panel header; per-stage chip only for stages whose authority differs.
- Share rendered once per stage (bar OR text — not both).
- Each stage links to the canonical drilldown subpage.

### 4.5 Tables

- Column headers in plain language (not enum keys).
- Default sort: age desc (oldest first); secondary sort: trust asc (lowest first).
- Empty state per §2.15.1.
- "Next step" column is a verb-led action.

### 4.6 Status banners

- One sentence + one CTA. Always.
- Templates per §2.15.

### 4.7 Drawer copy

- Drawer header is the workflow question, not the section name.
  - Filter drawer header: "Filter the data".
  - Export drawer header: "Export this view".
  - Governance drawer header: "Where this number comes from".
- Drawer footer buttons are verbs: "Apply filters", "Reset filters", "Save view", "Cancel", "Generate export".
- Drawer manifest preview labels are plain-language ("Active filters", "Metric definitions", "How fresh", "Formula version", "Owner", "Time exported").

---

## 5. Tone and voice

### 5.1 Voice attributes

- **Direct.** "We don't have permission to load live data here." — not "Authorization is required to access this resource."
- **Honest about uncertainty.** "Treat the number as a rough guide" — not "Approximate" alone.
- **Action-suggesting.** Always recommend a next step.
- **Calm under failure.** No exclamation marks except in success toasts.
- **Plural we.** "We don't have…", "We can't confirm…". The dashboard speaks for the team, not for the company or the system.

### 5.2 Voice anti-patterns (banned)

- Marketing copy. "The first fully elevated analytics module" → cut.
- Self-referential copy. "the redesigned subscription information architecture" → cut.
- Engineering hedging. "may", "should", "if applicable", "where available", "subject to" → replace with concrete language.
- Praise. "Premium", "world-class", "polished" → cut.
- Apology spam. Apologise once per failure state, never twice.

---

## 6. Progressive-disclosure copy contract

Three levels — locked.

### 6.1 Level 1 (always visible)

- Plain-language metric name.
- Value (largest).
- Source authority chip.
- Trust chip.
- Freshness chip when warning / degraded / stale / unknown.
- Optional one-action CTA.

Anything beyond this is **Level 2** or **Level 3** — never inline on the page surface.

### 6.2 Level 2 (`▾ Show metric definition`)

- One-paragraph plain-language definition.
- Friendly formula ("Saves divided by cancellation requests").
- Formula version in friendly form ("Subscription outcomes — version 3.2 · May 2026").
- Owner ("Analytics team").
- Last updated friendly time ("Updated 12 min ago · 5 May at 14:21 ET").
- Freshness rule (max age before warning).

### 6.3 Level 3 (`Open governance drawer`)

- Raw metric ID (monospace).
- Raw formula text.
- Audit reference + fingerprint (monospace, copy-to-clipboard).
- Source confirmation status enum.
- Filter object snapshot.
- Lineage breadcrumb.
- Export manifest reference.

### 6.4 What level a string lives at — quick reference

| String | Level |
|---|---|
| "Confirmed saves" | 1 |
| "Stay.ai · official" | 1 |
| "High" trust | 1 |
| "Pending Stay.ai · 9" alert | 1 |
| "Saves divided by cancellation requests" formula | 2 |
| "Subscription outcomes — version 3.2 · May 2026" | 2 |
| "Owner: Analytics team" | 2 |
| "Updated 12 min ago · 5 May at 14:21 ET" | 2 |
| "subscription_outcomes_v3.2" raw ID | 3 |
| Formula in algebra form `(N / D)` | 3 |
| ISO timestamp `2026-05-05T19:21:03+00:00` | 3 |
| Audit reference `AUD-2026-05-05-118` | 3 |
| Fingerprint `9f4c-…-7a21` | 3 |
| Filter object `{date_range: "30d", reason: "cost_too_high"}` | 3 |

---

## 7. Worked examples (before / after)

### 7.1 Subscription page hero

**Before (Cycle 006):**

> *Subscription analytics · priority module*
> **Stay.ai subscription outcome intelligence**
> The first fully elevated analytics module. Stay.ai owns subscription outcome truth, Shopify is context only, portal link delivery is never portal completion. Every KPI ships with a source authority, trust label, freshness state, and exportable audit metadata.

**After (Cycle 008):**

> *Subscription analytics*
> **What changed in subscriptions today?**
> Stay.ai is the system that owns the official subscription record. Shopify is context only. Numbers shown follow our published rulebook.

The "Stay.ai source of truth", "Shopify · context only", "Trust labels · system-calculated" chips remain in the header `meta` slot.

### 7.2 Status banner — fixture fallback

**Before:**

> Contract preview from fixture (analytics-api unreachable: ECONNREFUSED). Values are non-production.

**After:**

> Live data is temporarily unavailable. Showing the last reviewed snapshot. *(Refresh)*

### 7.3 Status banner — permission denied

**Before:**

> Permission denied by server: rendering shared-contract preview only. UI does not bypass server-side authorization.

**After:**

> We don't have permission to load live data here. Showing the last reviewed snapshot. *(Ask my manager for access)*

### 7.4 Pending Stay.ai chip

**Before:**

> Source confirmation: pending_stayai_match

**After (chip):**

> Stay.ai · pending

**After (chip tooltip / Level 2):**

> Stay.ai has not yet confirmed 9 calls in this period. We are showing provisional numbers — they may change once Stay.ai sends the official outcomes.

### 7.5 Metadata panel "Generated at"

**Before:**

> Generated at: 2026-05-05T19:21:03+00:00

**After (Level 2 expander):**

> Updated 12 min ago · 5 May at 14:21 ET

### 7.6 Footer

**Before:**

> Scentiment internal analytics · Stay.ai owns subscription outcome truth · Shopify is context only · Trust labels are system-calculated · build 0.9 · cycle 006

**After:**

> Scentiment internal analytics · Stay.ai owns subscription outcome truth · Shopify is context only · Trust labels are system-calculated.

(version chip removed from footer; visible only to Admin via hover tooltip.)

---

## 8. Implementation checklist for Agent B (Cycle 008)

This is the bite-sized checklist Agent B should run during Cycle 008 implementation. Every box must be checked before merge. Agent D will use the same list as part of QA.

- [ ] No banned string from §2.13 appears anywhere in the production UI (verified by `rg "Cycle 00|Wave 00|analytics-api|shape mismatch|fixture|IA v2 prototype|regression coverage|RBAC" apps/dashboard-web/src` returning zero matches in production-rendered text).
- [ ] Topbar `PAGE_META` matches §3.1 exactly.
- [ ] Sidebar wordmark line 2 reflects PM's brand decision.
- [ ] Footer contains no version chip.
- [ ] Every state chip uses the plain-language text from §2.6 / §2.4 / §2.5.
- [ ] Every cancellation reason / non-cancellation action / portal state uses the user-facing label from §2.7–§2.10.
- [ ] Every status banner uses one of the templates in §2.15.
- [ ] Every CTA uses a verb from §2.14.
- [ ] Level 1 surfaces never expose metric IDs / formulas / fingerprints / audit references / ISO timestamps.
- [ ] Level 2 expander uses friendly formula + owner + friendly time + freshness rule.
- [ ] Level 3 drawer is the only place raw IDs / fingerprints / ISO timestamps / lineage appear.
- [ ] Every metric on every subpage carries a Stay.ai / Shopify-context-only / Synthflow-journey-only / Portal authority chip and a trust chip.
- [ ] Every subpage has a "Help with this page" `?` button that opens the workflow's plain-language explainer (sourced from `support_user_subscription_workflows_v2.md`).

---

## 9. Cross-references

- IA v2 spec: `docs/07_dashboard_ui_ux/subscription_analytics_information_architecture_v2.md`.
- IA v2 wireframe spec: `project-management/reports/cycle-007/design/subscription_ia_v2_wireframe_spec.md`.
- Workflows v2: `docs/07_dashboard_ui_ux/support_user_subscription_workflows_v2.md`.
- Issue register: `project-management/reports/cycle-007/uiux-audit/cycle-006-screenshot-issue-register.md`.
- Acceptance criteria: `project-management/reports/cycle-007/review-checklists/uiux_second_designer_acceptance_criteria.md`.
- Cycle 007 Agent A backend matrix: `project-management/reports/cycle-007/metric-gap/subscription-required-vs-current-metric-matrix.md`.
- Cycle 007 Agent B IA primary design report: `project-management/reports/cycle-007/agent-b-wave-01-cycle-007-report.md`.
