with rules as (
    select * from {{ ref('governance_rule_registry_seed') }}
)

select
    rule_key,
    rule_text,
    owner,
    cast(launch_blocker_if_missing as boolean) as launch_blocker_if_missing
from rules
