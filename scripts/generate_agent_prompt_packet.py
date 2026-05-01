"""Generate a combined Cursor agent prompt packet from Wave 8 templates."""
from __future__ import annotations
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "project-management" / "generated"
TEMPLATE_PATHS = [
    "cursor-agent-system/AGENT_OPERATING_MODEL.md",
    "cursor-agent-system/AGENT_A_BACKEND_DATA_PROMPT_TEMPLATE.md",
    "cursor-agent-system/AGENT_B_FRONTEND_UI_PROMPT_TEMPLATE.md",
    "cursor-agent-system/AGENT_C_QA_GOVERNANCE_PROMPT_TEMPLATE.md",
    "cursor-agent-system/CURSOR_AGENT_RUN_REPORT_TEMPLATE.md",
    "cursor-agent-system/AI_PM_REVIEW_TEMPLATE.md",
    "cursor-agent-system/NO_DRIFT_REVIEW_WORKFLOW.md",
    "cursor-agent-system/BRANCH_PR_MERGE_RULES.md",
    "cursor-agent-system/MERGE_GATE_CHECKLIST.md",
]
def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    generated_at = datetime.now(timezone.utc).replace(microsecond=0).isoformat()
    chunks = [f"# Cursor Agent Prompt Packet\n\nGenerated: {generated_at}\n"]
    for rel in TEMPLATE_PATHS:
        path = ROOT / rel
        chunks.append(f"\n---\n\n## Source: `{rel}`\n\n")
        chunks.append(path.read_text(encoding="utf-8", errors="ignore"))
    out_path = OUT / "cursor_agent_prompt_packet.md"
    out_path.write_text("".join(chunks), encoding="utf-8")
    print(out_path.relative_to(ROOT))
    return 0
if __name__ == "__main__":
    raise SystemExit(main())
