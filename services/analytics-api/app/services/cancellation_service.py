from app.schemas.cancellation import CancellationSummary, CostTooHighValidationResponse
from app.schemas.metric import MetricCard, TrustLabel
from app.schemas.source_truth import CancellationValidationRequest, CostTooHighSequenceRequest
from app.services.source_truth_service import SourceTruthService


def get_cancellation_summary() -> CancellationSummary:
    return CancellationSummary(
        cards=[
            MetricCard(
                key="confirmed_cancellation_rate",
                label="Confirmed Cancellation Rate",
                value="starter",
                trust_label=TrustLabel.MEDIUM,
                description="Confirmed cancelled state divided by eligible cancellation attempts.",
                source_of_truth="Stay.ai",
            ),
            MetricCard(
                key="cancellation_reason_mix",
                label="Cancellation Reason Mix",
                value="starter",
                trust_label=TrustLabel.MEDIUM,
                description="Cancellation reason distribution from confirmed Stay.ai cancellation journey data.",
                source_of_truth="Stay.ai/Synthflow",
            ),
        ]
    )


def confirm_cancellation(request: CancellationValidationRequest):
    return SourceTruthService().cancellation_confirmed(request)


def validate_cost_too_high_sequence(
    request: CostTooHighSequenceRequest,
) -> CostTooHighValidationResponse:
    decision = SourceTruthService().validate_cost_too_high_sequence(request)
    return CostTooHighValidationResponse(sequence_valid=decision.allowed, decision=decision)
