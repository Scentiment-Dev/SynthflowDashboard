import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { DashboardFilters } from '../types/analytics';

type DashboardFilterContextValue = {
  filters: DashboardFilters;
  setDateRange: (dateRange: DashboardFilters['dateRange']) => void;
  setPlatform: (platform: DashboardFilters['platform']) => void;
  setSegment: (segment: DashboardFilters['segment']) => void;
  resetFilters: () => void;
};

const defaultFilters: DashboardFilters = {
  dateRange: '30d',
  platform: 'all',
  segment: 'all',
};

const DashboardFilterContext = createContext<DashboardFilterContextValue | null>(null);

export function DashboardFilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<DashboardFilters>(defaultFilters);

  const value = useMemo<DashboardFilterContextValue>(
    () => ({
      filters,
      setDateRange: (dateRange) => setFilters((current) => ({ ...current, dateRange })),
      setPlatform: (platform) => setFilters((current) => ({ ...current, platform })),
      setSegment: (segment) => setFilters((current) => ({ ...current, segment })),
      resetFilters: () => setFilters(defaultFilters),
    }),
    [filters],
  );

  return <DashboardFilterContext.Provider value={value}>{children}</DashboardFilterContext.Provider>;
}

export function useDashboardFilters() {
  const context = useContext(DashboardFilterContext);
  if (!context) {
    throw new Error('useDashboardFilters must be used inside DashboardFilterProvider');
  }
  return context;
}
