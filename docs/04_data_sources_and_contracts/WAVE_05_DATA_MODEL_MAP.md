# Wave 5 Data Model Map

## Raw sources

| Source | Raw table | Authority |
|---|---|---|
| Synthflow | `raw.synthflow_call_events` | Call journey, intent, branch, retention offer evidence, handoff/link-sent events |
| Stay.ai | `raw.stayai_subscription_events` | Official subscription state, action completion, save, cancellation |
| Shopify | `raw.shopify_order_context` | Order, product, customer, fulfillment, tracking/order-status context |
| Portal/Email/SMS | `raw.portal_completion_events` | Confirmed portal or self-service completion; link sent is only diagnostic |
| RingCX/live-agent | `raw.live_agent_escalation_events` | Transfer and downstream escalation outcomes where integrated |

## Model flow

```text
raw.*
  -> stg_*
  -> int_subscription_action_attempts
  -> int_subscription_official_outcomes
  -> int_portal_completion_evidence
  -> int_retention_offer_events
  -> int_subscription_journeys
  -> fact_subscription_journey / fact_subscription_outcome / fact_cancellation_retention_journey
  -> mart_* / mart_dashboard_metrics
```

## No-drift source locks

- `save_confirmed` and `cancelled_confirmed` come from Stay.ai confirmation only.
- `portal_completed` requires confirmed portal completion, never merely link sent.
- `order_status_resolved_with_shopify_context` requires Shopify order context.
- `containment_success_candidate` excludes abandoned, dropped-off, unresolved, failed-action, link-sent-only, and escalation-only records.
