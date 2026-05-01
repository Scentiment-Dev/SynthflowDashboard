select
    subscription_id,
    customer_id,
    call_id,
    portal_session_id,
    first_official_outcome_at,
    latest_official_outcome_at,
    save_confirmed,
    cancelled_confirmed,
    action_completed_confirmed,
    official_states_seen,
    action_types_seen,
    source_of_truth,
    has_stayai_confirmation,
    case
      when save_confirmed or cancelled_confirmed or action_completed_confirmed then 'Confirmed'
      else 'Missing'
    end as trust_label,
    '{{ var("formula_version") }}' as formula_version,
    current_timestamp as calculated_at
from {{ ref('int_subscription_official_outcomes') }}
