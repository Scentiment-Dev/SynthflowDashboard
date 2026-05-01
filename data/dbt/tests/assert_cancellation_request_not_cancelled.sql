-- No-drift rule: cancellation request alone is not confirmed cancellation.
select *
from {{ ref('mart_retention_analytics') }}
where canonical_intent in ('subscription_cancel','cancellation','cancel_subscription')
  and cancelled_confirmed = false
  and final_retention_outcome = 'cancelled'
