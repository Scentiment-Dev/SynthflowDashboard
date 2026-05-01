# Source-of-Truth Map

## Source ownership

| Platform / layer | Locked ownership | Dashboard implication |
|---|---|---|
| Synthflow / phone voice layer | Automated call sessions, voice flow path, captured call intent, step progression, caller interaction, call routing, transfer attempts, disconnect/drop-off, voice automation performance. | Synthflow events feed call handling, intent, funnel, containment, escalation, journey, and voice-flow performance widgets. Synthflow cannot be used as source of truth for Shopify order data or Stay.ai subscription state. |
| Shopify | eCommerce store data, purchases, order data, customer/order linkage, created_at/processed_at, order tags, pre-order tags, product/SKU context, shipping method, fulfillment/tracking, order history. | Shopify fields drive Order Status, ETA, pre-order/non-pre-order, product/SKU drivers, order lookup, shipping/fulfillment, and order-related value segmentation. |
| Stay.ai | Subscription status, subscription ID, frequency, action state, skip/pause/reactivation/cancellation state, retention action state, final subscription outcome, subscription product/customer context. | Stay.ai fields drive subscription matching, action completion, retention/cancellation, save status, reactivation, deferred/recovered value, and subscription outcome metrics. |
| Portal / email / SMS | Link sent, delivery, portal start, portal completion, completion timestamp, bounce/failure, opt-out/block status, portal-attributed action outcome. | Portal success requires completion, not link sent. Portal link sent is diagnostic. |
| Live-agent platform | Transfer connection, queue abandonment where available, agent-resolved outcome, downstream case outcome, match calibration. | Escalation widgets and calibration views depend on live-agent outcome availability; missing outcomes downgrade trust. |
| Analytics event layer / warehouse | Normalized event joins, final calculations, snapshots, trust labels, reconciliation, dashboard state. | Final dashboard numbers should come from warehouse/semantic layer, not direct frontend queries to source systems. |

## Critical implementation interpretation

The source pack names a phone / voice / telephony system as source of truth. For this project, Synthflow is the selected automated phone support / voice automation platform and is therefore the implementation system mapped to that source-of-truth layer. Where telephony carrier/caller-ID data sits outside Synthflow, it should be treated as phone/telephony source context and reconciled into the same voice analytics model.
