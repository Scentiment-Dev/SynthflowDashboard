# Contributing

This repository uses a quality-gated pull request workflow. All contributions should preserve data governance, no-drift rules, and CI stability.

## Branching

- Branch from `main`.
- Use a short-lived branch name with a clear scope, for example:
  - `feat/<area>-<change>`
  - `fix/<area>-<bug>`
  - `chore/<area>-<maintenance>`
- Keep branch scope single-purpose to simplify review and rollback.

## Pull Requests

- Keep PRs focused and reviewable.
- Include a clear summary of the behavior change and rationale.
- Include validation evidence (commands run and results).
- Include screenshots for UI changes.
- Reference related docs/reports when governance or policy behavior changes.

## Local Validation Before PR

Run the core repo gates before opening or updating a PR:

```bash
make validate-structure
make validate-no-drift
make manifest
make lint
make typecheck
make test
```

Run additional checks as needed:

```bash
make quality-gates
make dbt-test
make smoke
```

## Commit Hygiene

- Use descriptive commits that explain intent.
- Do not commit secrets, credentials, or local environment files.
- Keep generated outputs out of source control unless explicitly required.

## Governance Expectations

- Treat Stay.ai and Shopify source-of-truth rules as non-optional.
- Do not weaken trust labeling, export audit metadata, or permission checks.
- Prefer explicit denial behavior when access or metadata is incomplete.

## Review and Merge

- Required CI checks must pass.
- Address review comments with code or explicit rationale.
- Merge only when branch is up to date and checks are green.
