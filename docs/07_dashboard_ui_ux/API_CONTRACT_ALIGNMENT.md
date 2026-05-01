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
