# Scentiment Analytics Dashboard

Real development repository skeleton for Scentiment's automated phone support analytics dashboard. This is not documentation-only. It includes a React/Vite dashboard, FastAPI analytics API, ingestion worker, shared contracts, dbt analytics layer, PostgreSQL schema, Docker local dev, GitHub Actions workflows, tests, docs, project-management files, and Cursor agent operating templates.

## Core platforms

- **Synthflow**: automated phone support and call journey source.
- **Stay.ai**: subscription state/action/cancellation/save source of truth.
- **Shopify**: order/product/customer/fulfillment/tracking source of truth.
- **Portal / email / SMS**: self-service handoff, delivery, start, and confirmed completion source.
- **Live-agent / RingCX**: escalation and downstream resolution source where integrated.


## Current wave status

- Wave 1: Complete / locked — Attachment Intake and Source Audit.
- Wave 2: Complete / locked — Development Repo Skeleton.
- Next wave: Wave 3 — Backend/API Skeleton.

Run `make validate-structure`, `make validate-no-drift`, and `make manifest` before starting Wave 3 work.

## Local development

```bash
cp .env.example .env
make install
make dev
```

## No-drift rules

- Portal success requires confirmed portal completion, not link sent.
- Abandoned/drop-off and unresolved calls are excluded from successful containment.
- Stay.ai remains the source of truth for subscription state/action/cancellation/save outcomes.
- Shopify remains the source of truth for order/product/customer/order-status context.
- Save requires confirmed retained subscription outcome.
- Confirmed cancellation requires Stay.ai cancelled state or an approved official completion path.
- Cost Too High cancellation flow sequence is: frequency change offer -> 25% off offer -> confirmed cancellation if both are declined.
- Trust labels are system-calculated and cannot be manually elevated.
- Exports must include filters, definitions, trust labels, freshness, formula versions, owner, timestamp, fingerprint, and audit reference.
- Permissions are enforced server-side using explicit deny.
- Historical backfill is not base launch scope unless handled through a governed reprocess/backfill pipeline.
- Do not reopen locked blueprint waves unless Kevin explicitly requests a formal change request.

## Repo map

- `apps/dashboard-web` — React/Vite/TypeScript dashboard.
- `services/analytics-api` — FastAPI/Pydantic/SQLAlchemy backend.
- `services/ingestion-worker` — connector and normalization skeleton.
- `packages/shared-contracts` — JSON schemas and examples.
- `data/dbt` — dbt sources, staging, intermediate, marts, metrics, tests.
- `data/warehouse` — starter PostgreSQL DDL and seeds.
- `docs`, `project-management`, `cursor-agent-system` — implementation support, PM workflow, agent operating model.

## Current implementation wave status

Wave 5 is complete / locked. Next scheduled wave: Wave 6 — Ingestion and Connector Skeleton.

## Final Wave 10 Lock

Generated: 2026-04-30T16:33:03Z

Waves 1–10 are complete and locked. This root folder is the implementation skeleton for the Scentiment Automated Phone Support Analytics Dashboard. Start implementation with subscription handling analytics and preserve all source-of-truth/no-drift rules.
