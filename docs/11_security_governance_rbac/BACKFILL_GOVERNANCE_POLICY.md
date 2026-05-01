# Backfill Governance Policy

Historical backfill is not base launch scope unless handled through a governed reprocess/backfill pipeline.

## Requirements before backfill can run
- Approved change request ID.
- Explicit source systems.
- Start and end date.
- Reason and owner.
- Dry-run evidence before production execution.
- Audit event for request and approval.

Production backfills must write to `analytics.backfill_control` and must pass `assert_backfill_requires_governed_request.sql`.
