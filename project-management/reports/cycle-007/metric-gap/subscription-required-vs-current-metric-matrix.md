# Cycle 007 Subscription Required-vs-Current Metric Matrix

## Source pack resolution used in this cycle

- Required filenames were not present in `project-management/source_blueprints/selected_core_files/` or `docs/14_source_archive/selected/`.
- Mapping used for this reconciliation:
  - `subscription_metric_registry_wave20.md` -> `docs/14_source_archive/selected/wave20_subscription_build_plan.md`
  - `subscription_dashboard_views_wave20.md` -> `docs/14_source_archive/selected/wave20_subscription_build_plan.md`
  - `cancellation_retention_save_blueprint_wave18_priority.md` -> `docs/14_source_archive/selected/wave18_source_of_truth_map.md`
  - `phone_wave10_revenue_saved_churn_algorithms.md` -> `docs/14_source_archive/selected/wave10_final_analytics_governance.md`
  - `phone_wave10_revenue_churn_business_value_metric_catalog.md` -> `docs/05_metric_registry/METRIC_DEFINITIONS_MASTER.md`
  - `phone_wave10_revenue_formula_definitions.md` -> `docs/05_metric_registry/METRIC_DEFINITIONS_MASTER.md`
  - `phone_wave10_master_metric_catalog.md` -> `docs/05_metric_registry/METRIC_DEFINITIONS_MASTER.md`

## Required metric inventory

