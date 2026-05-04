import { useEffect, useMemo, useState } from 'react';
import { ApiClientError } from '../services/apiClient';
import { getSubscriptionSourceHealth } from '../services/dashboardApi';
import { SOURCE_HEALTH_FIXTURES } from '../data/sourceHealthFixtures';
import type {
  SourceHealthApiState,
  SourceHealthScenario,
  SubscriptionSourceHealthResponse,
} from '../types/sourceHealth';

const PERMISSION_DENIED_PATTERN = /403|forbidden|permission denied|unauthor(?:i[sz]ed)/i;

const REQUIRED_TOP_LEVEL_KEYS: Array<keyof SubscriptionSourceHealthResponse> = [
  'module',
  'generated_from_fixture',
  'overall_source_health',
  'conflict_status',
  'pending_or_unknown_final_outcome',
  'shopify_context_warning',
  'sources',
  'metadata',
];

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isSourceHealthShape(value: unknown): value is SubscriptionSourceHealthResponse {
  if (!isPlainObject(value)) return false;
  if (!REQUIRED_TOP_LEVEL_KEYS.every((key) => key in value)) return false;
  if (typeof value.generated_from_fixture !== 'boolean') return false;
  if (typeof value.pending_or_unknown_final_outcome !== 'boolean') return false;
  if (!Array.isArray(value.sources)) return false;
  if (!isPlainObject(value.metadata)) return false;
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

export function useSubscriptionSourceHealth(
  scenario: SourceHealthScenario = 'baseline',
): SourceHealthApiState {
  const fixture = useMemo(() => SOURCE_HEALTH_FIXTURES[scenario], [scenario]);
  const [state, setState] = useState<SourceHealthApiState>({
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

    getSubscriptionSourceHealth(scenario)
      .then((response) => {
        if (!active) return;
        if (!isSourceHealthShape(response)) {
          setState({
            data: fixture,
            loading: false,
            error: 'subscription source health response shape mismatch',
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
