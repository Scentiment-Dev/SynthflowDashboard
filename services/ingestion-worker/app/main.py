from __future__ import annotations

import argparse
import json

from app.core.logging import configure_logging
from app.pipelines import ingest_calls, ingest_live_agent_events, ingest_orders, ingest_portal_events, ingest_subscriptions

PIPELINES = {
    "calls": ingest_calls.run,
    "subscriptions": ingest_subscriptions.run,
    "orders": ingest_orders.run,
    "portal": ingest_portal_events.run,
    "live_agent": ingest_live_agent_events.run,
}


def run_once(pipeline: str = "all") -> dict[str, object]:
    if pipeline == "all":
        return {name: fn() for name, fn in PIPELINES.items()}
    if pipeline not in PIPELINES:
        raise ValueError(f"Unknown pipeline {pipeline}. Expected one of: {', '.join(['all', *PIPELINES])}")
    return {pipeline: PIPELINES[pipeline]()}


def main() -> None:
    parser = argparse.ArgumentParser(description="Scentiment analytics ingestion worker")
    parser.add_argument("--once", action="store_true", help="Run once and exit")
    parser.add_argument("--pipeline", default="all", choices=["all", *PIPELINES.keys()])
    parser.add_argument("--log-level", default="INFO")
    args = parser.parse_args()
    configure_logging(args.log_level)
    if args.once:
        print(json.dumps(run_once(args.pipeline), indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
