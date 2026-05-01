from fastapi import APIRouter, Depends

from app.api.dependencies import require_api_permission
from app.core.security import Permission, UserContext
from app.schemas.export import ExportAuditRecord, ExportMetadataValidation, ExportRequest
from app.schemas.governance import ExportPolicyEvaluationRequest, ExportPolicyEvaluationResult
from app.services.export_service import create_export_audit_record, validate_export_metadata
from app.services.governance_service import evaluate_export_policy

router = APIRouter(prefix="/exports", tags=["exports"])


@router.post("/audit", response_model=ExportAuditRecord)
def create_export_audit(
    request: ExportRequest,
    _: UserContext = Depends(require_api_permission(Permission.EXPORT_METRICS)),
) -> ExportAuditRecord:
    return create_export_audit_record(request)


@router.post("/audit/validate", response_model=ExportMetadataValidation)
def validate_audit_metadata(
    record: ExportAuditRecord,
    _: UserContext = Depends(require_api_permission(Permission.EXPORT_METRICS)),
) -> ExportMetadataValidation:
    return validate_export_metadata(record)


@router.post("/policy/evaluate", response_model=ExportPolicyEvaluationResult)
def evaluate_policy(
    request: ExportPolicyEvaluationRequest,
    _: UserContext = Depends(require_api_permission(Permission.EXPORT_METRICS)),
) -> ExportPolicyEvaluationResult:
    return evaluate_export_policy(request)
