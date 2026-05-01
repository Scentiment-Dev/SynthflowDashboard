-- No-drift rule: trust labels are system-calculated and cannot be manually elevated.
select *
from {{ ref('mart_dashboard_metrics') }}
where manual_trust_elevation_allowed = true
