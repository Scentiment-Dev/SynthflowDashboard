from __future__ import annotations

import json
from pathlib import Path


def test_sample_payload_files_are_json_arrays():
    payload_dir = Path(__file__).resolve().parents[1] / "app" / "sample_payloads"
    expected = [
        "synthflow_call_events.json",
        "stayai_subscription_events.json",
        "shopify_order_events.json",
        "portal_events.json",
        "live_agent_events.json",
    ]
    for filename in expected:
        path = payload_dir / filename
        assert path.exists(), filename
        payload = json.loads(path.read_text())
        assert isinstance(payload, list)
        assert payload, filename
