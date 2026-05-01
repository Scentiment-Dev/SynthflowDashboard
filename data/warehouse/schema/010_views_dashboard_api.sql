create or replace view analytics.v_dashboard_metrics_api as
select
    metric_key,
    module,
    metric_value,
    numerator,
    denominator,
    formula_definition,
    formula_version,
    source_of_truth,
    trust_label,
    freshness_status,
    freshness_at,
    owner,
    calculated_at
from analytics.dashboard_metric_snapshots;
