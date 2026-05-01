# Wave 8 — Cursor Agent System and PM Workflow

## Status

Complete / locked.

## Goal

Create the operating system for AI PM and the three Cursor agents so future waves are executed as controlled development work, not loose prompting.

## Inputs

- Wave 7 locked root project pack.
- Wave 7 governance/RBAC/export/audit skeleton.
- Locked source-of-truth rules.
- Existing Agent A/B/C ownership model.

## Development files created or updated

- `cursor-agent-system/AGENT_REGISTRY.json`
- `cursor-agent-system/AGENT_CYCLE_PLAN.json`
- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/ISSUE_TEMPLATE/agent_task.yml`
- `.github/ISSUE_TEMPLATE/change_request.yml`
- `scripts/validate_wave8_agent_system.py`
- `scripts/generate_agent_prompt_packet.py`
- `project-management/agent_cycle_board.csv`
- `project-management/agent_cycle_board.json`

## Documentation files created or updated

- `cursor-agent-system/AGENT_OPERATING_MODEL.md`
- `cursor-agent-system/BRANCH_PR_MERGE_RULES.md`
- `cursor-agent-system/NO_DRIFT_REVIEW_WORKFLOW.md`
- `cursor-agent-system/LOCAL_VALIDATION_COMMANDS.md`
- `cursor-agent-system/HANDOFF_PACKET_TEMPLATE.md`
- `cursor-agent-system/PR_REVIEW_CHECKLIST.md`
- `cursor-agent-system/MERGE_GATE_CHECKLIST.md`
- `cursor-agent-system/UPDATE_CADENCE_AND_HANDOFF_RULES.md`
- `docs/09_cursor_agent_system/`

## Acceptance criteria

- Agent ownership is explicit.
- Branch and PR rules are explicit.
- Agents may open PRs but may not merge their own PRs.
- Direct-to-main changes are forbidden after Wave 8.
- No-drift review workflow is codified.
- Handoff format is standardized.
- Machine-readable registry and cycle board exist.
- Wave 9 can start from this workflow.
