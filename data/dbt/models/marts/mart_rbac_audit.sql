with audit_log as (
    select * from {{ source('warehouse', 'audit_log') }}
),
permission_policy as (
    select * from {{ ref('dim_permission_policy') }}
)

select
    audit_log.audit_id,
    audit_log.actor,
    audit_log.action,
    audit_log.resource,
    audit_log.decision,
    audit_log.fingerprint,
    audit_log.created_at,
    count(permission_policy.policy_key) as known_policy_rows
from audit_log
left join permission_policy on true
group by 1,2,3,4,5,6,7
