-- No-drift rule: Cost Too High flow sequence is frequency change offer -> 25% off offer -> cancellation if both declined.
select *
from {{ ref('mart_retention_analytics') }}
where is_cost_too_high_path = true
  and cost_too_high_sequence_valid = false