| Metric ID/Name | Source Pack Reference | Required Page/Subpage | Formula | Source of Truth | Current Status | Backend Endpoint/Contract | UI Location | Data Dependency | Priority | Recommended Cycle |
|---|---|---|---|---|---|---|---|---|---|---|
| net_business_value_impact / Net Business Value Impact | wave10 governance + metric catalog mapping | Executive Overview -> Revenue / Churn / Business Value | gross_value_protected - offer_cost - discount_cost - free_shipping_cost + support_cost_avoided | Warehouse analytics with Stay.ai confirmation | partial | `GET /subscriptions/business-value` fixture stub (`services/analytics-api/app/services/subscription_service.py`) | missing from current subscription UI | Stay.ai final state, offer-cost ledger, support cost model | P0 | Cycle 007 (stub), Cycle 008 (productionized) |
| gross_value_protected / Gross Value Protected | wave10 governance + metric catalog mapping | Revenue / Churn / Business Value | sum(expected_revenue_saved_before_costs) | Warehouse analytics | partial | `GET /subscriptions/business-value` stub | missing | LTV projection and retention model | P0 | Cycle 008 |
| net_retained_recovered_value / Net Retained / Recovered Value | wave10 governance + metric catalog mapping | Revenue / Churn / Business Value | confirmed_saved + estimated_saved - leakage - offer_cost | Warehouse analytics + Stay.ai | partial | `GET /subscriptions/business-value` stub | missing | post-save churn window, offer costs | P0 | Cycle 008 |
| confirmed_business_value_impact / Confirmed Business Value Impact | wave10 governance + metric catalog mapping | Executive Overview | confirmed_saved_revenue - confirmed_offer_cost + confirmed_support_cost_avoided | Stay.ai + finance join | partial | `GET /subscriptions/business-value` stub | missing | Confirmed Stay.ai and finance posting | P0 | Cycle 008 |
| estimated_business_value_impact / Estimated Business Value Impact | wave10 governance + metric catalog mapping | Executive Overview | estimated_saved - estimated_cost + estimated_support_avoided | Warehouse analytics | partial | `GET /subscriptions/business-value` stub | missing | Pending confirmations and model assumptions | P0 | Cycle 008 |
| revenue_saved_estimate / Revenue Saved Estimate | wave10 revenue formula mapping | Revenue / Churn / Business Value | sum(estimated_retained_revenue) | Warehouse analytics | partial | `GET /subscriptions/business-value` stub | missing | Retention model weights | P0 | Cycle 008 |
| gross_saved_value / Gross Saved Value | wave10 revenue formula mapping | Revenue / Churn / Business Value | confirmed_saved_revenue + estimated_saved_revenue | Warehouse analytics | partial | `GET /subscriptions/business-value` stub | missing | Confirmed + estimated cohorts | P0 | Cycle 008 |
| confirmed_saved_revenue / Confirmed Saved Revenue | wave10 revenue formula mapping | Revenue / Churn / Business Value | sum(saved_revenue where Stay.ai confirmed) | Stay.ai + billing | partial | `GET /subscriptions/business-value` stub | missing | Stay.ai confirmed saves, billing linkage | P0 | Cycle 008 |
| net_saved_revenue / Net Saved Revenue | wave10 revenue formula mapping | Revenue / Churn / Business Value | gross_saved_value - total_offer_cost | Warehouse analytics | partial | `GET /subscriptions/business-value` stub | missing | Offer-cost join completeness | P0 | Cycle 008 |
| offer_cost / Offer Cost | wave18 cancellation blueprint mapping | Cancellation / Retention / Save -> Offer analytics | discount_cost + free_shipping_cost + incentive_cost | Offer redemption ledger | partial | `GET /subscriptions/business-value` stub | missing | Offer type/version and redemption data | P0 | Cycle 008 |
| discount_cost / Discount Cost | wave18 cancellation blueprint mapping | Cancellation / Retention / Save -> Offer analytics | sum(discount value applied) | Offer redemption ledger | partial | `GET /subscriptions/business-value` stub | missing | Discount code redemption records | P0 | Cycle 008 |
| free_shipping_cost / Free Shipping Cost | wave18 cancellation blueprint mapping | Cancellation / Retention / Save -> Offer analytics | sum(shipping subsidy) | Shopify shipping ledger | partial | `GET /subscriptions/business-value` stub | missing | Shipping override + subsidy events | P0 | Cycle 008 |
| revenue_at_risk / Revenue At Risk | wave10 revenue/churn mapping | Executive Overview -> Risk panel | sum(predicted_revenue for high churn risk) | Warehouse analytics | partial | `GET /subscriptions/business-value` stub | missing | Churn risk scores and MRR | P0 | Cycle 008 |
| support_cost_avoided / Support Cost Avoided | wave10 business value mapping | Executive Overview | contained_calls * cost_per_contained_call | Warehouse analytics + finance cost model | partial | `GET /subscriptions/business-value` stub | missing | Contained-call classification quality | P0 | Cycle 008 |
| cost_per_contained_call / Cost per Contained Call | wave10 business value mapping | Executive Overview | support_cost_avoided / contained_call_count | Finance ops model | partial | `GET /subscriptions/business-value` stub | missing | Baseline agent cost model version | P0 | Cycle 008 |
| net_value_per_contained_call / Net Value per Contained Call | wave10 business value mapping | Executive Overview | (net_saved_revenue + support_cost_avoided) / contained_call_count | Warehouse analytics | partial | `GET /subscriptions/business-value` stub | missing | Same as net saved + contained calls | P0 | Cycle 008 |
| automation_roi / Automation ROI | wave10 business value mapping | Executive Overview | (net_saved_revenue + support_cost_avoided) / automation_operating_cost | Warehouse analytics | partial | `GET /subscriptions/business-value` stub | missing | Operating-cost dataset and attribution | P0 | Cycle 008 |
| retention_roi_estimate / Retention ROI Estimate | wave10 business value mapping | Cancellation / Retention / Save | net_retained_recovered_value / retention_program_cost | Warehouse analytics | partial | `GET /subscriptions/business-value` stub | missing | Program cost allocation model | P0 | Cycle 008 |
| estimated_churn_prevented_count / Estimated Churn Prevented Count | wave10 churn algorithms mapping | Revenue / Churn / Business Value | sum(predicted_saved_subscriptions) | Warehouse analytics | partial | `GET /subscriptions/business-value` stub | missing | Churn model calibration | P0 | Cycle 008 |
| confirmed_churn_prevented_count / Confirmed Churn Prevented Count | wave10 churn algorithms mapping | Revenue / Churn / Business Value | count(stayai confirmed retained/saved/active) | Stay.ai | partial | `GET /subscriptions/business-value` stub | missing | Confirmed final states | P0 | Cycle 008 |
| revenue_leakage_after_save / Revenue Leakage After Save | wave10 churn algorithms mapping | Revenue / Churn / Business Value | sum(saved_then_cancelled_revenue_loss) | Stay.ai + billing | partial | `GET /subscriptions/business-value` stub | missing | post-save churn horizon completeness | P0 | Cycle 008 |
| high_value_churn_risk / High-Value Churn Risk | wave10 churn algorithms mapping | Executive Overview -> At-risk cohort | count(churn_risk>=threshold and high MRR) | Warehouse analytics | partial | `GET /subscriptions/business-value` stub | missing | Risk score + MRR threshold | P0 | Cycle 008 |
| cost_too_high_funnel_sequence_metrics / Cost Too High funnel sequence metrics | wave18 cancellation blueprint mapping | Cancellation / Retention -> Cost Too High funnel | ordered frequency_change -> offer -> outcome sequence | Synthflow + Stay.ai sequence join | blocked | `GET /subscriptions/business-value` metric state=`blocked_by_data` | missing | offer version join + sequence ordering | P0 | Cycle 008 (after data contract) |
| frequency_change_completion_rate / Frequency Change Completion Rate | wave18 cancellation blueprint mapping | Subscription non-cancellation actions | completed_frequency_change / requested_frequency_change | Stay.ai | partial | `GET /subscriptions/business-value` stub | missing | Stay.ai confirmation coverage | P0 | Cycle 008 |
| skip_completion_rate / Skip Completion Rate | wave18 cancellation blueprint mapping | Subscription non-cancellation actions | completed_skip / requested_skip | Stay.ai | partial | `GET /subscriptions/business-value` stub | missing | Stay.ai action completion confirmation | P0 | Cycle 008 |
| pause_completion_rate / Pause Completion Rate | wave18 cancellation blueprint mapping | Subscription non-cancellation actions | completed_pause / requested_pause | Stay.ai | partial | `GET /subscriptions/business-value` stub | missing | Stay.ai action completion confirmation | P0 | Cycle 008 |
| portal_completion_rate / Portal Completion Rate | wave20 dashboard views mapping | Subscription handling journey -> portal | confirmed_portal_completion / portal_link_sent | Portal + Stay.ai | implemented | `GET /subscriptions/outcomes`, `GET /subscriptions/analytics` | `SubscriptionOutcomesView` and `SubscriptionAnalyticsView` | Portal completion signal + Stay.ai confirmation | P0 | Cycle 007 complete |
| true_subscription_containment_rate / True Subscription Containment Rate | wave20 dashboard views mapping | Executive Overview -> containment quality | contained_without_repeat_contact / eligible_subscription_contacts | Warehouse analytics + Synthflow + Stay.ai | missing | no dedicated contract | missing | repeat contact linkage + final outcome | P0 | Cycle 008 |
| stay_ai_confirmation_coverage / Stay.ai Confirmation Coverage | wave20 metric registry mapping | Subscription source-confidence panel | confirmed_records / records_requiring_confirmation | Stay.ai | partial | `GET /subscriptions/source-health` and `GET /subscriptions/business-value` | source-health UI exists; business-value UI missing | confirmation status events and denominator definition | P0 | Cycle 007 (contract), Cycle 008 (executive view) |

