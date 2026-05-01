from __future__ import annotations

from app.connectors.base import SafeConnectorBase
from app.core.config import SourceConfig
from app.schemas.raw_event import RawSource


class ShopifyConnector(SafeConnectorBase):
    """Shopify order/customer/product context connector.

    Shopify is official for order, product, customer, fulfillment, and tracking
    context. It must not override Stay.ai subscription state.
    """

    source = RawSource.SHOPIFY

    def __init__(self, config: SourceConfig, sample_payload_dir=None) -> None:
        super().__init__(config, sample_payload_dir)
