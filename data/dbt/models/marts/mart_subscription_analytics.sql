select
    journey_id,
    call_id,
    customer_id,
    subscription_id,
    canonical_intent,
    action_family,
    journey_started_at,
    journey_last_event_at,
    link_sent,
    portal_completed,
    action_completed_confirmed,
    has_stayai_confirmation,
    successful_subscription_containment_candidate,
    trust_label,
    formula_version,
    calculated_at
from {{ ref('fact_subscription_journey') }}
where action_family in ('non_cancel','handoff','unknown')
   or canonical_intent like 'subscription%'
