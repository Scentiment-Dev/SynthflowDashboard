select *
from {{ ref('mart_source_freshness') }}
where freshness_status not in ('fresh','stale','missing')
   or trust_label not in ('Confirmed','Stale','Missing')
