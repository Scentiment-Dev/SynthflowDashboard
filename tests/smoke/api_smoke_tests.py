from __future__ import annotations

import os
import urllib.request


def test_api_health_smoke_when_local_api_url_set():
    """Smoke test for local/dev API.

    This test is intentionally skipped unless API_BASE_URL is supplied. CI can run
    it after docker compose starts the stack; local agents can run it manually.
    """
    base_url = os.getenv("API_BASE_URL")
    if not base_url:
        return
    with urllib.request.urlopen(f"{base_url.rstrip('/')}/health", timeout=10) as response:
        assert response.status == 200
        assert b"status" in response.read()
