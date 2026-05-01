from app.core.security import Permission, ROLE_PERMISSION_MATRIX, Role, UserContext, require_permission, serialize_role_permission_matrix
from app.schemas.governance import GovernanceDecision, PermissionEvaluationRequest, PermissionEvaluationResult


def get_role_permission_matrix() -> dict[str, list[str]]:
    return serialize_role_permission_matrix()


def evaluate_permission(request: PermissionEvaluationRequest) -> PermissionEvaluationResult:
    resolved: set[Permission] = set()
    for role in request.roles:
        resolved.update(ROLE_PERMISSION_MATRIX.get(role, set()))
    resolved.difference_update(set(request.explicit_denies))
    granted = require_permission(resolved, request.requested_permission)
    return PermissionEvaluationResult(
        user_id=request.user_id,
        requested_permission=request.requested_permission,
        granted=granted,
        decision=GovernanceDecision.ALLOW if granted else GovernanceDecision.DENY,
        resolved_permissions=sorted(resolved, key=lambda item: item.value),
        explicit_denies=request.explicit_denies,
        reason=(
            "Permission granted by server-side role matrix."
            if granted
            else "Explicit deny: permission missing or explicitly denied by server policy."
        ),
    )


def evaluate_user_context(user: UserContext, permission: Permission) -> PermissionEvaluationResult:
    return PermissionEvaluationResult(
        user_id=user.user_id,
        requested_permission=permission,
        granted=require_permission(user.resolved_permissions(), permission),
        decision=(
            GovernanceDecision.ALLOW
            if require_permission(user.resolved_permissions(), permission)
            else GovernanceDecision.DENY
        ),
        resolved_permissions=sorted(user.resolved_permissions(), key=lambda item: item.value),
        explicit_denies=sorted(user.denied_permissions, key=lambda item: item.value),
        reason="Evaluated from resolved user context using explicit deny semantics.",
    )
