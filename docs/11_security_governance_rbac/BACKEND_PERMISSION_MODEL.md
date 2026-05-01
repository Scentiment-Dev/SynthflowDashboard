# Backend Permission Model

Wave 3 introduces the backend permission skeleton.

## Non-negotiable rule

Permissions are enforced server-side using explicit deny.

## Current roles

- `admin`
- `analyst`
- `support_lead`
- `viewer`

## Current permissions

- `read:metrics`
- `read:subscriptions`
- `read:cancellations`
- `read:retention`
- `read:order_status`
- `read:escalations`
- `export:metrics`
- `admin:governance`

## Implementation files

- `services/analytics-api/app/core/security.py`
- `services/analytics-api/app/api/dependencies.py`
- `services/analytics-api/app/api/governance.py`

## Future hardening

Agent A or Agent C must replace the local development user stub with real JWT/session-backed auth while preserving explicit deny.
