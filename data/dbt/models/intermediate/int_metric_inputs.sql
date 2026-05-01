with retention as (
    select * from {{ ref('int_cancellation_retention_paths') }}
),
subscription as (
    select * from {{ ref('int_subscription_journeys') }}
),
containment as (
    select * from {{ ref('int_containment_abandonment') }}
),
order_status as (
    select * from {{ ref('int_order_status_outcomes') }}
)
select 'subscription_request_volume' as metric_key, count(distinct journey_id)::numeric as numerator, 1::numeric as denominator, 'count' as metric_type from subscription
union all select 'subscription_save_rate', count(*) filter (where save_confirmed)::numeric, nullif(count(*),0)::numeric, 'rate' from retention
union all select 'confirmed_cancellation_rate', count(*) filter (where cancelled_confirmed)::numeric, nullif(count(*),0)::numeric, 'rate' from retention
union all select 'frequency_offer_acceptance_rate', count(*) filter (where frequency_offer_accepted)::numeric, nullif(count(*) filter (where frequency_offer_presented),0)::numeric, 'rate' from retention
union all select 'discount_offer_acceptance_rate', count(*) filter (where discount_offer_accepted)::numeric, nullif(count(*) filter (where discount_offer_presented),0)::numeric, 'rate' from retention
union all select 'portal_completion_rate', count(*) filter (where portal_completed)::numeric, nullif(count(*) filter (where link_sent),0)::numeric, 'rate' from subscription
union all select 'automation_containment_rate', count(*) filter (where containment_success_candidate)::numeric, nullif(count(*),0)::numeric, 'rate' from containment where not abandoned and not dropped_off
union all select 'unresolved_subscription_call_rate', count(*) filter (where unresolved)::numeric, nullif(count(*),0)::numeric, 'rate' from subscription
union all select 'order_status_resolution_rate', count(*) filter (where order_status_resolved_with_shopify_context)::numeric, nullif(count(*),0)::numeric, 'rate' from order_status
