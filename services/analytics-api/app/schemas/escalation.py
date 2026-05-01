from pydantic import BaseModel, Field

from app.schemas.common import AnalyticsFilters
from app.schemas.metric import MetricCard


class EscalationSummaryRequest(BaseModel):
    filters: AnalyticsFilters = Field(default_factory=AnalyticsFilters)


class EscalationSummary(BaseModel):
    module: str = "escalations"
    cards: list[MetricCard]
    source_systems: list[str] = Field(default_factory=lambda: ["Synthflow", "RingCX", "support cases"])
    rule: str = "Transferred calls are not counted as successful automation containment"
