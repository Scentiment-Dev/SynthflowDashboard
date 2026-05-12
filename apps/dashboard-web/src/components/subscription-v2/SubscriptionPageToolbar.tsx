import { useCallback, useMemo, useState } from 'react';
import PageActionBar from './PageActionBar';
import SubscriptionFilterDrawer, {
  buildActiveChips,
  countActiveFilterValues,
  type AppliedFilters,
  type SavedView,
} from '../filters/SubscriptionFilterDrawer';
import SubscriptionExportDrawer, {
  type ExportManifestPreview,
  type ExportRequestResult,
  type ExportScopeAvailability,
} from '../exports/SubscriptionExportDrawer';
import { useSubscriptionAdvancedFilters } from '../../hooks/useSubscriptionAdvancedFilters';
import type { ExportScopeKey } from '../../lib/plainLanguageCopy';

type SubscriptionPageToolbarProps = {
  /** Plain-language label for the page being filtered / exported. */
  pageLabel: string;
  /** Currently applied filters (controlled by the parent page). */
  applied: AppliedFilters;
  // eslint-disable-next-line no-unused-vars
  onApply: (next: AppliedFilters) => void;
  /** Optional default filters used by the "Reset to default" affordance. */
  defaults?: AppliedFilters;
  /** Optional saved views; rendered as chips inside the drawer. */
  savedViews?: SavedView[];
  /** Plain-language reason saved-views are not yet connected. */
  savedViewsDisabledReason?: string;
  /** Callback when the user saves a view. */
  // eslint-disable-next-line no-unused-vars
  onSaveView?: (name: string) => void;
  /** Per-scope availability for the export drawer. */
  exportScopes: ExportScopeAvailability[];
  /** Manifest preview always shown above the export confirm button. */
  exportManifest: ExportManifestPreview;
  /** Triggered when the user confirms an export. */
  onConfirmExport?: (
    // eslint-disable-next-line no-unused-vars
    scope: ExportScopeKey,
  ) => Promise<ExportRequestResult> | ExportRequestResult;
  /** Optional override for the page-level export button label. */
  exportLabel?: string;
};

/**
 * Cycle 008 reusable subscription toolbar. Wraps `PageActionBar` (the
 * primary action strip Agent B added) so subpages can mount the Advanced
 * Filter Drawer and the Export Drawer with one prop set instead of having
 * to manage drawer state and chip wiring inline.
 *
 * The toolbar is the canonical seam for the IA v2 acceptance criteria
 * around filter / export affordances:
 *   - A2.01 / A2.02: drawer opens with all dimensions grouped by IA spec.
 *   - A2.03 : disabled dimensions render with a plain-language reason.
 *   - A2.05 : active filter chips visible directly below the page header.
 *   - A2.07 / A2.10: export button + manifest preview always reachable.
 */
export default function SubscriptionPageToolbar({
  pageLabel,
  applied,
  onApply,
  defaults,
  savedViews,
  savedViewsDisabledReason,
  onSaveView,
  exportScopes,
  exportManifest,
  onConfirmExport,
  exportLabel,
}: SubscriptionPageToolbarProps) {
  const filters = useSubscriptionAdvancedFilters();
  const [filterOpen, setFilterOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const activeCount = countActiveFilterValues(applied);
  const chips = useMemo(
    () =>
      buildActiveChips(applied, filters.data.options).map((chip) => ({
        id: `${chip.filterId}::${chip.value}`,
        label: chip.label,
      })),
    [applied, filters.data.options],
  );

  const handleClearChip = useCallback(
    (chipId: string) => {
      const [filterId, value] = chipId.split('::');
      if (!filterId || value === undefined) return;
      const current = applied[filterId] ?? [];
      const next = { ...applied };
      const remaining = current.filter((v) => v !== value);
      if (remaining.length === 0) delete next[filterId];
      else next[filterId] = remaining;
      onApply(next);
    },
    [applied, onApply],
  );

  const handleClearAll = useCallback(() => onApply({}), [onApply]);

  return (
    <>
      <PageActionBar
        activeFilters={chips}
        onOpenFilters={() => setFilterOpen(true)}
        onClearFilter={handleClearChip}
        onClearAllFilters={handleClearAll}
        onExport={() => setExportOpen(true)}
        exportLabel={exportLabel}
      />
      <SubscriptionFilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        state={filters}
        applied={applied}
        defaults={defaults}
        savedViews={savedViews}
        savedViewsDisabledReason={savedViewsDisabledReason}
        onApply={(next) => {
          onApply(next);
          setFilterOpen(false);
        }}
        onClearAll={handleClearAll}
        onReset={defaults ? () => onApply(defaults) : undefined}
        onSaveView={onSaveView}
      />
      <SubscriptionExportDrawer
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        pageLabel={pageLabel}
        scopes={exportScopes}
        manifest={exportManifest}
        onConfirm={onConfirmExport}
      />
      {/* Sentinel for tests / screenshots so it's easy to assert which page
        * mounted the toolbar without coupling to the toolbar's children. */}
      <span data-testid={`subscription-toolbar-${pageLabel.toLowerCase().replace(/\s+/g, '-')}`} aria-hidden="true" hidden>
        {activeCount}
      </span>
    </>
  );
}
