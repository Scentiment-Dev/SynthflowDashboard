# Support-User Subscription Workflows v2

- Document owner: Cursor Agent C — Second UI/UX designer / independent UX auditor
- Cycle: 007
- Wave: 01
- Status: **Authoritative second-designer redesign of the eight support-user workflows.**
- Companion to: `docs/07_dashboard_ui_ux/subscription_analytics_information_architecture_v2.md` (Agent B IA primary design)
- Companion to: `docs/07_dashboard_ui_ux/subscription_plain_language_copy_system.md` (Agent C copy guide)
- Source-of-truth lock: Stay.ai owns subscription outcome truth; Shopify is context only; Synthflow is journey-event only; portal link sent is not portal completion; trust labels are system-calculated.

---

## 0. Why this document exists

PM rejected Cycle 006 because the dashboard is unusable by non-technical customer-support agents. Cycle 007 Agent B's IA v2 spec describes ten subpages and a progressive-disclosure pattern, but it does not yet **describe what the support agent does step-by-step** when they walk in to start their shift. This is the document that does that.

For each workflow:

- **Persona** (who runs it).
- **Trigger** (what kicks the workflow off).
- **Goal** (what the user is trying to achieve).
- **Journey map** (the click-by-click flow with the page, the affordance, the value the user sees, and the expected next step).
- **Pre-condition / data state** (what data must be in place; what `BusinessValueState` chips render; how to behave when blocked).
- **Acceptance criteria** (objective tests for "this workflow works").
- **Failure modes** (states where the workflow must still feel safe and lead somewhere).
- **Wireframe outline** (ASCII; intentionally simpler than Agent B's wireframes — this is the operator's view).
- **Open questions / decisions for Agent B**.

These workflows are tested against the cycle prompt's eight required questions:

1. **What happened with subscription calls today?** → Workflow W1.
2. **How many cancellations were saved?** → Workflow W2.
3. **How much money did we save?** → Workflow W3.
4. **Which customers need follow-up?** → Workflow W4.
5. **Which offer path is working?** → Workflow W5.
6. **Which outcomes are pending Stay.ai confirmation?** → Workflow W6.
7. **What can I export for my manager?** → Workflow W7.
8. **Why can/can't I trust this metric?** → Workflow W8.

---

## 1. Persona model recap (anchored on the support lead)

| Code | Persona | Reads first | Drills | Almost never |
|---|---|---|---|---|
| **CSL** | Customer-support lead (primary) | Command Center, Follow-Up Queue, Cancellation Intake | Outcome Summary, Cost Too High, Portal+Handoff | Containment, Audit/Export internals |
| **CSA** | Customer-support agent (Tier 1) | Follow-Up Queue, Outcome Summary | Cancellation Intake, Portal+Handoff | Business Value, Audit/Export |
| **RM** | Retention / lifecycle manager | Outcome Summary, Cost Too High, Business Value | Non-Cancellation Actions | Audit/Export internals |
| **OPS** | Operations / data analyst | Containment, Source health, Follow-Up | Everything | — |
| **EXEC** | Executive / leadership | Command Center, Business Value | Outcome Summary | — |
| **GOV** | Compliance / governance | Export+Audit | Containment, Source health | — |

The eight workflows are written for **CSL** primarily, with **CSA**, **RM**, and **EXEC** annotations where relevant. Workflow W7 has a **GOV** annotation. Workflow W8 has a **OPS** annotation.

---

## 2. Universal page contract for every workflow (so I don't restate it eight times)

Every subpage entered by every workflow honours these contracts. If a subpage breaks any of them, the workflow is broken.

1. **Page header** = single answerable question (eyebrow + title) + 1-line subtitle (the answer or the action) + per-page export action + advanced-filter button.
2. **Above the fold** = at most 1 hero, ≤5 KPI cards, ≤1 primary visual, ≤1 action card.
3. **Source authority chip** is inline with each metric. First-mention "Stay.ai" on the page renders an info tooltip. "Shopify (context only)" / "Synthflow (journey only)" never appear without the parenthetical.
4. **Trust label chip** is inline with each metric. Low/Untrusted produces a tinted row.
5. **Active filter chip strip** is visible directly under the page header. Each chip is keyboard-removable.
6. **No raw governance metadata** — no fingerprint, no audit reference, no metric ID, no formula, no ISO timestamp on the page surface. All of that lives behind a `▾ Show metric definition…` Level 2 expander or `Open governance drawer` Level 3 affordance.
7. **No raw scenario / contract / fixture / shape mismatch / shared-contract preview** strings on the page surface. System-status copy follows the plain-language guide.
8. **Empty / blocked / pending / permission-denied** states render as friendly cards with an actionable next step, not as raw error text.
9. **No "Cycle N" / "Wave N" / "Agent X" / "skeleton" / "starter" / "regression coverage"** vocabulary anywhere in the production UI.
10. **Drilldowns** — every KPI card and every funnel stage is a link or a button to its canonical subpage / drilldown drawer.

