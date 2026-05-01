"""Validate no-drift rule anchors across code, dbt, and docs."""
from __future__ import annotations

from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
RULE_ANCHORS = {
    "portal completion": [
        "docs/00_read_me_first/NO_DRIFT_RULES.md",
        "data/dbt/tests/assert_portal_success_requires_completion.sql",
        "services/analytics-api/app/services/source_truth_service.py",
    ],
    "abandoned calls": [
        "docs/00_read_me_first/NO_DRIFT_RULES.md",
        "data/dbt/tests/assert_abandoned_calls_excluded_from_containment.sql",
    ],
    "stay ai": [
        "docs/00_read_me_first/NO_DRIFT_RULES.md",
        "services/analytics-api/app/services/source_truth_service.py",
        "config/local/dashboard.local.json",
    ],
    "trust labels": [
        "docs/00_read_me_first/NO_DRIFT_RULES.md",
        "data/dbt/tests/assert_no_manual_trust_elevation.sql",
        "services/analytics-api/app/services/source_truth_service.py",
    ],
    "explicit deny": [
        "docs/00_read_me_first/NO_DRIFT_RULES.md",
        "services/analytics-api/app/core/security.py",
    ],
}

def normalize(text: str) -> str:
    return text.lower().replace("-", " ").replace("_", " ").replace(".", " ")

def main() -> int:
    failures = []
    for label, rel_paths in RULE_ANCHORS.items():
        words = label.split()
        for rel_path in rel_paths:
            path = ROOT / rel_path
            if not path.exists():
                failures.append(f"{label}: missing {rel_path}")
                continue
            haystack = normalize(path.read_text(encoding="utf-8", errors="ignore"))
            if not all(word in haystack for word in words):
                failures.append(f"{label}: anchor not found in {rel_path}")
    if failures:
        print("No-drift anchor validation failed:")
        for failure in failures:
            print(f"- {failure}")
        return 1
    print("No-drift anchor validation passed.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
