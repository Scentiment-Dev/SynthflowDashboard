-- No-drift rule: Stay.ai is required for official subscription save/cancel/action outcomes.
select *
from {{ ref('fact_subscription_journey') }}
where (save_confirmed = true or cancelled_confirmed = true or action_completed_confirmed = true)
  and has_stayai_confirmation = false