---

## 3. Workflow W1 — "What happened with subscription calls today?"

> "It's 9 a.m. and I just sat down. What do I need to know about subscription calls in the last day, week, and month, and what should I do first?"

- **Persona:** CSL (primary), CSA (secondary).
- **Trigger:** logging in / opening the dashboard / clicking the `Subscriptions` sidebar item.
- **Goal:** in ≤30 seconds, the user knows the day's headline (saves, cancels, pending) and what 3 actions to take.
- **Page:** Command Center (`/subscriptions`).

### 3.1 Journey map

| Step | Page | Affordance | What the user sees | Expected next step |
|---|---|---|---|---|
| 1 | `/subscriptions` (Command Center) | Page header eyebrow + title | "Subscription calls today" / "What changed in subscriptions today?" | Read on. |
| 2 | Same | KPI strip (5 cards) | Confirmed saves · Confirmed cancels · Pending Stay.ai · Portal completion · Net business value (Confirmed) | Click any card to drill down. |
| 3 | Same | "What needs attention now" panel (3 rows max) | Row 1: "X calls are still waiting for official confirmation" → CTA "Open follow-up queue". Row 2: "Y calls' portal completion is unconfirmed" → CTA "Open portal & handoff". Row 3: "Source freshness degraded" → CTA "Open data quality". | Click the most-tinted row first. |
| 4 | Same | Trend strip (28-day) | Saves vs cancels mini area chart with delta vs prior 28 days | Hover for tooltip. |
| 5 | Subnav | "Outcomes" tab | Click to validate the headline numbers | Go to Workflow W2 if needed. |

### 3.2 Pre-conditions

- Stay.ai final state present for ≥1 call → KPIs render with `confirmed` chips.
- Stay.ai source unhealthy or fully missing → page header switches to a tinted "Action needed today" treatment; KPIs show em-dash with `unknown / blocked_by_data` chips.
- No subscription calls in scope → page renders an empty card "No subscription calls in this date range yet" + CTA "Widen the date range".

### 3.3 Acceptance criteria (W1)

- W1.A1: First time-to-answer ≤ 30 s for a CSL who has never used the dashboard before. Measured with a moderated UX session.
- W1.A2: KPI strip has ≤5 cards. No rate cards on Command Center.
- W1.A3: Each KPI card is a `<a>` (or `<button>`) that navigates to the canonical drilldown — Confirmed saves → `/subscriptions/outcomes?outcome=save`; Confirmed cancels → `/subscriptions/outcomes?outcome=cancel`; Pending Stay.ai → `/subscriptions/follow-up?filter=pending_stayai_final_state`; Portal completion → `/subscriptions/portal-handoff`; Net business value → `/subscriptions/business-value`.
- W1.A4: Action panel shows at most 3 rows; each row is one sentence + a single CTA button.
- W1.A5: Trend strip uses ≤1 colour for saves and ≤1 colour for cancels; no axis cruft.
- W1.A6: Page above-the-fold height ≤ 720 px on a 1440×900 viewport with the existing global topbar+filter strip+subnav already counted.
- W1.A7: Page total scroll height ≤ 1440 px (≤ 2 viewport heights) on Command Center; long-tail panels (legacy diagnostic) are not mounted.

### 3.4 Failure modes

| State | What renders |
|---|---|
| Stay.ai missing entirely | Full-width `surface-ink` banner "We're not getting Stay.ai final results right now. Numbers below cannot be trusted until this is fixed." + CTA "Open data quality" + audit reference. KPI cards switch to em-dash with the `blocked_by_data` chip. |
| Permission denied | Banner "We don't have permission to load live data here. Showing the last reviewed snapshot." + CTA "Ask my manager for access". |
| API unreachable | Banner "Live data is temporarily unavailable. Showing the last reviewed snapshot." + CTA "Refresh" with backoff. |

### 3.5 Wireframe outline (W1)

