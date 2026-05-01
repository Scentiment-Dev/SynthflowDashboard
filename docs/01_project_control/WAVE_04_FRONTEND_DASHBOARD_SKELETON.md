# Wave 4 — Frontend Dashboard Skeleton

## Goal

Create the actual React/Vite/TypeScript frontend dashboard foundation for the internal Scentiment automated phone support analytics dashboard.

## Owner

Cursor Agent B.

## Build focus

1. Dashboard routing.
2. Reusable module page shell.
3. API contract alignment with Wave 3 backend endpoints.
4. Fixture fallback for local development.
5. Source-of-truth visibility.
6. Trust label visibility.
7. Export audit readiness.
8. UI tests for no-drift content.

## Core routes

- `/overview`
- `/subscriptions`
- `/cancellations`
- `/retention`
- `/order-status`
- `/escalations`
- `/data-quality`
- `/governance`
- `/exports`

## Acceptance gates

- Agent B must not hardcode a successful business outcome without backend/source confirmation.
- The frontend may show fixture values, but must clearly identify when fixture fallback is being used.
- The frontend must not allow trust labels to be manually elevated.
- Export UI must remain backend permission-gated and audit-aware.
- Subscription handling remains first-priority UI module.
