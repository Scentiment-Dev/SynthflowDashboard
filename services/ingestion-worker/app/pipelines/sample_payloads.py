from __future__ import annotations

import json
from pathlib import Path

from app.schemas.raw_event import RawEvent


def load_sample_payloads(path: Path) -> list[RawEvent]:
    if not path.exists():
        return []
    return [RawEvent.model_validate(row) for row in json.loads(path.read_text(encoding="utf-8"))]
