create table if not exists governance.backfill_requests (
    backfill_id text primary key,
    requested_by text not null,
    scope text not null,
    reason text not null,
    status text not null check (status in ('requested','approved','running','completed','rejected','failed')),
    approval_reference text,
    requested_at timestamptz not null default now(),
    approved_at timestamptz,
    completed_at timestamptz
);

comment on table governance.backfill_requests is 'Historical backfill is not base launch scope unless handled through this governed request/reprocess pipeline.';
