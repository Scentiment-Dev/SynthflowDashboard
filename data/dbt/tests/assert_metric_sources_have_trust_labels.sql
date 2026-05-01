select *
from {{ ref('mart_dashboard_metrics') }}
where trust_label is null
   or freshness_status is null
   or source_of_truth is null
