-- Fails if an export is considered governance-compliant without fingerprint and audit reference.
select *
from {{ ref('mart_export_audit_governance') }}
where export_governance_compliant = true
  and (fingerprint is null or fingerprint = '' or audit_reference is null or audit_reference = '')
