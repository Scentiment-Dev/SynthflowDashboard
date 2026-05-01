# Pull Request

## Wave and task

- Wave:
- Task ID:
- Agent:

## Summary

-

## Files changed

| Path | Reason |
| ---- | ------ |

## Local checks

- [ ] `make validate-structure`
- [ ] `make validate-no-drift`
- [ ] `python -S scripts/validate_wave8_agent_system.py`
- [ ] Relevant backend/frontend/dbt/ingestion tests
- [ ] Backend coverage artifact produced (`coverage.xml` and/or `coverage-ingestion.xml`)
- [ ] Frontend coverage artifact produced (`apps/dashboard-web/coverage/lcov.info`)

## Required quality gates (blocking)

- [ ] Coverage and Codecov Upload workflow check is present and passing.
- [ ] Codecov signals are reviewed (informational under approved Cycle 001 override).
- [ ] Cursor Bugbot status is present and passing.
- [ ] Branch protection required checks are still enforced on `main`.

## No-drift confirmation

- [ ] Stay.ai subscription outcome source-of-truth preserved.
- [ ] Shopify order-context source-of-truth preserved.
- [ ] Portal completion requires confirmed completion.
- [ ] Containment excludes abandoned/unresolved/transferred.
- [ ] Trust labels cannot be manually elevated.
- [ ] Export audit metadata preserved.
- [ ] Explicit-deny permissions preserved.
