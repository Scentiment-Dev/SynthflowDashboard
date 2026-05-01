with raw_events as (
    select
        event_id,
        subscription_id,
        customer_id,
        event_type,
        occurred_at,
        payload,
        lower(coalesce(payload->>'action_type', payload->>'action', event_type)) as action_type,
        lower(coalesce(payload->>'confirmed_state', payload->>'subscription_state')) as confirmed_state,
        lower(coalesce(payload->>'outcome', payload->>'action_outcome')) as action_outcome,
        lower(coalesce(payload->>'cancellation_reason', payload->>'cancel_reason')) as cancellation_reason,
        payload->>'portal_session_id' as portal_session_id,
        payload->>'call_id' as call_id,
        coalesce((payload->>'official_confirmation')::boolean, true) as official_confirmation
    from {{ source('raw', 'stayai_subscription_events') }}
),
normalized as (
    select
        event_id,
        subscription_id,
        customer_id,
        call_id,
        portal_session_id,
        'stayai'::text as event_source,
        event_type,
        occurred_at,
        action_type,
        confirmed_state,
        action_outcome,
        cancellation_reason,
        official_confirmation,
        official_confirmation and confirmed_state in ('active','retained','saved') as confirms_retained_subscription,
        official_confirmation and confirmed_state = 'cancelled' as confirms_cancelled_subscription,
        official_confirmation and action_outcome in ('completed','success','confirmed') as confirms_action_completed,
        payload,
        true as is_subscription_source_of_truth
    from raw_events
)
select * from normalized
