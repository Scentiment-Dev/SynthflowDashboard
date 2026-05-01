from __future__ import annotations

import json
from pathlib import Path

import pytest

try:
    from jsonschema import Draft202012Validator
except Exception:  # pragma: no cover - dependency installed in CI contract workflow
    Draft202012Validator = None


ROOT = Path(__file__).resolve().parents[2]
SCHEMA_DIR = ROOT / "packages" / "shared-contracts" / "schemas"
EXAMPLE_DIR = ROOT / "packages" / "shared-contracts" / "examples"

EXAMPLE_BY_SCHEMA = {
    "synthflow_call_event.schema.json": "synthflow_call_event.example.json",
    "stayai_subscription_event.schema.json": "stayai_subscription_event.example.json",
    "shopify_order_context.schema.json": "shopify_order_context.example.json",
    "portal_completion_event.schema.json": "portal_completion_event.example.json",
    "subscription_analytics_response.schema.json": "subscription_analytics_response.example.json",
}

ADDITIONAL_EXAMPLES_BY_SCHEMA = {
    "stayai_subscription_event.schema.json": [
        "stayai_subscription_state_confirmed.example.json",
        "stayai_subscription_action_confirmed.example.json",
        "stayai_cancellation_outcome_confirmed.example.json",
        "stayai_save_outcome_confirmed.example.json",
    ],
    "shopify_order_context.schema.json": [
        "shopify_subscription_secondary_context.example.json",
    ],
    "portal_completion_event.schema.json": [
        "portal_link_sent_not_completed.example.json",
    ],
}


@pytest.mark.contract
def test_shared_contract_examples_validate_against_schemas():
    if Draft202012Validator is None:
        pytest.skip("jsonschema is not installed")
    for schema_name, example_name in EXAMPLE_BY_SCHEMA.items():
        schema = json.loads((SCHEMA_DIR / schema_name).read_text())
        example = json.loads((EXAMPLE_DIR / example_name).read_text())
        Draft202012Validator.check_schema(schema)
        Draft202012Validator(schema).validate(example)


@pytest.mark.contract
def test_additional_source_truth_examples_validate_against_schemas():
    if Draft202012Validator is None:
        pytest.skip("jsonschema is not installed")
    for schema_name, example_names in ADDITIONAL_EXAMPLES_BY_SCHEMA.items():
        schema = json.loads((SCHEMA_DIR / schema_name).read_text())
        Draft202012Validator.check_schema(schema)
        validator = Draft202012Validator(schema)
        for example_name in example_names:
            example = json.loads((EXAMPLE_DIR / example_name).read_text())
            validator.validate(example)
