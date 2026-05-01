# Trust Label Enforcement

Trust labels are system-calculated and cannot be manually elevated.

## Rules
- Manual override requests must be blocked.
- Low-trust evidence cannot be displayed as high-trust through UI state.
- Exported metrics must carry their trust labels and supporting freshness/formula metadata.

## Implementation anchors
- Backend: `governance_service.evaluate_trust_label()`
- dbt: `assert_manual_trust_label_elevation_blocked.sql`
- Frontend: Governance rule cards and trust badges.
