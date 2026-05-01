"""Run lightweight local quality gates without requiring npm/dbt installation."""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

COMMANDS = [
    ["python", "-S", "scripts/validate_repo_structure.py"],
    ["python", "-S", "scripts/validate_no_drift_rules.py"],
    ["python", "-S", "scripts/validate_wave8_agent_system.py"],
    ["python", "-S", "scripts/validate_wave9_qa_ci.py"],
    ["python", "-S", "scripts/verify_workflow_matrix.py"],
    ["python", "-S", "scripts/qa_collect_evidence.py"],
]


def main() -> int:
    for command in COMMANDS:
        print("+", " ".join(command))
        result = subprocess.run(command, cwd=ROOT)
        if result.returncode != 0:
            print(f"Quality gate failed: {' '.join(command)}")
            return result.returncode
    print("Lightweight local quality gates passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
