from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import (
    audit,
    cancellations,
    escalations,
    exports,
    governance,
    health,
    metrics,
    order_status,
    retention,
    subscriptions,
)
from app.core.config import get_settings
from app.core.logging import configure_logging


def create_app() -> FastAPI:
    settings = get_settings()
    configure_logging(settings.log_level)

    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description="Backend API for Scentiment automated phone support analytics.",
        docs_url="/docs" if settings.docs_enabled else None,
        redoc_url="/redoc" if settings.docs_enabled else None,
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    for router in [
        health.router,
        metrics.router,
        subscriptions.router,
        cancellations.router,
        retention.router,
        order_status.router,
        escalations.router,
        exports.router,
        governance.router,
        audit.router,
    ]:
        app.include_router(router)

    return app


app = create_app()
