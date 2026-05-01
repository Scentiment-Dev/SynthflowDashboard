from __future__ import annotations

import hashlib
import json
from typing import Any

from app.core.errors import SourceTruthViolation
from app.schemas.normalized_event import NormalizedEvent
from app.schemas.raw_event import RawEvent, RawSource

OFFICIAL_OUTCOME_SOURCES: dict[RawSource, set[str]] = {
    RawSource.STAYAI: {
        "subscription_state",
        "subscription_cancelled",
        "subscription_saved",
        "retention_offer_accepted",
        "frequency_changed",
        "pause_confirmed",
        "skip_confirmed",
    },
    RawSource.SHOPIFY: {"order_created", "fulfillment_updated", "tracking_updated", "customer_updated"},
    RawSource.PORTAL: {"portal_completed"},
    RawSource.LIVE_AGENT: {"agent_transfer", "case_created", "case_resolved"},
    RawSource.SYNTHFLOW: set(),
}

FORBIDDEN_CLAIMS: dict[RawSource, set[str]] = {
    RawSource.SYNTHFLOW: {"subscription_saved", "subscription_cancelled", "portal_completed"},
    RawSource.SHOPIFY: {"subscription_saved", "subscription_cancelled", "subscription_state"},
    RawSource.PORTAL: {"subscription_saved", "subscription_cancelled"},
    RawSource.LIVE_AGENT: {"contained_success"},
}


def normalize_event(raw: RawEvent) -> NormalizedEvent:
    _assert_source_truth(raw)
    payload: dict[str, Any] = dict(raw.payload)
    raw_payload_hash = hashlib.sha256(json.dumps(raw.payload, sort_keys=True).encode()).hexdigest()
    event_id = hashlib.sha256(f"{raw.source}:{raw.external_id}:{raw.event_type}:{raw.occurred_at}".encode()).hexdigest()
    notes = _source_truth_notes(raw)
    trust_label = _trust_label(raw)
    payload.update(
        {
            "raw_source": raw.source.value,
            "raw_payload_hash": raw_payload_hash,
            "external_id": raw.external_id,
            "cursor": raw.cursor,
        }
    )
    return NormalizedEvent(
        event_id=event_id,
        source=raw.source.value,
        event_type=raw.event_type,
        occurred_at=raw.occurred_at,
        customer_id=payload.get("customer_id"),
        call_id=payload.get("call_id"),
        subscription_id=payload.get("subscription_id"),
        order_id=payload.get("order_id"),
        is_official_outcome=raw.event_type in OFFICIAL_OUTCOME_SOURCES.get(raw.source, set()),
        trust_label=trust_label,
        source_truth_notes=notes,
        payload=payload,
    )


def _assert_source_truth(raw: RawEvent) -> None:
    forbidden = FORBIDDEN_CLAIMS.get(raw.source, set())
    if raw.event_type in forbidden:
        raise SourceTruthViolation(f"{raw.source.value} cannot claim event_type={raw.event_type}")
    if raw.event_type == "portal_link_sent" and raw.payload.get("portal_completed") is True:
        raise SourceTruthViolation("Portal link sent cannot be upgraded to portal completed.")
    if raw.payload.get("manual_trust_label") in {"high", "official"}:
        raise SourceTruthViolation("Trust labels are system-calculated and cannot be manually elevated.")


def _source_truth_notes(raw: RawEvent) -> list[str]:
    notes: list[str] = []
    if raw.source == RawSource.STAYAI:
        notes.append("Stay.ai is subscription outcome source of truth.")
    if raw.source == RawSource.SHOPIFY:
        notes.append("Shopify is order/customer/product context source of truth only.")
    if raw.event_type == "portal_link_sent":
        notes.append("Portal link sent is not portal completion.")
    if raw.event_type in {"agent_transfer", "call_abandoned"}:
        notes.append("Transferred/abandoned calls are excluded from successful containment.")
    return notes


def _trust_label(raw: RawEvent) -> str:
    if raw.event_type in OFFICIAL_OUTCOME_SOURCES.get(raw.source, set()):
        return "official"
    if raw.source in {RawSource.SYNTHFLOW, RawSource.SHOPIFY, RawSource.PORTAL, RawSource.LIVE_AGENT}:
        return "context"
    return "low"
