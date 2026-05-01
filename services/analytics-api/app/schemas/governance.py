from datetime import UTC, datetime
from enum import StrEnum
from pydantic import BaseModel, Field

from app.core.security import Permission, Role
from app.schemas.metric import TrustLabel


class GovernanceDecision(StrEnum):
    ALLOW = "allow"
    DENY = "deny"
    NEEDS_REVIEW = "needs_review"


class AuditAction(StrEnum):
    READ = "read"
    EXPORT_REQUESTED = "export_requested"
    EXPORT_VALIDATED = "export_validated"
    PERMISSION_CHECK = "permission_check"
    TRUST_LABEL_EVALUATED = "trust_label_evaluated"
    BACKFILL_REQUESTED = "backfill_requested"
    GOVERNANCE_RULE_READ = "governance_rule_read"


class GovernanceRuleSummary(BaseModel):
    key: str
    rule: str
    owner: str = "governance"
    enforced_in: list[str] = Field(default_factory=list)
    launch_blocker_if_missing: bool = True


class PermissionEvaluationRequest(BaseModel):
    user_id: str
    roles: list[Role] = Field(default_factory=list)
    requested_permission: Permission
    explicit_denies: list[Permission] = Field(default_factory=list)


class PermissionEvaluationResult(BaseModel):
    user_id: str
    requested_permission: Permission
    granted: bool
    decision: GovernanceDecision
    resolved_permissions: list[Permission]
    explicit_denies: list[Permission]
    reason: str
    rule: str = "Permissions are enforced server-side using explicit deny."


class TrustLabelEvaluationRequest(BaseModel):
    metric_key: str
    requested_trust_label: TrustLabel
    evidence_sources: list[str] = Field(default_factory=list)
    manual_override_requested: bool = False


class TrustLabelEvaluationResult(BaseModel):
    metric_key: str
    allowed: bool
    assigned_trust_label: TrustLabel
    requested_trust_label: TrustLabel
    manual_override_blocked: bool
    reason: str
    rule: str = "Trust labels are system-calculated and cannot be manually elevated."


class ExportPolicyEvaluationRequest(BaseModel):
    module: str
    requested_by: str
    includes_filters: bool = True
    includes_definitions: bool = True
    includes_trust_labels: bool = True
    includes_freshness: bool = True
    includes_formula_versions: bool = True
    includes_owner: bool = True
    includes_timestamp: bool = True
    includes_fingerprint: bool = True
    includes_audit_reference: bool = True


class ExportPolicyEvaluationResult(BaseModel):
    compliant: bool
    missing_fields: list[str] = Field(default_factory=list)
    decision: GovernanceDecision
    rule: str = "Exports must include filters, definitions, trust labels, freshness, formula versions, owner, timestamp, fingerprint, and audit reference."


class BackfillPolicyRequest(BaseModel):
    requested_by: str
    reason: str
    source_systems: list[str]
    start_date: str
    end_date: str
    approved_change_request_id: str | None = None
    dry_run: bool = True


class BackfillPolicyResult(BaseModel):
    allowed: bool
    decision: GovernanceDecision
    reason: str
    dry_run: bool
    rule: str = "Historical backfill is not base launch scope unless handled through a governed reprocess/backfill pipeline."


class AuditEvent(BaseModel):
    audit_id: str
    actor: str
    action: AuditAction
    resource: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    decision: GovernanceDecision = GovernanceDecision.ALLOW
    metadata: dict[str, str | int | float | bool | None] = Field(default_factory=dict)
    fingerprint: str


class AuditEventCreate(BaseModel):
    actor: str
    action: AuditAction
    resource: str
    decision: GovernanceDecision = GovernanceDecision.ALLOW
    metadata: dict[str, str | int | float | bool | None] = Field(default_factory=dict)


class AuditLogSearchResult(BaseModel):
    events: list[AuditEvent]
    count: int
    note: str = "Skeleton search returns in-memory evidence until persistent audit storage is wired."
