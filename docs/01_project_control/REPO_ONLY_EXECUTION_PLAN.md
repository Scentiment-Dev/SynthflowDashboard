# Repo-Only Execution Plan

Scope: repository governance and delivery hygiene only. No application behavior or feature code changes.

## Step 1: Baseline and Guardrails

- Confirm current branch and working tree state.
- Confirm active CI workflow inventory.
- Confirm ownership and policy files present/missing.

## Step 2: Governance Foundation

- Standardize `CODEOWNERS` to valid GitHub principals.
- Add root `CONTRIBUTING.md` with PR and validation expectations.
- Add root `SECURITY.md` with vulnerability reporting and secret handling policy.

## Step 3: CI Pipeline Hygiene

- Remove duplicate `pull_request` triggers from reusable workflows invoked by `ci.yml`.
- Keep orchestration in `ci.yml` as the single PR entrypoint.
- Improve deterministic frontend installs in CI (`npm ci` + lockfile cache path).
- Validate workflow matrix coverage includes the coverage upload job.

## Step 4: Repository Automation

- Add `Dependabot` updates for npm, pip, and GitHub Actions ecosystems.
- Keep dependency update cadence weekly with bounded PR volume.

## Step 5: Consistency and Drift Prevention

- Align root build metadata and scripts (`package.json`, `Makefile`) with current validation set.
- Expand `.gitignore` for common local artifacts created by quality and coverage tooling.

## Step 6: Branch and Review Strategy (Repo Layer)

- Publish branch naming, lifecycle, and cleanup strategy.
- Publish required check reference for branch protection alignment.

## Step 7: Verification

- Run workflow matrix validation.
- Run repo structure and no-drift checks.
- Review git diff to confirm repo-only file scope.
