-- No-drift rule: abandoned, dropped-off, and unresolved calls must be excluded from successful containment.
select *
from {{ ref('int_containment_abandonment') }}
where (abandoned = true or dropped_off = true or unresolved = true or failed_action = true)
  and containment_success_candidate = true
