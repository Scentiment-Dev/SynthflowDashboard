from app.schemas.metric import MetricCard, TrustLabel
from app.schemas.order_status import (
    OrderStatusSummary,
    ShopifyOrderContextValidationRequest,
    ShopifyOrderContextValidationResponse,
)
from app.services.source_truth_service import SourceTruthService


def get_order_status_summary() -> OrderStatusSummary:
    return OrderStatusSummary(
        cards=[
            MetricCard(
                key="order_status_resolution_rate",
                label="Order Status Resolution Rate",
                value="starter",
                trust_label=TrustLabel.MEDIUM,
                description="Order-status calls resolved with confirmed Shopify context.",
                source_of_truth="Synthflow + Shopify",
            ),
            MetricCard(
                key="eta_confidence_rate",
                label="ETA Confidence Rate",
                value="starter",
                trust_label=TrustLabel.MEDIUM,
                description="Share of order-status answers backed by Shopify order and fulfillment context.",
                source_of_truth="Shopify",
            ),
        ]
    )


def validate_shopify_context(
    request: ShopifyOrderContextValidationRequest,
) -> ShopifyOrderContextValidationResponse:
    decision = SourceTruthService().shopify_order_context_valid(request.shopify_evidence)
    return ShopifyOrderContextValidationResponse(valid=decision.allowed, decision=decision)
