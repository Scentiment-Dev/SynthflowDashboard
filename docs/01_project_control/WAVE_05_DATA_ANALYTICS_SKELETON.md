# Wave 5 — Data/Analytics Skeleton

## Status

Complete / locked.

## Goal

Create the actual analytics backbone for the Scentiment automated phone support analytics dashboard. This wave expands `data/dbt`, `data/warehouse`, metric registry seeds, source definitions, marts, and dbt tests using the Wave 3 backend contracts and Wave 4 frontend module expectations.

## Development files created or expanded

- dbt project config, profiles, macros, analyses.
- Source definitions and staging model schema tests.
- Staging models for Synthflow, Stay.ai, Shopify, portal, and live-agent events.
- Intermediate models for subscription action attempts, official outcomes, portal evidence, retention offers, containment, order status, source freshness, and metric inputs.
- Mart/fact models for subscription journeys, subscription outcomes, cancellation/retention journeys, handoff completion, source freshness, trust label audit, and dashboard metrics.
- Warehouse DDL for dimensions, subscription facts, metric snapshots, data quality audit, trust-label audit, backfill control, and API views.
- Seeds for metric registry, source-of-truth matrix, formula versions, trust labels, event taxonomy, and dashboard module registry.
- dbt assertion tests for portal completion, abandoned/unresolved exclusion, Stay.ai-required outcomes, Cost Too High sequence, Shopify non-override, formula versions, source freshness, export metadata, and trust labels.

## Acceptance criteria

- Stay.ai confirmation is required for save/cancel/action outcomes.
- Synthflow journey data cannot confirm saves/cancellations.
- Shopify context cannot override subscription state.
- Portal link sent cannot be counted as portal completion.
- Abandoned, dropped-off, unresolved, failed-action, escalation-only, and link-sent-only journeys are excluded from successful containment.
- Trust labels are system-calculated only.
- Dashboard metrics expose formula version, source of truth, trust label, freshness, owner, calculated timestamp, and manual-trust-elevation blocker.
- Backfill is represented as governed control metadata, not base launch scope.

## Owner

Cursor Agent A owns data/dbt/warehouse implementation. Cursor Agent C owns dbt test review and no-drift validation.