```
+------------------------------------------------------------+
| Subscription calls today                                   |
| What changed in subscriptions today?                       |
| [Last 30 days ▾] [Filters · 0 ▾] [Compare ▾] [Export ⤓]    |
| [Stay.ai source of truth] [Trust labels system-calculated] |
+------------------------------------------------------------+
| 142 saves    38 cancels   9 pending   71% portal   $4.8k   |
| Stay.ai      Stay.ai      Stay.ai     Portal       Net     |
| Confirmed    Confirmed    Pending     Confirmed    Conf.   |
| ↗ +12 vs    ↘ -4 vs      ⚠ 9 today   ↗ +3 pp     ↗ +$420  |
| prior 28d    prior 28d    waiting    vs prior 28d  vs prior|
+------------------------------------------------------------+
| What needs attention now                                   |
|  ● 9 calls are still waiting for official confirmation     |
|    [Open follow-up queue →]                                |
|  ● 4 calls' portal completion is unconfirmed               |
|    [Open portal & handoff →]                               |
|  ● Synthflow source freshness is degraded                  |
|    [Open data quality →]                                   |
+------------------------------------------------------------+
| Saves vs cancels — last 28 days                            |
|  ▁▂▃▅▇█▇▆▅▄▅▆█▇▅▄▅▆▇█▇▆▅▄▃▂▁                              |
+------------------------------------------------------------+
| ▾ Show how these numbers are defined and updated           |
+------------------------------------------------------------+
```

### 3.6 Open questions for Agent B (W1)

- W1.Q1: Default date range — last 30 days vs today. **Recommendation:** today, with a "Compare to prior 30 days" mini-chip.
- W1.Q2: Should the trend strip click-through to `/subscriptions/outcomes` with `compare=prior_period` already applied? **Recommendation:** yes.
- W1.Q3: Should the "What needs attention now" panel persist when zero alerts? **Recommendation:** yes — show "Nothing needs attention right now" + a small ✓.

---

## 4. Workflow W2 — "How many cancellations were saved?"

> "How many cancellation calls did we successfully convert into saves yesterday / this week / this month, and how does that compare to last week?"

- **Persona:** CSL, RM (primary).
- **Trigger:** the user wants to validate save performance.
- **Goal:** in ≤45 seconds, the user knows the absolute save count, the save rate, and whether it is going up or down.
- **Page:** Outcome Summary (`/subscriptions/outcomes`).

### 4.1 Journey map

| Step | Page | Affordance | What the user sees | Expected next step |
|---|---|---|---|---|
| 1 | `/subscriptions` | KPI card "Confirmed saves" | "142 saves" | Click. |
| 2 | `/subscriptions/outcomes` | Page header | "Subscription calls — confirmed save / cancel / pending" | Read funnel. |
| 3 | Same | Outcome funnel | Numbered stages: contacts → matched to subscription → cancellation requested → confirmed save / cancel / pending → portal completion | Hover for stage detail. |
| 4 | Same | Headline | "Save rate: 78.9% (Stay.ai-confirmed) — up 4.2 pp vs prior 28 days" | Compare with last week using comparison toggle. |
| 5 | Same | KPI grid | 6 cards (was 10+ in Cycle 006) | — |
| 6 | Same | "Open follow-up queue" CTA when `missing_stayai_final_state_total > 0` | — | Go to W6. |

### 4.2 Pre-conditions

- Stay.ai data fresh and source-confirmation = `confirmed_stayai_match` → save rate renders with `confirmed` trust chip.
- Stay.ai data partial → save rate renders with `estimated` chip and an inline note "X of Y calls are still pending official confirmation".
- Stay.ai data missing → save rate em-dash + `blocked_by_data` chip + the hard-fail banner per W1's missing-Stay.ai rule.

### 4.3 Acceptance criteria (W2)

- W2.A1: Outcome funnel shows ≤6 stages (contacts → matched → action requested → confirmed outcome → portal completion confirmed). No more.
- W2.A2: Save rate is the largest typographic element on the subpage (≥40 px display).
- W2.A3: The save rate carries a Stay.ai authority chip and a system-calculated trust chip. No raw formula on the page surface.
- W2.A4: Comparison-period control is at the top of the page; selection (`previous period` vs `previous year`) is reflected in a ` (vs prior 28d) ` annotation next to every KPI card.
- W2.A5: When the save rate cannot be confirmed, the page shows an `estimated` chip with a tooltip explaining what's missing.

### 4.4 Failure modes

| State | What renders |
|---|---|
| Save rate denominator = 0 | Card shows "—" + tooltip "No subscription cancellation calls yet". |
| Save rate `estimated` | Save rate value appears in italic with a `~` prefix and a `Estimated · awaiting Stay.ai` chip. |
| Save rate `blocked_by_data` | Em-dash + amber tint + CTA "Open data quality". |

### 4.5 Wireframe outline (W2)

