from app.core.security import Permission, Role
from app.schemas.governance import (
    BackfillPolicyRequest,
    ExportPolicyEvaluationRequest,
    PermissionEvaluationRequest,
    TrustLabelEvaluationRequest,
)
from app.schemas.metric import TrustLabel
from app.services.governance_service import (
    evaluate_backfill_policy,
    evaluate_export_policy,
    evaluate_trust_label,
)
from app.services.rbac_service import evaluate_permission


def test_viewer_is_explicitly_denied_export_permission() -> None:
    result = evaluate_permission(
        PermissionEvaluationRequest(
            user_id="viewer-1",
            roles=[Role.VIEWER],
            requested_permission=Permission.EXPORT_METRICS,
        )
    )
    assert result.granted is False
    assert result.decision == "deny"
    assert "Explicit deny" in result.reason


def test_admin_explicit_deny_overrides_admin_role() -> None:
    result = evaluate_permission(
        PermissionEvaluationRequest(
            user_id="admin-1",
            roles=[Role.ADMIN],
            requested_permission=Permission.MANAGE_BACKFILL,
            explicit_denies=[Permission.MANAGE_BACKFILL],
        )
    )
    assert result.granted is False


def test_manual_trust_label_elevation_is_blocked() -> None:
    result = evaluate_trust_label(
        TrustLabelEvaluationRequest(
            metric_key="subscription_save_rate",
            requested_trust_label=TrustLabel.HIGH,
            evidence_sources=["synthflow"],
            manual_override_requested=True,
        )
    )
    assert result.allowed is False
    assert result.manual_override_blocked is True
    assert result.assigned_trust_label == TrustLabel.LOW


def test_export_policy_requires_audit_metadata() -> None:
    result = evaluate_export_policy(
        ExportPolicyEvaluationRequest(
            module="subscriptions",
            requested_by="qa@scentiment.internal",
            includes_fingerprint=False,
            includes_audit_reference=False,
        )
    )
    assert result.compliant is False
    assert "fingerprint" in result.missing_fields
    assert "audit_reference" in result.missing_fields


def test_backfill_requires_approved_change_request() -> None:
    result = evaluate_backfill_policy(
        BackfillPolicyRequest(
            requested_by="ops@scentiment.internal",
            reason="load historic Stay.ai subscription events",
            source_systems=["stayai"],
            start_date="2026-01-01",
            end_date="2026-01-31",
        )
    )
    assert result.allowed is False
    assert result.decision == "deny"
