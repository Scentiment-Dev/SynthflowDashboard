from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]


def test_no_drift_rules_are_present_in_docs_and_tests():
    no_drift = (ROOT / "docs/00_read_me_first/NO_DRIFT_RULES.md").read_text().lower()
    anchors = [
        "portal success requires confirmed portal completion",
        "stay.ai remains the source of truth",
        "trust labels",
        "explicit deny",
    ]
    for anchor in anchors:
        assert anchor in no_drift


def test_dbt_contains_locked_assertions():
    dbt_tests = "\n".join(path.read_text().lower() for path in (ROOT / "data/dbt/tests").glob("*.sql"))
    for anchor in ["portal", "stayai", "trust", "manual", "cost_too_high"]:
        assert anchor in dbt_tests
