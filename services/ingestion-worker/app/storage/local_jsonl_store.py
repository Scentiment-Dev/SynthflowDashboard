from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from pydantic import BaseModel


class LocalJsonlStore:
    """Append-only JSONL store for local development and smoke tests."""

    def __init__(self, path: Path) -> None:
        self.path = path
        self.path.parent.mkdir(parents=True, exist_ok=True)

    def append(self, item: BaseModel | dict[str, Any]) -> None:
        payload = item.model_dump(mode="json") if isinstance(item, BaseModel) else item
        with self.path.open("a", encoding="utf-8") as handle:
            handle.write(json.dumps(payload, sort_keys=True) + "\n")

    def read_all(self) -> list[dict[str, Any]]:
        if not self.path.exists():
            return []
        return [json.loads(line) for line in self.path.read_text(encoding="utf-8").splitlines() if line.strip()]
