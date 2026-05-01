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
