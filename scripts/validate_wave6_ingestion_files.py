from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = [
    "services/ingestion-worker/app/core/config.py",
    "services/ingestion-worker/app/core/checkpoints.py",
    "services/ingestion-worker/app/core/retry.py",
    "services/ingestion-worker/app/core/errors.py",
    "services/ingestion-worker/app/connectors/base.py",
    "services/ingestion-worker/app/connectors/registry.py",
    "services/ingestion-worker/app/pipelines/runner.py",
    "services/ingestion-worker/app/pipelines/normalize_events.py",
    "services/ingestion-worker/app/storage/local_jsonl_store.py",
    "services/ingestion-worker/app/sample_payloads/synthflow_call_events.json",
    "services/ingestion-worker/app/sample_payloads/stayai_subscription_events.json",
    "services/ingestion-worker/app/sample_payloads/shopify_order_events.json",
    "services/ingestion-worker/app/sample_payloads/portal_events.json",
    "services/ingestion-worker/app/sample_payloads/live_agent_events.json",
    "services/ingestion-worker/tests/test_connector_safety.py",
    "services/ingestion-worker/tests/test_no_drift_normalization.py",
    "services/ingestion-worker/tests/test_pipeline_runner.py",
]
ANCHORS = [
    "Stay.ai is subscription outcome source of truth",
    "Portal link sent is not portal completion",
    "Transferred/abandoned calls are excluded from successful containment",
    "Trust labels are system-calculated",
]


def main() -> None:
    missing = [path for path in REQUIRED if not (ROOT / path).exists()]
    if missing:
        raise SystemExit(f"Missing Wave 6 files: {missing}")
    text = (ROOT / "services/ingestion-worker/app/pipelines/normalize_events.py").read_text(encoding="utf-8")
    absent = [anchor for anchor in ANCHORS if anchor not in text]
    if absent:
        raise SystemExit(f"Missing Wave 6 no-drift anchors: {absent}")
    print("Wave 6 ingestion validation passed")


if __name__ == "__main__":
    main()