```
+------------------------------------------------------------+
| Calls we saved                                             |
| Did the call end in confirmed save / cancel / pending?     |
| [Last 30d ▾] [Compare: prior 28d ▾] [Filters · 1 ▾]        |
+------------------------------------------------------------+
| Inline alerts: [Pending Stay.ai · 9] [Portal unknown · 4]  |
+------------------------------------------------------------+
|  78.9%                                                     |
|  Save rate (Stay.ai · Confirmed)                           |
|  +4.2 pp vs prior 28d                                      |
|  ▾ Show metric definition                                  |
+------------------------------------------------------------+
| Outcome funnel                                             |
|   1 Contacts in scope    245                               |
|   2 Matched to sub       198                               |
|   3 Cancellation asked   180                               |
|   4 Confirmed save       142  ←  78.9% of asks             |
|   5 Confirmed cancel      38                               |
|   6 Pending Stay.ai        9                               |
+------------------------------------------------------------+
| KPI grid (6 cards):                                        |
|  Confirmed saves · Confirmed cancels · Pending             |
|  Missing final  · Portal sent  · Portal completed          |
+------------------------------------------------------------+
| ▾ Show metric definitions, formula version, audit ref.     |
+------------------------------------------------------------+
```

### 4.6 Open questions for Agent B (W2)

- W2.Q1: Should the save-rate headline include the absolute number ("142 / 180")? **Recommendation:** yes, in the second line.
- W2.Q2: Funnel "Cancellation asked" — does this include skip / pause / frequency change requests too? **Recommendation:** no; non-cancellation actions go on `/subscriptions/non-cancellation`. The funnel here is cancel-only.

---

## 5. Workflow W3 — "How much money did we save?"

> "What is the dollar value of the saves we made? Net of offers, support cost, and the customers we couldn't save?"

- **Persona:** EXEC, RM (primary), CSL (secondary).
- **Trigger:** the user wants to translate save volume into dollars.
- **Goal:** in ≤90 seconds, the user can read the headline net-business-value figure with a clear formula, and they can drill into each component.
- **Page:** Business Value / Cost Savings (`/subscriptions/business-value`).

### 5.1 Journey map

| Step | Page | Affordance | What the user sees | Expected next step |
|---|---|---|---|---|
| 1 | `/subscriptions` | KPI card "Net business value" | "$4,820 (Confirmed)" | Click. |
| 2 | `/subscriptions/business-value` | Page header | "Calls we saved — in dollars" / "Net business value = gross protected − offer cost + support avoided" | Read headline. |
| 3 | Same | Headline card | "$4,820" + breakdown chips: "$7,210 gross protected" "−$1,540 offer cost" "+$1,150 support avoided" | Hover or click any chip → highlighted breakdown card. |
| 4 | Same | Three-column state grid | Confirmed / Estimated / Pending+Blocked columns per IA wireframe §1.6 | Read each column. |
| 5 | Same | "Export this view" page-header button | One-click governed export | Go to W7. |

### 5.2 State chips per IA spec (lock to Agent A's `BusinessValueState`)

| State | Visual | Copy | When |
|---|---|---|---|
| `confirmed` | emerald chip | "Confirmed" | Stay.ai final state present + invoice / portal completion confirmed. |
| `estimated` | sky chip | "Estimated" | Stay.ai final state present but downstream sources (revenue, support cost) are estimates. |
| `pending` | amber chip | "Pending Stay.ai" | Stay.ai final state has not arrived. |
| `unknown` | slate chip | "Unknown" | The metric is not derivable from current data. |
| `blocked_by_data` | rose chip | "Blocked — data missing" | A required join (e.g. offer version, repeat contact) has not shipped. |

### 5.3 Acceptance criteria (W3)

- W3.A1: Headline "Net Business Value Impact" is the largest visual element on the subpage; the formula is rendered as 3 chips beside it, not as algebra.
- W3.A2: Every sub-metric carries a state chip from the table above. No metric renders without a state.
- W3.A3: Sub-metrics with `blocked_by_data` render an em-dash + a friendly explanation (e.g. "Waiting on offer-version data — see Cycle 008 plan"). They never render `0` or `N/A`.
- W3.A4: The page never shows raw `BusinessValueState` enum values. The chip copy is "Confirmed" / "Estimated" / "Pending Stay.ai" / "Unknown" / "Blocked — data missing".
- W3.A5: "Export this view" generates a CSV + PDF + manifest containing every state chip and every formula version.

### 5.4 Failure modes

| State | What renders |
|---|---|
| All sub-metrics `blocked_by_data` | Headline em-dash + "We can't compute net business value yet — see Data quality" CTA. |
| `confirmed` net negative | Headline shown in rose: "We are net-negative this period: −$1,200" with explainer. |
| Permission denied to revenue figures | Page renders the `confirmed` retention column only with a "Some figures hidden by permission" notice. |

### 5.5 Wireframe outline (W3)

See IA wireframe spec §1.6. The Cycle 007 Agent C addition:

- A "Last 30 days" / "Last 7 days" / "Today" toggle in the page header that recomputes the headline.
- A "Hide pending columns" toggle for executives who only want the `confirmed` column (RBAC-respected — the toggle hides, it does not gate; data still loads server-side).

### 5.6 Open questions for Agent B (W3)

