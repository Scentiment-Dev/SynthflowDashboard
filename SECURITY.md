# Security Policy

## Reporting a Vulnerability

If you discover a security issue, report it privately to the repository maintainers. Do not open a public issue with exploit details.

Include:

- affected service(s) and file path(s)
- impact summary
- reproduction steps
- suggested mitigation (if available)

## Supported Security Controls

This repository enforces security expectations through architecture and workflow controls:

- server-side permission enforcement with explicit deny behavior
- no-drift validation for source-of-truth rules
- CI quality gates for lint, typecheck, and tests
- governed export metadata requirements for auditability

## Secret and Credential Handling

- Never commit secrets to source control.
- Use environment variables and secret managers for credentials.
- Rotate credentials immediately if accidental exposure is suspected.

## Access and Least Privilege

- Use least-privilege access for development and CI credentials.
- Restrict high-privilege tokens and service credentials to required scopes only.
- Review stale branches and stale automation tokens regularly.
