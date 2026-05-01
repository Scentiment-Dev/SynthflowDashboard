select
    event_id,
    call_id,
    'live_agent'::text as event_source,
    event_type,
    occurred_at,
    transfer_connected,
    queue_abandoned,
    lower(coalesce(resolution_status, payload->>'resolution_status', 'unknown')) as resolution_status,
    payload,
    transfer_connected and not queue_abandoned as escalation_connected,
    resolution_status in ('resolved','completed','closed') as downstream_resolution_confirmed
from {{ source('raw', 'live_agent_escalation_events') }}
