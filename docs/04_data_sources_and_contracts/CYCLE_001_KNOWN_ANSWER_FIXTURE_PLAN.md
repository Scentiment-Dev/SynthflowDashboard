# Cycle 001 Known-Answer Fixture Plan (Agent A)

## Scope

This fixture plan defines deterministic known-answer checks for subscription backend foundation work in Cycle 001.

The fixtures and checks enforce that Stay.ai remains source-of-truth for subscription outcomes while Shopify and Synthflow remain contextual systems.

## Required Known-Answer Cases

1. Cancelled subscription requires Stay.ai confirmed cancelled state or approved official completion path.
2. Retained/save outcome requires confirmed retained subscription status.
3. Shopify order context cannot finalize subscription state.
4. Portal link sent cannot count as portal completion.
5. Missing source data lowers trust or produces pending/unknown status.
6. Abandoned/dropped/unresolved/transferred calls cannot count as successful containment.
7. Trust labels cannot be manually elevated.
8. Historical backfill is not base launch scope without governed backfill/reprocess pipeline.

## Local Artifacts Added In Cycle 001

- `packages/shared-contracts/schemas/subscription_analytics_response.schema.json`
- `packages/shared-contracts/examples/subscription_analytics_response.example.json`
- `packages/shared-contracts/examples/stayai_subscription_state_confirmed.example.json`
- `packages/shared-contracts/examples/stayai_subscription_action_confirmed.example.json`
- `packages/shared-contracts/examples/stayai_cancellation_outcome_confirmed.example.json`
- `packages/shared-contracts/examples/stayai_save_outcome_confirmed.example.json`
- `packages/shared-contracts/examples/synthflow_subscription_handling_journey.example.json`
- `packages/shared-contracts/examples/shopify_subscription_secondary_context.example.json`
- `packages/shared-contracts/examples/portal_link_sent_not_completed.example.json`
- `tests/contracts/test_cycle001_known_answer_fixtures.py`

## Validation Approach

- JSON schema validation for new/expanded shared examples in `tests/contracts/test_json_schema_examples.py`.
- Rule-anchor checks in `tests/contracts/test_cycle001_known_answer_fixtures.py` against:
  - shared contract examples; and
  - `services/analytics-api/app/services/source_truth_service.py` no-drift rule enforcement text.

## Out Of Scope

- Live Stay.ai/Shopify/Synthflow integrations.
- Historical backfill implementation.
- Any PR/Bugbot/Codecov flow while root is not connected to a git repository.
