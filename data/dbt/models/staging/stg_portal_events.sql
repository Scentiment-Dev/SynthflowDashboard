select
    event_id,
    portal_session_id,
    call_id,
    subscription_id,
    'portal'::text as event_source,
    event_type,
    occurred_at,
    completed,
    coalesce((payload->>'official_completion')::boolean, completed) as official_completion,
    event_type in ('handoff_link_sent','portal_link_sent','link_sent') as link_sent,
    completed = true and event_type in ('portal_completed','handoff_completed','self_service_completed') as confirmed_portal_completion,
    payload
from {{ source('raw', 'portal_completion_events') }}
