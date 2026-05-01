-- No-drift rule: Shopify context cannot override subscription save/cancel state.
select *
from {{ ref('stg_shopify_orders') }}
where can_override_subscription_state = true
