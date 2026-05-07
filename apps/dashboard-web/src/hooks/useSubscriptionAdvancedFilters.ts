import { useEffect, useMemo, useState } from 'react';
import { getSubscriptionAdvancedFilters } from '../services/dashboardApi';
import { SUBSCRIPTION_ADVANCED_FILTERS_FIXTURE } from '../data/subscriptionAdvancedFiltersFixtures';
import { errorMessage, isPermissionDenied, isPlainObject } from '../utils/apiState';
import type {
  SubscriptionAdvancedFilterApiState,
  SubscriptionAdvancedFilterResponse,
} from '../types/subscriptionFilters';

function isAdvancedFiltersResponseShape(
  value: unknown,
): value is SubscriptionAdvancedFilterResponse {
  if (!isPlainObject(value)) return false;
  if (!Array.isArray(value.options)) return false;
  if (!isPlainObject(value.applied_filters)) return false;
  if (!isPlainObject(value.metadata)) return false;
  return true;
}

export function useSubscriptionAdvancedFilters(
  scenario = 'baseline',
): SubscriptionAdvancedFilterApiState {
  const fixture = useMemo(() => SUBSCRIPTION_ADVANCED_FILTERS_FIXTURE, []);
  const [state, setState] = useState<SubscriptionAdvancedFilterApiState>({
    data: fixture,
    loading: true,
    error: null,
    source: 'fixture',
    permissionDenied: false,
  });

  useEffect(() => {
    let active = true;
    setState({
      data: fixture,
      loading: true,
      error: null,
      source: 'fixture',
      permissionDenied: false,
    });

    getSubscriptionAdvancedFilters(scenario)
      .then((response) => {
        if (!active) return;
        if (!isAdvancedFiltersResponseShape(response)) {
          setState({
            data: fixture,
            loading: false,
            error: 'subscription advanced filters response shape mismatch',
            source: 'fixture',
            permissionDenied: false,
          });
          return;
        }
        setState({
          data: response,
          loading: false,
          error: null,
          source: 'api',
          permissionDenied: false,
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
        });
      });

    return () => {
      active = false;
    };
  }, [fixture, scenario]);

  return state;
}
