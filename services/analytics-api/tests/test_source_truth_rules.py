from app.schemas.common import Platform
from app.schemas.source_truth import (
    CancellationValidationRequest,
    ContainmentEvaluationRequest,
    CostTooHighSequenceRequest,
    EvidenceState,
    OutcomeEvidence,
    PortalSuccessValidationRequest,
    SubscriptionOutcomeValidationRequest,
)
from app.services.source_truth_service import SourceTruthService


def test_portal_link_sent_is_not_success() -> None:
    decision = SourceTruthService().portal_success(
        PortalSuccessValidationRequest(
            completion_event=OutcomeEvidence(
                source=Platform.PORTAL,
                event_type="portal_link_sent",
                confirmed=True,
                state=EvidenceState.SENT,
            )
        )
    )
    assert decision.allowed is False


def test_portal_completed_is_success() -> None:
    decision = SourceTruthService().portal_success(
        PortalSuccessValidationRequest(
            completion_event=OutcomeEvidence(
                source=Platform.PORTAL,
                event_type="portal_completed",
                confirmed=True,
                state=EvidenceState.COMPLETED,
            )
        )
    )
    assert decision.allowed is True


def test_abandoned_call_is_not_containment_success() -> None:
    decision = SourceTruthService().automation_containment_success(
        ContainmentEvaluationRequest(abandoned=True, voice_resolved=True, portal_completed=True)
    )
    assert decision.allowed is False


def test_save_requires_stayai_confirmed_state() -> None:
    decision = SourceTruthService().subscription_save_confirmed(
        SubscriptionOutcomeValidationRequest(
            evidence=OutcomeEvidence(
                source=Platform.STAYAI,
                event_type="subscription_saved",
                confirmed=True,
                state=EvidenceState.SAVED,
            )
        )
    )
    assert decision.allowed is True


def test_cancel_request_without_stayai_cancelled_state_is_not_confirmed() -> None:
    decision = SourceTruthService().cancellation_confirmed(
        CancellationValidationRequest(
            evidence=OutcomeEvidence(
                source=Platform.SYNTHFLOW,
                event_type="customer_requested_cancel",
                confirmed=True,
                state=EvidenceState.UNKNOWN,
            )
        )
    )
    assert decision.allowed is False


def test_cost_too_high_sequence_must_offer_frequency_then_discount() -> None:
    invalid = SourceTruthService().validate_cost_too_high_sequence(
        CostTooHighSequenceRequest(offers=["discount_25_percent"], final_state="cancelled")
    )
    valid = SourceTruthService().validate_cost_too_high_sequence(
        CostTooHighSequenceRequest(
            offers=["frequency_change", "discount_25_percent"], final_state="cancelled"
        )
    )
    assert invalid.allowed is False
    assert valid.allowed is True
