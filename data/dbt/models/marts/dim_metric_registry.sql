select
    metric_key,
    metric_id,
    display_name,
    module,
    metric_category,
    formula_definition,
    primary_source,
    source_of_truth_rule,
    trust_rule,
    formula_version,
    owner,
    qa_case_ids,
    is_p0,
    dashboard_visible
from {{ ref('metric_registry_seed') }}
