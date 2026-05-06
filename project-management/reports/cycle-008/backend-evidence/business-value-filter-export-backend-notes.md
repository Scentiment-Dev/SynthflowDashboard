# Cycle 008 Backend Evidence Notes

- Agent: Cursor Agent A (Backend / Analytics / API / Contracts)
- Model: Codex 5.3
- Date: 2026-05-06
- Branch: `agent-a/wave-01/cycle-008-business-value-filter-export-backend`

## Scope delivered

- Hardened `GET /subscriptions/business-value` contract with P0 metric family and per-metric
  business-value metadata, trust/freshness/source confirmation, plain-language guidance, and
  audit/fingerprint fields.
- Added `GET /subscriptions/advanced-filters` to return advanced filter dimensions, disabled
  reasons, source/dependency metadata, and applied filter state.
- Added `POST /subscriptions/export/preflight` for subscription export manifest/preflight with
  server-side explicit deny decision output and full metadata requirements.
- Added `GET /subscriptions/follow-up` fixture-backed action queue summary contract with
  actionability and support-user plain-language fields.

## Source-of-truth lock checks

- Stay.ai final confirmation remains required for final cancellation and retention truth.
- Shopify remains context-only and does not finalize subscription outcomes.
- Portal link sent remains distinct from confirmed portal completion.
- Trust labels remain system-calculated.
- Unknown/missing export requester role resolves to explicit deny in preflight response.

## Fixture vs live notes

- Cycle 008 contracts are fixture-backed deterministic responses.
- Revenue and ROI values are fixture-safe and states remain explicit (`confirmed`, `estimated`,
  `pending`, `unknown`, `blocked_by_data`).
- Metrics that depend on missing joins or unconfirmed data remain pending/blocked with explicit
  reasons and next actions.

## Remaining blockers

- Bugbot/Codecov status for this branch is blocked until a PR is opened and checks execute.
- `gh pr checks --watch` returns no PR for current branch, so merge-readiness checks are pending.
