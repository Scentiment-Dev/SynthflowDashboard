# Wave 5 Metric Formula Lock

Formula version: `sub_formula_v0.2_wave05_data_lock`

## Locked formula rules

1. Link sent is never equal to portal completion.
2. Call ended is never equal to resolved.
3. Offer accepted is never equal to confirmed save.
4. Cancellation requested is never equal to confirmed cancellation.
5. Save requires confirmed retained subscription outcome from Stay.ai or an approved official path.
6. Loss/cancellation requires Stay.ai cancelled state or approved official completion path.
7. Containment excludes abandoned, dropped-off, unresolved, failed-action, escalation-only, link-sent-only, and missing-confirmation journeys.
8. Shopify order context cannot override subscription state.
9. Trust labels are system-calculated and cannot be manually elevated.

## API-facing metric fields

Every metric row exposed through `mart_dashboard_metrics` must include:

- `metric_key`
- `module`
- `metric_value`
- `formula_definition`
- `formula_version`
- `source_of_truth`
- `source_of_truth_rule`
- `trust_label`
- `freshness_status`
- `owner`
- `calculated_at`
- `manual_trust_elevation_allowed = false`