- W3.Q1: Should the "Estimated" column be shown by default to executives? **Recommendation:** yes — but with an explainer "These are estimates — useful for trends, not for board decks."
- W3.Q2: How is "support cost avoided" computed? **Hand off to Agent C (data / dbt):** confirm the canonical table.

---

## 6. Workflow W4 — "Which customers need follow-up?"

> "Show me the calls that need a human to look at them, in priority order, with enough info to act."

- **Persona:** CSL (primary), CSA.
- **Trigger:** the CSL is allocating work for the day, or the CSA is picking up a queue of follow-ups.
- **Goal:** in ≤60 seconds, the user has a filtered queue of follow-up rows, can mark rows reviewed / escalate / export selected.
- **Page:** Failure + Follow-Up Queue (`/subscriptions/follow-up`).

### 6.1 Journey map

| Step | Page | Affordance | What the user sees | Expected next step |
|---|---|---|---|---|
| 1 | `/subscriptions` | Action panel CTA "Open follow-up queue" or KPI card "Pending Stay.ai" | — | Click. |
| 2 | `/subscriptions/follow-up` | Page header | "Calls that need a human" / "Who needs follow-up?" | Apply filter. |
| 3 | Same | Filter chip strip | [Missing Stay.ai final state] [Portal unknown] [Low trust] [Match confidence low] | Toggle any. |
| 4 | Same | Operator table | Rows: contact / reason / age / trust / source / next step | Select rows. |
| 5 | Same | Bulk action bar | [Mark reviewed] [Escalate selected] [Export selected ⤓] | Take action. |

### 6.2 Pre-conditions

- The follow-up table is empty when no rows match the active filters → render "No follow-ups in this filter — try widening" with a CTA "Clear filters".
- Server-side explicit deny on bulk actions → buttons render disabled with a tooltip "You don't have permission to take this action — ask your manager".

### 6.3 Acceptance criteria (W4)

- W4.A1: Operator table has at least these columns: Contact (anonymized), Reason, Age, Trust, Source, Next step. Raw IDs are gated behind RBAC + a Level 3 governance drawer.
- W4.A2: Each row's "Next step" column is a verb: "Open call", "Confirm in Stay.ai", "Resend portal link", "Escalate to lead".
- W4.A3: Bulk action bar appears as soon as ≥1 row is selected; never floats over content (sticky at the table footer).
- W4.A4: "Export selected" opens the Export drawer scoped to selected rows (per IA wireframe §4.4).
- W4.A5: The Cycle 006 anti-pattern of exposing scenario chips on this page is banned. Demo-state toggles do not appear.

### 6.4 Failure modes

| State | What renders |
|---|---|
| Stay.ai pending records but RBAC denies row-level read | "We can see X calls need follow-up but you don't have permission to see them. Ask your manager." + CTA. |
| All rows escalated already | Empty state with "No follow-ups left — nice work." + an undo affordance for the last batch. |

### 6.5 Wireframe outline (W4)

```
+------------------------------------------------------------+
| Calls that need a human                                    |
| Who needs follow-up?                                       |
| [Filters · 1 ▾] [Export · selected ⤓ · disabled]           |
+------------------------------------------------------------+
| Filter chips:                                              |
| [Missing Stay.ai final state ✕] [+ Portal unknown]         |
| [+ Low trust] [+ Low match confidence]                     |
+------------------------------------------------------------+
| ☐ # | Contact     | Reason          | Age | Trust | Next   |
|----+----+-------+---------------+-----+-------+--------    |
| ☐ 1 | Customer A  | Pending Stay.ai | 2h  | High  | Confirm |
| ☐ 2 | Customer B  | Portal unknown  | 4h  | High  | Resend  |
| ☐ 3 | Customer C  | Low trust       | 6h  | Low   | Review  |
+------------------------------------------------------------+
| (sticky footer when ≥1 row selected)                       |
| [Mark reviewed] [Escalate] [Export selected ⤓]             |
+------------------------------------------------------------+
```

### 6.6 Open questions for Agent B (W4)

- W4.Q1: Default sort — by age, by trust, or by reason? **Recommendation:** age desc (oldest first); secondary sort = trust asc (lowest trust first).
- W4.Q2: Should escalation move the row off the queue immediately or keep it visible with an "Escalated" chip? **Recommendation:** keep visible with chip until the next reload.
- W4.Q3: How many rows per page? **Recommendation:** 25 per page; virtualized scroll above 100.

---

## 7. Workflow W5 — "Which offer path is working?"

> "When a customer says 'cost too high' on a cancel call, do they accept the frequency-change offer, the 25%-off offer, or do they cancel anyway?"

- **Persona:** RM (primary), CSL.
- **Trigger:** the user wants to validate retention offer effectiveness.
- **Goal:** in ≤90 seconds, the user can see the funnel for cancellation reasons and the offer sequence (frequency-change → 25% off → confirmed cancel), with offer-version chips and per-stage save rate.
- **Page:** Cost Too High Retention Funnel (`/subscriptions/cost-too-high`).

