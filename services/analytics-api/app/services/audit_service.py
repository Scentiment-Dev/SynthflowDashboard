from hashlib import sha256
from uuid import uuid4

from app.schemas.governance import AuditEvent, AuditEventCreate, AuditLogSearchResult


_AUDIT_EVENTS: list[AuditEvent] = []


def create_audit_event(payload: AuditEventCreate) -> AuditEvent:
    audit_id = f"audit_{uuid4().hex[:12]}"
    fingerprint_payload = "|".join(
        [payload.actor, payload.action.value, payload.resource, payload.decision.value, audit_id]
    )
    event = AuditEvent(
        audit_id=audit_id,
        actor=payload.actor,
        action=payload.action,
        resource=payload.resource,
        decision=payload.decision,
        metadata=payload.metadata,
        fingerprint=sha256(fingerprint_payload.encode("utf-8")).hexdigest(),
    )
    _AUDIT_EVENTS.append(event)
    return event


def search_audit_events(actor: str | None = None, resource: str | None = None) -> AuditLogSearchResult:
    events = _AUDIT_EVENTS
    if actor:
        events = [event for event in events if event.actor == actor]
    if resource:
        events = [event for event in events if event.resource == resource]
    return AuditLogSearchResult(events=events[-100:], count=len(events))


def reset_audit_events_for_tests() -> None:
    _AUDIT_EVENTS.clear()
