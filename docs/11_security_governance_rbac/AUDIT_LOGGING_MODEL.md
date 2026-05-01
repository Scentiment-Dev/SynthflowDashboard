# Audit Logging Model

Wave 7 introduces audit event scaffolding for governance-sensitive actions.

## Audit event fields
- `audit_id`
- `actor`
- `action`
- `resource`
- `decision`
- `metadata`
- `fingerprint`
- `created_at`

## Current scope
The backend uses an in-memory skeleton service for development. Production implementation must persist events to PostgreSQL and expose filtered read access only to roles with `read:audit`.
