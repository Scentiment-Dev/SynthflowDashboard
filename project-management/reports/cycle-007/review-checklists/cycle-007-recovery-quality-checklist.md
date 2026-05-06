# Cycle 007 Recovery Quality Checklist

- Cycle: 007
- Owner: Cursor Agent D (QA / governance / no-drift)
- Model used: **Codex 5.3**
- Minimum acceptance confidence for Agent D completion: **97%**

## Universal hard gates

| Gate | Requirement | Evidence status |
| --- | --- | --- |
| G-01 | Bugbot required for PR-ready claim | PASS (PRs #26, #27, #28 all include successful Cursor Bugbot check) |
| G-02 | Codecov required when code changes | PASS (PRs #26, #27 include successful `codecov/patch`) |
| G-03 | Coverage must be >=95% | PASS (A: 99.12%, B: 99.24/96.47/99.62/99.75; Codecov patch success) |
| G-04 | Missing/failing Bugbot blocks readiness | PASS (no failing/missing Bugbot on A/B/C PRs) |
| G-05 | No evidence means no completion | PASS (A/B/C reports and artifacts present) |
| G-06 | Reports must include confidence percentage | PASS (A: 97.0%, B: 97%, C: 97.5%) |
| G-07 | Model routing is mandatory | PASS (A Codex 5.3, B Opus 4.7, C Opus 4.7, D Codex 5.3) |

## D1-D7 required work verification

| Item | Requirement | Result |
| --- | --- | --- |
| D1 | Verify four-agent role transition | PASS |
| D2 | Verify source-pack coverage against required Wave 20/18/Phone Wave 10 set | PASS (mapped equivalents documented; unresolved exact filenames explicitly disclosed) |
| D3 | Verify Agent C screenshot issue register + 98.5% confidence rule usage | PASS |
| D4 | Verify Agent B IA redesign quality (subpages/tabs, filters, export, drilldowns, business value) | PASS |
| D5 | Validate no-drift truth locks preserved | PASS |
| D6 | Create QA checklist + QA evidence README | PASS (this file + `qa-evidence/README.md`) |
| D7 | Create Agent D cycle report with governance verdict | PASS (`agent-d-wave-01-cycle-007-report.md`) |

## No-drift control checks

| Rule | Status |
| --- | --- |
| Stay.ai subscription truth preserved | PASS |
| Shopify context-only preserved | PASS |
| Synthflow journey truth preserved | PASS |
| Portal link sent != completion preserved | PASS |
| Trust labels system-calculated preserved | PASS |
| Server-side explicit deny preserved | PASS |
| Export audit metadata preserved | PASS |
| Subscription-first IA priority preserved | PASS |

## Merge-readiness checklist outcome

- **Cycle 007 governance package completeness:** PASS
- **Cycle 007 implementation readiness recommendation:** CONDITIONAL PASS
- **Reason:** Governance/design evidence is strong enough to proceed into implementation cycles, but Cycle 008 execution must satisfy Agent C acceptance criteria and close PM open questions before final UX acceptance.
