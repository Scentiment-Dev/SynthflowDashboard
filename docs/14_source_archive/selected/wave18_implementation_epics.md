# Implementation Epics — Final Wave 18 Lock

Status: **Final implementation-ready blueprint**  
Date: 2026-04-28

## Epic E01 — Project setup, infrastructure, environments, and CI/CD

Objective: establish repo/service structure, IaC, ECS Fargate services, API Gateway/WAF, Secrets Manager/Parameter Store, ClickHouse, PostgreSQL, Redis, S3, CloudFront, CI/CD, fixture loading, health checks, blue/green deploy, and rollback.

Acceptance: staging deploys cleanly; `/health/live`, `/health/ready`, and `/health/dependencies` behave correctly; CI gates block bad merges; rollback works in staging.

## Epic E02 — Source integrations and canonical event ingestion

Objective: ingest Synthflow, Shopify, Stay.ai, portal/email/SMS, live-agent, and observability/system-health data into raw immutable storage and normalized canonical events.

Acceptance: all adapters validate schema, quarantine invalid payloads, dedupe, retry, DLQ, replay, calculate freshness, and reconcile control totals.

## Epic E03 — Warehouse, dbt, data model, and snapshot layer

Objective: build ClickHouse/PostgreSQL schemas, dbt models, entity dimensions, bridge tables, metric facts, trust inputs, reconciliation outputs, immutable snapshots, and revision metadata.

Acceptance: dbt suite passes; P0 metric snapshots reconcile; late data creates revision metadata; comparison snapshots are immutable after reconciliation.

## Epic E04 — Governed metric registry, semantic service, and trust engine

Objective: centralize official metric formulas, source ownership, versions, explanation metadata, trust labels, and known-answer tests.

Acceptance: all P0/P1 known-answer tests pass; trust labels cannot be manually elevated; metric drawers expose definition, formula, source, filters, trust, QA, and export behavior.

## Epic E05 — Auth, permissions, PII masking, audit logging, and compliance gate

Objective: enforce SSO/passwordless auth, MFA for Admin/Data Analyst, explicit-deny permissions, server-side masking, append-only audit, Wave 1 raw identifier exception controls, and compliance approval gate.

Acceptance: permission bypass tests pass; PII masking tests pass; sensitive access/export/builder/metric/flag/reset audit rows are created; compliance gate blocks reset until entered.

## Epic E06 — Dashboard API and query services

Objective: build FastAPI routers, unified response envelope, OpenAPI contract, named query catalog, cache patterns, pagination/sort/filter/search conventions, saved views, comparison API, and generated TypeScript client.

Acceptance: API contract tests pass; P95 targets pass; breaking changes require `/api/v2/`.

## Epic E07 — Frontend app shell and global UX systems

Objective: build persistent sidebar, top command bar, DomainPageShell, filters, active chips, search overlay, saved views, comparison UX, trust labels, warning banners, explanation drawers, and desktop-only handling.

Acceptance: Wave 12 UX tests pass; accessibility tests pass; no mobile QA scope except CSS-only notice below 1100px.

## Epic E08 — Domain page and widget implementation

Objective: build all 10 dashboard domains in this order: Mission Control, Call Handling, Order Status, Subscription Matching, Subscription Non-Cancellation, Cancellation/Retention/Save, Revenue/Churn/Business Value, Journey/Funnel/Friction, API/System Health, Data Quality/Analytics Trust.

Acceptance: each domain has KPI row, trends/funnels/tables, drilldowns, drawers, trust/freshness warnings, filters/search/comparison compatibility, exports, states, permissions, and QA tests.

## Epic E09 — Custom statistic, comparison, and algorithm builders

Objective: implement governed builders with sandbox preview, submit/approve/publish workflow, versioning, rollback, deprecation, audit, and trust inheritance without overriding official locked formulas.

Acceptance: builder lifecycle passes; approved custom outputs show “Custom — not the governing formula”; builders remain feature-flagged until QA passes.

## Epic E10 — CSV/PDF exports, executive reporting, and scheduled reports

Objective: implement server-side async exports, CSV/PDF layouts, executive templates, scheduled reports, metadata, S3 links, retention, rate limits, masking, and audit.

Acceptance: export QA passes; CS Agent cannot export; full-dashboard export is Admin/Data Analyst only; metadata is complete.

## Epic E11 — System health, observability, incidents, and runbooks

Objective: implement structured logs, OTel traces, CloudWatch custom metrics/alarms, System Health incident pages, source health panels, trust downgrade propagation, runbooks, and monitoring ownership.

Acceptance: alarm test fires; runbooks exist; incidents link to affected metrics and trust labels.

## Epic E12 — QA, production readiness, go-live reset, deployment, and handoff

Objective: execute Wave 17 test suite, produce QA reports, complete readiness checklist, rehearse staging reset, execute production pre-go-live reset after approvals, deploy blue/green, run smoke tests, lock launch baseline, and complete handoff.

Acceptance: all launch blockers resolved; smoke suite passes; final handoff package signed off.