### 7.1 Journey map

| Step | Page | Affordance | What the user sees | Expected next step |
|---|---|---|---|---|
| 1 | `/subscriptions/cancellation-intake` | Reason × outcome table | "Cost Too High · 84 calls · 39% saved" → CTA "Open Cost Too High funnel" | Click. |
| 2 | `/subscriptions/cost-too-high` | Page header | "Cost Too High retention funnel" / "Frequency change → 25% off → confirmed cancel" | Read funnel. |
| 3 | Same | Numbered funnel | Stage 1 cancel intent · stage 2 frequency change offer · stage 3 25% off offer · stage 4 confirmed cancellation | Hover for offer version chip. |
| 4 | Same | Sequence integrity panel | "Out of order events: 0 · Missing offer step: 0 · Sequence joins missing: blocked_by_data" | If blocked, follow CTA. |
| 5 | Same | Business value mini-card (right column) | Offer cost burned · gross value protected · net | Drill to W3. |

### 7.2 Acceptance criteria (W5)

- W5.A1: Funnel has exactly 4 stages, in order; the visualisation enforces the sequence rule (a `blocked_by_data` state if upstream events are out of order).
- W5.A2: Each stage carries an offer-version chip when applicable.
- W5.A3: The page renders an "Offer cost vs gross value protected" mini-card with state chips.
- W5.A4: The page never silently includes calls whose sequence cannot be confirmed; it surfaces a `blocked_by_data` count.

### 7.3 Failure modes

| State | What renders |
|---|---|
| Sequence joins missing | Funnel stages 2/3 render em-dash + `Blocked — sequence joins missing` chip; CTA "Open data quality". |
| Offer-version not present | Stage chip "Offer version unknown" with tooltip. |

### 7.4 Wireframe outline (W5)

See IA wireframe spec §1.5. Agent C addition: a "By offer version" toggle that pivots the funnel on offer version (so RM can compare v3.4 vs v3.5).

### 7.5 Open questions for Agent B (W5)

- W5.Q1: When `blocked_by_data` covers > 50% of stage 2/3 traffic, should the funnel hide the stages entirely? **Recommendation:** no — render greyed bars with a "Most data missing" overlay; users learn what they don't have.

---

## 8. Workflow W6 — "Which outcomes are pending Stay.ai confirmation?"

> "How many of today's subscription calls are stuck waiting for the official outcome from Stay.ai? What do I do about them?"

- **Persona:** CSL (primary), OPS (secondary).
- **Trigger:** the user sees "Pending Stay.ai · 9" on Command Center, or on the alert chip in any subscription subpage.
- **Goal:** in ≤45 seconds, the user has a filtered list of pending records and a clear next action.

### 8.1 Journey map

| Step | Page | Affordance | What the user sees | Expected next step |
|---|---|---|---|---|
| 1 | `/subscriptions` | Action row "X calls are still waiting for official confirmation" | — | Click. |
| 2 | `/subscriptions/follow-up?filter=pending_stayai_final_state` | Operator table prefiltered | Rows where outcome = pending Stay.ai | Triage. |
| 3 | Same | Per-row "Next step" | "Confirm in Stay.ai" → opens Stay.ai (external link) with audit row written | Acknowledge. |

### 8.2 Acceptance criteria (W6)

- W6.A1: Filter is a deep-link (`?filter=pending_stayai_final_state`), so the link can be sent to a manager.
- W6.A2: Each row carries an "Age" column so the user can prioritise the oldest pending records.
- W6.A3: When the user clicks "Confirm in Stay.ai", the system writes an audit row server-side; the UI shows a confirmation toast with the audit reference.
- W6.A4: When Stay.ai source is degraded, the page shows a banner "Stay.ai is responding slowly today — confirmations may not write back for ~N minutes" + freshness chip.

### 8.3 Failure modes

| State | What renders |
|---|---|
| 0 pending records | Empty card "No calls are waiting for Stay.ai confirmation right now — nothing to do." |
| Stay.ai unreachable | Banner with the system-status copy from the plain-language guide. |

### 8.4 Open questions for Agent B (W6)

- W6.Q1: Should "Confirm in Stay.ai" deep-link directly into Stay.ai's UI? **Recommendation:** yes, in a new tab, **only if** the user has Stay.ai SSO configured. Otherwise show "Open Stay.ai · external" with a copy-the-ID affordance.

---

## 9. Workflow W7 — "What can I export for my manager?"

> "I need to send my retention manager a CSV of today's saved-by-cost-too-high calls and a PDF for the weekly meeting."

