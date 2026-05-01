# Final Analytics Governance

## Governance Purpose

The analytics dashboard must be stable, auditable, and readable across customer support, operations, data, leadership, and future AI-assistant continuation. Governance exists to prevent metric drift, duplicate definitions, formula changes without documentation, and dashboard numbers that cannot be explained.

## Metric Classes

### Production Metrics
Metrics approved for core dashboard use. These require locked definitions, formulas, source mapping, required events, trust/confidence labels, edge-case rules, and freshness/quality checks.

### Diagnostic Metrics
Metrics used for troubleshooting, root-cause analysis, operational review, or flow improvement. These can appear in drilldowns, system-health sections, journey diagnostics, or domain-specific pages.

### Exploratory / Future Metrics
Metrics that are valuable but depend on future events, future flows, richer source data, or additional validation. These should not be promoted to executive views until quality and trust requirements are met.

### Deprecated / Replaced Metrics
Metrics no longer recommended for production use. They must retain their historical definition, replacement metric if any, deprecation reason, and effective date.

## Final Dashboard Domains

1. Executive Overview
2. Call Handling
3. Order Status
4. Subscription Matching
5. Subscription Non-Cancellation Actions
6. Cancellation / Retention / Save
7. Revenue / Churn / Business Value
8. Customer Journey / Funnel / Friction
9. API / System Health
10. Data Quality / Analytics Trust

## Non-Negotiable Locked Rules

- Portal success requires confirmed portal action completion.
- Pre-order ETA uses a flat 60 calendar days from locked order date.
- Unusual delay is 10+ business days past applicable ETA endpoint.
- Abandoned/drop-off calls cannot count as successful containment.
- All seven cancellation intents must be tracked separately.
- Net business value must separate gross value, offer costs, support cost avoided, deferred value, lost value, confirmed value, and confidence labels.
- Raw operational identifiers may be available for authorized internal drilldowns, but dashboard views should avoid unnecessary exposure.
