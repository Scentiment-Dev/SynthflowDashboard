select *
from {{ ref('mart_dashboard_metrics') }}
where formula_version is null
   or formula_version = ''
   or source_of_truth is null
   or owner is null
   or calculated_at is null
