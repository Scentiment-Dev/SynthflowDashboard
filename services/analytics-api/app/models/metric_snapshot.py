from sqlalchemy import DateTime, Float, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin


class MetricSnapshot(Base, TimestampMixin):
    __tablename__ = "metric_snapshots"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    metric_key: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    module: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    value: Mapped[float] = mapped_column(Float, nullable=False)
    numerator: Mapped[float | None] = mapped_column(Float, nullable=True)
    denominator: Mapped[float | None] = mapped_column(Float, nullable=True)
    trust_label: Mapped[str] = mapped_column(String(32), nullable=False)
    source_of_truth: Mapped[str] = mapped_column(String(128), nullable=False)
    formula_version: Mapped[str] = mapped_column(String(32), nullable=False)
    period_start: Mapped[str] = mapped_column(DateTime(timezone=True), nullable=False)
    period_end: Mapped[str] = mapped_column(DateTime(timezone=True), nullable=False)
