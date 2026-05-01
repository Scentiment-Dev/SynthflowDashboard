select
    journey_id,
    call_id,
    canonical_intent,
    action_family,
    abandoned,
    dropped_off,
    unresolved,
    failed_action,
    transferred,
    link_sent,
    portal_completed,
    action_completed_confirmed,
    save_confirmed,
    cancelled_confirmed,
    case
      when abandoned or dropped_off or unresolved or failed_action then false
      when transferred and not action_completed_confirmed and not portal_completed then false
      when link_sent and not portal_completed and not action_completed_confirmed then false
      when action_completed_confirmed or portal_completed or save_confirmed or cancelled_confirmed then true
      else false
    end as containment_success_candidate,
    case
      when abandoned or dropped_off then 'abandoned_dropoff_excluded'
      when unresolved then 'unresolved_excluded'
      when failed_action then 'failed_action_excluded'
      when transferred and not action_completed_confirmed and not portal_completed then 'escalation_only_excluded'
      when link_sent and not portal_completed and not action_completed_confirmed then 'link_sent_only_excluded'
      when action_completed_confirmed or portal_completed or save_confirmed or cancelled_confirmed then 'confirmed_success'
      else 'pending_or_missing_confirmation'
    end as containment_reason
from {{ ref('int_subscription_journeys') }}
