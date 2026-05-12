# Required Checks Reference

Use this as the branch-protection source when configuring required status checks.

## PR Gate Workflows

- `CI / Repo validation and no-drift gates`
- `CI / backend-tests`
- `CI / ingestion-tests`
- `CI / frontend-tests`
- `CI / dbt-tests`
- `CI / contract-tests`
- `CI / smoke-tests`
- `CI / Coverage and Codecov Upload`

## External Statuses

- `codecov/project` (project coverage gate)
- `codecov/patch` (patch coverage gate)

## Branch Protection Recommendations

- Require pull request before merge.
- Require status checks to pass before merge.
- Require conversation resolution before merge.
- Require up-to-date branch before merge.
- Include administrators in protection rules.
