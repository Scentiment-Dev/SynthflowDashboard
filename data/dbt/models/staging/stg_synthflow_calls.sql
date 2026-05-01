with raw_events as (
    select
        event_id,
        call_id,
        event_type,
        occurred_at,
        payload,
        payload->>'journey_id' as journey_id,
        coalesce(payload->>'customer_id', payload->>'shopify_customer_id') as customer_id,
        payload->>'subscription_id' as subscription_id,
        payload->>'order_id' as order_id,
        coalesce(payload->>'intent', payload->>'primary_intent') as canonical_intent,
        coalesce(payload->>'branch', payload->>'flow_branch') as flow_branch,
        payload->>'cancel_reason' as cancel_reason,
        payload->>'offer_type' as offer_type,
        payload->>'offer_status' as offer_status,
        coalesce((payload->>'abandoned')::boolean, false) as abandoned,
        coalesce((payload->>'dropped_off')::boolean, false) as dropped_off,
        coalesce((payload->>'unresolved')::boolean, false) as unresolved,
        coalesce((payload->>'transferred')::boolean, false) as transferred,
        coalesce((payload->>'failed_action')::boolean, false) as failed_action,
        coalesce((payload->>'link_sent')::boolean, event_type in ('handoff_link_sent','portal_link_sent')) as link_sent,
        coalesce((payload->>'retention_funnel_started')::boolean, event_type='retention_funnel_started') as retention_funnel_started,
        payload->>'classifier_confidence' as classifier_confidence_raw
    from {{ source('raw', 'synthflow_call_events') }}
),
normalized as (
    select
        event_id,
        call_id,
        coalesce(journey_id, call_id) as journey_id,
        'synthflow'::text as event_source,
        event_type,
        occurred_at,
        customer_id,
        subscription_id,
        order_id,
        lower(coalesce(canonical_intent, 'unknown')) as canonical_intent,
        lower(coalesce(flow_branch, 'unknown')) as flow_branch,
        lower(coalesce(cancel_reason, 'unknown')) as cancel_reason,
        lower(coalesce(offer_type, 'none')) as offer_type,
        lower(coalesce(offer_status, 'none')) as offer_status,
        abandoned,
        dropped_off,
        unresolved,
        transferred,
        failed_action,
        link_sent,
        retention_funnel_started,
        case
          when classifier_confidence_raw ~ '^[0-9]+(\.[0-9]+)?$' then classifier_confidence_raw::numeric
          else null
        end as classifier_confidence,
        payload,
        false as confirms_subscription_outcome,
        true as is_journey_source
    from raw_events
)
select * from normalized
