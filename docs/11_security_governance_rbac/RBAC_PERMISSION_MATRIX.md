# RBAC Permission Matrix

Permissions are enforced server-side using explicit deny. The frontend may display available actions, but it cannot grant permissions.

| Role | Permission posture |
|---|---|
| Admin | All permissions, still subject to explicit-deny overrides. |
| Analyst | Read analytics modules and export metrics. |
| Support Lead | Read analytics modules; no export or admin governance. |
| Compliance Manager | Governance, audit, and export review. |
| QA Reviewer | Read metrics, governance, and audit evidence. |
| Viewer | Read metrics only. |

## Launch blocker
Any API route that exposes governance, export, or audit data must use `require_api_permission()`.
