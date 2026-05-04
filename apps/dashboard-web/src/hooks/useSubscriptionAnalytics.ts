import { useEffect, useMemo, useState } from 'react';
import { getSubscriptionAnalytics } from '../services/dashboardApi';
import { SUBSCRIPTION_ANALYTICS_FIXTURES } from '../data/subscriptionAnalyticsFixtures';
import { errorMessage, isPermissionDenied, isPlainObject } from '../utils/apiState';
import type {
  SubscriptionAnalyticsApiState,
  SubscriptionAnalyticsResponse,
  SubscriptionAnalyticsScenario,
} from '../types/subscriptionAnalytics';

const REQUIRED_TOP_LEVEL_KEYS: Array<keyof SubscriptionAnalyticsResponse> = [
  'module',
  'final_subscription_state',
  'source_of_truth_system',
  'source_confirmation_status',
  'subscription_overview',
  'portal_journey',
  'shopify_context',
  'synthflow_journey',
  'source_confirmation',
  'metric_metadata',
  'generated_from_fixture',
];

const REQUIRED_NESTED_OBJECT_KEYS: Array<keyof SubscriptionAnalyticsResponse> = [
  'subscription_overview',
  'portal_journey',
  'shopify_context',
  'synthflow_journey',
  'source_confirmation',
  'metric_metadata',
];

function isSubscriptionAnalyticsShape(value: unknown): value is SubscriptionAnalyticsResponse {
  if (!isPlainObject(value)) return false;
  if (!REQUIRED_TOP_LEVEL_KEYS.every((key) => key in value)) return false;
  if (!REQUIRED_NESTED_OBJECT_KEYS.every((key) => isPlainObject(value[key]))) return false;
  if (typeof value.generated_from_fixture !== 'boolean') return false;
  return true;
}

export function useSubscriptionAnalytics(
  scenario: SubscriptionAnalyticsScenario = 'baseline',
): SubscriptionAnalyticsApiState {
  const fixture = useMemo(() => SUBSCRIPTION_ANALYTICS_FIXTURES[scenario], [scenario]);
  const [state, setState] = useState<SubscriptionAnalyticsApiState>({
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

    getSubscriptionAnalytics(scenario)
      .then((response) => {
        if (!active) return;
        if (!isSubscriptionAnalyticsShape(response)) {
          setState({
            data: fixture,
            loading: false,
            error: 'subscription analytics response shape mismatch',
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
