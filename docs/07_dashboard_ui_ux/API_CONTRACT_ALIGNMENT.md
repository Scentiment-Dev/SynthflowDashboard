# API Contract Alignment — Wave 4

The frontend was aligned to the Wave 3 FastAPI skeleton instead of creating a disconnected mock-only dashboard.

## Contract naming

Frontend TypeScript types intentionally use the same snake_case JSON fields returned by the FastAPI/Pydantic backend:

- `metric_key`
- `display_name`
- `source_of_truth`
- `trust_rule`
- `formula_version`
- `recent_events`
- `trust_label`

## Module enum

Frontend modules align to backend `DashboardModule` values:

- `overview`
- `subscriptions`
- `cancellations`
- `retention`
- `order_status`
- `escalations`
- `data_quality`
- `governance`

## Local development behavior

If the backend API is unavailable, `useDashboardSummary` uses module fixtures and shows a visible fixture fallback banner.

## Production requirement

Before production release, every fixture value must either be removed or explicitly controlled by a demo/dev mode flag.

## Cycle 002 — Subscription analytics contract wiring

The Cycle 002 subscription analytics surface consumes the merged Agent A backend
`GET /subscriptions/analytics?scenario=...` endpoint and the shared contract
`packages/shared-contracts/schemas/subscription_analytics_response.schema.json`.

### Frontend TypeScript shape

`apps/dashboard-web/src/types/subscriptionAnalytics.ts` mirrors the
`SubscriptionAnalyticsResponse` Pydantic model exactly with no field renames:

- `module`, `generated_from_fixture`, `final_subscription_state`
- `source_of_truth_system` (always `stayai`), `source_confirmation_status`
- `subscription_overview` (cancellation requests, confirmed cancellations,
  save/retention attempts, confirmed retained subscriptions, pending Stay.ai
  confirmation, in-scope subscriptions)
- `portal_journey` (link sent vs confirmed completion)
- `shopify_context` (context-only role, finalization not allowed)
- `synthflow_journey` (status breakdown)
- `source_confirmation` (confirmed/pending/missing record counts)
- `metric_metadata` (filters, definitions, formula version, freshness, trust
  label, owner, timestamp, fingerprint, audit reference, source system, source
  confirmation status)

### Source-of-truth rules enforced in UI

- Stay.ai is the only system that can finalize a subscription state.
- Shopify is shown as context only and never overrides Stay.ai.
- Synthflow events that are unresolved/transferred/abandoned are excluded from
  containment success.
- Portal link sent is shown separately from confirmed portal completion.
- Trust labels surface as system-calculated; manual elevation is blocked.
- Export readiness checks for required metadata; missing fields render an
  explicit "export blocked" alert.

### State surface

`apps/dashboard-web/src/utils/subscriptionAnalyticsState.ts#deriveSubscriptionStateAlerts`
emits the following deterministic alerts based purely on contract fields:

`loading`, `permission_denied`, `rbac_unavailable`, `fixture_preview`, `empty`,
`low_trust`, `stale`, `pending_freshness`, `pending_source_confirmation`,
`missing_stayai_final_state`, `final_state_not_confirmed`,
`portal_link_unknown_completion`, `shopify_without_stayai_final`,
`synthflow_journey_incomplete`, `audit_unavailable`, `export_pending_metadata`.

### Local development behavior (Cycle 002)

`useSubscriptionAnalytics(scenario)` fetches the analytics endpoint and falls
back to the typed fixture in
`apps/dashboard-web/src/data/subscriptionAnalyticsFixtures.ts` if either:

1. The fetch rejects (analytics-api unreachable), or
2. The response shape does not match the contract.

The UI clearly tags fixture-backed responses as "Contract preview from fixture"
and surfaces permission-denied/RBAC unavailable as separate states so local
checks are never treated as production authorization.
