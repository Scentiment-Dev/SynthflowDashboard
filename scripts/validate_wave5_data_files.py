"""Lightweight Wave 5 data skeleton validation without requiring dbt dependencies."""
from __future__ import annotations

from pathlib import Path
import csv
import sys

ROOT = Path(__file__).resolve().parents[1]
REQUIRED_SQL_CONTAINS = {
    "data/dbt/models/marts/mart_dashboard_metrics.sql": ["formula_version", "trust_label", "manual_trust_elevation_allowed", "source_of_truth"],
    "data/dbt/models/intermediate/int_subscription_journeys.sql": ["has_stayai_confirmation", "portal_completed", "save_confirmed", "cancelled_confirmed"],
    "data/dbt/tests/assert_portal_success_requires_completion.sql": ["link sent", "confirmed_portal_completion"],
    "data/dbt/tests/assert_stayai_required_for_subscription_outcome.sql": ["Stay.ai", "has_stayai_confirmation"],
    "data/dbt/tests/assert_cost_too_high_offer_sequence.sql": ["Cost Too High", "cost_too_high_sequence_valid"],
}


def main() -> int:
    failures: list[str] = []
    for rel_path, anchors in REQUIRED_SQL_CONTAINS.items():
        path = ROOT / rel_path
        if not path.exists():
            failures.append(f"missing {rel_path}")
            continue
        text = path.read_text(encoding="utf-8", errors="ignore").lower()
        for anchor in anchors:
            if anchor.lower() not in text:
                failures.append(f"{rel_path}: missing anchor {anchor}")
    seed = ROOT / "data/warehouse/seeds/metric_registry_seed.csv"
    if not seed.exists():
        failures.append("missing metric_registry_seed.csv")
    else:
        with seed.open(newline="", encoding="utf-8") as f:
            rows = list(csv.DictReader(f))
        if len(rows) < 24:
            failures.append(f"metric registry expected >=24 rows, found {len(rows)}")
        for required in ["subscription_save_rate", "confirmed_cancellation_rate", "portal_completion_rate", "automation_containment_rate"]:
            if required not in {row.get("metric_key") for row in rows}:
                failures.append(f"metric registry missing {required}")
    if failures:
        print("Wave 5 data validation failed:")
        for failure in failures:
            print(f"- {failure}")
        return 1
    print("Wave 5 data validation passed.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
