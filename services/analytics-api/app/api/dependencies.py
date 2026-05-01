from collections.abc import Callable

from fastapi import Depends, Header, HTTPException, status

from app.core.security import Permission, Role, UserContext, require_permission


def _parse_csv_header(value: str | None) -> list[str]:
    if not value:
        return []
    return [part.strip() for part in value.split(",") if part.strip()]


def get_current_user_context(
    x_scentiment_user_id: str | None = Header(default=None),
    x_scentiment_email: str | None = Header(default=None),
    x_scentiment_roles: str | None = Header(default=None),
    x_scentiment_permissions: str | None = Header(default=None),
    x_scentiment_denied_permissions: str | None = Header(default=None),
) -> UserContext:
    """Resolve user context for local/dev API calls.

    Production authentication must replace this with JWT/session-backed identity. The important
    governance invariant stays here: every protected route must call require_api_permission(), and
    missing permissions are denied server-side. Headers are only a local scaffold so Cursor agents
    can test role behavior before auth integration exists.
    """
    role_names = _parse_csv_header(x_scentiment_roles)
    permission_names = _parse_csv_header(x_scentiment_permissions)
    denied_names = _parse_csv_header(x_scentiment_denied_permissions)

    roles = [Role(role) for role in role_names] if role_names else [Role.ADMIN]
    permissions = {Permission(permission) for permission in permission_names}
    denied = {Permission(permission) for permission in denied_names}

    return UserContext(
        user_id=x_scentiment_user_id or "local-dev-user",
        email=x_scentiment_email or "local-dev@scentiment.internal",
        roles=roles,
        permissions=permissions,
        denied_permissions=denied,
    )


def require_api_permission(permission: Permission) -> Callable[[UserContext], UserContext]:
    def dependency(user: UserContext = Depends(get_current_user_context)) -> UserContext:
        if not require_permission(user.resolved_permissions(), permission):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Explicit deny: missing permission {permission.value}",
            )
        return user

    return dependency
