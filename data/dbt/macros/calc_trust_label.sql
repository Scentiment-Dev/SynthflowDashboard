{% macro calc_trust_label(confirmed_expr, partial_expr='false', stale_expr='false', conflict_expr='false') -%}
    case
      when {{ conflict_expr }} then 'Conflicting'
      when {{ stale_expr }} then 'Stale'
      when {{ confirmed_expr }} then 'Confirmed'
      when {{ partial_expr }} then 'Partial Evidence'
      else 'Missing'
    end
{%- endmacro %}
