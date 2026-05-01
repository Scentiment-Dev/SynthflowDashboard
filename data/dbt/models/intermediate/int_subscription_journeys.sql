with attempts as (
    select
        journey_id,
        call_id,
        customer_id,
        subscription_id,
        canonical_intent,
        flow_branch,
        cancel_reason,
        action_family,
        min(journey_started_at) as journey_started_at,
        max(journey_last_event_at) as journey_last_event_at,
        {{ bool_or_int("abandoned") }} as abandoned,
        {{ bool_or_int("dropped_off") }} as dropped_off,
        {{ bool_or_int("unresolved") }} as unresolved,
        {{ bool_or_int("failed_action") }} as failed_action,
        {{ bool_or_int("transferred") }} as transferred,
        {{ bool_or_int("link_sent") }} as link_sent
    from {{ ref('int_subscription_action_attempts') }}
    where canonical_intent like 'subscription%'
       or action_family in ('non_cancel','cancellation','retention','handoff')
    group by 1,2,3,4,5,6,7,8
),
portal as (
    select * from {{ ref('int_portal_completion_evidence') }}
),
outcomes as (
    select * from {{ ref('int_subscription_official_outcomes') }}
)
select
    a.journey_id,
    a.call_id,
    a.customer_id,
    coalesce(a.subscription_id, p.subscription_id, o.subscription_id) as subscription_id,
    a.canonical_intent,
    a.flow_branch,
    a.cancel_reason,
    a.action_family,
    a.journey_started_at,
    a.journey_last_event_at,
    a.abandoned,
    a.dropped_off,
    a.unresolved,
    a.failed_action,
    a.transferred,
    a.link_sent,
    coalesce(p.confirmed_portal_completion, false) as portal_completed,
    coalesce(o.save_confirmed, false) as save_confirmed,
    coalesce(o.cancelled_confirmed, false) as cancelled_confirmed,
    coalesce(o.action_completed_confirmed, false) as action_completed_confirmed,
    coalesce(o.has_stayai_confirmation, false) as has_stayai_confirmation,
    o.source_of_truth as subscription_outcome_source,
    case
      when a.abandoned or a.dropped_off or a.unresolved or a.failed_action then false
      when a.transferred and not coalesce(p.confirmed_portal_completion, false) and not coalesce(o.action_completed_confirmed, false) then false
      when a.link_sent and not coalesce(p.confirmed_portal_completion, false) and not coalesce(o.action_completed_confirmed, false) then false
      when coalesce(o.action_completed_confirmed, false) or coalesce(p.confirmed_portal_completion, false) then true
      else false
    end as successful_subscription_containment_candidate,
    {{ calc_trust_label("coalesce(o.has_stayai_confirmation, false) or coalesce(p.confirmed_portal_completion, false)", "a.link_sent or a.transferred", "false", "false") }} as trust_label
from attempts a
left join portal p on p.call_id = a.call_id
left join outcomes o on o.subscription_id = coalesce(a.subscription_id, p.subscription_id)
