select
    source_name,
    last_seen_at,
    freshness_sla_hours,
    freshness_status,
    case
      when freshness_status = 'fresh' then 'Confirmed'
      when freshness_status = 'stale' then 'Stale'
      else 'Missing'
    end as trust_label,
    current_timestamp as calculated_at
from {{ ref('int_source_freshness') }}
