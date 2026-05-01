from app.schemas.metric import MetricCard, TrustLabel
from app.schemas.retention import RetentionOffer, RetentionSummary, SaveConfirmationResponse
from app.schemas.source_truth import SubscriptionOutcomeValidationRequest
from app.services.source_truth_service import SourceTruthService


def get_retention_summary() -> RetentionSummary:
    return RetentionSummary(
        cards=[
            MetricCard(
                key="subscription_save_rate",
                label="Subscription Save Rate",
                value="starter",
                trust_label=TrustLabel.MEDIUM,
                description="Stay.ai-confirmed saved/retained subscriptions divided by eligible attempts.",
                source_of_truth="Stay.ai",
            ),
            MetricCard(
                key="cost_too_high_offer_progression",
                label="Cost Too High Offer Progression",
                value="starter",
                trust_label=TrustLabel.MEDIUM,
                description="Frequency change offer before 25% discount before confirmed cancellation.",
                source_of_truth="Synthflow + Stay.ai",
            ),
        ],
        cost_too_high_sequence=[
            RetentionOffer.FREQUENCY_CHANGE,
            RetentionOffer.DISCOUNT_25_PERCENT,
        ],
    )


def confirm_save(request: SubscriptionOutcomeValidationRequest) -> SaveConfirmationResponse:
    decision = SourceTruthService().subscription_save_confirmed(request)
    return SaveConfirmationResponse(save_confirmed=decision.allowed, decision=decision)
