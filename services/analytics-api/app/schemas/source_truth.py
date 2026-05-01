from enum import StrEnum
from pydantic import BaseModel, Field

from app.schemas.common import Platform


class EvidenceState(StrEnum):
    ACTIVE = "active"
    RETAINED = "retained"
    SAVED = "saved"
    CANCELLED = "cancelled"
    COMPLETED = "completed"
    SENT = "sent"
    STARTED = "started"
    UNKNOWN = "unknown"


class OutcomeEvidence(BaseModel):
    source: Platform
    event_type: str
    confirmed: bool = False
    state: EvidenceState = EvidenceState.UNKNOWN
    reference_id: str | None = None
    notes: str | None = None


class SourceTruthDecision(BaseModel):
    allowed: bool
    trust_label: str
    source_of_truth: str
    reason: str
    no_drift_rule: str
    evidence_reference_id: str | None = None


class PortalSuccessValidationRequest(BaseModel):
    completion_event: OutcomeEvidence | None = None


class ContainmentEvaluationRequest(BaseModel):
    abandoned: bool = False
    unresolved: bool = False
    voice_resolved: bool = False
    portal_completed: bool = False
    transferred_to_agent: bool = False


class SubscriptionOutcomeValidationRequest(BaseModel):
    evidence: OutcomeEvidence | None = None


class CancellationValidationRequest(BaseModel):
    evidence: OutcomeEvidence | None = None
    approved_official_path: bool = False


class CostTooHighSequenceRequest(BaseModel):
    offers: list[str] = Field(default_factory=list)
    final_state: str
