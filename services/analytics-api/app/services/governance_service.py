from app.schemas.governance import (
    BackfillPolicyRequest,
    BackfillPolicyResult,
    ExportPolicyEvaluationRequest,
    ExportPolicyEvaluationResult,
    GovernanceDecision,
    GovernanceRuleSummary,
    TrustLabelEvaluationRequest,
    TrustLabelEvaluationResult,
)
from app.schemas.metric import TrustLabel
from app.services.source_truth_service import NO_DRIFT_RULES


def governance_rules() -> list[GovernanceRuleSummary]:
    # Trust labels are system-calculated and cannot be manually elevated.
    # Historical backfill is not base launch scope unless handled through a governed reprocess/backfill pipeline.
    return [
        GovernanceRuleSummary(
            key="portal_completion",
            rule=NO_DRIFT_RULES[0],
            enforced_in=["SourceTruthService.portal_success", "dbt tests", "ingestion normalizer"],
        ),
        GovernanceRuleSummary(
            key="containment_exclusion",
            rule=NO_DRIFT_RULES[1],
            enforced_in=["SourceTruthService.automation_containment_success", "dbt tests"],
        ),
        GovernanceRuleSummary(
            key="stayai_subscription_source_truth",
            rule=NO_DRIFT_RULES[2],
            enforced_in=["SourceTruthService", "dbt tests", "metric registry"],
        ),
        GovernanceRuleSummary(
            key="trust_labels_system_calculated",
            rule=NO_DRIFT_RULES[7],
            enforced_in=["TrustLabelEvaluation", "dbt tests", "exports"],
        ),
        GovernanceRuleSummary(
            key="export_metadata_required",
            rule=NO_DRIFT_RULES[8],
            enforced_in=["ExportService", "dbt tests", "frontend export form"],
        ),
        GovernanceRuleSummary(
            key="server_side_explicit_deny",
            rule=NO_DRIFT_RULES[9],
            enforced_in=["FastAPI dependencies", "RBAC service", "backend tests"],
        ),
        GovernanceRuleSummary(
            key="governed_backfill_only",
            rule=NO_DRIFT_RULES[10],
            enforced_in=["Backfill policy evaluator", "warehouse backfill_control"],
        ),
    ]


def evaluate_trust_label(request: TrustLabelEvaluationRequest) -> TrustLabelEvaluationResult:
    if request.manual_override_requested:
        return TrustLabelEvaluationResult(
            metric_key=request.metric_key,
            allowed=False,
            assigned_trust_label=TrustLabel.LOW,
            requested_trust_label=request.requested_trust_label,
            manual_override_blocked=True,
            reason="Manual trust-label elevation is blocked; trust must be calculated from evidence.",
        )
    evidence_count = len(request.evidence_sources)
    assigned = TrustLabel.HIGH if evidence_count >= 2 else TrustLabel.MEDIUM if evidence_count == 1 else TrustLabel.LOW
    return TrustLabelEvaluationResult(
        metric_key=request.metric_key,
        allowed=True,
        assigned_trust_label=assigned,
        requested_trust_label=request.requested_trust_label,
        manual_override_blocked=False,
        reason="Trust label calculated from available evidence sources.",
    )


def evaluate_export_policy(request: ExportPolicyEvaluationRequest) -> ExportPolicyEvaluationResult:
    required = {
        "filters": request.includes_filters,
        "definitions": request.includes_definitions,
        "trust_labels": request.includes_trust_labels,
        "freshness": request.includes_freshness,
        "formula_versions": request.includes_formula_versions,
        "owner": request.includes_owner,
        "timestamp": request.includes_timestamp,
        "fingerprint": request.includes_fingerprint,
        "audit_reference": request.includes_audit_reference,
    }
    missing = [field for field, present in required.items() if not present]
    return ExportPolicyEvaluationResult(
        compliant=not missing,
        missing_fields=missing,
        decision=GovernanceDecision.ALLOW if not missing else GovernanceDecision.DENY,
    )


def evaluate_backfill_policy(request: BackfillPolicyRequest) -> BackfillPolicyResult:
    approved = bool(request.approved_change_request_id and request.reason and request.source_systems)
    return BackfillPolicyResult(
        allowed=approved,
        decision=GovernanceDecision.ALLOW if approved else GovernanceDecision.DENY,
        reason=(
            "Backfill is tied to a governed approved change request."
            if approved
            else "Backfill is blocked until an approved change request and governed reprocess path exist."
        ),
        dry_run=request.dry_run,
    )
