import { useEffect, useId, useRef, useState } from 'react';
import { MoreVertical } from 'lucide-react';

export type WidgetActionItem = {
  id: string;
  label: string;
  /** Optional plain-language reason the action is disabled. */
  disabledReason?: string;
  onSelect?: () => void;
};

type WidgetActionMenuProps = {
  /** Plain-language label for the widget the menu controls (used in aria). */
  widgetLabel: string;
  items: WidgetActionItem[];
  /** Test hook so callers can target the menu in tests / screenshots. */
  testId?: string;
};

/**
 * Cycle 008 per-widget action menu. Renders the kebab `⋮` affordance every
 * KPI / chart / panel / table needs so support users can export the
 * widget, open the metric definition, or jump to the canonical drilldown
 * subpage in one click.
 *
 * The menu closes on outside-click, Escape, or after an item is selected.
 * Disabled items still render with their `disabledReason` exposed via
 * `title` + `aria-describedby` so the user knows why the action is off.
 */
export default function WidgetActionMenu({
  widgetLabel,
  items,
  testId = 'widget-action-menu',
}: WidgetActionMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative inline-flex" data-testid={testId}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`Actions for ${widgetLabel}`}
        data-testid={`${testId}-trigger`}
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60"
      >
        <MoreVertical className="h-4 w-4" aria-hidden />
      </button>
      {open ? (
        <ul
          id={menuId}
          role="menu"
          aria-label={`Actions for ${widgetLabel}`}
          className="absolute right-0 top-full z-30 mt-1 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 text-sm text-slate-700 shadow-lg"
        >
          {items.map((item) => {
            const disabled = Boolean(item.disabledReason);
            return (
              <li key={item.id} role="none">
                <button
                  type="button"
                  role="menuitem"
                  data-testid={`${testId}-item-${item.id}`}
                  disabled={disabled}
                  aria-disabled={disabled || undefined}
                  title={item.disabledReason}
                  onClick={() => {
                    if (disabled) return;
                    item.onSelect?.();
                    setOpen(false);
                  }}
                  className={`flex w-full flex-col gap-0.5 px-3 py-2 text-left transition ${
                    disabled
                      ? 'cursor-not-allowed bg-slate-50 text-slate-400'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <span className="font-semibold">{item.label}</span>
                  {disabled ? (
                    <span className="text-[11px] text-slate-500">{item.disabledReason}</span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
