select
    portal_session_id,
    call_id,
    subscription_id,
    first_link_sent_at,
    first_confirmed_completion_at,
    link_sent,
    confirmed_portal_completion,
    official_completion_seen,
    portal_event_count,
    case
      when confirmed_portal_completion then 'Confirmed'
      when link_sent then 'Partial Evidence'
      else 'Missing'
    end as trust_label,
    '{{ var("formula_version") }}' as formula_version,
    current_timestamp as calculated_at
from {{ ref('int_portal_completion_evidence') }}
