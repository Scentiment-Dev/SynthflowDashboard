select
    order_id,
    order_name,
    customer_id,
    'shopify'::text as event_source,
    created_at,
    processed_at,
    tags,
    shipping_method,
    fulfillment_status,
    case when tags::text ilike '%pre-order%' or tags::text ilike '%preorder%' or tags::text ilike '%pre order%' then true else false end as has_preorder_tag,
    payload,
    true as is_order_source_of_truth,
    false as can_override_subscription_state
from {{ source('raw', 'shopify_order_context') }}
