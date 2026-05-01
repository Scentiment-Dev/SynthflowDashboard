select
    *,
    '{{ var("formula_version") }}' as formula_version,
    current_timestamp as calculated_at
from {{ ref('int_cancellation_retention_paths') }}
