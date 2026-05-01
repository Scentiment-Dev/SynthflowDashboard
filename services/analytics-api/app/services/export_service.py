from hashlib import sha256
from uuid import uuid4

from app.schemas.export import ExportAuditRecord, ExportMetadataValidation, ExportRequest


REQUIRED_EXPORT_FIELDS = [
    "filters",
    "definitions",
    "trust_labels",
    "freshness",
    "formula_versions",
    "owner",
    "timestamp",
    "fingerprint",
    "audit_reference",
]


def create_export_audit_record(request: ExportRequest) -> ExportAuditRecord:
    export_id = f"exp_{uuid4().hex[:12]}"
    audit_reference = f"audit_{uuid4().hex[:12]}"
    fingerprint_payload = "|".join(
        [request.requested_by, request.module, ",".join(sorted(request.metric_keys)), audit_reference]
    )
    fingerprint = sha256(fingerprint_payload.encode("utf-8")).hexdigest()
    return ExportAuditRecord(
        export_id=export_id,
        requested_by=request.requested_by,
        module=request.module,
        filters=request.filters.model_dump(mode="json"),
        metric_keys=request.metric_keys,
        definitions_included=request.include_definitions,
        trust_labels_included=request.include_trust_labels,
        freshness_included=request.include_freshness,
        formula_versions_included=request.include_formula_versions,
        fingerprint=fingerprint,
        audit_reference=audit_reference,
    )


def validate_export_metadata(record: ExportAuditRecord) -> ExportMetadataValidation:
    missing: list[str] = []
    if not record.filters:
        missing.append("filters")
    if not record.definitions_included:
        missing.append("definitions")
    if not record.trust_labels_included:
        missing.append("trust_labels")
    if not record.freshness_included:
        missing.append("freshness")
    if not record.formula_versions_included:
        missing.append("formula_versions")
    if not record.owner:
        missing.append("owner")
    if not record.created_at:
        missing.append("timestamp")
    if not record.fingerprint:
        missing.append("fingerprint")
    if not record.audit_reference:
        missing.append("audit_reference")
    return ExportMetadataValidation(compliant=not missing, missing_fields=missing)
