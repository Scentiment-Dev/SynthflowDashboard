from app.schemas.governance import AuditAction, AuditEventCreate, GovernanceDecision
from app.services.audit_service import create_audit_event, reset_audit_events_for_tests, search_audit_events


def test_audit_event_gets_fingerprint_and_is_searchable() -> None:
    reset_audit_events_for_tests()
    event = create_audit_event(
        AuditEventCreate(
            actor="qa@scentiment.internal",
            action=AuditAction.PERMISSION_CHECK,
            resource="governance/rbac/evaluate",
            decision=GovernanceDecision.DENY,
            metadata={"permission": "export:metrics"},
        )
    )
    assert event.audit_id.startswith("audit_")
    assert len(event.fingerprint) == 64

    result = search_audit_events(actor="qa@scentiment.internal")
    assert result.count == 1
    assert result.events[0].fingerprint == event.fingerprint