## Advanced filter/export backend contract gap review

| Gap area | Current backend contract support | Gap status | Notes |
|---|---|---|---|
| cancellation reason | not exposed in subscription routes | missing | Requires filter shape in `/subscriptions/outcomes` and `/subscriptions/business-value`. |
| offer type/version | not exposed | missing | Needed for Cost Too High sequence and offer cost reconciliation. |
| subscription status | partial | partial | Final state exists, but filter contract is not exposed on route/query. |
| product/SKU | not exposed | missing | Shopify context is count-only; no SKU filterable payload. |
| match confidence | not exposed | missing | No confidence field for subscription-source matching in responses. |
| portal state | partial | partial | Link sent/completion counts exist; no filterable portal state taxonomy. |
| save/cancel/pending outcome | partial | partial | Outcome statuses present but filter contract and export manifest missing. |
| escalation state | not exposed | missing | Escalation route exists in separate module; not joined into subscription contracts. |
| repeat contact | not exposed | missing | Blocks true containment metric. |
| value range | not exposed | missing | Required for high-value risk and ROI slice filters. |
| trust label | partial | partial | Trust exists in metadata but not a queryable filter surface. |
| flow version | not exposed | missing | Needed for flow-version comparison and no-drift checks. |
| Stay.ai action/offer version | not exposed | missing | Required for sequence and offer-version reconciliations. |
| Stay.ai freshness/API state | partial | partial | Freshness and source-health status are present but not normalized into filters. |
| export manifest by widget/table/page | not exposed | missing | Export endpoints validate metadata but no per-widget manifest contract. |
| CSV/PDF support readiness | partial | partial | Export governance exists; module-specific CSV/PDF payload contracts are not defined. |
| saved views support readiness | not exposed | missing | No saved-view filter-set persistence contract in backend. |
