# Export Requirements

Every export must include filters, definitions, trust labels, freshness, formula versions, owner, timestamp, fingerprint, and audit reference.

## Cycle 008 subscription preflight requirements

- Export preflight response must include:
  - `export_allowed`
  - `blocked_reason`
  - `requested_scope`
  - `requested_format`
  - `filters`
  - `comparison_period`
  - `metric_definitions`
  - `trust_labels`
  - `freshness`
  - `formula_versions`
  - `owner`
  - `timestamp`
  - `fingerprint`
  - `audit_reference`
  - `requester_role`
  - `permission_decision`
  - `source_confirmation_status`
  - `included_widgets`
  - `excluded_widgets`
  - `missing_required_metadata`
- Missing or unknown requester role must resolve to server-side explicit deny.
- Permission decisions are contract fields and cannot be inferred only by HTTP status.
