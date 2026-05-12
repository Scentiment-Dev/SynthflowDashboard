import { useId, useState, type ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type TechnicalDetailsDisclosureProps = {
  /** Plain-language summary visible when expanded (Level 2). */
  summary: ReactNode;
  /**
   * Raw governance content (Level 3). Rendered behind a second toggle so
   * raw IDs / fingerprints / ISO timestamps stay one extra click away.
   */
  governance?: ReactNode;
  /** Override the trigger label. */
  triggerLabel?: string;
  /** Override the governance toggle label. */
  governanceLabel?: string;
  /** Override the governance "hide" label. */
  governanceHideLabel?: string;
  testId?: string;
};

/**
 * Cycle 008 technical-details disclosure. Wraps two layers of progressive
 * disclosure: the friendly Level 2 summary (formula, owner, friendly
 * timestamps) and the Level 3 raw governance details (metric IDs,
 * fingerprints, ISO timestamps).
 *
 * Designed as the seam Agent B mounts inside KPI cards / panels to remove
 * raw technical metadata from the primary surface.
 */
export default function TechnicalDetailsDisclosure({
  summary,
  governance,
  triggerLabel = 'Show metric definition',
  governanceLabel = 'Open governance drawer',
  governanceHideLabel = 'Hide governance details',
  testId = 'technical-details-disclosure',
}: TechnicalDetailsDisclosureProps) {
  const [open, setOpen] = useState(false);
  const [governanceOpen, setGovernanceOpen] = useState(false);
  const summaryId = useId();
  const governanceId = useId();

  return (
    <div className="mt-2 text-xs leading-5 text-slate-500" data-testid={testId}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={summaryId}
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-slate-900"
      >
        {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        {triggerLabel}
      </button>
      {open ? (
        <div
          id={summaryId}
          className="mt-2 space-y-1 rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-slate-600"
        >
          <div className="text-slate-700">{summary}</div>
          {governance ? (
            <div className="pt-2">
              <button
                type="button"
                aria-expanded={governanceOpen}
                aria-controls={governanceId}
                onClick={() => setGovernanceOpen((prev) => !prev)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-900"
              >
                {governanceOpen ? governanceHideLabel : governanceLabel}
              </button>
              {governanceOpen ? (
                <div
                  id={governanceId}
                  className="mt-2 rounded-lg border border-slate-200 bg-white p-3 font-mono text-[11px] leading-relaxed text-slate-700"
                >
                  {governance}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
