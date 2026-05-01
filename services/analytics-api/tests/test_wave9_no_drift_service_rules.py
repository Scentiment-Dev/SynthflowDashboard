from __future__ import annotations

from app.schemas.common import Platform
from app.schemas.source_truth import (
    EvidenceState,
    OutcomeEvidence,
    PortalSuccessValidationRequest,
    SubscriptionOutcomeValidationRequest,
)
from app.services.source_truth_service import SourceTruthService


def test_portal_link_sent_is_not_completion():
    service = SourceTruthService()
    result = service.portal_success(
        PortalSuccessValidationRequest(
            completion_event=OutcomeEvidence(
                source=Platform.PORTAL,
                event_type="portal_link_sent",
                confirmed=False,
                state=EvidenceState.SENT,
            )
        )
    )
    assert result.allowed is False


def test_shopify_cannot_confirm_subscription_save():
    service = SourceTruthService()
    result = service.subscription_save_confirmed(
        SubscriptionOutcomeValidationRequest(
            evidence=OutcomeEvidence(
                source=Platform.SHOPIFY,
                event_type="subscription_saved",
                confirmed=True,
                state=EvidenceState.SAVED,
            )
        )
    )
    assert result.allowed is False


def test_trust_label_manual_elevation_rejected():
    service = SourceTruthService()
    assert service.trust_label_can_be_manual() is False
