-- This test protects export-ready metrics by ensuring audit metadata fields exist in the dashboard metric mart.
select *
from {{ ref('mart_dashboard_metrics') }}
where metric_key is null
   or formula_version is null
   or trust_label is null
   or calculated_at is null
