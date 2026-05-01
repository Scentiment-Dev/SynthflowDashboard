# Dashboard Web — Wave 4 Frontend Skeleton

This is the React/Vite/TypeScript dashboard application for the Scentiment automated phone support analytics dashboard.

Wave 4 expands the frontend from page placeholders into an implementation-ready dashboard shell aligned to the Wave 3 FastAPI contracts.

## Current scope

- Route-level dashboard modules:
  - Overview
  - Subscriptions
  - Cancellations
  - Retention
  - Order Status
  - Escalations
  - Data Quality
  - Governance
  - Exports
- API-backed summary hook with fixture fallback.
- Source-of-truth banners and locked rule panels.
- Metric cards with trust labels and source badges.
- Time-series chart, funnel chart, journey flow visual, metric table, normalized event table.
- Export audit action stub wired to `/exports/audit`.
- Filter context for date range, platform, and segment.
- Starter tests for shell rendering, metric cards, and retention no-drift content.

## No-drift UI rules

The UI must never imply that a metric is confirmed unless the backend/source data confirms it.

- Portal success means confirmed portal completion, not link sent.
- Stay.ai controls subscription state/action/cancellation/save outcomes.
- Shopify controls order/product/customer/order-status context.
- Save requires confirmed retained subscription outcome.
- Cost Too High sequence is locked: frequency change offer → 25% off offer → confirmed cancellation if both are declined.
- Trust labels are system-calculated and cannot be manually elevated from the UI.
- Export actions must show required metadata and remain backend permission-gated.

## Local commands

```bash
npm install
npm run dev
npm run build
npm run test
```

Set `VITE_API_BASE_URL=http://localhost:8000` to connect to the local FastAPI service.
