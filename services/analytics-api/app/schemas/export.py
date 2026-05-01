from datetime import UTC, datetime
from pydantic import BaseModel, Field

from app.schemas.common import AnalyticsFilters
from app.schemas.metric import TrustLabel


class ExportRequest(BaseModel):
    requested_by: str
    module: str
    filters: AnalyticsFilters = Field(default_factory=AnalyticsFilters)
    metric_keys: list[str] = Field(default_factory=list)
    include_definitions: bool = True
    include_trust_labels: bool = True
    include_freshness: bool = True
    include_formula_versions: bool = True
    reason: str | None = None


class ExportAuditRecord(BaseModel):
    export_id: str
    requested_by: str
    module: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    filters: dict[str, object]
    metric_keys: list[str]
    definitions_included: bool
    trust_labels_included: bool
    freshness_included: bool
    formula_versions_included: bool
    owner: str = "analytics"
    fingerprint: str
    audit_reference: str
    trust_label: TrustLabel = TrustLabel.MEDIUM


class ExportMetadataValidation(BaseModel):
    compliant: bool
    missing_fields: list[str] = Field(default_factory=list)
    rule: str = "Exports must include filters, definitions, trust labels, freshness, formula versions, owner, timestamp, fingerprint, and audit reference."
