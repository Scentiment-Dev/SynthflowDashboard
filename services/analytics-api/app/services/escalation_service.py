from app.schemas.escalation import EscalationSummary
from app.schemas.metric import MetricCard, TrustLabel


def get_escalation_summary() -> EscalationSummary:
    return EscalationSummary(
        cards=[
            MetricCard(
                key="escalation_rate",
                label="Escalation Rate",
                value="starter",
                trust_label=TrustLabel.MEDIUM,
                description="Live-agent transfers divided by eligible automation calls.",
                source_of_truth="Synthflow + RingCX/support case system",
            ),
            MetricCard(
                key="escalation_reason_mix",
                label="Escalation Reason Mix",
                value="starter",
                trust_label=TrustLabel.MEDIUM,
                description="Top reasons calls are handed off to support.",
                source_of_truth="Synthflow + support cases",
            ),
        ]
    )
