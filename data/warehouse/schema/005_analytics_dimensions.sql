create schema if not exists analytics;
create schema if not exists governance;

create table if not exists analytics.dim_metric_registry (
    metric_key text primary key,
    metric_id text not null unique,
    display_name text not null,
    module text not null,
    metric_category text not null,
    formula_definition text not null,
    primary_source text not null,
    source_of_truth_rule text not null,
    trust_rule text not null,
    formula_version text not null,
    owner text not null,
    qa_case_ids text,
    is_p0 boolean not null default false,
    dashboard_visible boolean not null default true
);

create table if not exists analytics.dim_source_truth_matrix (
    domain text primary key,
    source_of_truth text not null,
    allowed_to_confirm text not null,
    forbidden_override text not null,
    rule text not null,
    trust_label_when_missing text not null
);

create table if not exists analytics.dim_trust_label_registry (
    trust_label text primary key,
    rank integer not null,
    meaning text not null,
    can_be_manual boolean not null default false,
    display_policy text not null,
    constraint trust_labels_not_manual check (can_be_manual = false)
);
