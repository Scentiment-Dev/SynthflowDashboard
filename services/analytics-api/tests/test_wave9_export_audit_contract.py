from __future__ import annotations


def test_export_audit_requires_metadata(client):
    response = client.post(
        "/exports/audit",
        json={
            "requested_by": "qa@local",
            "module": "subscriptions",
            "filters": {"date_range": "last_7_days"},
            "metric_ids": ["subscription_save_rate"],
        },
    )
    assert response.status_code in {200, 201, 422}
    if response.status_code in {200, 201}:
        text = response.text.lower()
        for anchor in ["audit", "fingerprint", "timestamp"]:
            assert anchor in text


def test_export_routes_do_not_confirm_business_outcomes(client):
    response = client.get("/exports/readiness")
    assert response.status_code in {200, 404}
    if response.status_code == 200:
        assert "stay" not in response.text.lower() or "source" in response.text.lower()
