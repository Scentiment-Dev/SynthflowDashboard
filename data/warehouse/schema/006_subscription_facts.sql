create table if not exists analytics.fact_subscription_journey (
    journey_id text primary key,
    call_id text not null,
    customer_id text,
    subscription_id text,
    canonical_intent text not null,
    flow_branch text,
    cancel_reason text,
    action_family text not null,
    journey_started_at timestamptz,
    journey_last_event_at timestamptz,
    abandoned boolean not null default false,
    dropped_off boolean not null default false,
    unresolved boolean not null default false,
    failed_action boolean not null default false,
    transferred boolean not null default false,
    link_sent boolean not null default false,
    portal_completed boolean not null default false,
    save_confirmed boolean not null default false,
    cancelled_confirmed boolean not null default false,
    action_completed_confirmed boolean not null default false,
    has_stayai_confirmation boolean not null default false,
    trust_label text not null,
    formula_version text not null,
    calculated_at timestamptz not null default now(),
    constraint stayai_required_for_save_cancel check (
      (save_confirmed = false and cancelled_confirmed = false and action_completed_confirmed = false)
      or has_stayai_confirmation = true
    ),
    constraint link_sent_not_completion check (not (link_sent = true and portal_completed = true and has_stayai_confirmation = false and action_completed_confirmed = false))
);
