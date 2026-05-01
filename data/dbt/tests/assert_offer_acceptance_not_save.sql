-- No-drift rule: offer acceptance is not a save unless Stay.ai confirms retained subscription outcome.
select *
from {{ ref('mart_retention_analytics') }}
where (frequency_offer_accepted = true or discount_offer_accepted = true)
  and save_confirmed = false
  and final_retention_outcome = 'saved'
