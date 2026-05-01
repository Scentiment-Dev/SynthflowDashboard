# Branch, PR, and Merge Rules

## Default branch

`main` is the source of truth. Keep it current, stable, and protected.

## Branch naming

Use this pattern:

```text
wave-<number>/<agent>/<short-task-name>
```

Examples:

```text
wave-09/agent-c/ci-test-matrix
wave-09/agent-a/backend-contract-tests
wave-09/agent-b/frontend-smoke-tests
```

## Merge rules

- Agents may open PRs.
- Agents may not merge their own PRs.
- Agent C must review no-drift for functional changes.
- AI PM must confirm scope alignment before merge.
- Direct commits to `main` are forbidden after Wave 8.
- Any change to no-drift rules requires Kevin approval.

## Required PR sections

Every PR must include wave/task ID, problem solved, files changed, local checks, screenshots/API examples when applicable, no-drift review notes, rollback notes, and remaining risks.
