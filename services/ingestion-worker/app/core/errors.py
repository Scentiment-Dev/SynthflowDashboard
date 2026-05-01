from __future__ import annotations

from dataclasses import dataclass
from typing import Any


class IngestionError(Exception):
    """Base ingestion exception."""


class ConnectorDisabledError(IngestionError):
    """Raised when a live connector is requested without being enabled."""


class SourceTruthViolation(IngestionError):
    """Raised when an event attempts to claim an outcome from the wrong source."""


@dataclass(frozen=True)
class DeadLetterRecord:
    source: str
    pipeline: str
    reason: str
    raw_payload: dict[str, Any]
