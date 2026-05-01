from app.schemas.common import Platform
from app.schemas.source_truth import (
    CancellationValidationRequest,
    ContainmentEvaluationRequest,
    CostTooHighSequenceRequest,
    EvidenceState,
    OutcomeEvidence,
    PortalSuccessValidationRequest,
    SourceTruthDecision,
    SubscriptionOutcomeValidationRequest,
)

NO_DRIFT_RULES = [
    "Portal success requires confirmed portal completion, not link sent.",
    "Abandoned/drop-off and unresolved calls are excluded from successful containment.",
    "Stay.ai remains the source of truth for subscription state/action/cancellation/save outcomes.",
    "Shopify remains the source of truth for order/product/customer/order-status context.",
    "Save requires confirmed retained subscription outcome.",
    "Confirmed cancellation requires Stay.ai cancelled state or an approved official completion path.",
    "Cost Too High cancellation flow sequence is: frequency change offer -> 25% off offer -> confirmed cancellation if both are declined.",
    "Trust labels are system-calculated and cannot be manually elevated.",
    "Exports must include filters, definitions, trust labels, freshness, formula versions, owner, timestamp, fingerprint, and audit reference.",
    "Permissions are enforced server-side using explicit deny.",
    "Historical backfill is not base launch scope unless handled through a governed reprocess/backfill pipeline.",
    "Do not reopen locked blueprint waves unless Kevin explicitly requests a formal change request.",
]


class SourceTruthService:
    """Central deterministic enforcement for locked source-of-truth rules."""

    def portal_success(self, request: PortalSuccessValidationRequest) -> SourceTruthDecision:
        evidence = request.completion_event
        allowed = bool(
            evidence
            and evidence.source in {Platform.PORTAL, Platform.STAYAI}
            and evidence.confirmed
            and evidence.state == EvidenceState.COMPLETED
        )
        return SourceTruthDecision(
            allowed=allowed,
            trust_label="high" if allowed else "low",
            source_of_truth="Portal/Stay.ai completion event",
            reason="Confirmed portal completion found." if allowed else "A link sent or unconfirmed event is not portal success.",
            no_drift_rule=NO_DRIFT_RULES[0],
            evidence_reference_id=evidence.reference_id if evidence else None,
        )

    def automation_containment_success(
        self, request: ContainmentEvaluationRequest
    ) -> SourceTruthDecision:
        if request.abandoned or request.unresolved or request.transferred_to_agent:
            return SourceTruthDecision(
                allowed=False,
                trust_label="high",
                source_of_truth="Synthflow + warehouse disposition",
                reason="Abandoned, unresolved, or transferred calls are excluded from successful containment.",
                no_drift_rule=NO_DRIFT_RULES[1],
            )
        allowed = request.voice_resolved or request.portal_completed
        return SourceTruthDecision(
            allowed=allowed,
            trust_label="high" if allowed else "medium",
            source_of_truth="Synthflow + confirmed downstream completion",
            reason="Voice resolution or confirmed portal completion qualifies." if allowed else "No successful completion signal found.",
            no_drift_rule=NO_DRIFT_RULES[1],
        )

    def subscription_save_confirmed(
        self, request: SubscriptionOutcomeValidationRequest
    ) -> SourceTruthDecision:
        evidence = request.evidence
        allowed = bool(
            evidence
            and evidence.source == Platform.STAYAI
            and evidence.confirmed
            and evidence.state in {EvidenceState.ACTIVE, EvidenceState.RETAINED, EvidenceState.SAVED}
        )
        return SourceTruthDecision(
            allowed=allowed,
            trust_label="high" if allowed else "low",
            source_of_truth="Stay.ai",
            reason="Stay.ai retained/saved/active state confirmed." if allowed else "Save requires confirmed retained subscription outcome from Stay.ai.",
            no_drift_rule=NO_DRIFT_RULES[4],
            evidence_reference_id=evidence.reference_id if evidence else None,
        )

    def cancellation_confirmed(
        self, request: CancellationValidationRequest
    ) -> SourceTruthDecision:
        evidence = request.evidence
        allowed = bool(
            request.approved_official_path
            or (
                evidence
                and evidence.source == Platform.STAYAI
                and evidence.confirmed
                and evidence.state == EvidenceState.CANCELLED
            )
        )
        return SourceTruthDecision(
            allowed=allowed,
            trust_label="high" if allowed else "low",
            source_of_truth="Stay.ai or approved official completion path",
            reason="Confirmed cancellation path found." if allowed else "Cancellation request alone is not a confirmed cancellation.",
            no_drift_rule=NO_DRIFT_RULES[5],
            evidence_reference_id=evidence.reference_id if evidence else None,
        )

    def validate_cost_too_high_sequence(
        self, request: CostTooHighSequenceRequest
    ) -> SourceTruthDecision:
        required = ["frequency_change", "discount_25_percent"]
        valid = request.final_state != "cancelled" or request.offers[:2] == required
        return SourceTruthDecision(
            allowed=valid,
            trust_label="high" if valid else "low",
            source_of_truth="Synthflow journey + Stay.ai final state",
            reason="Cost Too High sequence preserved." if valid else "Cancelled Cost Too High path must offer frequency change before 25% off.",
            no_drift_rule=NO_DRIFT_RULES[6],
        )

    def shopify_order_context_valid(self, evidence: OutcomeEvidence | None) -> SourceTruthDecision:
        allowed = bool(evidence and evidence.source == Platform.SHOPIFY and evidence.confirmed)
        return SourceTruthDecision(
            allowed=allowed,
            trust_label="high" if allowed else "low",
            source_of_truth="Shopify",
            reason="Confirmed Shopify order context found." if allowed else "Order status context must come from Shopify.",
            no_drift_rule=NO_DRIFT_RULES[3],
            evidence_reference_id=evidence.reference_id if evidence else None,
        )

    def trust_label_can_be_manual(self) -> bool:
        return False
