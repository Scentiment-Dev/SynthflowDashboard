import { useId, useState, type ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type MetricDisclosureProps = {
  /** Plain-language summary of the metric. Visible when expanded. */
  summary: string;
  /** Friendly formula text, e.g. "Saves divided by cancellation requests". */
  formula?: string;
  formulaVersion?: string;
  owner?: string;
  /** Friendly relative-age string from `formatRelativeAge`. */
  updatedAge?: string;
  /** Friendly absolute timestamp from `formatFriendlyTimestamp`. */
  updatedTimestamp?: string;
  /** Optional Level-3 governance content rendered behind a secondary button. */
  governance?: ReactNode;
  /** Override for the disclosure button label. */
  label?: string;
};

/**
 * Cycle 008 progressive-disclosure expander. Collapsed by default so Level 1
 * surfaces stay clean; opens to reveal Level 2 content (definition, friendly
 * formula, owner, friendly time) with an optional Level 3 governance slot.
 */
export default function MetricDisclosure({
  summary,
  formula,
  formulaVersion,
  owner,
  updatedAge,
  updatedTimestamp,
  governance,
  label = 'Show metric definition',
}: MetricDisclosureProps) {
  const [open, setOpen] = useState(false);
  const [governanceOpen, setGovernanceOpen] = useState(false);
  const panelId = useId();
  const governanceId = useId();

  return (
    <div className="mt-2 text-xs leading-5 text-slate-500">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-slate-900"
      >
        {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        {label}
      </button>
      {open ? (
        <div
          id={panelId}
          className="mt-2 space-y-1 rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-slate-600"
        >
          <p className="text-slate-700">{summary}</p>
          {formula ? (
            <p>
              <span className="font-semibold text-slate-700">How we calculate it: </span>
              {formula}
            </p>
          ) : null}
          <dl className="mt-1 grid grid-cols-1 gap-y-1 sm:grid-cols-2">
            {formulaVersion ? (
              <div>
                <dt className="inline font-semibold text-slate-700">Formula version: </dt>
                <dd className="inline">{formulaVersion}</dd>
              </div>
            ) : null}
            {owner ? (
              <div>
                <dt className="inline font-semibold text-slate-700">Owner: </dt>
                <dd className="inline">{owner}</dd>
              </div>
            ) : null}
            {updatedAge ? (
              <div className="sm:col-span-2">
                <dt className="inline font-semibold text-slate-700">Last updated: </dt>
                <dd className="inline">
                  {updatedAge}
                  {updatedTimestamp ? ` · ${updatedTimestamp}` : null}
                </dd>
              </div>
            ) : null}
          </dl>
          {governance ? (
            <div className="pt-2">
              <button
                type="button"
                aria-expanded={governanceOpen}
                aria-controls={governanceId}
                onClick={() => setGovernanceOpen((prev) => !prev)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-900"
              >
                {governanceOpen ? 'Hide governance details' : 'Open governance drawer'}
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
