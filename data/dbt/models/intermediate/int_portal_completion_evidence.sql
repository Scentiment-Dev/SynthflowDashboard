select
    portal_session_id,
    call_id,
    subscription_id,
    min(occurred_at) filter (where link_sent) as first_link_sent_at,
    min(occurred_at) filter (where confirmed_portal_completion) as first_confirmed_completion_at,
    {{ bool_or_int("link_sent") }} as link_sent,
    {{ bool_or_int("confirmed_portal_completion") }} as confirmed_portal_completion,
    {{ bool_or_int("official_completion") }} as official_completion_seen,
    count(*) as portal_event_count
from {{ ref('stg_portal_events') }}
group by 1,2,3
