from fastapi import APIRouter, Depends

from app.api.dependencies import require_api_permission
from app.core.security import Permission, UserContext
from app.schemas.governance import (
    BackfillPolicyRequest,
    BackfillPolicyResult,
    ExportPolicyEvaluationRequest,
    ExportPolicyEvaluationResult,
    GovernanceRuleSummary,
    PermissionEvaluationRequest,
    PermissionEvaluationResult,
    TrustLabelEvaluationRequest,
    TrustLabelEvaluationResult,
)
from app.schemas.source_truth import ContainmentEvaluationRequest, SourceTruthDecision
from app.services.governance_service import (
    evaluate_backfill_policy,
    evaluate_export_policy,
    evaluate_trust_label,
    governance_rules,
)
from app.services.rbac_service import evaluate_permission, get_role_permission_matrix
from app.services.source_truth_service import NO_DRIFT_RULES, SourceTruthService

router = APIRouter(prefix="/governance", tags=["governance"])


@router.get("/no-drift-rules")
def no_drift_rules(
    _: UserContext = Depends(require_api_permission(Permission.READ_GOVERNANCE)),
) -> dict[str, list[str]]:
    return {"rules": NO_DRIFT_RULES}


@router.get("/rules", response_model=list[GovernanceRuleSummary])
def rules(
    _: UserContext = Depends(require_api_permission(Permission.READ_GOVERNANCE)),
) -> list[GovernanceRuleSummary]:
    return governance_rules()


@router.get("/rbac/matrix")
def rbac_matrix(
    _: UserContext = Depends(require_api_permission(Permission.READ_GOVERNANCE)),
) -> dict[str, list[str]]:
    return get_role_permission_matrix()


@router.post("/rbac/evaluate", response_model=PermissionEvaluationResult)
def rbac_evaluate(
    request: PermissionEvaluationRequest,
    _: UserContext = Depends(require_api_permission(Permission.ADMIN_GOVERNANCE)),
) -> PermissionEvaluationResult:
    return evaluate_permission(request)


@router.post("/trust-labels/evaluate", response_model=TrustLabelEvaluationResult)
def trust_label_evaluate(
    request: TrustLabelEvaluationRequest,
    _: UserContext = Depends(require_api_permission(Permission.ADMIN_GOVERNANCE)),
) -> TrustLabelEvaluationResult:
    return evaluate_trust_label(request)


@router.get("/trust-labels/manual-elevation")
def trust_label_manual_elevation(
    _: UserContext = Depends(require_api_permission(Permission.ADMIN_GOVERNANCE)),
) -> dict[str, bool | str]:
    return {
        "allowed": SourceTruthService().trust_label_can_be_manual(),
        "rule": "Trust labels are system-calculated and cannot be manually elevated.",
    }


@router.post("/exports/evaluate", response_model=ExportPolicyEvaluationResult)
def export_policy_evaluate(
    request: ExportPolicyEvaluationRequest,
    _: UserContext = Depends(require_api_permission(Permission.EXPORT_METRICS)),
) -> ExportPolicyEvaluationResult:
    return evaluate_export_policy(request)


@router.post("/backfills/evaluate", response_model=BackfillPolicyResult)
def backfill_policy_evaluate(
    request: BackfillPolicyRequest,
    _: UserContext = Depends(require_api_permission(Permission.MANAGE_BACKFILL)),
) -> BackfillPolicyResult:
    return evaluate_backfill_policy(request)


@router.post("/containment/evaluate", response_model=SourceTruthDecision)
def evaluate_containment(
    request: ContainmentEvaluationRequest,
    _: UserContext = Depends(require_api_permission(Permission.ADMIN_GOVERNANCE)),
) -> SourceTruthDecision:
    return SourceTruthService().automation_containment_success(request)
