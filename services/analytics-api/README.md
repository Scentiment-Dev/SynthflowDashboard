# Analytics API — Wave 3 Backend Skeleton

This service is the FastAPI backend for the Scentiment Automated Phone Support Analytics Dashboard.

## Wave 3 scope

Wave 3 expands the backend from light starter endpoints into implementation-ready API scaffolding:

- Domain routers for metrics, subscriptions, cancellations, retention, order status, escalations, exports, and governance.
- Pydantic request/response contracts for each analytics domain.
- Source-of-truth enforcement service preserving the locked no-drift rules.
- Server-side explicit-deny permission helpers and request context dependency stubs.
- SQLAlchemy model skeletons and Alembic migration structure.
- Pytest starter tests for health, metrics, no-drift rules, exports, and source-truth validation.

## Source-of-truth anchors

- Stay.ai is authoritative for subscription state, saves, cancellations, and retention outcomes.
- Shopify is authoritative for order, product, customer, fulfillment, and order-status context.
- Portal success requires confirmed completion, not a sent link.
- Abandoned/drop-off/unresolved calls are never counted as successful containment.
- Trust labels are calculated by the system and cannot be manually elevated.
- Export permissions and audit metadata are enforced server-side.

## Local development

```bash
cd services/analytics-api
pip install -e .[dev]
uvicorn app.main:app --reload
pytest
```

## Important next steps for Agent A

1. Replace the in-memory service responses with repository-backed queries.
2. Wire SQLAlchemy sessions into router dependencies.
3. Add real auth/JWT validation while preserving explicit-deny behavior.
4. Connect metric definitions to the dbt metric registry and warehouse marts.
5. Keep source-truth functions deterministic and covered by tests.
