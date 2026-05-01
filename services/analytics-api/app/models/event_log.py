from sqlalchemy import JSON, Boolean, DateTime, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin


class EventLog(Base, TimestampMixin):
    __tablename__ = "event_logs"

    event_id: Mapped[str] = mapped_column(String(128), primary_key=True)
    source: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    event_type: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    occurred_at: Mapped[str] = mapped_column(DateTime(timezone=True), index=True, nullable=False)
    source_reference_id: Mapped[str | None] = mapped_column(String(128), nullable=True)
    normalized: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    payload: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)
