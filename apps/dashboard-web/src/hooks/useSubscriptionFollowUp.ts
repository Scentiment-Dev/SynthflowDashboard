import { useEffect, useMemo, useState } from 'react';
import { getSubscriptionFollowUp } from '../services/dashboardApi';
import { SUBSCRIPTION_FOLLOW_UP_FIXTURES } from '../data/subscriptionFollowUpFixtures';
import { errorMessage, isPermissionDenied, isPlainObject } from '../utils/apiState';
import type {
  SubscriptionFollowUpApiState,
  SubscriptionFollowUpResponse,
  SubscriptionFollowUpScenario,
} from '../types/subscriptionFollowUp';

const REQUIRED_TOP_LEVEL_KEYS: Array<keyof SubscriptionFollowUpResponse> = [
  'module',
  'generated_from_fixture',
  'scenario',
  'records',
  'metadata',
];

function isFollowUpResponseShape(value: unknown): value is SubscriptionFollowUpResponse {
  if (!isPlainObject(value)) return false;
  if (!REQUIRED_TOP_LEVEL_KEYS.every((key) => key in value)) return false;
  if (typeof value.generated_from_fixture !== 'boolean') return false;
  if (!Array.isArray(value.records)) return false;
  if (!isPlainObject(value.metadata)) return false;
  return true;
}

export function useSubscriptionFollowUp(
  scenario: SubscriptionFollowUpScenario = 'baseline',
): SubscriptionFollowUpApiState {
  const fixture = useMemo(
    () => SUBSCRIPTION_FOLLOW_UP_FIXTURES[scenario],
    [scenario],
  );
  const [state, setState] = useState<SubscriptionFollowUpApiState>({
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

    getSubscriptionFollowUp(scenario)
      .then((response) => {
        if (!active) return;
        if (!isFollowUpResponseShape(response)) {
          setState({
            data: fixture,
            loading: false,
            error: 'subscription follow-up response shape mismatch',
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
