create table if not exists governance.data_quality_audit (
    audit_id bigserial primary key,
    model_name text not null,
    test_name text not null,
    severity text not null check (severity in ('warn','error','blocker')),
    status text not null check (status in ('pass','fail','skipped')),
    failed_row_count integer,
    notes text,
    checked_at timestamptz not null default now()
);

create table if not exists governance.trust_label_audit (
    audit_id bigserial primary key,
    metric_key text not null,
    calculated_trust_label text not null,
    evidence_summary jsonb not null default '{}'::jsonb,
    manual_override_attempted boolean not null default false,
    checked_at timestamptz not null default now(),
    constraint block_manual_trust_elevation check (manual_override_attempted = false)
);
