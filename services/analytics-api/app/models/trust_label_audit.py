from sqlalchemy import JSON, Boolean, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin


class TrustLabelAudit(Base, TimestampMixin):
    __tablename__ = "trust_label_audits"

    audit_key: Mapped[str] = mapped_column(String(128), primary_key=True)
    metric_key: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    assigned_trust_label: Mapped[str] = mapped_column(String(32), nullable=False)
    requested_trust_label: Mapped[str] = mapped_column(String(32), nullable=False)
    manual_override_requested: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    allowed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    evidence_sources: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
