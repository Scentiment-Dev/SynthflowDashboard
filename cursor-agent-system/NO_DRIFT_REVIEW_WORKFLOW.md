# No-Drift Review Workflow

Agent C owns the formal no-drift review, but every agent must self-check before handoff.

## Locked no-drift anchors

- Portal success requires confirmed portal completion, not link sent.
- Abandoned/drop-off/unresolved/transferred calls are excluded from successful containment.
- Stay.ai is the source of truth for subscription state, cancellation, save, and retention outcomes.
- Shopify is the source of truth for order, product, customer, fulfillment, tracking, and order-status context.
- Save requires confirmed retained subscription outcome.
- Confirmed cancellation requires Stay.ai cancelled state or approved official completion path.
- Cost Too High cancellation sequence is: frequency change offer, then 25% off offer, then confirmed cancellation only if both are declined.
- Trust labels are system-calculated and cannot be manually elevated.
- Export outputs require filters, definitions, trust labels, freshness, formula versions, owner, timestamp, fingerprint, and audit reference.
- Permissions are server-side explicit deny.
- Historical backfill is not base launch scope unless governed through the reprocess/backfill pipeline.

## Review questions

For every functional change, answer:

1. Does this change alter an official outcome definition?
2. Does this change treat a non-authoritative source as authoritative?
3. Does this change hide source freshness, fallback, mock data, or trust labels?
4. Does this change export data without audit metadata?
5. Does this change allow a user to manually elevate trust labels?
6. Does this change weaken explicit deny permissions?
7. Does this change add backfill behavior outside the governed backfill path?

Any yes answer blocks merge until resolved or formally approved.
