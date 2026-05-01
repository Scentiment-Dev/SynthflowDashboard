from enum import StrEnum
from pydantic import BaseModel, Field


class Permission(StrEnum):
    READ_METRICS = "read:metrics"
    READ_SUBSCRIPTIONS = "read:subscriptions"
    READ_CANCELLATIONS = "read:cancellations"
    READ_RETENTION = "read:retention"
    READ_ORDER_STATUS = "read:order_status"
    READ_ESCALATIONS = "read:escalations"
    READ_GOVERNANCE = "read:governance"
    READ_AUDIT = "read:audit"
    EXPORT_METRICS = "export:metrics"
    WRITE_EXPORTS = "write:exports"
    ADMIN_GOVERNANCE = "admin:governance"
    MANAGE_RBAC = "manage:rbac"
    MANAGE_BACKFILL = "manage:backfill"


class Role(StrEnum):
    ADMIN = "admin"
    ANALYST = "analyst"
    SUPPORT_LEAD = "support_lead"
    COMPLIANCE_MANAGER = "compliance_manager"
    QA_REVIEWER = "qa_reviewer"
    VIEWER = "viewer"


ROLE_PERMISSION_MATRIX: dict[Role, set[Permission]] = {
    Role.ADMIN: set(Permission),
    Role.ANALYST: {
        Permission.READ_METRICS,
        Permission.READ_SUBSCRIPTIONS,
        Permission.READ_CANCELLATIONS,
        Permission.READ_RETENTION,
        Permission.READ_ORDER_STATUS,
        Permission.READ_ESCALATIONS,
        Permission.READ_GOVERNANCE,
        Permission.EXPORT_METRICS,
        Permission.WRITE_EXPORTS,
    },
    Role.SUPPORT_LEAD: {
        Permission.READ_METRICS,
        Permission.READ_SUBSCRIPTIONS,
        Permission.READ_CANCELLATIONS,
        Permission.READ_RETENTION,
        Permission.READ_ORDER_STATUS,
        Permission.READ_ESCALATIONS,
        Permission.READ_GOVERNANCE,
    },
    Role.COMPLIANCE_MANAGER: {
        Permission.READ_METRICS,
        Permission.READ_GOVERNANCE,
        Permission.READ_AUDIT,
        Permission.EXPORT_METRICS,
        Permission.ADMIN_GOVERNANCE,
    },
    Role.QA_REVIEWER: {
        Permission.READ_METRICS,
        Permission.READ_GOVERNANCE,
        Permission.READ_AUDIT,
    },
    Role.VIEWER: {Permission.READ_METRICS},
}


class UserContext(BaseModel):
    user_id: str = "local-dev-user"
    email: str = "local-dev@scentiment.internal"
    roles: list[Role] = Field(default_factory=lambda: [Role.ADMIN])
    permissions: set[Permission] = Field(default_factory=set)
    denied_permissions: set[Permission] = Field(default_factory=set)

    def resolved_permissions(self) -> set[Permission]:
        resolved = set(self.permissions)
        for role in self.roles:
            resolved.update(ROLE_PERMISSION_MATRIX.get(role, set()))
        return resolved.difference(self.denied_permissions)


def require_permission(user_permissions: set[str] | set[Permission], permission: Permission) -> bool:
    """Server-side explicit deny permission helper.

    No-drift rule: permissions must be enforced server-side using explicit deny.
    Missing permissions are denied by default and cannot be bypassed by frontend state.
    """
    normalized = {p.value if isinstance(p, Permission) else p for p in user_permissions}
    return permission.value in normalized


def assert_permission(user_permissions: set[str] | set[Permission], permission: Permission) -> None:
    if not require_permission(user_permissions, permission):
        raise PermissionError(f"Explicit deny: missing permission {permission.value}")


def serialize_role_permission_matrix() -> dict[str, list[str]]:
    return {
        role.value: sorted(permission.value for permission in permissions)
        for role, permissions in ROLE_PERMISSION_MATRIX.items()
    }
