# Wave 9 — QA/Test/CI/CD Skeleton

## Status

Complete / locked.

## Goal

Create the project quality-gate layer for unit tests, contract tests, smoke tests, dbt checks, lint/typecheck gates, GitHub Actions workflows, and deterministic QA evidence collection.

## Scope

Wave 9 does not reopen the locked analytics blueprint. It creates the validation and CI/CD skeleton that lets Cursor Agent C verify implementation work before PR merge.

## New quality layers

1. Backend FastAPI contract tests.
2. Ingestion worker normalization and connector registry tests.
3. Frontend governance/API alignment tests.
4. Shared contract schema/example tests.
5. Root integration skeleton tests.
6. Smoke tests for local stack readiness.
7. dbt parse/test workflow.
8. Lint/typecheck workflows for backend, ingestion, and frontend.
9. No-drift validation workflow.
10. Release-readiness workflow with QA evidence artifacts.

## Locked no-drift coverage

- Stay.ai remains source of truth for subscription save/cancel/state/retention outcomes.
- Shopify remains order/product/customer/order-status context source of truth.
- Portal success requires confirmed portal completion, not only a portal link sent.
- Abandoned, unresolved, and transferred calls are excluded from successful containment.
- Trust labels are system-calculated and cannot be manually elevated.
- Permissions are enforced server-side using explicit deny.
- Exports must include filters, definitions, trust labels, freshness, formula versions, owner, timestamp, fingerprint, and audit reference.

## Acceptance criteria

- GitHub Actions workflow files exist for backend, ingestion, frontend, dbt, contracts, smoke, governance, lint/typecheck, and release readiness.
- Local validation scripts exist and are runnable without external credentials.
- Contract/smoke/integration test skeletons exist.
- QA evidence generation exists.
- Wave 9 validator passes.
- Existing source-of-truth and no-drift anchors remain intact.

## Owner

Cursor Agent C, with AI PM review.
