# Final Handoff README — Wave 10 Locked

Generated: 2026-04-30T16:33:03Z

Use this repository as the actual root project folder for the Scentiment Automated Phone Support Analytics Dashboard implementation.

## Current locked state

- Wave 1: Complete / locked — attachment intake and source audit.
- Wave 2: Complete / locked — development repo skeleton.
- Wave 3: Complete / locked — backend/API skeleton.
- Wave 4: Complete / locked — frontend dashboard skeleton.
- Wave 5: Complete / locked — data/analytics skeleton.
- Wave 6: Complete / locked — ingestion and connector skeleton.
- Wave 7: Complete / locked — governance, RBAC, export, audit skeleton.
- Wave 8: Complete / locked — Cursor agent system and PM workflow.
- Wave 9: Complete / locked — QA/Test/CI/CD skeleton.
- Wave 10: Complete / locked — final pack, rehydration pack, archive validation, fallback archives, manifest, checksums.

## Required first commands after unpacking

```bash
make validate-structure
make validate-no-drift
make validate-wave8
make validate-wave9
make validate-wave10
make qa-evidence
make manifest
```

## Agent ownership

- Cursor Agent A: backend, data, ingestion, schemas, APIs, dbt, database.
- Cursor Agent B: frontend dashboard, React components, UI/UX, charts, filters, tables.
- Cursor Agent C: QA, tests, governance, RBAC, docs consistency, no-drift review.
- AI PM: wave governance, PR review coordination, change-control, conflict resolution, schedule truth, completion truth.

## Non-negotiable no-drift rules

- Stay.ai remains source of truth for subscription state/action/cancellation/save outcomes.
- Shopify remains source of truth for order/product/customer/order-status context.
- Portal success requires confirmed portal completion, not link sent.
- Abandoned/drop-off/unresolved/transferred calls are excluded from successful containment.
- Save requires confirmed retained subscription outcome.
- Confirmed cancellation requires Stay.ai cancelled state or approved official completion path.
- Cost Too High cancellation flow sequence is frequency change offer → 25% off offer → confirmed cancellation if both are declined.
- Trust labels are system-calculated and cannot be manually elevated.
- Exports must include filters, definitions, trust labels, freshness, formula versions, owner, timestamp, fingerprint, and audit reference.
- Permissions are enforced server-side using explicit deny.
- Historical backfill is not base launch scope unless handled through a governed reprocess/backfill pipeline.
- Do not reopen locked blueprint or implementation waves unless Kevin explicitly requests a formal change request.

## Recommended implementation start

Start with subscription handling analytics, then cancellation/retention, then order status, escalations, governance/export/audit, and production hardening.
