-- Fails if any permission policy row disables explicit-deny defaults.
select *
from {{ ref('dim_permission_policy') }}
where explicit_deny_default is not true
