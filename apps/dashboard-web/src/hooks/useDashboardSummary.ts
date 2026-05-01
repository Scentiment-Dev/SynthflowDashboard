import { useEffect, useMemo, useState } from 'react';
import { MODULE_FIXTURES } from '../data/dashboardFixtures';
import { getDashboardSummary } from '../services/dashboardApi';
import type { ApiState } from '../types/analytics';
import type { DashboardModule, DashboardSummary, ModuleFixture } from '../types/metrics';

export function useDashboardSummary(module: DashboardModule): ApiState<ModuleFixture> {
  const fixture = useMemo(() => MODULE_FIXTURES[module], [module]);
  const [state, setState] = useState<ApiState<ModuleFixture>>({
    data: fixture,
    loading: true,
    error: null,
    source: 'fixture',
  });

  useEffect(() => {
    let active = true;
    setState((current) => ({ ...current, data: fixture, loading: true, error: null }));

    getDashboardSummary(module)
      .then((summary: DashboardSummary) => {
        if (!active) return;
        setState({
          data: { ...fixture, summary },
          loading: false,
          error: null,
          source: 'api',
        });
      })
      .catch((error: Error) => {
        if (!active) return;
        setState({
          data: fixture,
          loading: false,
          error: error.message,
          source: 'fixture',
        });
      });

    return () => {
      active = false;
    };
  }, [fixture, module]);

  return state;
}
