-- Fails if manual trust label override is allowed.
select *
from {{ source('warehouse', 'trust_label_audit') }}
where manual_override_requested is true
  and allowed is true
