"""Validate the required implementation repository skeleton paths through Wave 9."""
from __future__ import annotations

from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]

REQUIRED_PATHS = [
    "README.md",
    "PROJECT_OVERVIEW.md",
    ".env.example",
    ".gitignore",
    ".editorconfig",
    ".dockerignore",
    ".pre-commit-config.yaml",
    "Makefile",
    "docker-compose.yml",
    "package.json",
    "pytest.ini",
    "apps/dashboard-web/package.json",
    "apps/dashboard-web/src/App.tsx",
    "apps/dashboard-web/src/pages/SubscriptionAnalyticsPage.tsx",
    "apps/dashboard-web/src/pages/GovernancePage.tsx",
    "apps/dashboard-web/src/components/dashboard/DashboardModulePage.tsx",
    "apps/dashboard-web/src/services/dashboardApi.ts",
    "apps/dashboard-web/src/tests/GovernancePage.test.tsx",
    "services/analytics-api/pyproject.toml",
    "services/analytics-api/app/main.py",
    "services/analytics-api/app/api/health.py",
    "services/analytics-api/app/api/metrics.py",
    "services/analytics-api/app/api/governance.py",
    "services/analytics-api/app/services/source_truth_service.py",
    "services/analytics-api/tests/test_wave9_api_contracts.py",
    "services/ingestion-worker/pyproject.toml",
    "services/ingestion-worker/app/connectors/stayai_connector.py",
    "services/ingestion-worker/app/connectors/synthflow_connector.py",
    "services/ingestion-worker/app/pipelines/normalize_events.py",
    "services/ingestion-worker/tests/test_wave9_normalization_contracts.py",
    "packages/shared-contracts/schemas/stayai_subscription_event.schema.json",
    "packages/shared-contracts/schemas/synthflow_call_event.schema.json",
    "data/dbt/dbt_project.yml",
    "data/dbt/macros/safe_divide.sql",
    "data/dbt/models/sources/sources.yml",
    "data/dbt/models/staging/stg_synthflow_calls.sql",
    "data/dbt/models/intermediate/int_subscription_journeys.sql",
    "data/dbt/models/marts/mart_dashboard_metrics.sql",
    "data/dbt/models/metrics/metric_registry.yml",
    "data/dbt/tests/assert_stayai_required_for_subscription_outcome.sql",
    "data/dbt/tests/assert_cost_too_high_offer_sequence.sql",
    "data/dbt/tests/assert_explicit_deny_permissions.sql",
    "data/warehouse/schema/001_raw_events.sql",
    "data/warehouse/schema/006_subscription_facts.sql",
    "data/warehouse/schema/011_governance_rbac_audit.sql",
    "data/warehouse/seeds/metric_registry_seed.csv",
    "data/warehouse/seeds/source_truth_matrix_seed.csv",
    "data/warehouse/seeds/trust_label_registry_seed.csv",
    ".github/workflows/ci.yml",
    ".github/workflows/backend-tests.yml",
    ".github/workflows/ingestion-tests.yml",
    ".github/workflows/frontend-tests.yml",
    ".github/workflows/dbt-tests.yml",
    ".github/workflows/contract-tests.yml",
    ".github/workflows/smoke-tests.yml",
    ".github/workflows/governance-validation.yml",
    ".github/workflows/release-readiness.yml",
    "tests/contracts/test_backend_frontend_contract_alignment.py",
    "tests/smoke/smoke_test_plan.md",
    "tests/integration/test_ingestion_to_backend_contract.py",
    "docs/00_read_me_first/NO_DRIFT_RULES.md",
    "docs/10_qa_acceptance/WAVE_09_QA_TEST_CI_CD_SKELETON.md",
    "docs/10_qa_acceptance/LOCAL_TEST_MATRIX.md",
    "docs/10_qa_acceptance/CI_CD_GATE_MAP.md",
    "docs/12_runbooks_operations/LOCAL_QA_RUNBOOK.md",
    "project-management/wave_schedule.md",
    "project-management/wave_status.md",
    "project-management/wave_09_completion_report.md",
    "cursor-agent-system/AGENT_OPERATING_MODEL.md",
    "cursor-agent-system/BRANCH_PR_MERGE_RULES.md",
]

def main() -> int:
    missing = [path for path in REQUIRED_PATHS if not (ROOT / path).exists()]
    if missing:
        print("Missing required implementation paths:")
        for path in missing:
            print(f"- {path}")
        return 1
    print(f"Implementation repository structure validation passed ({len(REQUIRED_PATHS)} required paths).")
    return 0

if __name__ == "__main__":
    sys.exit(main())
