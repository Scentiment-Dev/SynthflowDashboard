"""Initial analytics dashboard schema with governance controls.

Revision ID: 0001_initial_schema
Revises:
Create Date: 2026-04-30
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa

revision: str = "0001_initial_schema"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "event_logs",
        sa.Column("event_id", sa.String(length=128), primary_key=True),
        sa.Column("source", sa.String(length=64), nullable=False, index=True),
        sa.Column("event_type", sa.String(length=128), nullable=False),
        sa.Column("occurred_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("payload", sa.JSON(), nullable=False, server_default="{}"),
    )
    op.create_table(
        "metric_snapshots",
        sa.Column("snapshot_id", sa.String(length=128), primary_key=True),
        sa.Column("metric_key", sa.String(length=128), nullable=False, index=True),
        sa.Column("module", sa.String(length=64), nullable=False, index=True),
        sa.Column("value", sa.Float(), nullable=False),
        sa.Column("trust_label", sa.String(length=32), nullable=False),
        sa.Column("formula_version", sa.String(length=64), nullable=False),
        sa.Column("captured_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_table(
        "source_syncs",
        sa.Column("source", sa.String(length=64), primary_key=True),
        sa.Column("last_synced_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("status", sa.String(length=64), nullable=False),
        sa.Column("freshness_minutes", sa.Integer(), nullable=True),
    )
    op.create_table(
        "export_audits",
        sa.Column("export_id", sa.String(length=128), primary_key=True),
        sa.Column("requested_by", sa.String(length=256), nullable=False, index=True),
        sa.Column("module", sa.String(length=64), nullable=False, index=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("filters", sa.JSON(), nullable=False, server_default="{}"),
        sa.Column("metric_keys", sa.JSON(), nullable=False, server_default="[]"),
        sa.Column("owner", sa.String(length=128), nullable=False),
        sa.Column("fingerprint", sa.String(length=128), nullable=False),
        sa.Column("audit_reference", sa.String(length=128), nullable=False),
        sa.Column("trust_label", sa.String(length=32), nullable=False),
    )
    op.create_table(
        "audit_logs",
        sa.Column("audit_id", sa.String(length=128), primary_key=True),
        sa.Column("actor", sa.String(length=256), nullable=False, index=True),
        sa.Column("action", sa.String(length=128), nullable=False, index=True),
        sa.Column("resource", sa.String(length=256), nullable=False, index=True),
        sa.Column("decision", sa.String(length=64), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("metadata", sa.JSON(), nullable=False, server_default="{}"),
        sa.Column("fingerprint", sa.String(length=128), nullable=False),
    )
    op.create_table(
        "permission_policies",
        sa.Column("policy_key", sa.String(length=128), primary_key=True),
        sa.Column("role", sa.String(length=128), nullable=False, index=True),
        sa.Column("permissions", sa.JSON(), nullable=False, server_default="[]"),
        sa.Column("explicit_deny", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("owner", sa.String(length=128), nullable=False, server_default="governance"),
    )
    op.create_table(
        "trust_label_audits",
        sa.Column("audit_key", sa.String(length=128), primary_key=True),
        sa.Column("metric_key", sa.String(length=128), nullable=False, index=True),
        sa.Column("assigned_trust_label", sa.String(length=32), nullable=False),
        sa.Column("requested_trust_label", sa.String(length=32), nullable=False),
        sa.Column("manual_override_requested", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("allowed", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("evidence_sources", sa.JSON(), nullable=False, server_default="[]"),
    )


def downgrade() -> None:
    op.drop_table("trust_label_audits")
    op.drop_table("permission_policies")
    op.drop_table("audit_logs")
    op.drop_table("export_audits")
    op.drop_table("source_syncs")
    op.drop_table("metric_snapshots")
    op.drop_table("event_logs")
