from datetime import UTC, datetime
from fastapi import APIRouter

from app.core.config import get_settings
from app.schemas.common import ApiMessage

router = APIRouter(prefix="/health", tags=["health"])


@router.get("", response_model=ApiMessage)
def health_check() -> ApiMessage:
    return ApiMessage(status="ok", message="analytics-api is running")


@router.get("/ready")
def readiness_check() -> dict[str, str | bool]:
    settings = get_settings()
    return {
        "status": "ready",
        "service": "analytics-api",
        "environment": settings.app_env,
        "checked_at": datetime.now(UTC).isoformat(),
        "docs_enabled": settings.docs_enabled,
    }
