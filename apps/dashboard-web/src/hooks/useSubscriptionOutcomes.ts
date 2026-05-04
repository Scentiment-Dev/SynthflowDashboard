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

function isSubscriptionOutcomesShape(value: unknown): value is SubscriptionOutcomesResponse {
  if (!isPlainObject(value)) return false;
  if (!REQUIRED_TOP_LEVEL_KEYS.every((key) => key in value)) return false;
  if (!REQUIRED_NESTED_OBJECT_KEYS.every((key) => isPlainObject(value[key]))) return false;
  if (typeof value.generated_from_fixture !== 'boolean') return false;
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
