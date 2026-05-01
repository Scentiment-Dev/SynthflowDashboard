# Issue / Task Ticket Template

## Title

`[Wave X][Agent Y] Short task name`

## Owner

- Agent:
- Reviewer:
- PM:

## Scope

Describe exactly what should change.

## Allowed paths

-

## Forbidden paths

- Locked blueprint files unless change request approved.

## Acceptance criteria

- [ ]

## Required checks

- [ ] `make validate-structure`
- [ ] `make validate-no-drift`
- [ ] `python -S scripts/validate_wave8_agent_system.py`

## No-drift review anchors

- [ ] Stay.ai outcome source-of-truth preserved.
- [ ] Portal completion rule preserved.
- [ ] Containment exclusion rule preserved.
- [ ] Trust-label rule preserved.
- [ ] Export audit metadata preserved.
- [ ] Explicit deny preserved.
