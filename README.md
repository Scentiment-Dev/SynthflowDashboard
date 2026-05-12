# Scentiment Analytics Dashboard

Enterprise analytics platform for automated phone support operations, subscription retention, and business value performance.

This repository is the implementation root for a multi-service analytics stack spanning:

- a React/Vite dashboard for operational users
- a FastAPI analytics API
- an ingestion worker for upstream event pipelines
- shared contracts and fixtures
- dbt modeling and warehouse SQL artifacts
- CI quality gates and governance controls

---

## What This Project Delivers

The platform is designed to answer high-value support and retention questions such as:

- What changed in subscription outcomes today?
- Which flows are saving vs canceling customers?
- Which results are trustworthy enough for reporting?
- Why are metrics blocked or degraded?
- What should operators do next?
- Can users export governed, auditable outputs?

The system emphasizes plain-language UX and controlled data governance, not just data visualization.

---

## Core Data Platforms

- **Synthflow**: automated phone support call journey events.
- **Stay.ai**: authoritative subscription state/action/cancellation/save source of truth.
- **Shopify**: order/product/customer/order-state context source of truth.
- **Portal / Email / SMS**: customer handoff, start, delivery, and confirmed completion events.
- **Live-agent / RingCX**: escalation and downstream human resolution signals (where integrated).

---

## High-Level Architecture

1. **Ingestion Worker** normalizes upstream source data and prepares events for analytics processing.
2. **Analytics API** applies business logic, source-of-truth rules, and governance checks.
3. **Dashboard Web App** renders support-oriented views, filters, exports, disclosures, and trust context.
4. **dbt + Warehouse Layer** supports modeled analytics datasets and metric definitions.
5. **Contracts + Tests + CI** enforce compatibility, drift prevention, and merge readiness.

---

## Repository Map

- `apps/dashboard-web` — React/Vite/TypeScript frontend
- `services/analytics-api` — FastAPI/Pydantic/SQLAlchemy backend
- `services/ingestion-worker` — ingestion + normalization worker
- `packages/shared-contracts` — JSON schemas/examples for interface stability
- `data/dbt` — dbt project (`sources`, `models`, `tests`, `metrics`)
- `data/warehouse` — PostgreSQL starter schema/seed bootstrap artifacts
- `tests` — smoke and contract test suites
- `scripts` — validation, manifests, quality gate helpers
- `docs` — UX, QA, security, governance, architecture references
- `project-management` — reports, audits, planning artifacts, issue logs
- `cursor-agent-system` — structured agent/PM operating workflows

For additional zone-level ownership conventions, see `PROJECT_STRUCTURE.md`.

---

## Technology Stack

### Frontend

- React + TypeScript + Vite
- Tailwind CSS
- Recharts
- Vitest + Testing Library
- ESLint

### Backend

- FastAPI
- Pydantic / Pydantic Settings
- SQLAlchemy
- Psycopg
- Alembic
- Pytest / Ruff / MyPy

### Data & Infrastructure

- PostgreSQL 16
- dbt
- Docker Compose for local orchestration
- GitHub Actions CI
- Codecov integration

---

## Prerequisites

- **Node.js** `>=20` (see `.nvmrc`)
- **Python** `>=3.11`
- **Docker** + **Docker Compose**
- **dbt** (for dbt parse/test/build commands)

---

## Quick Start (Recommended)

```bash
cp .env.example .env
make install
make dev
```

This starts the local stack using `docker-compose.yml`:

- Postgres (`5432`)
- Analytics API (`8000`)
- Dashboard web (`5173`)
- Ingestion worker (one-shot command mode by default)

Stop services:

```bash
make stop
```

---

## Running Components Individually

### Frontend only

```bash
npm run dev:web
```

or

```bash
npm --prefix apps/dashboard-web run dev
```

### API tests

```bash
make test-backend
```

### Ingestion tests

```bash
make test-ingestion
```

### Frontend tests

```bash
make test-frontend
```

### Contract + smoke tests

```bash
make test-contract
make smoke
```

---

## Quality, Validation, and Gates

Common local verification sequence:

```bash
make validate-structure
make validate-no-drift
make manifest
make lint
make typecheck
make test
```

Useful additional commands:

- `make quality-gates` — run local quality gate script
- `make qa-evidence` — collect QA evidence artifacts
- `make dbt-test` / `make dbt-build` — dbt validation/build

### CI Merge Gate Context

Main branch protection currently enforces required status checks including backend/frontend tests and Codecov checks.

---

## Governance and No-Drift Rules

The following rules are foundational and should not be bypassed:

- Portal success requires **confirmed portal completion**, not just link delivery/sent.
- Abandoned/drop-off/unresolved calls are excluded from successful containment outcomes.
- Stay.ai is the source of truth for subscription state/action/cancellation/save outcomes.
- Shopify is the source of truth for commerce context (orders/products/customers/status).
- Save classification requires confirmed retained-subscription outcome.
- Confirmed cancellation requires Stay.ai canceled state or approved official completion path.
- Cost Too High sequence: frequency offer -> 25% off offer -> confirmed cancellation when both declined.
- Trust labels are system-calculated and cannot be manually elevated.
- Exports must include governance metadata (filters, definitions, trust, freshness, versions, owner, timestamp, fingerprint, audit reference).
- Permissions are server-enforced with explicit deny behavior.
- Historical backfill is out of base launch scope unless routed through governed backfill/reprocess pipelines.

No-drift validation is implemented in repo scripts and should be run before major merges.

---

## Export and Auditability Standard

Governed exports are expected to include:

- active filters
- metric definitions
- trust labels
- freshness state
- formula versions
- owner
- timestamp
- fingerprint
- audit reference
- permission decision context

This is required for reproducibility and downstream governance.

---

## Security and Access

- Permission logic is server-side authoritative.
- UI affordances should never be treated as the final access control boundary.
- Explicit deny behavior is preferred over implicit permissive assumptions.
- Use least privilege for credentials and environment secrets.

---

## Documentation Pointers

- `PROJECT_OVERVIEW.md` — concise project summary
- `PROJECT_STRUCTURE.md` — zone ownership and structure lock context
- `docs/07_dashboard_ui_ux/` — UX systems, copy, IA, support-user workflows
- `docs/10_qa_acceptance/` — QA and acceptance patterns
- `docs/11_security_governance_rbac/` — security/governance references
- `HANDOFF_README.md` — handoff expectations/context

---

## Contribution Workflow

1. Create a branch from `main`.
2. Implement changes with tests.
3. Run local validations and quality gates.
4. Open PR with clear summary + test evidence.
5. Ensure required checks are green before merge.

Recommended minimum PR evidence:

- what changed
- why it changed
- test plan/results
- screenshots for UI behavior changes
- any governance or risk notes

---

## Troubleshooting

### Vite module resolution errors in local dev

If you see missing `vite/dist/node/chunks/*` errors, reinstall dependencies:

```bash
npm --prefix apps/dashboard-web install
```

Then restart dev/build:

```bash
npm --prefix apps/dashboard-web run dev
```

### Local cache/build inconsistencies

If needed:

```bash
make clean
```

Then reinstall and rerun.

---

## License and Internal Use

This repository contains implementation and operational artifacts for Scentiment analytics delivery workflows. Follow internal governance and security policies for access, deployment, and data handling.

