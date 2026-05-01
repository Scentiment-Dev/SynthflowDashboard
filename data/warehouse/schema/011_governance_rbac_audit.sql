create table if not exists analytics.permission_policy (
  policy_key text primary key,
  role_name text not null,
  permission_key text not null,
  explicit_deny_default boolean not null default true,
  owner text not null default 'governance',
  created_at timestamptz not null default now()
);

create table if not exists analytics.audit_log (
  audit_id text primary key,
  actor text not null,
  action text not null,
  resource text not null,
  decision text not null,
  metadata jsonb not null default '{}'::jsonb,
  fingerprint text not null,
  created_at timestamptz not null default now()
);

create table if not exists analytics.trust_label_audit (
  audit_key text primary key,
  metric_key text not null,
  requested_trust_label text not null,
  assigned_trust_label text not null,
  manual_override_requested boolean not null default false,
  allowed boolean not null default false,
  evidence_sources jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists analytics.export_audit_metadata (
  export_id text primary key,
  module text not null,
  requested_by text not null,
  filters jsonb not null,
  definitions_included boolean not null,
  trust_labels_included boolean not null,
  freshness_included boolean not null,
  formula_versions_included boolean not null,
  owner text not null,
  fingerprint text not null,
  audit_reference text not null,
  created_at timestamptz not null default now()
);
