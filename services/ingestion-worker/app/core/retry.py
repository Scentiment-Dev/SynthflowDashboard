from __future__ import annotations

from collections.abc import Callable
import time
from typing import TypeVar

T = TypeVar("T")


def run_with_retries(operation: Callable[[], T], max_retries: int = 3, base_delay_seconds: float = 0.0) -> T:
    """Run an operation with deterministic retry behavior.

    The default delay is zero so unit tests and local dry-runs are fast. Production
    can set a non-zero base delay or replace this with tenacity/backoff.
    """

    attempts = 0
    last_error: Exception | None = None
    while attempts < max_retries:
        try:
            return operation()
        except Exception as exc:  # noqa: BLE001 - deliberate retry boundary
            last_error = exc
            attempts += 1
            if attempts >= max_retries:
                break
            if base_delay_seconds:
                time.sleep(base_delay_seconds * attempts)
    assert last_error is not None
    raise last_error
