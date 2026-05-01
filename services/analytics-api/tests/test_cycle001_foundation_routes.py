from __future__ import annotations

from fastapi.testclient import TestClient

from app.schemas.common import Platform
from app.schemas.export import ExportAuditRecord
from app.services.export_service import validate_export_metadata


def test_cycle001_foundation_routes_and_permissions(client: TestClient) -> None:
    # Keep this smoke-style route sweep explicit for governance PR checks.
    # Cover CSV header parsing path in dependency scaffold.
    metric_resp = client.get(
        "/metrics/definitions",
        headers={"x-scentiment-permissions": "read:metrics, export:metrics"},
    )
    assert metric_resp.status_code == 200

    # Cover explicit deny path (403) in permission dependency.
    denied_resp = client.get(
        "/governance/rules",
        headers={"x-scentiment-roles": "viewer"},
    )
    assert denied_resp.status_code == 403

    assert client.get("/metrics/modules").status_code == 200
    assert client.get("/metrics/subscription_save_rate/series").status_code == 200
    assert client.get("/subscriptions/summary").status_code == 200
    assert client.get("/cancellations/summary").status_code == 200
    assert client.get("/retention/summary").status_code == 200
    assert client.get("/order-status/summary").status_code == 200
    assert client.get("/escalations/summary").status_code == 200
    assert client.get("/audit/events", params={"resource": "governance/rbac/evaluate"}).status_code == 200
    assert client.get("/governance/no-drift-rules").status_code == 200
    assert client.get("/governance/rbac/matrix").status_code == 200
    assert client.get("/governance/trust-labels/manual-elevation").status_code == 200


def test_cycle001_foundation_mutating_routes(client: TestClient) -> None:
    evidence = {
        "source": "stayai",
        "event_type": "subscription_saved",
        "confirmed": True,
        "state": "saved",
        "reference_id": "ev-1",
    }

    subscription_confirm = client.post(
        "/subscriptions/actions/confirm",
        json={"action": "save", "evidence": evidence},
    )
    assert subscription_confirm.status_code == 200
    assert subscription_confirm.json()["decision"]["allowed"] is True

    portal_validate = client.post(
        "/subscriptions/portal-success/validate",
        json={
            "completion_event": {
                "source": "portal",
                "event_type": "portal_completed",
                "confirmed": True,
                "state": "completed",
                "reference_id": "portal-1",
            }
        },
    )
    assert portal_validate.status_code == 200
    assert portal_validate.json()["allowed"] is True

    cancellation_confirm = client.post(
        "/cancellations/confirm",
        json={"approved_official_path": True},
    )
    assert cancellation_confirm.status_code == 200
    assert cancellation_confirm.json()["allowed"] is True

    cost_too_high = client.post(
        "/cancellations/cost-too-high/validate",
        json={"offers": ["frequency_change", "discount_25_percent"], "final_state": "cancelled"},
    )
    assert cost_too_high.status_code == 200
    assert cost_too_high.json()["sequence_valid"] is True

    save_confirm = client.post(
        "/retention/save/confirm",
        json={"evidence": evidence},
    )
    assert save_confirm.status_code == 200
    assert save_confirm.json()["save_confirmed"] is True

    shopify_invalid = client.post(
        "/order-status/shopify-context/validate",
        json={"shopify_evidence": None},
    )
    assert shopify_invalid.status_code == 200
    assert shopify_invalid.json()["valid"] is False

    shopify_valid = client.post(
        "/order-status/shopify-context/validate",
        json={
            "shopify_evidence": {
                "source": "shopify",
                "event_type": "order_updated",
                "confirmed": True,
                "state": "completed",
            }
        },
    )
    assert shopify_valid.status_code == 200
    assert shopify_valid.json()["valid"] is True

    export_audit = client.post(
        "/exports/audit",
        json={
            "requested_by": "qa@scentiment.internal",
            "module": "subscriptions",
            "filters": {"platforms": ["stayai"]},
            "metric_keys": ["subscription_save_rate"],
        },
    )
    assert export_audit.status_code == 200
    export_record = export_audit.json()

    export_validate = client.post("/exports/audit/validate", json=export_record)
    assert export_validate.status_code == 200
    assert export_validate.json()["compliant"] is True

    export_policy = client.post(
        "/exports/policy/evaluate",
        json={
            "module": "subscriptions",
            "requested_by": "qa@scentiment.internal",
            "includes_fingerprint": False,
            "includes_audit_reference": False,
        },
    )
    assert export_policy.status_code == 200
    assert export_policy.json()["compliant"] is False

    audit_event = client.post(
        "/audit/events",
        json={
            "actor": "qa@scentiment.internal",
            "action": "permission_check",
            "resource": "governance/rbac/evaluate",
            "decision": "deny",
            "metadata": {"permission": "export:metrics"},
        },
    )
    assert audit_event.status_code == 200
    assert audit_event.json()["audit_id"].startswith("audit_")

    trust_eval = client.post(
        "/governance/trust-labels/evaluate",
        json={
            "metric_key": "subscription_save_rate",
            "requested_trust_label": "high",
            "evidence_sources": [],
            "manual_override_requested": False,
        },
    )
    assert trust_eval.status_code == 200
    assert trust_eval.json()["assigned_trust_label"] == "low"

    rbac_eval = client.post(
        "/governance/rbac/evaluate",
        json={
            "user_id": "u-1",
            "roles": ["viewer"],
            "requested_permission": "read:governance",
            "explicit_denies": [],
        },
    )
    assert rbac_eval.status_code == 200
    assert rbac_eval.json()["granted"] is False

    export_eval = client.post(
        "/governance/exports/evaluate",
        json={"module": "subscriptions", "requested_by": "qa@scentiment.internal"},
    )
    assert export_eval.status_code == 200
    assert export_eval.json()["compliant"] is True

    backfill_eval = client.post(
        "/governance/backfills/evaluate",
        json={
            "requested_by": "ops@scentiment.internal",
            "reason": "patch missing events",
            "source_systems": ["stayai"],
            "start_date": "2026-01-01",
            "end_date": "2026-01-15",
            "approved_change_request_id": "CR-1001",
            "dry_run": True,
        },
    )
    assert backfill_eval.status_code == 200
    assert backfill_eval.json()["allowed"] is True

    containment_eval = client.post(
        "/governance/containment/evaluate",
        json={
            "abandoned": False,
            "unresolved": False,
            "voice_resolved": True,
            "portal_completed": False,
            "transferred_to_agent": False,
        },
    )
    assert containment_eval.status_code == 200
    assert containment_eval.json()["allowed"] is True


def test_export_validation_reports_missing_fields() -> None:
    record = ExportAuditRecord(
        export_id="exp_123",
        requested_by="qa@scentiment.internal",
        module="subscriptions",
        filters={},
        metric_keys=["subscription_save_rate"],
        definitions_included=False,
        trust_labels_included=False,
        freshness_included=False,
        formula_versions_included=False,
        owner="",
        fingerprint="",
        audit_reference="",
    )
    result = validate_export_metadata(record)
    assert result.compliant is False
    assert {"filters", "definitions", "trust_labels", "freshness", "formula_versions"}.issubset(
        set(result.missing_fields)
    )


def test_order_status_validation_uses_shopify_context_rule(client: TestClient) -> None:
    response = client.post(
        "/order-status/shopify-context/validate",
        json={
            "shopify_evidence": {
                "source": Platform.SYNTHFLOW.value,
                "event_type": "order_status_guess",
                "confirmed": True,
                "state": "completed",
            }
        },
    )
    assert response.status_code == 200
    assert response.json()["valid"] is False
