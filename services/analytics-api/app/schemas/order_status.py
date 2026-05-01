from pydantic import BaseModel, Field

from app.schemas.common import AnalyticsFilters
from app.schemas.metric import MetricCard
from app.schemas.source_truth import OutcomeEvidence, SourceTruthDecision


class OrderStatusSummaryRequest(BaseModel):
    filters: AnalyticsFilters = Field(default_factory=AnalyticsFilters)


class OrderStatusSummary(BaseModel):
    module: str = "order_status"
    cards: list[MetricCard]
    source_of_truth: str = "Shopify"
    rule: str = "Shopify remains source of truth for order/product/customer/order-status context"


class ShopifyOrderContextValidationRequest(BaseModel):
    shopify_evidence: OutcomeEvidence | None = None


class ShopifyOrderContextValidationResponse(BaseModel):
    valid: bool
    decision: SourceTruthDecision
