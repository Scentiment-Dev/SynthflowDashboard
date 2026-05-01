from app.core.retry import run_with_retries


def test_run_with_retries_succeeds_after_retry() -> None:
    attempts = {"count": 0}

    def flaky() -> str:
        attempts["count"] += 1
        if attempts["count"] < 2:
            raise RuntimeError("try again")
        return "ok"

    assert run_with_retries(flaky, max_retries=3) == "ok"
    assert attempts["count"] == 2
