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
