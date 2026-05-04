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

## Cycle 005 — Subscription outcome analytics UI

This is the first production-priority subscription analytics module. It is rendered as the
top section of `SubscriptionAnalyticsPage` and is visually prioritized above the Cycle 004
source-health view, the Cycle 002 contract-wired view, and the Cycle 001 module shell.

| Area | Files |
|---|---|
| Contract types | `src/types/subscriptionOutcomes.ts` |
| Fixtures | `src/data/subscriptionOutcomesFixtures.ts` (covers `baseline`, `pending_stayai_confirmation`, `missing_stayai_final_state`, `empty` scenarios) |
| Service | `src/services/dashboardApi.ts` (`getSubscriptionOutcomes`, `buildSubscriptionOutcomesUrl`) |
| Hook | `src/hooks/useSubscriptionOutcomes.ts` (validates contract shape, falls back to fixture, surfaces permission denied) |
| State helpers | `src/utils/subscriptionOutcomesState.ts` (KPI/rate card builders, funnel builder, alerts derivation, tone helpers) |
| View | `src/components/dashboard/subscriptionOutcomes/SubscriptionOutcomesView.tsx` |
| Section panels | `src/components/dashboard/subscriptionOutcomes/{SubscriptionOutcomeKpiGrid,SubscriptionOutcomeFunnel,SubscriptionOutcomeAlertsPanel,SubscriptionOutcomeMetadataPanel}.tsx` |
| Page wiring | `src/pages/SubscriptionAnalyticsPage.tsx` (mounts `SubscriptionOutcomesView` as the first section) |
| Tests | `src/tests/SubscriptionOutcomeAnalytics.test.tsx` |
| Backend contract | `GET /subscriptions/outcomes?scenario=...` (Agent A Cycle 005) and shared schema `packages/shared-contracts/schemas/subscription_outcomes_response.schema.json` |

### Cycle 005 UI behavior rules

- **Source-of-truth display**: every KPI, rate, and funnel stage shows its source authority
  string (`Stay.ai`, `Stay.ai + Synthflow`, `Stay.ai / Portal`, `Synthflow / Portal`,
  `Shopify (context only)`, `Synthflow`). Cards backed by Stay.ai final authority also render
  a `ShieldCheck` icon.
- **Stay.ai precedence**: Shopify context cards are explicitly tagged "Shopify (context only)"
  and never imply finalization. The funnel labels Shopify and Synthflow stages as
  "Context / request" rather than "Stay.ai final".
- **Portal link sent ≠ portal completion**: portal link sent and portal completion confirmed
  are rendered as separate KPIs and as separate funnel stages. Whenever
  `portal_link_sent_total > portal_completion_confirmed_total`, the alerts panel raises a
  warning labeled `Portal link sent — completion unknown`.
- **Trust labels**: trust label is system-calculated and rendered as a colored chip in the
  metadata panel header (`emerald`/`sky`/`amber`/`rose`). `low` and `untrusted` also raise a
  danger-level alert. Manual elevation is not exposed in the UI.
- **Pending and missing Stay.ai final state**: `pending_stayai_confirmation_total` and
  `missing_stayai_final_state_total` are surfaced as their own KPI cards. When
  `metadata.source_confirmation_status` is `pending` or `missing`, the alerts panel raises a
  warning or danger row and the metadata panel chip changes color accordingly.
- **Required UI states**: loading, empty, error, permission denied, low trust, stale source,
  pending/unknown freshness, pending/missing Stay.ai final state, portal link sent without
  completion, Shopify context-only, Synthflow journey incomplete, and export/audit metadata
  unavailable. All states are derived from the contract response and rendered through
  `SubscriptionOutcomeAlertsPanel`.
- **Metric definition / source authority display**: every section is governed by the
  `SubscriptionOutcomeMetadataPanel`, which renders metric ID, formula version, owner,
  generated-at timestamp, scenario, fingerprint, audit reference, metric definitions, and
  applied filters. Trust, freshness, and source confirmation chips are visually distinct.
- **Fixture preview labeling**: when the analytics-api is unreachable or returns a contract
  shape mismatch, the status bar and the alerts panel both render explicit "contract preview
  from fixture" messaging. The hook never silently substitutes fixture data without surfacing
  it to the user.
- **Permissions**: server-side 401/403 responses surface a "permission denied by server"
  status bar, a `permission_denied` alert row, and the contract preview fallback. The UI does
  not bypass server-side authorization.
