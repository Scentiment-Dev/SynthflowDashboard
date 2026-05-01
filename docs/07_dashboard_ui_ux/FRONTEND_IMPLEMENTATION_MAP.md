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

## Fixture fallback rule

Fixture data is allowed during local development, but the UI must show that the dashboard is using fixtures when the backend is not reachable.