- **Persona:** CSL, RM (primary), GOV (secondary).
- **Trigger:** the user clicks "Export this view" or "Export selected rows" anywhere.
- **Goal:** in ≤60 seconds, the user can produce a CSV + PDF + manifest with audit reference and fingerprint.
- **Page:** any subscription subpage (Export drawer) and `/subscriptions/export-audit`.

### 9.1 Journey map

| Step | Page | Affordance | What the user sees | Expected next step |
|---|---|---|---|---|
| 1 | Any subpage | "Export this view" header button | Drawer opens scoped to current page | Choose format. |
| 2 | Drawer | Format picker | [☐ PDF snapshot] [☐ CSV bundle] [☐ Audit manifest] | Pick. |
| 3 | Drawer | Manifest preview | Filters · Metric defs · Trust labels · Freshness · Formula versions · Owner · Timestamp · Fingerprint · Audit reference | Read; confirm formula versions match expectation. |
| 4 | Drawer | "Generate export" button | Confirmation toast with audit reference + fingerprint | Files arrive. |
| 5 | `/subscriptions/export-audit` | Export queue | Status of current and recent exports | Re-download. |

### 9.2 Acceptance criteria (W7)

- W7.A1: Export drawer is reachable from page header, per-widget kebab, per-row selection, and the topbar — a maximum of 1 click on any subpage.
- W7.A2: Manifest preview is **always visible** while the drawer is open. The user cannot generate an export without seeing the manifest.
- W7.A3: A manifest mismatch between the page-rendered metric and the live registry causes the export to be **rejected** with a clear blocked-state message ("Export blocked: a metric definition has changed since this view was rendered. Refresh and try again").
- W7.A4: RBAC: CS Agent can export filtered table rows (CSV) but not the full subpage PDF; Data Analyst / Admin can export everything; server-side explicit-deny is the source of truth.
- W7.A5: Every export emits an audit row server-side; the UI returns a confirmation toast with the audit reference and the manifest fingerprint.

### 9.3 Failure modes

The five canonical Export blocked states (from IA wireframe spec §4.2) are mandatory:

| Reason | UI message |
|---|---|
| Insufficient permission (server-side deny) | "Export blocked: your role cannot export this scope. Audit reference logged." |
| Low trust gate | "Export blocked: one or more metrics are at low trust. Admin override required." |
| Missing source confirmation | "Export blocked: Stay.ai final state pending. Wait for confirmation or contact owner." |
| Freshness stale beyond hard-fail | "Export blocked: source data older than hard-fail threshold." |
| Manifest mismatch with metric registry | "Export blocked: a metric definition has changed since this view was rendered. Refresh and try again." |

### 9.4 Open questions for Agent B (W7)

- W7.Q1: Should "Audit manifest only" (without the data) be a primary format option? **Recommendation:** yes, for governance / compliance.
- W7.Q2: When a CSV is generated, where does it download — browser download or `/subscriptions/export-audit` queue with a link? **Recommendation:** both — browser download for immediacy, queue persistence for re-download with audit reference.

---

## 10. Workflow W8 — "Why can / can't I trust this metric?"

> "I'm looking at a number. Should I trust it? What does the trust label mean? Where does the data come from?"

- **Persona:** CSL, OPS (primary), EXEC (secondary).
- **Trigger:** the user clicks the trust chip on any KPI / row / funnel stage.
- **Goal:** in ≤30 seconds, the user understands what the trust label means, what source confirmed the metric, when it was last refreshed, and what to do if the trust is low.

### 10.1 Journey map

| Step | Affordance | What the user sees | Expected next step |
|---|---|---|---|
| 1 | Any trust chip on any subpage | Tooltip "What does this mean?" | Click. |
| 2 | `▾ Show metric definition…` Level 2 expander | One-paragraph plain-language definition + formula version + owner + generated-at + freshness | Read. |
| 3 | "Open governance drawer" link | Level 3 governance drawer: full audit reference, metric ID, fingerprint, source confirmation status, applied filters, lineage breadcrumb | Read or copy. |
| 4 | If trust = low | "Why is trust low?" banner with the 3 reasons | Take recommended action. |

### 10.2 Plain-language trust copy (locked to copy guide)

| System state | Trust chip | Plain-language tooltip |
|---|---|---|
| `high` | "High" | "We have official confirmation from Stay.ai and the source is fresh." |
| `medium` | "Medium" | "We have most of the data we need. A few records are still pending or partly estimated." |
| `low` | "Low" | "Some of this data is missing or out of date. Treat the number as a rough guide." |
| `untrusted` | "Untrusted" | "We cannot trust this number right now. Open the data quality page for details." |

### 10.3 Acceptance criteria (W8)

