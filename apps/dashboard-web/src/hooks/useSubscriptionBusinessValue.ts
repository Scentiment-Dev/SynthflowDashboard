import { useEffect, useMemo, useState } from 'react';
import { getSubscriptionBusinessValue } from '../services/dashboardApi';
import { SUBSCRIPTION_BUSINESS_VALUE_FIXTURES } from '../data/subscriptionBusinessValueFixtures';
import { errorMessage, isPermissionDenied, isPlainObject } from '../utils/apiState';
import type {
  SubscriptionBusinessValueApiState,
  SubscriptionBusinessValueResponse,
  SubscriptionBusinessValueScenario,
} from '../types/subscriptionBusinessValue';

const REQUIRED_TOP_LEVEL_KEYS: Array<keyof SubscriptionBusinessValueResponse> = [
  'module',
  'generated_from_fixture',
  'source_of_truth_system',
  'source_confirmation_status',
  'scenario',
  'metrics',
  'metadata',
];

function isBusinessValueResponseShape(
  value: unknown,
): value is SubscriptionBusinessValueResponse {
  if (!isPlainObject(value)) return false;
  if (!REQUIRED_TOP_LEVEL_KEYS.every((key) => key in value)) return false;
  if (typeof value.generated_from_fixture !== 'boolean') return false;
  if (!Array.isArray(value.metrics)) return false;
  if (!isPlainObject(value.metadata)) return false;
  return true;
}

export function useSubscriptionBusinessValue(
  scenario: SubscriptionBusinessValueScenario = 'baseline',
): SubscriptionBusinessValueApiState {
  const fixture = useMemo(
    () => SUBSCRIPTION_BUSINESS_VALUE_FIXTURES[scenario],
    [scenario],
  );
  const [state, setState] = useState<SubscriptionBusinessValueApiState>({
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

    getSubscriptionBusinessValue(scenario)
      .then((response) => {
        if (!active) return;
        if (!isBusinessValueResponseShape(response)) {
          setState({
            data: fixture,
            loading: false,
            error: 'subscription business value response shape mismatch',
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
