create schema if not exists raw;

create table if not exists raw.synthflow_call_events (
    event_id text primary key,
    source text not null default 'synthflow',
    call_id text not null,
    event_type text not null,
    occurred_at timestamptz not null,
    raw_payload jsonb not null default '{}'::jsonb,
    raw_payload_hash text,
    payload jsonb not null default '{}'::jsonb,
    ingested_at timestamptz not null default now()
);

create table if not exists raw.stayai_subscription_events (
    event_id text primary key,
    source text not null default 'stayai',
    subscription_id text not null,
    customer_id text,
    event_type text not null,
    occurred_at timestamptz not null,
    raw_payload jsonb not null default '{}'::jsonb,
    raw_payload_hash text,
    payload jsonb not null default '{}'::jsonb,
    ingested_at timestamptz not null default now()
);

create table if not exists raw.shopify_order_context (
    order_id text primary key,
    source text not null default 'shopify',
    order_name text,
    customer_id text,
    created_at timestamptz not null,
    processed_at timestamptz,
    tags text[] default '{}',
    shipping_method text,
    fulfillment_status text,
    raw_payload jsonb not null default '{}'::jsonb,
    raw_payload_hash text,
    payload jsonb not null default '{}'::jsonb,
    ingested_at timestamptz not null default now()
);

create table if not exists raw.portal_completion_events (
    event_id text primary key,
    source text not null default 'portal',
    portal_session_id text not null,
    call_id text,
    subscription_id text,
    event_type text not null,
    occurred_at timestamptz not null,
    completed boolean not null default false,
    raw_payload jsonb not null default '{}'::jsonb,
    raw_payload_hash text,
    payload jsonb not null default '{}'::jsonb,
    ingested_at timestamptz not null default now()
);

create table if not exists raw.live_agent_escalation_events (
    event_id text primary key,
    source text not null default 'live_agent',
    call_id text not null,
    event_type text not null,
    occurred_at timestamptz not null,
    transfer_connected boolean not null default false,
    queue_abandoned boolean not null default false,
    resolution_status text,
    raw_payload jsonb not null default '{}'::jsonb,
    raw_payload_hash text,
    payload jsonb not null default '{}'::jsonb,
    ingested_at timestamptz not null default now()
);
