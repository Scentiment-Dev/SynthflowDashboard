# Codecov Project Status Governance Note (Path A)

## Decision

- Date: 2026-05-01
- Scope: Cycle 001 governance unblock
- Decision: enforce emitted blocking checks while `codecov/project` is not published.

## Required Checks Enforced on `main`

- `backend-tests / backend`
- `frontend-tests / frontend`
- `Coverage and Codecov Upload`
- `codecov/patch`
- `Cursor Bugbot`

## Rationale

- `codecov/project` is configured in `codecov.yml` but remains non-emitting for PR contexts.
- CI upload success and patch coverage are still enforced as blocking.
- This avoids deadlock while preserving real quality gates.

## Revisit Trigger

- Re-enable `codecov/project` as a required check when Codecov consistently publishes the context on PRs.

## Codecov Support Ticket Template

Use the following template in Codecov support:

```markdown
Subject: `codecov/project` status not emitted on PRs despite valid config and successful uploads

Repository: https://github.com/Scentiment-Dev/SynthflowDashboard
Visibility: Public

Issue:
- `codecov/patch` is emitted and passing.
- `codecov/project` is configured but never emitted as a PR status context.
- This blocks GitHub branch protection when `codecov/project` is required.

Current Codecov config:
- `coverage.status.project.default.target: 95%`
- `coverage.status.patch.default.target: 95%`
- `if_ci_failed: error` for both

Validation performed:
- `codecov.yml` validated via `https://codecov.io/validate` (Valid).
- Codecov uploads succeed in GitHub Actions (`codecov/codecov-action@v5`).
- Uploads include explicit PR metadata:
  - `override_pr: ${{ github.event.pull_request.number }}`
  - `override_branch: ${{ github.head_ref || github.ref_name }}`
  - `override_commit: ${{ github.event.pull_request.head.sha || github.sha }}`
- PR checks show `codecov/patch` but never `codecov/project`.

Recent PR evidence:
- https://github.com/Scentiment-Dev/SynthflowDashboard/pull/9
- Prior reproductions on PR #7 and #8.

Request:
- Confirm why `codecov/project` is not emitted.
- Provide required Codecov-side setting or fix to force project status publication on PRs.
```
