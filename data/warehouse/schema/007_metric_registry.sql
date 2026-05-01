create table if not exists analytics.metric_formula_versions (
    formula_version text primary key,
    locked_at date not null,
    scope text not null,
    notes text not null
);

create table if not exists analytics.dashboard_metric_snapshots (
    snapshot_id bigserial primary key,
    metric_key text not null,
    module text not null,
    metric_value numeric,
    numerator numeric,
    denominator numeric,
    formula_definition text not null,
    formula_version text not null,
    source_of_truth text not null,
    trust_label text not null check (trust_label in ('Confirmed','Pending Confirmation','Partial Evidence','Stale','Missing','Conflicting','Unverified')),
    freshness_status text not null check (freshness_status in ('fresh','stale','missing')),
    freshness_at timestamptz,
    owner text not null,
    calculated_at timestamptz not null default now(),
    manual_trust_elevation_allowed boolean not null default false,
    constraint no_manual_trust_elevation check (manual_trust_elevation_allowed = false)
);
