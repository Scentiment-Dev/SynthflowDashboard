# Dashboard UI/UX Specs

Pages must show clear definitions, source labels, trust labels, filters, readable tables/charts, and no-overlap journey visuals.

## Cycle 001 subscription dashboard shell

The subscription dashboard shell is implemented as a frontend foundation only and must not present placeholder states as confirmed business truth.

- Route: `/subscriptions`
- Primary page wrapper: `apps/dashboard-web/src/components/dashboard/DashboardModulePage.tsx`
- Subscription readiness panel: `apps/dashboard-web/src/components/dashboard/SubscriptionStateReadinessPanel.tsx`

### Required state visibility

The shell must present readable placeholders for:

1. Loading
2. Empty
3. Error
4. Permission denied
5. Low trust
6. Stale data
7. Pending source confirmation
8. Missing Stay.ai final state
9. Portal link sent but completion unknown
10. Shopify context available but Stay.ai final state missing
11. Synthflow journey incomplete
12. Export blocked/pending metadata
13. Audit metadata unavailable
14. RBAC server confirmation unavailable

### Source-of-truth guardrails

- Stay.ai confirmation is required before retained/cancelled outcomes are final.
- Shopify context can support display but cannot finalize subscription state.
- Portal link sent remains diagnostic and cannot be treated as completion.
- Permission checks require backend explicit deny/allow behavior.
- Trust labels remain calculated and cannot be manually elevated in UI.
