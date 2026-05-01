with exports as (
    select * from {{ source('warehouse', 'export_audit_metadata') }}
)

select
    export_id,
    module,
    requested_by,
    created_at,
    case
        when filters is null then false
        when definitions_included is not true then false
        when trust_labels_included is not true then false
        when freshness_included is not true then false
        when formula_versions_included is not true then false
        when owner is null or owner = '' then false
        when fingerprint is null or fingerprint = '' then false
        when audit_reference is null or audit_reference = '' then false
        else true
    end as export_governance_compliant,
    fingerprint,
    audit_reference
from exports
