from datetime import datetime

from sqlalchemy import JSON, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin


class AuditLog(Base, TimestampMixin):
    __tablename__ = "audit_logs"

    audit_id: Mapped[str] = mapped_column(String(128), primary_key=True)
    actor: Mapped[str] = mapped_column(String(256), index=True, nullable=False)
    action: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    resource: Mapped[str] = mapped_column(String(256), index=True, nullable=False)
    decision: Mapped[str] = mapped_column(String(64), nullable=False)
    created_at: Mapped[datetime]
    metadata_json: Mapped[dict[str, object]] = mapped_column(
        "metadata", JSON, default=dict, nullable=False
    )
    fingerprint: Mapped[str] = mapped_column(String(128), nullable=False)
