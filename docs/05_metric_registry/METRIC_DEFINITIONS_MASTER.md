# Metric Definitions Master

| Metric Key | Display Name | Module | Formula | Source of Truth | Trust Rule |
| --- | --- | --- | --- | --- | --- |
| subscription_save_rate | Subscription Save Rate | retention | confirmed_saved / eligible_cancellation_attempts | Stay.ai | Confirmed retained subscription outcome required. |
| confirmed_cancellation_rate | Confirmed Cancellation Rate | retention | confirmed_cancelled / eligible_cancellation_attempts | Stay.ai | Request alone is not cancellation. |
| cost_too_high_offer_progression | Cost Too High Offer Progression | retention | frequency_change -> 25_percent_offer -> cancellation_if_declined | Synthflow + Stay.ai | Offer sequence is locked. |
| portal_completion_rate | Portal Completion Rate | subscriptions | confirmed_portal_completed / portal_started | Portal/Stay.ai | Link sent is diagnostic only. |
| subscription_contacts_total | Subscription Contacts Total | subscriptions | count(distinct subscription_contact_id) | Stay.ai + Synthflow | Contact volume metric only; does not imply outcome confirmation. |
| subscription_action_requests_total | Subscription Action Requests Total | subscriptions | count(action_requested=true) | Stay.ai + Synthflow | Request counts cannot be treated as final outcomes. |
| cancellation_requests_total | Cancellation Requests Total | subscriptions | count(action_requested=true AND action_type='cancel') | Stay.ai + Synthflow | Request counts cannot be treated as final outcomes. |
| confirmed_cancellations_total | Confirmed Cancellations Total | subscriptions | count(stayai_final_state='cancelled' OR approved_official_completion_path=true) | Stay.ai | Confirmed cancellation requires Stay.ai cancelled state or approved official path. |
| save_or_retention_attempts_total | Save/Retention Attempts Total | subscriptions | count(action_requested=true AND action_type='save') | Stay.ai + Synthflow | Save attempt is not automatically retained outcome. |
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

## Cycle 008 subscription business-value P0 metrics

| Metric Key | Display Name | Module | Formula | Source of Truth | Trust Rule |
| --- | --- | --- | --- | --- | --- |
| net_business_value_impact | Net Business Value Impact | subscriptions | gross_value_protected - offer_cost + support_cost_avoided | Stay.ai + warehouse | Never confirmed without confirmed Stay.ai source confirmation status. |
| gross_value_protected | Gross Value Protected | subscriptions | sum(expected_revenue_saved_before_costs) | Warehouse | Report as estimated when confirmations are pending. |
| net_retained_recovered_value | Net Retained / Recovered Value | subscriptions | confirmed_saved + estimated_saved - leakage - offer_cost | Stay.ai + warehouse | Confirmed and estimated states must remain distinct. |
| confirmed_business_value_impact | Confirmed Business Value Impact | subscriptions | confirmed_saved_revenue - confirmed_offer_cost + confirmed_support_cost_avoided | Stay.ai + finance | Requires confirmed Stay.ai final state and official completion path rules. |
| estimated_business_value_impact | Estimated Business Value Impact | subscriptions | estimated_saved - estimated_cost + estimated_support_avoided | Warehouse | Explicitly marked estimated until confirmed data arrives. |
| revenue_saved_estimate | Revenue Saved Estimate | subscriptions | sum(estimated_retained_revenue) | Warehouse | Estimated-only unless source confirmation status is confirmed. |
| gross_saved_value | Gross Saved Value | subscriptions | confirmed_saved_revenue + estimated_saved_revenue | Warehouse | Must preserve confirmed vs estimated composition. |
| confirmed_saved_revenue | Confirmed Saved Revenue | subscriptions | sum(saved_revenue where stayai confirmed) | Stay.ai + billing | Confirmed only when Stay.ai confirmation is confirmed. |
| net_saved_revenue | Net Saved Revenue | subscriptions | gross_saved_value - offer_cost | Warehouse | Estimated when cost joins or confirmations are incomplete. |
| offer_cost | Offer Cost | subscriptions | discount_cost + free_shipping_cost + incentive_cost | Offer ledger | State follows offer-cost lineage completeness. |
| discount_cost | Discount Cost | subscriptions | sum(discount value applied) | Offer ledger | Unknown or blocked when discount joins are missing. |
| free_shipping_cost | Free Shipping Cost | subscriptions | sum(shipping subsidy) | Shopify context | Shopify remains context-only for final outcome truth. |
| revenue_at_risk | Revenue At Risk | subscriptions | sum(predicted_revenue_for_high_churn_probability) | Warehouse | Estimated until full confirmation windows close. |
| support_cost_avoided | Support Cost Avoided | subscriptions | contained_calls * cost_per_contained_call | Warehouse + finance | Cannot be manually elevated; trust is system-calculated. |
| cost_per_contained_call | Cost per Contained Call | subscriptions | support_cost_avoided / contained_call_count | Finance ops | Confirmed with finance baseline model. |
| net_value_per_contained_call | Net Value per Contained Call | subscriptions | (net_saved_revenue + support_cost_avoided) / contained_call_count | Warehouse | Estimated when net_saved_revenue remains estimated. |
| automation_roi | Automation ROI | subscriptions | (net_saved_revenue + support_cost_avoided) / automation_operating_cost | Warehouse | Requires explicit formula version in export manifest. |
| retention_roi_estimate | Retention ROI Estimate | subscriptions | net_retained_recovered_value / retention_program_cost | Warehouse | Estimated unless all cost allocations are confirmed. |
| estimated_churn_prevented_count | Estimated Churn Prevented Count | subscriptions | sum(predicted_saved_subscriptions) | Warehouse | Estimated by definition. |
| confirmed_churn_prevented_count | Confirmed Churn Prevented Count | subscriptions | count(stayai final retained/saved/active) | Stay.ai | Confirmed only from Stay.ai final state. |
| revenue_leakage_after_save | Revenue Leakage After Save | subscriptions | sum(saved_then_cancelled_revenue_loss) | Stay.ai + billing | Pending when post-save window has not closed. |
| high_value_churn_risk | High-Value Churn Risk | subscriptions | count(churn_risk>=threshold and mrr>=cutoff) | Warehouse | Estimated if risk model freshness is stale. |
| stay_ai_confirmation_coverage | Stay.ai Confirmation Coverage | subscriptions | confirmed_records / records_requiring_confirmation | Stay.ai | Source confirmation metric; governs trust chips. |
| true_subscription_containment_rate | True Subscription Containment Rate | subscriptions | contained_without_repeat_contact / eligible_subscription_contacts | Warehouse + Stay.ai | Blocked when repeat-contact join is unavailable. |
