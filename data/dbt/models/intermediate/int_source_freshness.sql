with source_max as (
    select 'synthflow' as source_name, max(occurred_at) as last_seen_at, {{ var('freshness_sla_hours')['synthflow'] }} as freshness_sla_hours from {{ ref('stg_synthflow_calls') }}
    union all select 'stayai', max(occurred_at), {{ var('freshness_sla_hours')['stayai'] }} from {{ ref('stg_stayai_subscriptions') }}
    union all select 'shopify', max(created_at), {{ var('freshness_sla_hours')['shopify'] }} from {{ ref('stg_shopify_orders') }}
    union all select 'portal', max(occurred_at), {{ var('freshness_sla_hours')['portal'] }} from {{ ref('stg_portal_events') }}
    union all select 'live_agent', max(occurred_at), {{ var('freshness_sla_hours')['live_agent'] }} from {{ ref('stg_live_agent_escalations') }}
)
select
    source_name,
    last_seen_at,
    freshness_sla_hours,
    {{ freshness_status('last_seen_at', 'freshness_sla_hours') }} as freshness_status,
    current_timestamp as calculated_at
from source_max
