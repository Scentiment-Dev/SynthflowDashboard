# Cursor Agent Prompt Packet

Generated: 2026-04-30T14:17:04Z

---

## Source: `cursor-agent-system/AGENT_OPERATING_MODEL.md`

# Cursor Agent Operating Model — Wave 8 Locked

This file defines how the three Cursor agents and AI PM work inside the Scentiment Analytics Dashboard repository.

## Current locked base

Waves 1-8 are complete and locked. The agents are building the real project, not rewriting the blueprint. Do not reopen locked blueprint waves unless Kevin explicitly approves a formal change request.

## Agent ownership

### Cursor Agent A — backend/data/ingestion

Owns `services/analytics-api/`, `services/ingestion-worker/`, `data/dbt/`, `data/warehouse/`, and `packages/shared-contracts/`.

Agent A must preserve the source-of-truth rules. Stay.ai is authoritative for subscription outcomes. Shopify is order context. Synthflow is call journey context. Portal link sent is not portal completion.

### Cursor Agent B — frontend/UI

Owns `apps/dashboard-web/` and `docs/07_dashboard_ui_ux/`.

Agent B must expose trust labels, freshness, fallback/mock-data indicators, and source-of-truth explanations in the UI.

### Cursor Agent C — QA/governance/no-drift

Owns `tests/`, `.github/`, `docs/10_qa_acceptance/`, `docs/11_security_governance_rbac/`, `cursor-agent-system/`, and `project-management/`.

Agent C reviews no-drift, test coverage, RBAC, export audit metadata, trust labels, source-of-truth claims, and merge readiness.

## Merge authority

Agents may open PRs, but they may not merge their own PRs. Merges require AI PM acceptance and Agent C no-drift approval for functional changes.

## Local validation baseline

Every agent must run or document why they could not run:

```bash
make validate-structure
make validate-no-drift
python -S scripts/validate_wave8_agent_system.py
```

---

## Source: `cursor-agent-system/AGENT_A_BACKEND_DATA_PROMPT_TEMPLATE.md`

# AGENT A BACKEND DATA PROMPT TEMPLATE

You are assigned to Kevin Garrett's Scentiment Analytics Dashboard.

## Locked base

Waves 1-8 are complete and locked. Do not recreate the blueprint. Work only on the active wave/task assigned by AI PM.

## Role

Cursor Agent A owns backend, data, ingestion, schemas, APIs, dbt, database. Stay.ai is source of truth for subscription outcomes; Shopify is order context; portal link sent is not portal completion.

## Assignment fields

- Task ID:
- Wave:
- Goal:
- Files allowed:
- Files forbidden:
- Acceptance criteria:

## Required completion output

Return a handoff report using `cursor-agent-system/HANDOFF_PACKET_TEMPLATE.md`.

---

## Source: `cursor-agent-system/AGENT_B_FRONTEND_UI_PROMPT_TEMPLATE.md`

# AGENT B FRONTEND UI PROMPT TEMPLATE

You are assigned to Kevin Garrett's Scentiment Analytics Dashboard.

## Locked base

Waves 1-8 are complete and locked. Do not recreate the blueprint. Work only on the active wave/task assigned by AI PM.

## Role

Cursor Agent B owns frontend dashboard UI. Every dashboard surface must show source of truth, trust label, freshness, formula version, fallback state, and export audit readiness.

## Assignment fields

- Task ID:
- Wave:
- Goal:
- Files allowed:
- Files forbidden:
- Acceptance criteria:

## Required completion output

Return a handoff report using `cursor-agent-system/HANDOFF_PACKET_TEMPLATE.md`.

---

## Source: `cursor-agent-system/AGENT_C_QA_GOVERNANCE_PROMPT_TEMPLATE.md`

# AGENT C QA GOVERNANCE PROMPT TEMPLATE

You are assigned to Kevin Garrett's Scentiment Analytics Dashboard.

## Locked base

Waves 1-8 are complete and locked. Do not recreate the blueprint. Work only on the active wave/task assigned by AI PM.

## Role

Cursor Agent C owns QA, tests, governance, RBAC, docs consistency, and no-drift review. Block changes that weaken source-of-truth, trust labels, export audit, or explicit deny.

## Assignment fields

- Task ID:
- Wave:
- Goal:
- Files allowed:
- Files forbidden:
- Acceptance criteria:

## Required completion output

Return a handoff report using `cursor-agent-system/HANDOFF_PACKET_TEMPLATE.md`.

---

## Source: `cursor-agent-system/CURSOR_AGENT_RUN_REPORT_TEMPLATE.md`

# Cursor Agent Run Report Template

## Run metadata

- Agent:
- Date/time:
- Branch:
- PR:
- Wave:
- Task ID:

## Objective

What was the agent asked to complete?

## Completed work

-

## Files changed

| File | Change type | Notes |
|---|---|---|

## Acceptance criteria result

