with inputs as (
    select * from {{ ref('int_metric_inputs') }}
),
registry as (
    select * from {{ ref('dim_metric_registry') }}
),
freshness as (
    select
        case
          when source_name = 'stayai' then 'Stay.ai'
          when source_name = 'synthflow' then 'Synthflow'
          when source_name = 'shopify' then 'Shopify'
          when source_name = 'portal' then 'Portal/Stay.ai'
          else source_name
        end as source_match,
        min(freshness_status) as freshness_status,
        max(last_seen_at) as freshness_at
    from {{ ref('mart_source_freshness') }}
    group by 1
)
select
    r.metric_key,
    r.metric_id,
    r.display_name,
    r.module,
    r.metric_category,
    coalesce(i.numerator, 0) as numerator,
    i.denominator,
    case
      when i.metric_type = 'count' then coalesce(i.numerator, 0)
      else {{ safe_divide('coalesce(i.numerator, 0)', 'i.denominator') }}
    end as metric_value,
    r.formula_definition,
    r.formula_version,
    r.primary_source as source_of_truth,
    r.source_of_truth_rule,
    r.trust_rule,
    case
      when r.metric_key in ('subscription_save_rate','confirmed_cancellation_rate') and r.primary_source ilike '%Stay.ai%' then 'Confirmed'
      when r.metric_key = 'portal_completion_rate' then 'Confirmed'
      when r.metric_key = 'automation_containment_rate' then 'Confirmed'
      else 'Partial Evidence'
    end as trust_label,
    coalesce(f.freshness_status, 'missing') as freshness_status,
    f.freshness_at,
    r.owner,
    current_timestamp as calculated_at,
    false as manual_trust_elevation_allowed
from registry r
left join inputs i on i.metric_key = r.metric_key
left join freshness f on r.primary_source ilike '%' || f.source_match || '%'
where r.dashboard_visible
