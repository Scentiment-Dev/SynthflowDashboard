from pathlib import Path

from app.pipelines.sample_payloads import load_sample_payloads


def test_sample_payloads_parse() -> None:
    for path in Path("app/sample_payloads").glob("*.json"):
        events = load_sample_payloads(path)
        assert events, f"Expected sample events in {path}"
