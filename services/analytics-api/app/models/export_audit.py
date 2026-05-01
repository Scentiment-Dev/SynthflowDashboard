from sqlalchemy import JSON, DateTime, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin


class ExportAudit(Base, TimestampMixin):
    __tablename__ = "export_audits"

    export_id: Mapped[str] = mapped_column(String(128), primary_key=True)
    requested_by: Mapped[str] = mapped_column(String(256), index=True, nullable=False)
    module: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    created_at: Mapped[str] = mapped_column(DateTime(timezone=True), nullable=False)
    filters: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)
    metric_keys: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    owner: Mapped[str] = mapped_column(String(128), nullable=False)
    fingerprint: Mapped[str] = mapped_column(String(128), nullable=False)
    audit_reference: Mapped[str] = mapped_column(String(128), nullable=False)
    trust_label: Mapped[str] = mapped_column(String(32), nullable=False)
