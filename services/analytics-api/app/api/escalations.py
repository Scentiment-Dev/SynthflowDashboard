from fastapi import APIRouter, Depends

from app.api.dependencies import require_api_permission
from app.core.security import Permission, UserContext
from app.schemas.escalation import EscalationSummary
from app.services.escalation_service import get_escalation_summary

router = APIRouter(prefix="/escalations", tags=["escalations"])


@router.get("/summary", response_model=EscalationSummary)
def summary(
    _: UserContext = Depends(require_api_permission(Permission.READ_ESCALATIONS)),
) -> EscalationSummary:
    return get_escalation_summary()
