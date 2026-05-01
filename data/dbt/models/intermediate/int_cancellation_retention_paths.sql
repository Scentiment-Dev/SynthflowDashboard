with journeys as (
    select * from {{ ref('int_subscription_journeys') }}
    where action_family in ('cancellation','retention')
       or canonical_intent in ('subscription_cancel','cancellation','cancel_subscription')
),
offers as (
    select * from {{ ref('int_retention_offer_events') }}
)
select
    j.journey_id,
    j.call_id,
    j.customer_id,
    j.subscription_id,
    j.canonical_intent,
    j.flow_branch,
    j.cancel_reason,
    j.journey_started_at,
    j.journey_last_event_at,
    j.abandoned,
    j.dropped_off,
    j.unresolved,
    j.failed_action,
    j.transferred,
    j.link_sent,
    j.portal_completed,
    j.save_confirmed,
    j.cancelled_confirmed,
    j.has_stayai_confirmation,
    o.retention_started_at,
    coalesce(o.frequency_offer_first_at is not null, false) as frequency_offer_presented,
    coalesce(o.discount_offer_first_at is not null, false) as discount_offer_presented,
    coalesce(o.frequency_offer_accepted, false) as frequency_offer_accepted,
    coalesce(o.discount_offer_accepted, false) as discount_offer_accepted,
    coalesce(o.frequency_offer_declined, false) as frequency_offer_declined,
    coalesce(o.discount_offer_declined, false) as discount_offer_declined,
    coalesce(o.is_cost_too_high_path, j.flow_branch = 'cost_too_high') as is_cost_too_high_path,
    coalesce(o.cost_too_high_sequence_valid, j.flow_branch <> 'cost_too_high') as cost_too_high_sequence_valid,
    case
      when j.save_confirmed then 'saved'
      when j.cancelled_confirmed then 'cancelled'
      when j.portal_completed then 'portal_completed_pending_official_subscription_outcome'
      when j.link_sent then 'link_sent_only'
      when j.abandoned or j.dropped_off then 'abandoned_or_dropped'
      when j.unresolved then 'unresolved'
      else 'pending_confirmation'
    end as final_retention_outcome,
    j.trust_label
from journeys j
left join offers o on o.journey_id = j.journey_id
