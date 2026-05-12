import { useEffect, useId, useRef, type ReactNode } from 'react';
import { HelpCircle, X } from 'lucide-react';

type MetricHelpDrawerProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Plain-language summary visible at the top of the drawer. */
  summary: string;
  /** Friendly formula description. */
  friendlyFormula?: string;
  ownerLabel?: string;
  updatedAge?: string;
  updatedTimestamp?: string;
  /** Optional Level-3 raw governance content. */
  governance?: ReactNode;
  /** Plain-language guidance: "what to do next" if the metric is concerning. */
  whatToDoNext?: string;
};

/**
 * Cycle 008 metric help drawer (Level 2 / Level 3 disclosure surface).
 *
 * Built so Agent B can mount it next to any metric without having to
 * manage focus, ESC handling, or the close-on-outside-click pattern.
 * The drawer uses an aria-labelled overlay so the underlying page
 * remains accessible; the panel itself is rendered as a `<aside>` with
 * `role="dialog"` so screen readers announce it correctly.
 */
export default function MetricHelpDrawer({
  open,
  onClose,
  title,
  summary,
  friendlyFormula,
  ownerLabel,
  updatedAge,
  updatedTimestamp,
  governance,
  whatToDoNext,
}: MetricHelpDrawerProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      aria-hidden={open ? false : true}
      className="fixed inset-0 z-40 flex justify-end bg-slate-900/40"
      data-testid="metric-help-drawer-overlay"
      onClick={onClose}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-testid="metric-help-drawer"
        onClick={(event) => event.stopPropagation()}
        className="flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-700">
              <HelpCircle className="h-4 w-4" aria-hidden />
            </span>
            <div>
              <p className="eyebrow !tracking-[0.18em]">Help with this metric</p>
              <h2 id={titleId} className="text-base font-semibold text-slate-950">
                {title}
              </h2>
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            data-testid="metric-help-drawer-close"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
            aria-label="Close metric help"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </header>
        <div className="flex flex-col gap-4 px-5 py-5 text-sm leading-6 text-slate-700">
          <section>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              What this number means
            </p>
            <p className="mt-1 text-slate-700">{summary}</p>
          </section>
          {friendlyFormula ? (
            <section>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                How we calculate it
              </p>
              <p className="mt-1 text-slate-700">{friendlyFormula}</p>
            </section>
          ) : null}
          {(ownerLabel || updatedAge || updatedTimestamp) ? (
            <section>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Who owns it · when it last refreshed
              </p>
              <ul className="mt-1 space-y-0.5 text-[12px] text-slate-600">
                {ownerLabel ? <li>Owner: {ownerLabel}</li> : null}
                {updatedAge ? (
                  <li>
                    {updatedAge}
                    {updatedTimestamp ? ` · ${updatedTimestamp}` : null}
                  </li>
                ) : null}
              </ul>
            </section>
          ) : null}
          {whatToDoNext ? (
            <section className="rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                What to do next
              </p>
              <p className="mt-1 text-[12px] text-slate-700">{whatToDoNext}</p>
            </section>
          ) : null}
          {governance ? (
            <section>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Governance details
              </p>
              <div className="mt-2 rounded-lg border border-slate-200 bg-slate-900/95 p-3 font-mono text-[11px] leading-relaxed text-slate-100">
                {governance}
              </div>
            </section>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
