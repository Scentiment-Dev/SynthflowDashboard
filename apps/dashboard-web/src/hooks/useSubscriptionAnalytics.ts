import { useEffect, useMemo, useState } from 'react';
import { ApiClientError } from '../services/apiClient';
import { getSubscriptionAnalytics } from '../services/dashboardApi';
import { SUBSCRIPTION_ANALYTICS_FIXTURES } from '../data/subscriptionAnalyticsFixtures';
import type {
  SubscriptionAnalyticsApiState,
  SubscriptionAnalyticsResponse,
  SubscriptionAnalyticsScenario,
} from '../types/subscriptionAnalytics';

const PERMISSION_DENIED_PATTERN = /403|forbidden|permission denied|unauthor(?:i[sz]ed)/i;

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

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isSubscriptionAnalyticsShape(value: unknown): value is SubscriptionAnalyticsResponse {
  if (!isPlainObject(value)) return false;
  if (!REQUIRED_TOP_LEVEL_KEYS.every((key) => key in value)) return false;
  if (!REQUIRED_NESTED_OBJECT_KEYS.every((key) => isPlainObject(value[key]))) return false;
  if (typeof value.generated_from_fixture !== 'boolean') return false;
  return true;
}

function isPermissionDenied(error: unknown): boolean {
  if (error instanceof ApiClientError) {
    if (error.status === 401 || error.status === 403) return true;
    if (error.message && PERMISSION_DENIED_PATTERN.test(error.message)) return true;
    return false;
  }
  if (error instanceof Error) {
    return PERMISSION_DENIED_PATTERN.test(error.message);
  }
  return false;
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
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
