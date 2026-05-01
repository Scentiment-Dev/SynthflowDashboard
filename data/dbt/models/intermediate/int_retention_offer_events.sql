with offers as (
    select
        journey_id,
        call_id,
        customer_id,
        subscription_id,
        cancel_reason,
        flow_branch,
        offer_type,
        offer_status,
        occurred_at,
        event_type,
        retention_funnel_started,
        case when offer_type = 'frequency_change' and offer_status in ('presented','accepted','declined') then occurred_at end as frequency_offer_at,
        case when offer_type in ('discount_25_percent','25_percent_discount','discount') and offer_status in ('presented','accepted','declined') then occurred_at end as discount_offer_at,
        case when offer_type = 'frequency_change' and offer_status = 'accepted' then true else false end as frequency_offer_accepted,
        case when offer_type in ('discount_25_percent','25_percent_discount','discount') and offer_status = 'accepted' then true else false end as discount_offer_accepted,
        case when offer_type = 'frequency_change' and offer_status = 'declined' then true else false end as frequency_offer_declined,
        case when offer_type in ('discount_25_percent','25_percent_discount','discount') and offer_status = 'declined' then true else false end as discount_offer_declined
    from {{ ref('stg_synthflow_calls') }}
    where retention_funnel_started
       or offer_type in ('frequency_change','discount_25_percent','25_percent_discount','discount')
       or flow_branch = 'cost_too_high'
),
rolled as (
    select
        journey_id,
        call_id,
        customer_id,
        subscription_id,
        min(occurred_at) as retention_started_at,
        max(cancel_reason) as cancel_reason,
        max(flow_branch) as flow_branch,
        min(frequency_offer_at) as frequency_offer_first_at,
        min(discount_offer_at) as discount_offer_first_at,
        {{ bool_or_int("frequency_offer_accepted") }} as frequency_offer_accepted,
        {{ bool_or_int("discount_offer_accepted") }} as discount_offer_accepted,
        {{ bool_or_int("frequency_offer_declined") }} as frequency_offer_declined,
        {{ bool_or_int("discount_offer_declined") }} as discount_offer_declined
    from offers
    group by 1,2,3,4
)
select
    *,
    flow_branch = 'cost_too_high' as is_cost_too_high_path,
    case
      when flow_branch <> 'cost_too_high' then true
      when frequency_offer_first_at is not null and discount_offer_first_at is not null and frequency_offer_first_at <= discount_offer_first_at then true
      when frequency_offer_first_at is not null and discount_offer_first_at is null then true
      else false
    end as cost_too_high_sequence_valid
from rolled
