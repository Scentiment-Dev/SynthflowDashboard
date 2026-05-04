import { useEffect, useMemo, useState } from 'react';
import { getSubscriptionOutcomes } from '../services/dashboardApi';
import { SUBSCRIPTION_OUTCOMES_FIXTURES } from '../data/subscriptionOutcomesFixtures';
import { errorMessage, isPermissionDenied, isPlainObject } from '../utils/apiState';
import type {
  SubscriptionOutcomesApiState,
  SubscriptionOutcomesResponse,
  SubscriptionOutcomesScenario,
} from '../types/subscriptionOutcomes';

const REQUIRED_TOP_LEVEL_KEYS: Array<keyof SubscriptionOutcomesResponse> = [
  'module',
  'generated_from_fixture',
  'source_of_truth_system',
  'source_confirmation_status',
  'scenario',
  'metrics',
  'metadata',
];

const REQUIRED_NESTED_OBJECT_KEYS: Array<keyof SubscriptionOutcomesResponse> = [
  'metrics',
  'metadata',
];

const REQUIRED_METRIC_NUMBER_KEYS = [
  'subscription_contacts_total',
  'subscription_action_requests_total',
  'cancellation_requests_total',
  'confirmed_cancellations_total',
  'save_or_retention_attempts_total',
  'confirmed_retained_total',
  'non_cancellation_actions_total',
  'pending_stayai_confirmation_total',
  'missing_stayai_final_state_total',
  'portal_link_sent_total',
  'portal_completion_confirmed_total',
  'shopify_context_available_total',
  'synthflow_subscription_journeys_total',
  'subscription_outcome_unknown_total',
  'retention_rate',
  'cancellation_confirmation_rate',
  'portal_completion_rate',
] as const;

const REQUIRED_METADATA_STRING_KEYS = [
  'metric_id',
  'formula_version',
  'freshness_status',
  'trust_label',
  'owner',
  'timestamp',
  'fingerprint',
  'audit_reference',
  'source_confirmation_status',
] as const;

function isSubscriptionOutcomesShape(value: unknown): value is SubscriptionOutcomesResponse {
  if (!isPlainObject(value)) return false;
  if (!REQUIRED_TOP_LEVEL_KEYS.every((key) => key in value)) return false;
  if (!REQUIRED_NESTED_OBJECT_KEYS.every((key) => isPlainObject(value[key]))) return false;
  if (typeof value.generated_from_fixture !== 'boolean') return false;

  // Nested validation guards `deriveSubscriptionOutcomeAlerts` and the funnel/KPI builders
  // from crashing on partially-broken contracts. If any required nested field is missing or
  // the wrong type, reject the payload and let the hook fall back to the fixture instead of
  // mounting a half-rendered analytics view.
  const metrics = value.metrics as Record<string, unknown>;
  for (const key of REQUIRED_METRIC_NUMBER_KEYS) {
    const metric = metrics[key];
    if (typeof metric !== 'number' || !Number.isFinite(metric)) return false;
  }

  const metadata = value.metadata as Record<string, unknown>;
  for (const key of REQUIRED_METADATA_STRING_KEYS) {
    if (typeof metadata[key] !== 'string') return false;
  }
  if (!Array.isArray(metadata.metric_definitions)) return false;
  if (!metadata.metric_definitions.every((definition) => typeof definition === 'string')) {
    return false;
  }
  if (!isPlainObject(metadata.filters)) return false;

  return true;
}

export function useSubscriptionOutcomes(
  scenario: SubscriptionOutcomesScenario = 'baseline',
): SubscriptionOutcomesApiState {
  const fixture = useMemo(() => SUBSCRIPTION_OUTCOMES_FIXTURES[scenario], [scenario]);
  const [state, setState] = useState<SubscriptionOutcomesApiState>({
    data: fixture,
    loading: true,
    error: null,
    source: 'fixture',
    permissionDenied: false,
    scenario,
  });

  useEffect(() => {
    let active = true;
    setState({
      data: fixture,
      loading: true,
      error: null,
      source: 'fixture',
      permissionDenied: false,
      scenario,
    });

    getSubscriptionOutcomes(scenario)
      .then((response) => {
        if (!active) return;
        if (!isSubscriptionOutcomesShape(response)) {
          setState({
            data: fixture,
            loading: false,
            error: 'subscription outcomes response shape mismatch',
            source: 'fixture',
            permissionDenied: false,
            scenario,
          });
          return;
        }
        setState({
          data: response,
          loading: false,
          error: null,
          source: 'api',
          permissionDenied: false,
          scenario,
        });
      })
      .catch((error: unknown) => {
        if (!active) return;
        setState({
          data: fixture,
          loading: false,
          error: errorMessage(error),
          source: 'fixture',
          permissionDenied: isPermissionDenied(error),
          scenario,
        });
      });

    return () => {
      active = false;
    };
  }, [fixture, scenario]);

  return state;
}