- W8.A1: Every metric on every subpage carries a trust chip. No exceptions.
- W8.A2: The chip is keyboard-focusable and exposes the plain-language tooltip on focus + hover.
- W8.A3: Clicking the chip opens the Level 2 expander; clicking "Open governance drawer" inside the expander opens the Level 3 drawer.
- W8.A4: The UI never offers a manual elevation affordance — trust labels remain system-calculated.
- W8.A5: When trust is low / untrusted, the recommended action is one of:
  - "Open data quality" (when freshness is the cause).
  - "Ask my manager for access" (when permission is the cause).
  - "Wait for Stay.ai confirmation" (when source confirmation is pending).

### 10.4 Failure modes

| State | What renders |
|---|---|
| Trust chip missing for a metric | The metric is rendered as em-dash with a tinted "Trust label not yet computed" chip. The metric is treated as `unknown`. |
| Trust = low globally | A page-level banner "Several metrics on this page are at low trust today" + CTA "Open data quality". |

### 10.5 Open questions for Agent B (W8)

- W8.Q1: Should the trust chip be inline with the metric value, or floating to its right? **Recommendation:** inline-right, so the eye reads `value → authority → trust → freshness` in a single horizontal scan.

---

## 11. Cross-workflow guarantees (the "the workflow was rejected" tests)

If any of these fail, **the workflow is rejected and Cycle 008 cannot ship**. They are duplicated as test items in the Agent D acceptance checklist (`project-management/reports/cycle-007/review-checklists/uiux_second_designer_acceptance_criteria.md`).

| ID | Test | How to verify |
|---|---|---|
| X1 | A new CS agent who has never seen Stay.ai's architecture can answer Workflows W1–W4 in ≤2 minutes total. | Moderated UX session. |
| X2 | The dashboard never shows raw `analytics-api`, `contract`, `fixture`, `shape mismatch`, `Cycle 00N`, `Wave 00N`, `Agent X`, `regression coverage`, `IA v2 prototype`, `starter`, `skeleton`, or any markdown file path. | grep + axe + manual scan. |
| X3 | Every metric carries a trust chip and a source authority chip. | DOM-level test in Agent D's e2e. |
| X4 | Every subpage exposes "Export this view" within 1 click. | DOM-level test. |
| X5 | Every subpage exposes "Advanced filters" within 1 click. | DOM-level test. |
| X6 | A manifest mismatch rejects the export. | Contract test. |
| X7 | The Cycle 006 anti-pattern of stacking Cycle 001 / 002 / 005 / source-health on `/subscriptions` is gone. | Code review (the legacy panels must not be mounted on `/subscriptions`). |
| X8 | "Pending Stay.ai · N" CTA in Command Center deep-links to `/subscriptions/follow-up?filter=pending_stayai_final_state`. | DOM-level test. |
| X9 | Hard-fail Stay.ai missing state replaces Command Center with a tinted full-width banner; KPIs render em-dash. | Snapshot test. |
| X10 | The follow-up queue never exposes scenario toggles. | DOM-level test. |

---

## 12. Open questions for PM

These are not technical — they are scope decisions a non-technical PM needs to confirm before Agent B implements.

- **PMQ1:** "Confirm in Stay.ai" — should the dashboard write back to Stay.ai (server-to-server) or only deep-link the user into Stay.ai's UI? Recommendation: deep-link only in Cycle 008; consider write-back in a later cycle once governance signs off.
- **PMQ2:** Should CS agents (Tier 1) be allowed to export at all? Recommendation: yes — CSV row exports of the queue they own; no full-page PDFs.
- **PMQ3:** Should `/subscriptions/business-value` be visible to CS agents (Tier 1)? Recommendation: redacted (counts only, no dollars) by default; full visibility for CSL+ via RBAC.
- **PMQ4:** Should the Diagnostics drawer ever be visible to CS agents? Recommendation: no — Admin / Data Analyst only.
- **PMQ5:** Default Command Center date range — today vs last 30 days? Recommendation: today, with a pinned "Compare to prior 30 days" delta on every KPI.

---

## 13. Cross-references

- IA v2 spec: `docs/07_dashboard_ui_ux/subscription_analytics_information_architecture_v2.md`.
- IA v2 wireframe spec: `project-management/reports/cycle-007/design/subscription_ia_v2_wireframe_spec.md`.
- Plain-language copy system: `docs/07_dashboard_ui_ux/subscription_plain_language_copy_system.md`.
- Issue register: `project-management/reports/cycle-007/uiux-audit/cycle-006-screenshot-issue-register.md`.
- Acceptance criteria: `project-management/reports/cycle-007/review-checklists/uiux_second_designer_acceptance_criteria.md`.
- Cycle 007 Agent A backend matrix: `project-management/reports/cycle-007/metric-gap/subscription-required-vs-current-metric-matrix.md`.
- Cycle 007 Agent B IA primary design report: `project-management/reports/cycle-007/agent-b-wave-01-cycle-007-report.md`.
