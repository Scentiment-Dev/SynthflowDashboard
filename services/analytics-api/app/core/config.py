from functools import lru_cache
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime configuration for the Analytics API.

    Secret values are represented as environment-variable names only in this skeleton.
    Do not commit real credentials.
    """

    app_name: str = "Scentiment Analytics API"
    app_version: str = "0.3.0"
    app_env: str = "local"
    log_level: str = "INFO"
    docs_enabled: bool = True

    api_cors_origins: str = "http://localhost:5173,http://localhost:3000"
    database_url: str = "postgresql+psycopg://sdash:sdash@localhost:5432/sdash"

    jwt_issuer: str = "scentiment-internal"
    jwt_audience: str = "scentiment-analytics-dashboard"
    jwt_secret: str = "change-me-local-only"
    export_fingerprint_secret: str = "change-me-local-only"

    metric_freshness_warning_minutes: int = Field(default=60, ge=1)
    metric_freshness_hard_fail_minutes: int = Field(default=240, ge=1)
    trust_label_manual_elevation_allowed: bool = False
    historical_backfill_enabled: bool = False

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.api_cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
