# AI PM Review Template

## Review metadata

- Reviewed by:
- Agent:
- Wave:
- Task ID:
- Branch/PR:
- Date/time:

## Scope check

| Question | Answer |
|---|---|
| Is this within the active wave? | |
| Does this modify locked blueprint scope? | |
| Is a formal change request required? | |

## Acceptance check

| Acceptance criterion | Result | Evidence |
|---|---|---|

## Validation check

| Command | Result | Notes |
|---|---|---|
| `make validate-structure` | | |
| `make validate-no-drift` | | |
| `python -S scripts/validate_wave8_agent_system.py` | | |

## Decision

Approve / Request changes / Block / Needs Kevin approval
