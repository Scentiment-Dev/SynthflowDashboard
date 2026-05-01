from app.schemas.export import ExportRequest
from app.services.export_service import create_export_audit_record, validate_export_metadata


def test_export_audit_record_contains_required_metadata() -> None:
    record = create_export_audit_record(
        ExportRequest(
            requested_by="qa@scentiment.internal",
            module="subscriptions",
            metric_keys=["subscription_save_rate"],
        )
    )
    validation = validate_export_metadata(record)
    assert validation.compliant is True
    assert record.fingerprint
    assert record.audit_reference
