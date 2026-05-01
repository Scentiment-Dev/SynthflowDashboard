from sqlalchemy import JSON, Boolean, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin


class PermissionPolicy(Base, TimestampMixin):
    __tablename__ = "permission_policies"

    policy_key: Mapped[str] = mapped_column(String(128), primary_key=True)
    role: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    permissions: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    explicit_deny: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    owner: Mapped[str] = mapped_column(String(128), default="governance", nullable=False)
