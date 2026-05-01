from fastapi import APIRouter, Depends

from app.api.dependencies import require_api_permission
from app.core.security import Permission, UserContext
from app.schemas.metric import DashboardModule, DashboardSummary, MetricDefinition, MetricSeriesPoint
from app.services.metric_service import (
    list_dashboard_modules,
    list_metric_definitions,
    metric_series,
    module_summary,
)

router = APIRouter(prefix="/metrics", tags=["metrics"])


@router.get("/definitions", response_model=list[MetricDefinition])
def get_metric_definitions(
    _: UserContext = Depends(require_api_permission(Permission.READ_METRICS)),
) -> list[MetricDefinition]:
    return list_metric_definitions()


@router.get("/modules", response_model=list[DashboardModule])
def get_dashboard_modules(
    _: UserContext = Depends(require_api_permission(Permission.READ_METRICS)),
) -> list[DashboardModule]:
    return list_dashboard_modules()


@router.get("/modules/{module}/summary", response_model=DashboardSummary)
def get_module_summary(
    module: DashboardModule,
    _: UserContext = Depends(require_api_permission(Permission.READ_METRICS)),
) -> DashboardSummary:
    return module_summary(module)


@router.get("/{metric_key}/series", response_model=list[MetricSeriesPoint])
def get_metric_series(
    metric_key: str,
    _: UserContext = Depends(require_api_permission(Permission.READ_METRICS)),
) -> list[MetricSeriesPoint]:
    return metric_series(metric_key)
