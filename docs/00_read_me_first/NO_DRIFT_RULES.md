# No-Drift Rules

1. Portal success requires confirmed portal completion, not link sent.
2. Abandoned/drop-off and unresolved calls are excluded from successful containment.
3. Stay.ai remains the source of truth for subscription state/action/cancellation/save outcomes.
4. Shopify remains the source of truth for order/product/customer/order-status context.
5. Save requires confirmed retained subscription outcome.
6. Confirmed cancellation requires Stay.ai cancelled state or an approved official completion path.
7. Cost Too High cancellation flow sequence is: frequency change offer -> 25% off offer -> confirmed cancellation if both are declined.
8. Trust labels are system-calculated and cannot be manually elevated.
9. Exports must include filters, definitions, trust labels, freshness, formula versions, owner, timestamp, fingerprint, and audit reference.
10. Permissions are enforced server-side using explicit deny.
11. Historical backfill is not base launch scope unless handled through a governed reprocess/backfill pipeline.
12. Do not reopen locked blueprint waves unless Kevin explicitly requests a formal change request.
