with policy as (
    select * from {{ ref('permission_policy_seed') }}
)

select
    policy_key,
    role_name,
    permission_key,
    cast(explicit_deny_default as boolean) as explicit_deny_default,
    owner
from policy
