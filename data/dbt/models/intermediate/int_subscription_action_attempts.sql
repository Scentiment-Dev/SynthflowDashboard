with journey_events as (
    select
        journey_id,
        call_id,
        customer_id,
        subscription_id,
        canonical_intent,
        flow_branch,
        cancel_reason,
        offer_type,
        offer_status,
        event_type,
        occurred_at,
        link_sent,
        abandoned,
        dropped_off,
        unresolved,
        failed_action,
        transferred
    from {{ ref('stg_synthflow_calls') }}
),
classified as (
    select
        journey_id,
        call_id,
        customer_id,
        subscription_id,
        canonical_intent,
        flow_branch,
        cancel_reason,
        offer_type,
        offer_status,
        min(occurred_at) over (partition by journey_id) as journey_started_at,
        max(occurred_at) over (partition by journey_id) as journey_last_event_at,
        case
          when canonical_intent in ('change_frequency','skip_subscription','pause_subscription','subscription_update') then 'non_cancel'
          when canonical_intent in ('subscription_cancel','cancellation','cancel_subscription') then 'cancellation'
          when event_type like 'retention_%' or offer_type in ('frequency_change','discount_25_percent') then 'retention'
          when link_sent then 'handoff'
          else 'unknown'
        end as action_family,
        abandoned,
        dropped_off,
        unresolved,
        failed_action,
        transferred,
        link_sent
    from journey_events
)
select distinct * from classified
