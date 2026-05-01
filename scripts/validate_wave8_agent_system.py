"""Validate Wave 8 Cursor agent system and PM workflow files.

This validator is forward-compatible with later waves. It confirms Wave 8
remains locked without requiring Wave 9 to still be the next wave.
"""
from __future__ import annotations
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
REQUIRED_FILES = [
    "cursor-agent-system/AGENT_REGISTRY.json",
    "cursor-agent-system/AGENT_CYCLE_PLAN.json",
    "cursor-agent-system/AGENT_OPERATING_MODEL.md",
    "cursor-agent-system/BRANCH_PR_MERGE_RULES.md",
    "cursor-agent-system/NO_DRIFT_REVIEW_WORKFLOW.md",
    "cursor-agent-system/LOCAL_VALIDATION_COMMANDS.md",
    "cursor-agent-system/HANDOFF_PACKET_TEMPLATE.md",
    "cursor-agent-system/PR_REVIEW_CHECKLIST.md",
    "cursor-agent-system/MERGE_GATE_CHECKLIST.md",
    "cursor-agent-system/ISSUE_TICKET_TEMPLATE.md",
    "cursor-agent-system/WAVE_HANDOFF_PROTOCOL.md",
    "cursor-agent-system/CURSOR_AGENT_RUN_REPORT_TEMPLATE.md",
    "cursor-agent-system/AI_PM_REVIEW_TEMPLATE.md",
    ".github/PULL_REQUEST_TEMPLATE.md",
    ".github/ISSUE_TEMPLATE/agent_task.yml",
    ".github/ISSUE_TEMPLATE/change_request.yml",
    "docs/01_project_control/WAVE_08_CURSOR_AGENT_PM_WORKFLOW.md",
    "docs/09_cursor_agent_system/AGENT_BRANCH_PR_MERGE_RULES.md",
    "docs/09_cursor_agent_system/AI_PM_REVIEW_WORKFLOW.md",
    "docs/09_cursor_agent_system/NO_DRIFT_REVIEW_WORKFLOW.md",
    "docs/09_cursor_agent_system/PROMPT_PACK_INDEX.md",
    "docs/09_cursor_agent_system/AGENT_HANDOFF_CADENCE.md",
    "docs/09_cursor_agent_system/WAVE_09_AGENT_STARTER_ASSIGNMENTS.md",
    "project-management/agent_cycle_board.csv",
    "project-management/agent_cycle_board.json",
    "project-management/branch_pr_policy.md",
    "project-management/no_drift_review_register.md",
    "project-management/wave_08_completion_report.md",
]
REQUIRED_PHRASES = {
    "cursor-agent-system/BRANCH_PR_MERGE_RULES.md": ["may not merge", "Direct commits to `main` are forbidden"],
    "cursor-agent-system/NO_DRIFT_REVIEW_WORKFLOW.md": ["Stay.ai", "Portal success", "explicit deny", "Trust labels"],
    ".github/PULL_REQUEST_TEMPLATE.md": ["No-drift", "make validate-no-drift", "Stay.ai"],
}

def main() -> int:
    failures = []
    for rel in REQUIRED_FILES:
        if not (ROOT / rel).exists():
            failures.append(f"missing required Wave 8 file: {rel}")
    registry_path = ROOT / "cursor-agent-system/AGENT_REGISTRY.json"
    if registry_path.exists():
        registry = json.loads(registry_path.read_text(encoding="utf-8"))
        agent_ids = {agent.get("id") for agent in registry.get("agents", [])}
        missing = {"agent_a", "agent_b", "agent_c", "ai_pm"} - agent_ids
        if missing:
            failures.append(f"agent registry missing: {sorted(missing)}")
        if 8 not in registry.get("locked_waves", []):
            failures.append("agent registry does not mark Wave 8 locked")
        if int(registry.get("next_wave", 0)) < 9:
            failures.append("agent registry next_wave regressed below 9")
    wave_status = ROOT / "project-management/wave_status.md"
    if wave_status.exists():
        text = wave_status.read_text(encoding="utf-8", errors="ignore")
        if "8 | Complete / locked" not in text and "8 | Cursor Agent System and PM Workflow | Complete / locked" not in text:
            failures.append("project-management/wave_status.md does not show Wave 8 complete / locked")
    for rel, phrases in REQUIRED_PHRASES.items():
        path = ROOT / rel
        if path.exists():
            text = path.read_text(encoding="utf-8", errors="ignore")
            for phrase in phrases:
                if phrase not in text:
                    failures.append(f"{rel} missing phrase: {phrase}")
    if failures:
        print("Wave 8 agent system validation failed:")
        for f in failures:
            print(f"- {f}")
        return 1
    print(f"Wave 8 agent system validation passed ({len(REQUIRED_FILES)} required files).")
    return 0

if __name__ == "__main__":
    sys.exit(main())
