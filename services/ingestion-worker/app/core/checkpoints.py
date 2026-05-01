from __future__ import annotations

import json
from pathlib import Path
from typing import Any


class CheckpointStore:
    """Small local checkpoint store for development.

    Production can replace this with DynamoDB, Postgres, Redis, or a queue cursor
    table without changing the pipeline runner interface.
    """

    def __init__(self, path: Path) -> None:
        self.path = path
        self.path.parent.mkdir(parents=True, exist_ok=True)

    def read(self, source: str) -> str | None:
        data = self._read_all()
        value = data.get(source)
        return str(value) if value is not None else None

    def write(self, source: str, cursor: str | None) -> None:
        data = self._read_all()
        data[source] = cursor
        self.path.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n", encoding="utf-8")

    def _read_all(self) -> dict[str, Any]:
        if not self.path.exists():
            return {}
        try:
            return json.loads(self.path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            return {}
