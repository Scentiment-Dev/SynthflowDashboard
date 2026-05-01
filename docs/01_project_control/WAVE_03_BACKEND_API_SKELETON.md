# Wave 3 — Backend/API Skeleton

## Goal

Build a real FastAPI backend skeleton for the Scentiment Analytics Dashboard, with domain routers, typed schemas, services, source-truth enforcement, audit/export handling, security stubs, SQLAlchemy models, migrations, and backend tests.

## Files created or updated

- `services/analytics-api/app/main.py`
- `services/analytics-api/app/api/*.py`
- `services/analytics-api/app/api/dependencies.py`
- `services/analytics-api/app/core/*.py`
- `services/analytics-api/app/schemas/*.py`
- `services/analytics-api/app/services/*.py`
- `services/analytics-api/app/models/*.py`
- `services/analytics-api/app/db/session.py`
- `services/analytics-api/app/db/migrations/versions/0001_initial_schema.py`
- `services/analytics-api/tests/*.py`
- `services/analytics-api/README.md`

## Acceptance criteria

- Backend API routes are domain-specific and typed.
- Subscription analytics is represented first.
- Cancellation, retention, order-status, escalation, export, and governance modules are represented.
- Locked no-drift rules are implemented in `SourceTruthService`.
- Permission checks default to server-side explicit deny.
- Export audit metadata is generated and validated.
- Backend files compile successfully.

## Agent ownership

Cursor Agent A owns this wave and future backend/data expansion.
