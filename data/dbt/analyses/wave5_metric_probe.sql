-- Manual probe for Wave 5 validation. Run after dbt build.
select
  module,
  count(*) as metric_count,
  count(*) filter (where trust_label = 'Confirmed') as confirmed_metric_count,
  count(*) filter (where freshness_status = 'stale') as stale_metric_count,
  count(*) filter (where freshness_status = 'missing') as missing_metric_count
from {{ ref('mart_dashboard_metrics') }}
group by 1
order by 1;
