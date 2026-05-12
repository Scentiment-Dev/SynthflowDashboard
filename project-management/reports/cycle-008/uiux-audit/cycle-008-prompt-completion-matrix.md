# Cycle 008 — Initial prompt completion matrix (Agent C)

This document maps every deliverable in the **Cursor Agent C — Cycle 008** implementation prompt to evidence in the repo. Use it for Agent D QA and for PM sign-off.

| ID | Prompt requirement | Status | Evidence |
| --- | --- | --- | --- |
| **Baseline** | Mandatory PowerShell verification + `gh pr view` 26–29 + cycle-007 listing | **Done** | Logged in `agent-c-wave-01-cycle-008-report.md` §Mandatory baseline |
| **Branch** | `agent-c/wave-01/cycle-008-filter-export-copy-ux-implementation` | **Done** | Current implementation branch |
| **C1** | Advanced filter drawer; **all** IA groups; **all** named dimensions; UX behaviors | **Done** | `SubscriptionFilterDrawer.tsx`; `subscriptionAdvancedFiltersFixtures.ts` (fixture row per `FILTER_ID_TO_GROUP` key); grouped sections; chips; apply/clear/reset; disabled + dependency copy; saved-view placeholder + `saved_view` dimension |
| **C2** | Export drawer; six scopes; blocked states; manifest preview | **Done** | `SubscriptionExportDrawer.tsx`; `EXPORT_*` in `plainLanguageCopy.ts`; integration on Command Center + Business Value |
| **C3** | Plain-language copy utilities per copy-system doc | **Done** | `plainLanguageCopy.ts` (`toPlainLanguage`, trust/source/WHAT_TO_DO_NEXT, banned scan) |
| **C4** | Progressive disclosure components (named list) | **Done** | `apps/dashboard-web/src/components/help/*.tsx` |
| **C5** | Support-user comprehension pass (six questions) | **Done** | `cycle-008-support-comprehension-matrix.md` |
| **C6** | Integration tests + a11y + banned strings + **coverage ≥95%** | **Done** | `src/tests/*`; `npm run test:coverage` ≥95% statements/branches |
| **C7** | Eight screenshot categories | **Done** | `project-management/reports/cycle-008/screenshots/` (items 12–23 cover all eight categories plus toolbar variants) |
| **C8** | npm install, lint, typecheck, test, coverage, build | **Done (local)** | CI script results in report; see **C8 exception** below |
| **C9** | Report with required fields | **Done** | `agent-c-wave-01-cycle-008-report.md` |

### C8 exception — `gh pr checks --watch`

**Remote CI gates (Cursor Bugbot, Codecov patch)** require an **open GitHub PR**. They cannot be satisfied from a local branch alone.

**Action to close the loop:** open the PR with the canonical title, then run:

```powershell
gh pr checks --watch
```

Until that PR runs green, treat **Bugbot + Codecov** as **pending remote verification**, not as a local gap in implementation.

### Universal gates (Bugbot, Codecov)

| Gate | Local substitute | Remote requirement |
| --- | --- | --- |
| Bugbot | N/A | PR must run; historically SUCCESS on PRs 26–29 |
| Codecov ≥95% patch | `npm run test:coverage` meets **95%+** on `apps/dashboard-web` | Upload on PR |

---

## 98.5% issue logging

Cycle 007 register themes (filters, exports, plain language, disclosure) are addressed by the C1–C4 implementation. New regressions discovered during Cycle 008 are covered by automated tests and this matrix; no separate P0 register was required once blocking gaps (incomplete filter catalog, missing data-dependency surfacing) were fixed in code.
