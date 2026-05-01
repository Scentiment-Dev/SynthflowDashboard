"""Verify that expected GitHub Actions workflows exist and declare expected jobs."""
from __future__ import annotations

from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]

EXPECTED = {
    "ci.yml": ["repo-validation", "backend-tests", "ingestion-tests", "frontend-tests", "dbt-tests", "contract-tests", "smoke-tests"],
    "backend-tests.yml": ["backend"],
    "ingestion-tests.yml": ["ingestion"],
    "frontend-tests.yml": ["frontend"],
    "dbt-tests.yml": ["dbt"],
    "lint-typecheck.yml": ["lint-typecheck"],
    "contract-tests.yml": ["contracts"],
    "smoke-tests.yml": ["smoke"],
    "governance-validation.yml": ["governance"],
    "release-readiness.yml": ["release-readiness"],
}


def main() -> int:
    failures: list[str] = []
    workflow_dir = ROOT / ".github" / "workflows"
    for filename, job_names in EXPECTED.items():
        path = workflow_dir / filename
        if not path.exists():
            failures.append(f"missing workflow: {filename}")
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        for job in job_names:
            if f"{job}:" not in text:
                failures.append(f"{filename} missing job reference: {job}")
    if failures:
        print("Workflow matrix validation failed:")
        for failure in failures:
            print(f"- {failure}")
        return 1
    print("Workflow matrix validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
