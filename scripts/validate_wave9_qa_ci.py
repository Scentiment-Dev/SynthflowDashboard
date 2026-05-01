"""Validate Wave 9 QA/Test/CI/CD skeleton.

This validator intentionally uses only the Python standard library so Cursor
agents can run it before dependency installation.
"""
from __future__ import annotations

import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]

REQUIRED_FILES = [
    ".github/workflows/ci.yml",
    ".github/workflows/backend-tests.yml",
    ".github/workflows/ingestion-tests.yml",
    ".github/workflows/frontend-tests.yml",
    ".github/workflows/dbt-tests.yml",
    ".github/workflows/lint-typecheck.yml",
    ".github/workflows/contract-tests.yml",
    ".github/workflows/smoke-tests.yml",
    ".github/workflows/governance-validation.yml",
    ".github/workflows/release-readiness.yml",
    "pytest.ini",
    "services/ingestion-worker/pyproject.toml",
    "services/analytics-api/tests/conftest.py",
    "services/analytics-api/tests/test_wave9_api_contracts.py",
    "services/analytics-api/tests/test_wave9_export_audit_contract.py",
    "services/analytics-api/tests/test_wave9_no_drift_service_rules.py",
    "services/ingestion-worker/tests/test_wave9_connector_registry.py",
    "services/ingestion-worker/tests/test_wave9_sample_payloads.py",
    "services/ingestion-worker/tests/test_wave9_normalization_contracts.py",
    "tests/contracts/test_json_schema_examples.py",
    "tests/contracts/test_backend_frontend_contract_alignment.py",
    "tests/contracts/test_no_drift_contract_anchors.py",
    "tests/smoke/test_local_stack_contract_smoke.py",
    "tests/smoke/api_smoke_tests.py",
    "tests/smoke/smoke_test_plan.md",
    "tests/integration/test_ingestion_to_backend_contract.py",
    "tests/integration/test_governance_export_audit_flow.py",
    "tests/e2e/dashboard_no_drift_e2e_spec.md",
    "scripts/qa_collect_evidence.py",
    "scripts/run_local_quality_gates.py",
    "scripts/verify_workflow_matrix.py",
    "docs/10_qa_acceptance/WAVE_09_QA_TEST_CI_CD_SKELETON.md",
    "docs/10_qa_acceptance/LOCAL_TEST_MATRIX.md",
    "docs/10_qa_acceptance/CI_CD_GATE_MAP.md",
    "docs/10_qa_acceptance/CONTRACT_TEST_STRATEGY.md",
    "docs/10_qa_acceptance/QA_EVIDENCE_REGISTER.md",
    "docs/12_runbooks_operations/LOCAL_QA_RUNBOOK.md",
    "infra/github-actions/WAVE_09_WORKFLOW_MAP.md",
    "project-management/wave_09_completion_report.md",
]

WORKFLOW_ANCHORS = {
    ".github/workflows/ci.yml": ["validate_no_drift_rules.py", "validate_wave9_qa_ci.py"],
    ".github/workflows/backend-tests.yml": ["pytest", "ruff", "mypy"],
    ".github/workflows/ingestion-tests.yml": ["pytest", "ruff", "mypy"],
    ".github/workflows/frontend-tests.yml": ["npm run typecheck", "npm run lint", "npm run test:run"],
    ".github/workflows/dbt-tests.yml": ["dbt parse", "dbt test"],
    ".github/workflows/contract-tests.yml": ["pytest tests/contracts"],
    ".github/workflows/smoke-tests.yml": ["pytest tests/smoke"],
    ".github/workflows/governance-validation.yml": ["validate_no_drift_rules.py", "qa_collect_evidence.py"],
    ".github/workflows/release-readiness.yml": ["qa_collect_evidence.py", "upload-artifact"],
}

NO_DRIFT_ANCHORS = [
    "Stay.ai",
    "Portal success requires confirmed portal completion",
    "Trust labels",
    "explicit deny",
    "export",
]


def normalized(text: str) -> str:
    return text.lower().replace("-", " ").replace("_", " ")


def main() -> int:
    failures: list[str] = []

    for rel in REQUIRED_FILES:
        if not (ROOT / rel).exists():
            failures.append(f"missing required Wave 9 file: {rel}")

    for rel, anchors in WORKFLOW_ANCHORS.items():
        path = ROOT / rel
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        for anchor in anchors:
            if anchor not in text:
                failures.append(f"{rel} missing workflow anchor: {anchor}")

    docs_text = "\n".join(
        path.read_text(encoding="utf-8", errors="ignore")
        for path in [
            ROOT / "docs/10_qa_acceptance/WAVE_09_QA_TEST_CI_CD_SKELETON.md",
            ROOT / "docs/10_qa_acceptance/LOCAL_TEST_MATRIX.md",
            ROOT / "tests/smoke/smoke_test_plan.md",
        ]
        if path.exists()
    )
    docs_norm = normalized(docs_text)
    for anchor in NO_DRIFT_ANCHORS:
        words = normalized(anchor).split()
        if not all(word in docs_norm for word in words):
            failures.append(f"Wave 9 docs missing no-drift anchor: {anchor}")

    try:
        pkg = json.loads((ROOT / "package.json").read_text())
        scripts = pkg.get("scripts", {})
        for script in ["validate:wave9", "qa:evidence", "qa:gates"]:
            if script not in scripts:
                failures.append(f"package.json missing script: {script}")
    except Exception as exc:  # pragma: no cover
        failures.append(f"package.json could not be parsed: {exc}")

    if failures:
        print("Wave 9 QA/CI validation failed:")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print(f"Wave 9 QA/CI validation passed ({len(REQUIRED_FILES)} required files).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
