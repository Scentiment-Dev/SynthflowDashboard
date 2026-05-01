from fastapi import APIRouter, Depends

from app.api.dependencies import require_api_permission
from app.core.security import Permission, UserContext
from app.schemas.order_status import (
    OrderStatusSummary,
    ShopifyOrderContextValidationRequest,
    ShopifyOrderContextValidationResponse,
)
from app.services.order_status_service import get_order_status_summary, validate_shopify_context

router = APIRouter(prefix="/order-status", tags=["order_status"])


@router.get("/summary", response_model=OrderStatusSummary)
def summary(
    _: UserContext = Depends(require_api_permission(Permission.READ_ORDER_STATUS)),
) -> OrderStatusSummary:
    return get_order_status_summary()


@router.post("/shopify-context/validate", response_model=ShopifyOrderContextValidationResponse)
def validate_context(
    request: ShopifyOrderContextValidationRequest,
    _: UserContext = Depends(require_api_permission(Permission.READ_ORDER_STATUS)),
) -> ShopifyOrderContextValidationResponse:
    return validate_shopify_context(request)
