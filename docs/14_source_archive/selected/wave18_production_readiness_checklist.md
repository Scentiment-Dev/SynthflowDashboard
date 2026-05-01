# Production Readiness Checklist — Final Wave 17 Lock

Status: **Launch-blocking checklist**  
Required before: pre-go-live reset execution and production launch

| # | Gate | Owner | Evidence required | Status |
|---:|---|---|---|---|
| 1 | All CI checks pass on release candidate branch | Developer | CI run / signed release evidence | Pending implementation |
| 2 | Staging performance tests pass all P95 targets | Developer | k6/Locust baseline report | Pending implementation |
| 3 | Staging security tests pass all 10 categories | Admin + Developer | ZAP/manual security report | Pending implementation |
| 4 | Accessibility tests pass | Developer + QA | axe-core + manual report | Pending implementation |
| 5 | dbt test suite passes in staging | Data Analyst | dbt test artifact/report | Pending implementation |
| 6 | All 10 domain-page criteria verified | Data Analyst | Signed domain checklist | Pending implementation |
| 7 | Export system acceptance verified | Admin | Export test report and audit proof | Pending implementation |
| 8 | Builder system acceptance verified | Data Analyst + Admin | Builder lifecycle test report | Pending implementation |
| 9 | Governance/permission acceptance verified | Admin | Permission matrix report | Pending implementation |
| 10 | No open Sev1 or Sev2 data-quality issues | Operations Manager | System Health incident evidence | Pending implementation |
| 11 | Freshness SLAs passing for critical sources | Operations Manager | Data Quality evidence | Pending implementation |
| 12 | Reconciliation passing for all P0 metrics | Data Analyst | Reconciliation report | Pending implementation |
| 13 | Schema validation active for all adapters | Developer | Adapter health report | Pending implementation |
| 14 | DLQ monitored and empty or explained | Developer + Operations | DLQ monitor evidence | Pending implementation |
| 15 | Compliance approval gate record entered | Admin + Leadership | In-product compliance approval | Pending implementation |
| 16 | Incident alerting active and tested | Developer + Admin | Alarm test evidence | Pending implementation |
| 17 | Scheduled leadership reports configured | Admin | Report schedule list | Pending implementation |
| 18 | Admin/Data Analyst MFA complete | Admin | Auth provider evidence | Pending implementation |
| 19 | CloudWatch alarms active and tested | Developer | Artificial threshold breach | Pending implementation |
| 20 | Infrastructure as code reviewed/applied | Developer / Infra | CDK/Terraform plan/apply evidence | Pending implementation |

## Absolute blockers

The product must not launch if any item below is unresolved:

- Compliance approval for the Wave 1 raw identifier exception is missing.
- Any P0/P1 metric lacks known-answer coverage or fails formula compliance.
- Any server-side permission bypass exists.
- Any audit log failure exists for sensitive access, exports, builder approvals, metric changes, feature flags, or reset actions.
- Any unresolved critical/high security or accessibility issue exists.
- Any critical source adapter cannot validate schema, freshness, DLQ monitoring, or reconciliation.
- Pre-go-live reset dry-run fails.
