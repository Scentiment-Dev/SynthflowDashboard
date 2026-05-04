from fastapi import APIRouter, Depends, Query

from app.api.dependencies import require_api_permission
from app.core.security import Permission, UserContext
from app.schemas.source_truth import PortalSuccessValidationRequest, SourceTruthDecision
from app.schemas.subscription import (
    SourceSystem,
    SubscriptionActionConfirmationRequest,
    SubscriptionActionConfirmationResponse,
    SubscriptionAnalyticsResponse,
    SubscriptionOutcomesResponse,
    SubscriptionSourceHealthResponse,
    SubscriptionSummary,
)
from app.services.subscription_service import (
    confirm_subscription_action,
    get_subscription_analytics,
    get_subscription_outcomes,
    get_subscription_source_health,
    get_subscription_summary,
    validate_portal_success,
)

router = APIRouter(prefix="/subscriptions", tags=["subscriptions"])


@router.get("/summary", response_model=SubscriptionSummary)
def summary(
    _: UserContext = Depends(require_api_permission(Permission.READ_SUBSCRIPTIONS)),
) -> SubscriptionSummary:
    return get_subscription_summary()


@router.get("/analytics", response_model=SubscriptionAnalyticsResponse)
def analytics(
    scenario: str = "baseline",
    _: UserContext = Depends(require_api_permission(Permission.READ_SUBSCRIPTIONS)),
) -> SubscriptionAnalyticsResponse:
    return get_subscription_analytics(scenario)


@router.get("/outcomes", response_model=SubscriptionOutcomesResponse)
def outcomes(
    scenario: str = "baseline",
    _: UserContext = Depends(require_api_permission(Permission.READ_SUBSCRIPTIONS)),
) -> SubscriptionOutcomesResponse:
    return get_subscription_outcomes(scenario)


@router.get("/source-health", response_model=SubscriptionSourceHealthResponse)
def source_health(
    scenario: str = "baseline",
    sources: list[SourceSystem] | None = Query(default=None),
    _: UserContext = Depends(require_api_permission(Permission.READ_SUBSCRIPTIONS)),
) -> SubscriptionSourceHealthResponse:
    return get_subscription_source_health(scenario=scenario, source_systems=sources)


@router.post("/actions/confirm", response_model=SubscriptionActionConfirmationResponse)
def confirm_action(
    request: SubscriptionActionConfirmationRequest,
    _: UserContext = Depends(require_api_permission(Permission.READ_SUBSCRIPTIONS)),
) -> SubscriptionActionConfirmationResponse:
    return confirm_subscription_action(request)


@router.post("/portal-success/validate", response_model=SourceTruthDecision)
def validate_portal_completion(
    request: PortalSuccessValidationRequest,
    _: UserContext = Depends(require_api_permission(Permission.READ_SUBSCRIPTIONS)),
) -> SourceTruthDecision:
    return validate_portal_success(request)
