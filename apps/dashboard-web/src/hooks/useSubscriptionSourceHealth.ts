import { useEffect, useMemo, useState } from 'react';
import { getSubscriptionSourceHealth } from '../services/dashboardApi';
import { SOURCE_HEALTH_FIXTURES } from '../data/sourceHealthFixtures';
import { errorMessage, isPermissionDenied, isPlainObject } from '../utils/apiState';
import type {
  SourceHealthApiState,
  SourceHealthEntry,
  SourceHealthScenario,
  SourceHealthSystem,
  SubscriptionSourceHealthResponse,
} from '../types/sourceHealth';

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

const KNOWN_SOURCE_SYSTEMS: ReadonlySet<SourceHealthSystem> = new Set([
  'stay_ai',
  'synthflow',
  'shopify',
  'portal',
]);

const SOURCE_ENTRY_FIELD_TYPES: Record<keyof SourceHealthEntry, 'string' | 'number'> = {
  source_system: 'string',
  source_authority_level: 'string',
  record_count: 'number',
  last_seen_at: 'string',
  freshness_status: 'string',
  freshness_minutes: 'number',
  source_confirmation_status: 'string',
  data_quality_status: 'string',
  conflict_count: 'number',
  missing_required_fields: 'string',
  lineage_reference: 'string',
  owner: 'string',
  formula_version: 'string',
  audit_reference: 'string',
  trust_label: 'string',
};

function isSourceHealthEntryShape(value: unknown): value is SourceHealthEntry {
  if (!isPlainObject(value)) return false;
  for (const [key, expectedType] of Object.entries(SOURCE_ENTRY_FIELD_TYPES) as Array<
    [keyof SourceHealthEntry, 'string' | 'number']
  >) {
    if (!(key in value)) return false;
    if (key === 'missing_required_fields') continue;
    if (typeof value[key] !== expectedType) return false;
  }
  if (!KNOWN_SOURCE_SYSTEMS.has(value.source_system as SourceHealthSystem)) return false;
  const missingFields = value.missing_required_fields;
  if (!Array.isArray(missingFields)) return false;
  if (!missingFields.every((field) => typeof field === 'string')) return false;
  return true;
}

function isSourceHealthShape(value: unknown): value is SubscriptionSourceHealthResponse {
  if (!isPlainObject(value)) return false;
  if (!REQUIRED_TOP_LEVEL_KEYS.every((key) => key in value)) return false;
  if (typeof value.generated_from_fixture !== 'boolean') return false;
  if (typeof value.pending_or_unknown_final_outcome !== 'boolean') return false;
  if (!Array.isArray(value.sources)) return false;
  if (!isPlainObject(value.metadata)) return false;
  if (!value.sources.every((entry) => isSourceHealthEntryShape(entry))) return false;
  return true;
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
