select
    c.journey_id,
    c.call_id,
    c.customer_id,
    c.order_id as synthflow_order_id,
    o.order_id,
    o.order_name,
    o.fulfillment_status,
    o.shipping_method,
    o.has_preorder_tag,
    o.is_order_source_of_truth,
    o.order_id is not null as shopify_context_found,
    c.abandoned,
    c.dropped_off,
    c.unresolved,
    case
      when c.abandoned or c.dropped_off or c.unresolved then false
      when o.order_id is not null then true
      else false
    end as order_status_resolved_with_shopify_context
from {{ ref('stg_synthflow_calls') }} c
left join {{ ref('stg_shopify_orders') }} o
  on o.order_id = c.order_id or (o.customer_id = c.customer_id and c.order_id is null)
where c.canonical_intent = 'order_status'
