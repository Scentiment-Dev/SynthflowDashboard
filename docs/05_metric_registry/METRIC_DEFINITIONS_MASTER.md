# Metric Definitions Master

| Metric Key | Display Name | Module | Formula | Source of Truth | Trust Rule |
| --- | --- | --- | --- | --- | --- |
| subscription_save_rate | Subscription Save Rate | retention | confirmed_saved / eligible_cancellation_attempts | Stay.ai | Confirmed retained subscription outcome required. |
| confirmed_cancellation_rate | Confirmed Cancellation Rate | retention | confirmed_cancelled / eligible_cancellation_attempts | Stay.ai | Request alone is not cancellation. |
| cost_too_high_offer_progression | Cost Too High Offer Progression | retention | frequency_change -> 25_percent_offer -> cancellation_if_declined | Synthflow + Stay.ai | Offer sequence is locked. |
| portal_completion_rate | Portal Completion Rate | subscriptions | confirmed_portal_completed / portal_started | Portal/Stay.ai | Link sent is diagnostic only. |
| subscription_contacts_total | Subscription Contacts Total | subscriptions | count(distinct subscription_contact_id) | Stay.ai + Synthflow | Contact volume metric only; does not imply outcome confirmation. |
| subscription_action_requests_total | Subscription Action Requests Total | subscriptions | count(action_requested=true) | Stay.ai + Synthflow | Request counts cannot be treated as final outcomes. |
| cancellation_requests_total | Cancellation Requests Total | subscriptions | count(action_type='cancel') | Stay.ai + Synthflow | Request counts cannot be treated as final outcomes. |
| confirmed_cancellations_total | Confirmed Cancellations Total | subscriptions | count(stayai_final_state='cancelled' OR approved_official_completion_path=true) | Stay.ai | Confirmed cancellation requires Stay.ai cancelled state or approved official path. |
| save_or_retention_attempts_total | Save/Retention Attempts Total | subscriptions | count(action_type='save') | Stay.ai + Synthflow | Save attempt is not automatically retained outcome. |
| confirmed_retained_total | Confirmed Retained Total | subscriptions | count(action_type='save' AND stayai_final_state IN ['retained','saved','active'] AND stayai_confirmed=true) | Stay.ai | Confirmed retained requires Stay.ai final retained/saved/active state. |
| non_cancellation_actions_total | Non-cancellation Actions Total | subscriptions | count(non_cancel_action_completed=true) | Stay.ai + Synthflow | Non-cancel actions are tracked separately from cancel/save outcomes. |
| pending_stayai_confirmation_total | Pending Stay.ai Confirmation Total | subscriptions | count(action_type IN ['cancel','save'] AND stayai_confirmation_status='pending') | Stay.ai | Pending confirmation lowers confidence and blocks finalization. |
| missing_stayai_final_state_total | Missing Stay.ai Final State Total | subscriptions | count(action_type IN ['cancel','save'] AND stayai_final_state IS NULL) | Stay.ai | Missing final state produces pending/unknown outcome. |
| portal_link_sent_total | Portal Link Sent Total | subscriptions | count(portal_link_sent=true) | Portal | Link sent is not completion. |
| portal_completion_confirmed_total | Portal Completion Confirmed Total | subscriptions | count(portal_completion_confirmed=true) | Portal/Stay.ai | Requires confirmed completion event. |
| shopify_context_available_total | Shopify Context Available Total | subscriptions | count(shopify_context_available=true) | Shopify | Shopify context cannot finalize cancellation/retention state. |
| synthflow_subscription_journeys_total | Synthflow Subscription Journeys Total | subscriptions | count(synthflow_journey_present=true) | Synthflow | Journey presence does not confirm final subscription state. |
| subscription_outcome_unknown_total | Subscription Outcome Unknown Total | subscriptions | count(action_requested=true AND final_outcome_not_confirmed=true) | Stay.ai + Synthflow + Shopify | Unknown outcomes remain unresolved until authoritative confirmation. |
| retention_rate | Retention Rate | subscriptions | confirmed_retained_total / save_or_retention_attempts_total | Stay.ai | Requires confirmed retained outcome from Stay.ai. |
| cancellation_confirmation_rate | Cancellation Confirmation Rate | subscriptions | confirmed_cancellations_total / cancellation_requests_total | Stay.ai | Cancellation request alone is insufficient. |
| automation_containment_rate | Automation Containment Rate | overview | resolved_or_portal_completed / eligible_calls | Synthflow + Warehouse | Abandoned/drop-off excluded from success. |
| order_status_resolution_rate | Order Status Resolution Rate | order_status | resolved_order_status_calls / eligible_order_status_calls | Synthflow + Shopify | Shopify provides official order context. |
| high_trust_metric_rate | High Trust Metric Rate | data_quality | high_trust_metrics / major_metrics | Warehouse | Trust labels are calculated only. |
| export_audit_compliance_rate | Export Audit Compliance Rate | governance | compliant_exports / all_exports | Analytics API | Fingerprint and audit reference required. |
