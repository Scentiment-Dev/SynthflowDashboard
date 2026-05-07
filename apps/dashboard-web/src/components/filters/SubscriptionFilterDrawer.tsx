import {
  useEffect,
  useId,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { Filter, X, RefreshCcw, RotateCcw, Save, Plus } from 'lucide-react';
import {
  FILTER_GROUP_LABELS,
  FILTER_GROUP_ORDER,
  type FilterGroupKey,
  groupForFilterId,
  labelForFilterValue,
  plainLanguageDataDependency,
} from '../../lib/plainLanguageCopy';
import type {
  SubscriptionAdvancedFilterApiState,
  SubscriptionFilterOption,
} from '../../types/subscriptionFilters';

/* ---------------------------------------------------------------------- */
/* Types                                                                  */
/* ---------------------------------------------------------------------- */

export type AppliedFilters = Record<string, string[]>;

export type ActiveFilterChip = {
  filterId: string;
  value: string;
  label: string;
};

type FilterDrawerProps = {
  open: boolean;
  onClose: () => void;
  /** Result of `useSubscriptionAdvancedFilters` — owns the catalog of filters. */
  state: SubscriptionAdvancedFilterApiState;
  /** Currently applied filter selections (keyed by `filter_id`). */
  applied: AppliedFilters;
  /** Optional default applied filters used by the "Reset to default" action. */
  defaults?: AppliedFilters;
  /** Triggered when the user clicks "Apply filters". */
  // eslint-disable-next-line no-unused-vars
  onApply: (next: AppliedFilters) => void;
  /** Triggered when the user clicks "Clear all". */
  onClearAll?: () => void;
  /** Triggered when the user clicks "Reset to default". */
  onReset?: () => void;
  /** Triggered when the user clicks "Save view". */
  // eslint-disable-next-line no-unused-vars
  onSaveView?: (name: string) => void;
  /** Optional list of saved views. */
  savedViews?: SavedView[];
  /** Plain-language reason saved-views aren't yet connected (optional). */
  savedViewsDisabledReason?: string;
};

export type SavedView = {
  id: string;
  name: string;
  applied: AppliedFilters;
};

type DraftAction =
  | { type: 'toggle'; filterId: string; value: string }
  | { type: 'set'; filterId: string; values: string[] }
  | { type: 'clear-all' }
  | { type: 'replace'; next: AppliedFilters };

function draftReducer(state: AppliedFilters, action: DraftAction): AppliedFilters {
  switch (action.type) {
    case 'toggle': {
      const current = state[action.filterId] ?? [];
      const next = current.includes(action.value)
        ? current.filter((v) => v !== action.value)
        : [...current, action.value];
      const out = { ...state };
      if (next.length === 0) {
        delete out[action.filterId];
      } else {
        out[action.filterId] = next;
      }
      return out;
    }
    case 'set': {
      const out = { ...state };
      if (action.values.length === 0) delete out[action.filterId];
      else out[action.filterId] = action.values;
      return out;
    }
    case 'clear-all':
      return {};
    case 'replace':
      return { ...action.next };
    default:
      return state;
  }
}

/* ---------------------------------------------------------------------- */
/* Helpers                                                                */
/* ---------------------------------------------------------------------- */

export function buildActiveChips(
  applied: AppliedFilters,
  options: SubscriptionFilterOption[],
): ActiveFilterChip[] {
  const optionMap = new Map(options.map((o) => [o.filter_id, o]));
  const chips: ActiveFilterChip[] = [];
  for (const [filterId, values] of Object.entries(applied)) {
    const option = optionMap.get(filterId);
    if (!option) {
      // Unknown filter id: still render so the user is not surprised.
      for (const value of values) {
        chips.push({
          filterId,
          value,
          label: `${filterId}: ${value}`,
        });
      }
      continue;
    }
    for (const value of values) {
      chips.push({
        filterId,
        value,
        label: `${option.label}: ${labelForFilterValue(filterId, value)}`,
      });
    }
  }
  return chips;
}

export function countActiveFilterValues(applied: AppliedFilters): number {
  let count = 0;
  for (const values of Object.values(applied)) {
    count += values.length;
  }
  return count;
}

function groupOptions(
  options: SubscriptionFilterOption[],
): Record<FilterGroupKey, SubscriptionFilterOption[]> {
  const empty: Record<FilterGroupKey, SubscriptionFilterOption[]> = {
    date_and_comparison: [],
    outcome: [],
    cancellation_and_retention: [],
    customer_subscription: [],
    product_sku: [],
    value_and_risk: [],
    source_and_trust: [],
    flow_version: [],
    portal_handoff: [],
    saved_views: [],
  };
  for (const option of options) {
    const group = groupForFilterId(option.filter_id);
    empty[group].push(option);
  }
  return empty;
}

/* ---------------------------------------------------------------------- */
/* Component                                                              */
/* ---------------------------------------------------------------------- */

/**
 * Cycle 008 reusable Advanced Filter Drawer.
 *
 * Renders every filter dimension exposed by the
 * `SubscriptionAdvancedFilterResponse` contract grouped by IA-spec section
 * (Date & comparison · Outcome · Cancellation & retention · Customer/sub ·
 * Product/SKU · Value & risk · Source & trust · Flow/version · Portal/
 * handoff · Saved views). Filters whose backend dependency is not yet
 * built render disabled with the plain-language reason exposed via title
 * + visible helper text.
 *
 * Drawer behavior:
 *   - Opens when `open` is true; close button + ESC + overlay-click all
 *     dismiss without applying.
 *   - Internal draft state holds the user's edits until they hit "Apply
 *     filters" — preventing flicker on the underlying page surface.
 *   - "Clear all" empties the draft (still requires Apply to commit).
 *   - "Reset to default" replaces the draft with the `defaults` prop.
 *   - "Save view" prompts for a name and bubbles up via `onSaveView`.
 *   - Saved-views section renders `savedViewsDisabledReason` when the
 *     backend persistence isn't connected yet.
 *   - Active filter count + chip strip render at the top so the operator
 *     always sees what's already on.
 */
export default function SubscriptionFilterDrawer({
  open,
  onClose,
  state,
  applied,
  defaults,
  onApply,
  onClearAll,
  onReset,
  onSaveView,
  savedViews,
  savedViewsDisabledReason,
}: FilterDrawerProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const [draft, dispatch] = useReducer(draftReducer, applied, (init) => ({
    ...init,
  }));
  const [saveName, setSaveName] = useState('');
  const [showSavePrompt, setShowSavePrompt] = useState(false);

  // Resync draft whenever the drawer opens or external applied filters change.
  useEffect(() => {
    if (open) dispatch({ type: 'replace', next: applied });
  }, [open, applied]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  const grouped = useMemo(() => groupOptions(state.data.options), [state.data.options]);
  const draftCount = countActiveFilterValues(draft);
  const draftChips = useMemo(
    () => buildActiveChips(draft, state.data.options),
    [draft, state.data.options],
  );

  if (!open) return null;

  const renderOption = (option: SubscriptionFilterOption) => {
    const selected = draft[option.filter_id] ?? [];
    const reason = !option.is_enabled
      ? option.is_disabled_reason ?? 'This filter dimension is not yet wired.'
      : null;
    return (
      <fieldset
        key={option.filter_id}
        data-testid={`subscription-filter-${option.filter_id}`}
        data-disabled={Boolean(reason)}
        className={`flex flex-col gap-2 rounded-2xl border border-slate-200 px-3 py-3 ${
          reason ? 'opacity-70' : ''
        }`}
      >
        <legend className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          {option.label}
          {reason ? (
            <span
              data-testid={`subscription-filter-${option.filter_id}-disabled`}
              className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700"
            >
              Not yet wired
            </span>
          ) : null}
        </legend>
        <p className="text-[11px] leading-4 text-slate-500">{option.plain_language_help}</p>
        <p
          className="text-[10px] leading-4 text-slate-500"
          data-testid={`subscription-filter-${option.filter_id}-data-dependency`}
        >
          <span className="font-semibold text-slate-600">Data depends on:</span>{' '}
          {plainLanguageDataDependency(option.data_dependency)}
        </p>
        {reason ? (
          <p
            className="rounded-lg bg-amber-50/80 px-2 py-1 text-[11px] text-amber-900"
            data-testid={`subscription-filter-${option.filter_id}-reason`}
          >
            {reason}
          </p>
        ) : option.allowed_values.length === 0 ? (
          <p className="rounded-lg bg-slate-50 px-2 py-1 text-[11px] text-slate-500">
            No options available right now.
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {option.allowed_values.map((value) => {
              const checked = selected.includes(value);
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={checked}
                  data-testid={`subscription-filter-${option.filter_id}-value-${value}`}
                  onClick={() =>
                    dispatch({ type: 'toggle', filterId: option.filter_id, value })
                  }
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition ${
                    checked
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                  }`}
                >
                  {labelForFilterValue(option.filter_id, value)}
                </button>
              );
            })}
          </div>
        )}
      </fieldset>
    );
  };

  return (
    <div
      className="fixed inset-0 z-40 flex justify-end bg-slate-900/40"
      data-testid="subscription-filter-drawer-overlay"
      onClick={onClose}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-testid="subscription-filter-drawer"
        onClick={(event) => event.stopPropagation()}
        className="flex h-full w-full max-w-xl flex-col overflow-hidden bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-700">
              <Filter className="h-4 w-4" aria-hidden />
            </span>
            <div>
              <p className="eyebrow !tracking-[0.18em]">Filter the data</p>
              <h2 id={titleId} className="text-base font-semibold text-slate-950">
                Advanced filters
              </h2>
              <p className="mt-0.5 text-[11px] text-slate-500">
                {draftCount === 0
                  ? 'No filters applied yet.'
                  : `${draftCount} filter value${draftCount === 1 ? '' : 's'} active.`}
              </p>
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close filter drawer"
            data-testid="subscription-filter-drawer-close"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </header>

        {draftChips.length > 0 ? (
          <div
            aria-label="Active filter chips"
            data-testid="subscription-filter-drawer-active-chips"
            className="flex flex-wrap gap-1.5 border-b border-slate-100 px-5 py-3"
          >
            {draftChips.map((chip) => (
              <button
                key={`${chip.filterId}::${chip.value}`}
                type="button"
                onClick={() =>
                  dispatch({ type: 'toggle', filterId: chip.filterId, value: chip.value })
                }
                aria-label={`Remove filter ${chip.label}`}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-slate-300 hover:bg-white"
              >
                {chip.label}
                <X className="h-3 w-3" aria-hidden />
              </button>
            ))}
          </div>
        ) : null}

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {state.error ? (
            <p
              data-testid="subscription-filter-drawer-error"
              className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] text-amber-900"
            >
              Live filter catalog is temporarily unavailable. Showing the last reviewed snapshot.
            </p>
          ) : null}

          {FILTER_GROUP_ORDER.map((groupKey) => {
            const groupOptionsList = grouped[groupKey] ?? [];
            if (groupKey !== 'saved_views' && groupOptionsList.length === 0) {
              return null;
            }

            if (groupKey === 'saved_views') {
              return (
                <section key={groupKey} aria-labelledby={`${groupKey}-heading`}>
                  <h3
                    id={`${groupKey}-heading`}
                    className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500"
                  >
                    {FILTER_GROUP_LABELS[groupKey]}
                  </h3>
                  {groupOptionsList.length > 0 ? (
                    <div className="mt-2 grid gap-2">
                      {groupOptionsList.map(renderOption)}
                    </div>
                  ) : null}
                  <div className="mt-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-3 py-3 text-[12px] text-slate-600">
                    {savedViews && savedViews.length > 0 ? (
                      <ul className="flex flex-wrap gap-1.5">
                        {savedViews.map((view) => (
                          <li key={view.id}>
                            <button
                              type="button"
                              onClick={() => dispatch({ type: 'replace', next: view.applied })}
                              data-testid={`saved-view-${view.id}`}
                              className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-slate-300"
                            >
                              {view.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p data-testid="saved-views-empty">
                        Saved views are not yet connected.{' '}
                        {savedViewsDisabledReason ??
                          'Save view will be enabled once backend persistence ships.'}
                      </p>
                    )}
                    {showSavePrompt ? (
                      <form
                        onSubmit={(event) => {
                          event.preventDefault();
                          if (!saveName.trim()) return;
                          onSaveView?.(saveName.trim());
                          setSaveName('');
                          setShowSavePrompt(false);
                        }}
                        className="mt-2 flex flex-wrap items-center gap-2"
                      >
                        <label className="flex flex-1 items-center gap-2 text-[11px] font-semibold text-slate-700">
                          Name
                          <input
                            type="text"
                            value={saveName}
                            onChange={(event) => setSaveName(event.target.value)}
                            data-testid="saved-views-name-input"
                            className="flex-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-[12px] font-normal text-slate-700"
                            aria-label="Saved view name"
                          />
                        </label>
                        <button
                          type="submit"
                          data-testid="saved-views-confirm"
                          disabled={!onSaveView || Boolean(savedViewsDisabledReason)}
                          className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Save className="h-3 w-3" /> Save
                        </button>
                      </form>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowSavePrompt(true)}
                        data-testid="saved-views-save"
                        disabled={!onSaveView || Boolean(savedViewsDisabledReason)}
                        className="mt-2 inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Plus className="h-3 w-3" /> Save view
                      </button>
                    )}
                  </div>
                </section>
              );
            }

            return (
              <section key={groupKey} aria-labelledby={`${groupKey}-heading`}>
                <h3
                  id={`${groupKey}-heading`}
                  className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500"
                >
                  {FILTER_GROUP_LABELS[groupKey]}
                </h3>
                <div className="mt-2 grid gap-2">{groupOptionsList.map(renderOption)}</div>
              </section>
            );
          })}
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-5 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                dispatch({ type: 'clear-all' });
                onClearAll?.();
              }}
              data-testid="subscription-filter-drawer-clear"
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300"
            >
              <RefreshCcw className="h-3 w-3" />
              Clear all
            </button>
            {defaults ? (
              <button
                type="button"
                onClick={() => {
                  dispatch({ type: 'replace', next: defaults });
                  onReset?.();
                }}
                data-testid="subscription-filter-drawer-reset"
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300"
              >
                <RotateCcw className="h-3 w-3" />
                Reset to default
              </button>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => onApply(draft)}
            data-testid="subscription-filter-drawer-apply"
            className="inline-flex items-center gap-1 rounded-full border border-slate-900 bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
          >
            Apply filters
          </button>
        </footer>
      </aside>
    </div>
  );
}
