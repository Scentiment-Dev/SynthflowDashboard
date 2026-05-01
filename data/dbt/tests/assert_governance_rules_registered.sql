-- Fails if core governance launch blockers are missing from the registry.
with required as (
    select 'default_explicit_deny' as rule_key union all
    select 'trust_labels_system_calculated' union all
    select 'export_metadata_required' union all
    select 'backfill_governed_only'
), registered as (
    select rule_key from {{ ref('dim_governance_rule_registry') }}
)
select required.rule_key
from required
left join registered using (rule_key)
where registered.rule_key is null
