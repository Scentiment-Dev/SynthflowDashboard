# Frontend Implementation Map

## App location

`apps/dashboard-web`

## Framework

- React
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- React Router

## Primary source files

| Area | Files |
|---|---|
| App shell | `src/App.tsx`, `src/main.tsx`, `src/layouts/DashboardLayout.tsx` |
| Routing | `src/routes/DashboardRoutes.tsx` |
| Pages | `src/pages/*.tsx` |
| Dashboard shell | `src/components/dashboard/DashboardModulePage.tsx` |
| Data/API | `src/services/apiClient.ts`, `src/services/dashboardApi.ts`, `src/hooks/useDashboardSummary.ts`, `src/data/dashboardFixtures.ts` |
| Filters | `src/context/DashboardFilterContext.tsx`, `src/components/filters/*.tsx` |
| Visuals | `src/components/charts/*.tsx`, `src/components/tables/*.tsx` |
| Governance UI | `SourceTruthBanner`, `ExportReadinessPanel`, `ExportAuditForm`, `TrustBadge`, `SourceBadge` |
| Tests | `src/tests/*.test.tsx` |

## API alignment

The frontend uses the Wave 3 backend contract pattern:

- `GET /metrics/modules/{module}/summary`
- `GET /metrics/definitions`
- `GET /metrics/{metric_key}/series`
- `GET /governance/no-drift-rules`
- `POST /exports/audit`

Cycle 002 adds the subscription analytics contract endpoint:

- `GET /subscriptions/analytics?scenario={baseline|missing_stayai_confirmation}`

## Fixture fallback rule

Fixture data is allowed during local development, but the UI must show that the dashboard is using fixtures when the backend is not reachable.

## Cycle 002 — Subscription analytics contract slice

| Area | Files |
|---|---|
| Contract types | `src/types/subscriptionAnalytics.ts` |
| Fixtures | `src/data/subscriptionAnalyticsFixtures.ts` |
| Service | `src/services/dashboardApi.ts` (`getSubscriptionAnalytics`, `buildSubscriptionAnalyticsUrl`) |
| Hook | `src/hooks/useSubscriptionAnalytics.ts` |
| State helpers | `src/utils/subscriptionAnalyticsState.ts` |
| View | `src/components/dashboard/subscription/SubscriptionAnalyticsView.tsx` |
| Section panels | `src/components/dashboard/subscription/{SubscriptionFinalStateBanner,SubscriptionOverviewGrid,PortalJourneyPanel,ShopifyContextPanel,SynthflowJourneyPanel,SourceConfirmationPanel,SubscriptionMetricMetadataPanel,SubscriptionStateAlertsPanel}.tsx` |
| Page wiring | `src/pages/SubscriptionAnalyticsPage.tsx` |
| Tests | `src/tests/SubscriptionAnalyticsContractWiring.test.tsx` |

## Cycle 004 — Source health, freshness, and lineage UI

| Area | Files |
|---|---|
| Contract types | `src/types/sourceHealth.ts` |
| Fixtures | `src/data/sourceHealthFixtures.ts` (mirrors backend `baseline`, `missing_stayai_final_state`, `failing_quality_with_missing_stayai`, `conflicting_sources` scenarios) |
| Service | `src/services/dashboardApi.ts` (`getSubscriptionSourceHealth`, `buildSubscriptionSourceHealthUrl`) |
| Hook | `src/hooks/useSubscriptionSourceHealth.ts` |
| State helpers | `src/utils/sourceHealthState.ts` (tones, labels, alerts, visual-state library, `formatLastSeenRelative`) |
| View | `src/components/dashboard/sourceHealth/SourceHealthView.tsx` |
| Cards & panels | `src/components/dashboard/sourceHealth/{SourceHealthOverviewBar,SourceHealthCard,SourceHealthAlertsPanel,FreshnessStateLegend,LineageConflictPanel}.tsx` |
| Page wiring | `src/pages/SubscriptionAnalyticsPage.tsx` (mounts `SourceHealthView` above the Cycle 002 analytics view) |
| Tests | `src/tests/SourceHealthLineageUi.test.tsx` |
| Backend contract | `GET /subscriptions/source-health?scenario=...` (Agent A Cycle 004) and shared schema `packages/shared-contracts/schemas/subscription_source_health.schema.json` |
