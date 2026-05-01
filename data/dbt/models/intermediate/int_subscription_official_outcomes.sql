select
    subscription_id,
    customer_id,
    call_id,
    portal_session_id,
    min(occurred_at) as first_official_outcome_at,
    max(occurred_at) as latest_official_outcome_at,
    {{ bool_or_int("confirms_retained_subscription") }} as save_confirmed,
    {{ bool_or_int("confirms_cancelled_subscription") }} as cancelled_confirmed,
    {{ bool_or_int("confirms_action_completed") }} as action_completed_confirmed,
    string_agg(distinct confirmed_state, ', ' order by confirmed_state) as official_states_seen,
    string_agg(distinct action_type, ', ' order by action_type) as action_types_seen,
    'Stay.ai'::text as source_of_truth,
    true as has_stayai_confirmation
from {{ ref('stg_stayai_subscriptions') }}
group by 1,2,3,4
