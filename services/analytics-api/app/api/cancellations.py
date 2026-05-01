from fastapi import APIRouter, Depends

from app.api.dependencies import require_api_permission
from app.core.security import Permission, UserContext
from app.schemas.cancellation import CancellationSummary, CostTooHighValidationResponse
from app.schemas.source_truth import (
    CancellationValidationRequest,
    CostTooHighSequenceRequest,
    SourceTruthDecision,
)
from app.services.cancellation_service import (
    confirm_cancellation,
    get_cancellation_summary,
    validate_cost_too_high_sequence,
)

router = APIRouter(prefix="/cancellations", tags=["cancellations"])


@router.get("/summary", response_model=CancellationSummary)
def summary(
    _: UserContext = Depends(require_api_permission(Permission.READ_CANCELLATIONS)),
) -> CancellationSummary:
    return get_cancellation_summary()


@router.post("/confirm", response_model=SourceTruthDecision)
def confirm(
    request: CancellationValidationRequest,
    _: UserContext = Depends(require_api_permission(Permission.READ_CANCELLATIONS)),
) -> SourceTruthDecision:
    return confirm_cancellation(request)


@router.post("/cost-too-high/validate", response_model=CostTooHighValidationResponse)
def validate_cost_too_high(
    request: CostTooHighSequenceRequest,
    _: UserContext = Depends(require_api_permission(Permission.READ_CANCELLATIONS)),
) -> CostTooHighValidationResponse:
    return validate_cost_too_high_sequence(request)
