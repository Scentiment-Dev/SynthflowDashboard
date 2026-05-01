select
    event_id,
    call_id,
    event_source,
    event_type,
    occurred_at,
    transfer_connected,
    queue_abandoned,
    resolution_status,
    escalation_connected,
    downstream_resolution_confirmed,
    case when downstream_resolution_confirmed then 'Confirmed' when escalation_connected then 'Partial Evidence' else 'Missing' end as trust_label,
    '{{ var("formula_version") }}' as formula_version,
    current_timestamp as calculated_at
from {{ ref('stg_live_agent_escalations') }}
