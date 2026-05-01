select
    metric_key,
    module,
    trust_rule,
    source_of_truth,
    formula_version,
    false as manual_trust_elevation_allowed,
    'system_calculated_only' as trust_label_authority,
    current_timestamp as audited_at
from {{ ref('dim_metric_registry') }}
