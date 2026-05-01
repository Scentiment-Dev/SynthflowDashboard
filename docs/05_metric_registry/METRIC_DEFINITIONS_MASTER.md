# Metric Definitions Master

| Metric Key | Display Name | Module | Formula | Source of Truth | Trust Rule |
| --- | --- | --- | --- | --- | --- |
| subscription_save_rate | Subscription Save Rate | retention | confirmed_saved / eligible_cancellation_attempts | Stay.ai | Confirmed retained subscription outcome required. |
| confirmed_cancellation_rate | Confirmed Cancellation Rate | retention | confirmed_cancelled / eligible_cancellation_attempts | Stay.ai | Request alone is not cancellation. |
| cost_too_high_offer_progression | Cost Too High Offer Progression | retention | frequency_change -> 25_percent_offer -> cancellation_if_declined | Synthflow + Stay.ai | Offer sequence is locked. |
| portal_completion_rate | Portal Completion Rate | subscriptions | confirmed_portal_completed / portal_started | Portal/Stay.ai | Link sent is diagnostic only. |
| automation_containment_rate | Automation Containment Rate | overview | resolved_or_portal_completed / eligible_calls | Synthflow + Warehouse | Abandoned/drop-off excluded from success. |
| order_status_resolution_rate | Order Status Resolution Rate | order_status | resolved_order_status_calls / eligible_order_status_calls | Synthflow + Shopify | Shopify provides official order context. |
| high_trust_metric_rate | High Trust Metric Rate | data_quality | high_trust_metrics / major_metrics | Warehouse | Trust labels are calculated only. |
| export_audit_compliance_rate | Export Audit Compliance Rate | governance | compliant_exports / all_exports | Analytics API | Fingerprint and audit reference required. |
