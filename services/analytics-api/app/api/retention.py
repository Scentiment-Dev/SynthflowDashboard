from fastapi import APIRouter, Depends

from app.api.dependencies import require_api_permission
from app.core.security import Permission, UserContext
from app.schemas.retention import RetentionSummary, SaveConfirmationResponse
from app.schemas.source_truth import SubscriptionOutcomeValidationRequest
from app.services.retention_service import confirm_save, get_retention_summary

router = APIRouter(prefix="/retention", tags=["retention"])


@router.get("/summary", response_model=RetentionSummary)
def summary(
    _: UserContext = Depends(require_api_permission(Permission.READ_RETENTION)),
) -> RetentionSummary:
    return get_retention_summary()


@router.post("/save/confirm", response_model=SaveConfirmationResponse)
def confirm_retention_save(
    request: SubscriptionOutcomeValidationRequest,
    _: UserContext = Depends(require_api_permission(Permission.READ_RETENTION)),
) -> SaveConfirmationResponse:
    return confirm_save(request)