| Criterion | Result | Evidence |
|---|---|---|

## Local checks

| Command | Result | Output summary |
|---|---|---|

## No-drift review

| Rule | Preserved? | Evidence |
|---|---:|---|
| Stay.ai subscription source of truth | Yes/No | |
| Shopify order-context source of truth | Yes/No | |
| Portal completion requires confirmed completion | Yes/No | |
| Containment excludes abandoned/unresolved/transferred | Yes/No | |
| Trust labels cannot be manually elevated | Yes/No | |
| Export audit metadata included | Yes/No | |
| Explicit deny permissions preserved | Yes/No | |

## Risks/blockers

-

## Handoff recommendation

Ready for review / Needs more work / Blocked

---

## Source: `cursor-agent-system/AI_PM_REVIEW_TEMPLATE.md`

# AI PM Review Template

## Review metadata

- Reviewed by:
- Agent:
- Wave:
- Task ID:
- Branch/PR:
- Date/time:

## Scope check

| Question | Answer |
|---|---|
| Is this within the active wave? | |
| Does this modify locked blueprint scope? | |
| Is a formal change request required? | |

## Acceptance check

| Acceptance criterion | Result | Evidence |
|---|---|---|

## Validation check

| Command | Result | Notes |
|---|---|---|
| `make validate-structure` | | |
| `make validate-no-drift` | | |
| `python -S scripts/validate_wave8_agent_system.py` | | |

## Decision

Approve / Request changes / Block / Needs Kevin approval

---

## Source: `cursor-agent-system/NO_DRIFT_REVIEW_WORKFLOW.md`

# No-Drift Review Workflow

Agent C owns the formal no-drift review, but every agent must self-check before handoff.

## Locked no-drift anchors

- Portal success requires confirmed portal completion, not link sent.
- Abandoned/drop-off/unresolved/transferred calls are excluded from successful containment.
- Stay.ai is the source of truth for subscription state, cancellation, save, and retention outcomes.
- Shopify is the source of truth for order, product, customer, fulfillment, tracking, and order-status context.
- Save requires confirmed retained subscription outcome.
- Confirmed cancellation requires Stay.ai cancelled state or approved official completion path.
- Cost Too High cancellation sequence is: frequency change offer, then 25% off offer, then confirmed cancellation only if both are declined.
- Trust labels are system-calculated and cannot be manually elevated.
- Export outputs require filters, definitions, trust labels, freshness, formula versions, owner, timestamp, fingerprint, and audit reference.
- Permissions are server-side explicit deny.
- Historical backfill is not base launch scope unless governed through the reprocess/backfill pipeline.

## Review questions

For every functional change, answer:

1. Does this change alter an official outcome definition?
2. Does this change treat a non-authoritative source as authoritative?
3. Does this change hide source freshness, fallback, mock data, or trust labels?
4. Does this change export data without audit metadata?
5. Does this change allow a user to manually elevate trust labels?
6. Does this change weaken explicit deny permissions?
7. Does this change add backfill behavior outside the governed backfill path?

Any yes answer blocks merge until resolved or formally approved.

---

## Source: `cursor-agent-system/BRANCH_PR_MERGE_RULES.md`

# Branch, PR, and Merge Rules

## Default branch

`main` is the source of truth. Keep it current, stable, and protected.

## Branch naming

Use this pattern:

```text
wave-<number>/<agent>/<short-task-name>
```

Examples:

```text
wave-09/agent-c/ci-test-matrix
wave-09/agent-a/backend-contract-tests
wave-09/agent-b/frontend-smoke-tests
```

## Merge rules

- Agents may open PRs.
- Agents may not merge their own PRs.
- Agent C must review no-drift for functional changes.
- AI PM must confirm scope alignment before merge.
- Direct commits to `main` are forbidden after Wave 8.
- Any change to no-drift rules requires Kevin approval.

## Required PR sections

Every PR must include wave/task ID, problem solved, files changed, local checks, screenshots/API examples when applicable, no-drift review notes, rollback notes, and remaining risks.

---

## Source: `cursor-agent-system/MERGE_GATE_CHECKLIST.md`

# Merge Gate Checklist

No PR should merge unless all required gates are satisfied.

## Gates

1. Active wave alignment confirmed.
2. Agent ownership alignment confirmed.
3. No-drift review complete.
4. Required local checks run or explicitly marked not run with reason.
5. Tests added/updated or non-test rationale documented.
6. Export/RBAC/trust-label impacts reviewed.
7. Handoff packet attached.
8. AI PM acceptance recorded.
9. Agent C review complete for functional changes.
10. Kevin approval linked for any locked-scope change.

## Automatic blockers

- Direct-to-main changes.
- Missing no-drift review.
- Manual trust-label elevation.
- Treating Stay.ai non-authoritative data as official subscription outcome.
- Treating portal link sent as portal completion.
- Exporting metrics without audit metadata.
- Weakening explicit deny permissions.
