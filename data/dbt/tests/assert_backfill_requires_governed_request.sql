-- Fails if backfill rows are approved without approved_change_request_id.
select *
from analytics.backfill_control
where status in ('approved', 'running', 'completed')
  and (approved_change_request_id is null or approved_change_request_id = '')
