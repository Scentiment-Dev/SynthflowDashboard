# Dashboard Module Specs

| Module Key | Module | Description |
| --- | --- | --- |
| overview | Executive Overview | Containment, net business impact, trust health, revenue/churn overview. |
| subscriptions | Subscription Analytics | Stay.ai-confirmed subscription actions and non-cancellation outcomes. |
| retention | Cancellation / Retention | Cancellation reasons, offers, saves, confirmed cancels, Cost Too High path. |
| order_status | Order Status | Shopify-backed ETA, fulfillment, tracking, pre-order, and delay analytics. |
| escalations | Escalations | RingCX/live-agent transfer, queue, unresolved, and follow-up outcomes. |
| data_quality | Data Quality / Trust | Freshness, join coverage, schema validity, duplicate risk, trust labels. |
| governance | Governance / RBAC / Exports | Explicit deny, export audit, fingerprints, permissions, formula versions. |

## UI behavior notes (Cycle 001 frontend shell)

- Subscription analytics is rendered as a dashboard shell with non-production placeholders.
- Final subscription outcomes remain pending until Stay.ai final state/action confirmation is available.
- Portal link delivery is shown separately from portal completion.
- Shopify context can enrich display but cannot finalize retained/cancelled subscription outcomes.
- Low-trust, stale, missing-data, pending-confirmation, and permission-denied states must remain visible.

## Cycle 002 backend API contract surface

- Backend route: `GET /subscriptions/analytics` (fixture-backed deterministic response).
- Backend route: `GET /subscriptions/outcomes` (fixture-backed deterministic subscription outcome metrics).
- Scenario switch for known-answer tests: `GET /subscriptions/analytics?scenario=missing_stayai_confirmation`.
- Scenario switch for outcome tests: `GET /subscriptions/outcomes?scenario=<known_answer_case>`.
- `subscription_overview.confirmed_cancellations_count` is Stay.ai-confirmed only.
- `subscription_overview.confirmed_retained_subscriptions_count` requires confirmed retained/saved/active Stay.ai state.
- `portal_journey.portal_link_sent_count` is tracked separately from `portal_journey.confirmed_portal_completion_count`.
- `shopify_context.context_role` is `context_only` and `finalization_allowed` is always `false`.
- `metric_metadata` includes filters, metric definitions, trust label, freshness, formula version, owner, timestamp, fingerprint, and audit reference.
- `outcomes.metadata` includes source confirmation status and the same audit/fingerprint/freshness/formula governance fields.

## Cycle 005 subscription outcome UI behavior

The Cycle 005 outcome UI (`SubscriptionOutcomesView`) renders the
`/subscriptions/outcomes` contract as the top section of `SubscriptionAnalyticsPage` and is
visually prioritized above the Cycle 004 source-health view, the Cycle 002 contract-wired
view, and the Cycle 001 module shell.

- Renders KPI cards for every required outcome count: subscription contacts,
  subscription action requests, cancellation requests, confirmed cancellations,
  save/retention attempts, confirmed retained, non-cancellation actions, pending Stay.ai
  confirmation, missing Stay.ai final state, portal link sent, portal completion confirmed,
  Shopify context available, Synthflow subscription journeys, and subscription outcome
  unknown.
- Renders rate cards for retention rate, cancellation confirmation rate, and portal
  completion rate. Each rate card displays the live formula (`numerator / denominator`) and
  shows `n/a` when the denominator is zero.
- Renders an eight-stage outcome funnel: subscription contact / journey, requested action,
  cancellation path, save/retention path, non-cancellation action path, Stay.ai final
  confirmation, portal completion (where applicable), and unknown / pending states.
- Each KPI, rate, and funnel stage exposes its source authority. Stay.ai final-authority
  metrics are tagged with a shield icon and a "Stay.ai final" chip. Shopify context and
  Synthflow journey are tagged "Context / request" and never imply finalization.
- Required UI states are derived from the contract response: loading, empty,
  error, permission denied, low trust, stale source, pending Stay.ai confirmation,
  missing Stay.ai final state, portal link sent without confirmed completion,
  Shopify context available without Stay.ai final, Synthflow journey incomplete,
  export/audit metadata unavailable, and contract preview from fixture.
- Metric definition, formula version, owner, timestamp, scenario, fingerprint,
  audit reference, metric definitions, and filters are rendered through the metadata
  panel. Trust, freshness, and source confirmation chips use color-coded tones.

## Cycle 008 backend contract additions (subscription IA support)

- `GET /subscriptions/business-value` now carries per-metric plain-language, trust, freshness,
  formula version, fingerprint, audit reference, and source confirmation state fields.
- `GET /subscriptions/advanced-filters` provides filter option catalog + disabled reasons for:
  date preset, custom/comparison period, cancellation reason, offer type/version, subscription
  status, SKU, confidence, portal state, outcome, escalation, repeat contact, value range, trust
  label, Synthflow/Stay.ai version dimensions, current-vs-future flow, and saved views.
- `POST /subscriptions/export/preflight` returns explicit permission decision, export-allowed
  result, blocked reason, requested scope/format, applied filters, comparison period, metric
  definitions, trust labels, freshness, formula versions, owner, timestamp, fingerprint, audit
  reference, source confirmation status, and included/excluded widgets.
- `GET /subscriptions/follow-up` returns action queue rows with recommended action, priority,
  blocking data gap, confirmation status, portal completion status, estimated value at risk, SLA
  status, queue ownership, and plain-language support guidance.
