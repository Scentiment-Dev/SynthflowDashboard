-- No-drift rule: link sent is diagnostic only. It cannot be counted as portal completion.
select *
from {{ ref('mart_handoff_completion') }}
where link_sent = true
  and confirmed_portal_completion = false
  and trust_label = 'Confirmed'
