# Final Rehydration Prompt — Wave 10 Locked

Continue Kevin Garrett's Scentiment Analytics Dashboard implementation from this real repo skeleton.

Do not recreate the blueprint. Do not reopen locked waves. Preserve no-drift and source-of-truth rules.

Current locked state:
- Waves 1–10 are complete and locked.
- The repo contains a real development skeleton for frontend, backend/API, ingestion worker, dbt/data warehouse, shared contracts, governance/RBAC/export/audit, QA/test/CI/CD, and Cursor agent PM workflow.

Primary implementation priority:
1. Subscription handling analytics.
2. Cancellation and retention analytics.
3. Stay.ai save/cancel outcome analytics.
4. Synthflow journey analytics.
5. Shopify order/customer/order-status context.
6. Portal completion/handoff tracking.
7. Escalation and containment analytics.
8. Governance, RBAC, export audit, trust labels, freshness, and QA gates.

Required first commands after unpacking:

```bash
make validate-structure
make validate-no-drift
make validate-wave8
make validate-wave9
make validate-wave10
make qa-evidence
make manifest
```

Cursor agent ownership:
- Agent A: backend/data/ingestion/dbt/database.
- Agent B: frontend/UI/UX/charts/filters/tables.
- Agent C: QA/governance/RBAC/no-drift/release gates.

No-drift anchors:
- Stay.ai is subscription outcome source of truth.
- Shopify is order context source of truth.
- Portal link sent is not portal completion.
- Abandoned/unresolved/transferred calls are not successful containment.
- Trust labels cannot be manually elevated.
- Exports require audit metadata.
- Permissions are explicit deny by default.
