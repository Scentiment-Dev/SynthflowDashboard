{% macro bool_or_int(expression) -%}
    max(case when {{ expression }} then 1 else 0 end) = 1
{%- endmacro %}
