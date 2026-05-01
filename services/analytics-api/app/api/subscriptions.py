from fastapi import APIRouter, Depends

from app.api.dependencies import require_api_permission
from app.core.security import Permission, UserContext
from app.schemas.source_truth import PortalSuccessValidationRequest, SourceTruthDecision
from app.schemas.subscription import (
    SubscriptionActionConfirmationRequest,
    SubscriptionActionConfirmationResponse,
    SubscriptionAnalyticsResponse,
    SubscriptionSummary,
)
from app.services.subscription_service import (
    confirm_subscription_action,
    get_subscription_analytics,
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
