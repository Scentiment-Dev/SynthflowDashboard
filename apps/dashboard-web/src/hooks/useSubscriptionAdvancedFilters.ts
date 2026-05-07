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

// Module-level cache. The advanced-filters response is constant across page
// navigations within a session and is only consumed by `PageActionBar`'s
// "X dimensions available" status pills. Without this cache the same fetch
// fires on every page mount (Command Center, Outcomes, Business Value,
// Follow-Up). The cache stores the resolved/fallback state per scenario so
// every subsequent hook instance returns it synchronously without a refetch.
//
// `__resetSubscriptionAdvancedFiltersCache` is exported for tests so each
// test starts from a clean slate without polluting later runs.
const RESOLVED_CACHE = new Map<string, SubscriptionAdvancedFilterApiState>();
const IN_FLIGHT_CACHE = new Map<string, Promise<SubscriptionAdvancedFilterApiState>>();

export function __resetSubscriptionAdvancedFiltersCache(): void {
  RESOLVED_CACHE.clear();
  IN_FLIGHT_CACHE.clear();
}

export function useSubscriptionAdvancedFilters(
  scenario = 'baseline',
): SubscriptionAdvancedFilterApiState {
  const fixture = useMemo(() => SUBSCRIPTION_ADVANCED_FILTERS_FIXTURE, []);
  const [state, setState] = useState<SubscriptionAdvancedFilterApiState>(() => {
    const cached = RESOLVED_CACHE.get(scenario);
    if (cached) return cached;
    return {
      data: fixture,
      loading: true,
      error: null,
      source: 'fixture',
      permissionDenied: false,
    };
  });

  useEffect(() => {
    let active = true;

    const cached = RESOLVED_CACHE.get(scenario);
    if (cached) {
      setState(cached);
      return () => {
        active = false;
      };
    }

    setState({
      data: fixture,
      loading: true,
      error: null,
      source: 'fixture',
      permissionDenied: false,
    });

    let promise = IN_FLIGHT_CACHE.get(scenario);
    if (!promise) {
      promise = getSubscriptionAdvancedFilters(scenario)
        .then((response): SubscriptionAdvancedFilterApiState => {
          if (!isAdvancedFiltersResponseShape(response)) {
            return {
              data: fixture,
              loading: false,
              error: 'subscription advanced filters response shape mismatch',
              source: 'fixture',
              permissionDenied: false,
            };
          }
          return {
            data: response,
            loading: false,
            error: null,
            source: 'api',
            permissionDenied: false,
          };
        })
        .catch((error: unknown): SubscriptionAdvancedFilterApiState => ({
          data: fixture,
          loading: false,
          error: errorMessage(error),
          source: 'fixture',
          permissionDenied: isPermissionDenied(error),
        }))
        .then((resolved) => {
          RESOLVED_CACHE.set(scenario, resolved);
          IN_FLIGHT_CACHE.delete(scenario);
          return resolved;
        });
      IN_FLIGHT_CACHE.set(scenario, promise);
    }

    promise.then((resolved) => {
      if (!active) return;
      setState(resolved);
    });

    return () => {
      active = false;
    };
  }, [fixture, scenario]);

  return state;
}
