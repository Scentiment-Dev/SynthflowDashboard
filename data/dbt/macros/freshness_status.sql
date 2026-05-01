{% macro freshness_status(last_seen_expr, sla_hours_expr) -%}
    case
      when {{ last_seen_expr }} is null then 'missing'
      when {{ last_seen_expr }} < (current_timestamp - (({{ sla_hours_expr }})::text || ' hours')::interval) then 'stale'
      else 'fresh'
    end
{%- endmacro %}
