from fastapi import APIRouter, Depends

from app.api.dependencies import require_api_permission
from app.core.security import Permission, UserContext
from app.schemas.governance import AuditEvent, AuditEventCreate, AuditLogSearchResult
from app.services.audit_service import create_audit_event, search_audit_events

router = APIRouter(prefix="/audit", tags=["audit"])


@router.post("/events", response_model=AuditEvent)
def create_event(
    payload: AuditEventCreate,
    _: UserContext = Depends(require_api_permission(Permission.ADMIN_GOVERNANCE)),
) -> AuditEvent:
    return create_audit_event(payload)


@router.get("/events", response_model=AuditLogSearchResult)
def list_events(
    actor: str | None = None,
    resource: str | None = None,
    _: UserContext = Depends(require_api_permission(Permission.READ_AUDIT)),
) -> AuditLogSearchResult:
    return search_audit_events(actor=actor, resource=resource)
