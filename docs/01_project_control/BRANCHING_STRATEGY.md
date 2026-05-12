# Branching and Lifecycle Strategy

## Goals

- Keep `main` always releasable.
- Reduce stale branch accumulation.
- Make PR intent obvious from branch names.

## Branch Types

- `feat/<scope>-<summary>`: new functionality
- `fix/<scope>-<summary>`: bug fixes
- `chore/<scope>-<summary>`: maintenance, docs, CI, repo hygiene
- `hotfix/<scope>-<summary>`: urgent production-critical fix

## Rules

- Branch from latest `main`.
- Keep each branch focused on one review unit.
- Rebase or merge from `main` regularly to minimize drift.
- Delete merged branches automatically.

## Stale Branch Policy

- Weekly stale branch audit:
  - merged branches -> delete local + remote
  - inactive branches older than agreed threshold -> verify owner intent, then archive/delete
- Protect long-lived release or migration branches explicitly by naming convention and docs.

## PR Expectations

- One PR maps to one branch objective.
- Required checks must pass before merge.
- Draft PRs encouraged for early review and CI feedback.
