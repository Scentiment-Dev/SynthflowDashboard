import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Download, X, ShieldAlert } from 'lucide-react';
import StateChip from '../subscription-v2/StateChip';
import {
  EXPORT_BLOCKED_REASON,
  EXPORT_MANIFEST_FIELD_LABEL,
  EXPORT_SCOPE_DESCRIPTION,
  EXPORT_SCOPE_LABEL,
  type ExportBlockedReasonKey,
  type ExportManifestFieldKey,
  type ExportScopeKey,
} from '../../lib/plainLanguageCopy';

/* ---------------------------------------------------------------------- */
/* Types                                                                  */
/* ---------------------------------------------------------------------- */

export type ExportManifestPreview = {
  filters?: string[];
  metric_definitions?: string[];
  trust_labels?: string[];
  freshness?: string;
  formula_versions?: string[];
  owner?: string;
  timestamp?: string;
  fingerprint?: string;
  audit_reference?: string;
  requester_role?: string;
  permission_decision?: string;
  source_confirmation_status?: string;
  included_widgets?: string[];
  excluded_widgets?: string[];
};

export type ExportScopeAvailability = {
  scope: ExportScopeKey;
  blockedReason: ExportBlockedReasonKey;
};

export type ExportRequestResult = {
  status: 'allowed' | 'blocked' | 'pending';
  blockedReason?: ExportBlockedReasonKey;
  audit_reference?: string;
  fingerprint?: string;
};

type ExportDrawerProps = {
  open: boolean;
  onClose: () => void;
  /** Plain-language label for the surface being exported (e.g. "Command Center"). */
  pageLabel: string;
  /** Per-scope availability — maps each scope to its blocked reason / "allowed". */
  scopes: ExportScopeAvailability[];
  /** Manifest preview always shown above the generate button. */
  manifest: ExportManifestPreview;
  /**
   * Callback when the user confirms the export. Receives the selected scope
   * key. Implementations bubble back the audit reference / fingerprint.
   */
  // eslint-disable-next-line no-unused-vars
  onConfirm?: (scope: ExportScopeKey) => Promise<ExportRequestResult> | ExportRequestResult;
  /**
   * Optional pre-selection. Defaults to the first scope marked "allowed" or
   * the first scope in the list.
   */
  defaultScope?: ExportScopeKey;
};

/* ---------------------------------------------------------------------- */
/* Helpers                                                                */
/* ---------------------------------------------------------------------- */

const MANIFEST_FIELDS: ReadonlyArray<{ key: ExportManifestFieldKey; arrayLabel?: string }> = [
  { key: 'filters' },
  { key: 'metric_definitions' },
  { key: 'trust_labels' },
  { key: 'freshness' },
  { key: 'formula_versions' },
  { key: 'owner' },
  { key: 'timestamp' },
  { key: 'fingerprint' },
  { key: 'audit_reference' },
  { key: 'requester_role' },
  { key: 'permission_decision' },
  { key: 'source_confirmation_status' },
  { key: 'included_widgets' },
  { key: 'excluded_widgets' },
];

function renderManifestValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.length === 0 ? '—' : value.join(' · ');
  }
  if (value === undefined || value === null || value === '') return '—';
  return String(value);
}

/* ---------------------------------------------------------------------- */
/* Component                                                              */
/* ---------------------------------------------------------------------- */

/**
 * Cycle 008 reusable Export Drawer.
 *
 * Surfaces every export scope (current page · selected widget · selected
 * rows · filtered CSV · PDF snapshot · audit manifest) with its blocked
 * reason in plain language, plus the manifest preview that must always
 * be visible before the user can generate.
 *
 * Blocked-reason taxonomy:
 *   - allowed
 *   - permission
 *   - missing_metadata
 *   - low_trust
 *   - backend_not_connected
 *   - no_rows_selected
 *   - pending_audit_reference
 *
 * The drawer prevents the user from confirming when no scope is allowed.
 * After a successful confirm, the result toast surfaces the audit
 * reference + fingerprint per workflow W7.A5.
 */
export default function SubscriptionExportDrawer({
  open,
  onClose,
  pageLabel,
  scopes,
  manifest,
  onConfirm,
  defaultScope,
}: ExportDrawerProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const allowedScopes = useMemo(
    () => scopes.filter((s) => s.blockedReason === 'allowed'),
    [scopes],
  );

  const [selected, setSelected] = useState<ExportScopeKey | null>(() => {
    if (defaultScope) return defaultScope;
    if (allowedScopes.length > 0) return allowedScopes[0].scope;
    return scopes[0]?.scope ?? null;
  });
  const [result, setResult] = useState<ExportRequestResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  // Reset transient state every time the drawer opens.
  useEffect(() => {
    if (!open) return;
    setResult(null);
    setSubmitting(false);
    if (defaultScope) setSelected(defaultScope);
    else if (allowedScopes.length > 0) setSelected(allowedScopes[0].scope);
    else setSelected(scopes[0]?.scope ?? null);
  }, [open, defaultScope, allowedScopes, scopes]);

  if (!open) return null;

  const selectedAvailability = scopes.find((s) => s.scope === selected) ?? null;
  const selectedBlocked =
    selectedAvailability && selectedAvailability.blockedReason !== 'allowed';

  const handleConfirm = async () => {
    if (!selected || !onConfirm || selectedBlocked) return;
    try {
      setSubmitting(true);
      const out = await Promise.resolve(onConfirm(selected));
      setResult(out);
    } catch {
      // Network/server failures or thrown errors — always surface as a blocked toast so the
      // operator gets actionable copy instead of a silent stuck state.
      setResult({ status: 'blocked', blockedReason: 'request_failed' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 flex justify-end bg-slate-900/40"
      data-testid="subscription-export-drawer-overlay"
      onClick={onClose}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-testid="subscription-export-drawer"
        onClick={(event) => event.stopPropagation()}
        className="flex h-full w-full max-w-xl flex-col overflow-hidden bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-700">
              <Download className="h-4 w-4" aria-hidden />
            </span>
            <div>
              <p className="eyebrow !tracking-[0.18em]">Export this view</p>
              <h2 id={titleId} className="text-base font-semibold text-slate-950">
                {pageLabel}
              </h2>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Choose what to export. The manifest preview shows what the audit row will
                contain.
              </p>
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close export drawer"
            data-testid="subscription-export-drawer-close"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          <section aria-labelledby="export-scope-heading">
            <h3
              id="export-scope-heading"
              className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500"
            >
              What to export
            </h3>
            <div className="mt-2 grid gap-2">
              {scopes.map((option) => {
                const blocked = option.blockedReason !== 'allowed';
                const checked = selected === option.scope;
                return (
                  <label
                    key={option.scope}
                    data-testid={`export-scope-${option.scope}`}
                    data-blocked={blocked}
                    className={`flex flex-col gap-1 rounded-2xl border px-3 py-2.5 transition ${
                      checked
                        ? 'border-slate-900 ring-2 ring-slate-900/10'
                        : 'border-slate-200 hover:border-slate-300'
                    } ${blocked ? 'opacity-70' : ''}`}
                  >
                    <span className="flex items-start gap-2">
                      <input
                        type="radio"
                        name="export-scope"
                        value={option.scope}
                        checked={checked}
                        onChange={() => setSelected(option.scope)}
                        disabled={blocked}
                        aria-disabled={blocked || undefined}
                        className="mt-1 h-3.5 w-3.5"
                        data-testid={`export-scope-${option.scope}-input`}
                      />
                      <span className="flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900">
                            {EXPORT_SCOPE_LABEL[option.scope]}
                          </span>
                          {blocked ? (
                            <StateChip
                              tone="warning"
                              label="Blocked"
                              tooltip={EXPORT_BLOCKED_REASON[option.blockedReason]}
                            />
                          ) : (
                            <StateChip tone="success" label="Available" />
                          )}
                        </span>
                        <span className="mt-0.5 block text-[11px] leading-4 text-slate-500">
                          {EXPORT_SCOPE_DESCRIPTION[option.scope]}
                        </span>
                        {blocked ? (
                          <span
                            data-testid={`export-scope-${option.scope}-reason`}
                            className="mt-1 block rounded-md bg-amber-50 px-2 py-1 text-[11px] text-amber-900"
                          >
                            {EXPORT_BLOCKED_REASON[option.blockedReason]}
                          </span>
                        ) : null}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </section>

          <section
            aria-labelledby="export-manifest-heading"
            data-testid="export-manifest-preview"
          >
            <h3
              id="export-manifest-heading"
              className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500"
            >
              Manifest preview
            </h3>
            <p className="mt-1 text-[11px] text-slate-500">
              Every export emits an audit row containing exactly these fields. Operators see
              this before generating so they can verify what's about to leave the dashboard.
            </p>
            <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-2 rounded-2xl border border-slate-200 bg-slate-50/60 px-3 py-3 sm:grid-cols-2">
              {MANIFEST_FIELDS.map(({ key }) => (
                <div key={key} className="text-[12px] leading-5">
                  <dt className="font-semibold text-slate-700">
                    {EXPORT_MANIFEST_FIELD_LABEL[key]}
                  </dt>
                  <dd
                    data-testid={`export-manifest-field-${key}`}
                    className="text-slate-600"
                  >
                    {renderManifestValue((manifest as Record<string, unknown>)[key])}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {selectedBlocked && selectedAvailability ? (
            <section
              aria-labelledby="export-blocked-heading"
              data-testid="export-blocked-callout"
              className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-amber-900"
            >
              <ShieldAlert className="mt-0.5 h-4 w-4" aria-hidden />
              <div>
                <p
                  id="export-blocked-heading"
                  className="text-sm font-semibold"
                >
                  Export blocked
                </p>
                <p className="mt-0.5 text-[12px] leading-5">
                  {EXPORT_BLOCKED_REASON[selectedAvailability.blockedReason]}
                </p>
              </div>
            </section>
          ) : null}

          {result ? (
            <section
              data-testid="export-result-toast"
              role="status"
              className={`rounded-2xl border px-3 py-2.5 text-[12px] leading-5 ${
                result.status === 'allowed'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                  : result.status === 'pending'
                    ? 'border-sky-200 bg-sky-50 text-sky-900'
                    : 'border-rose-200 bg-rose-50 text-rose-900'
              }`}
            >
              {result.status === 'allowed' ? (
                <>
                  <p className="font-semibold">Export ready.</p>
                  {result.audit_reference ? (
                    <p>audit reference: {result.audit_reference}</p>
                  ) : null}
                  {result.fingerprint ? (
                    <p>manifest fingerprint: {result.fingerprint}</p>
                  ) : null}
                </>
              ) : result.status === 'pending' ? (
                <p>Your export is pending an audit reference. We will notify you when it lands.</p>
              ) : (
                <p>
                  {result.blockedReason
                    ? EXPORT_BLOCKED_REASON[result.blockedReason]
                    : 'Export blocked. Refresh and try again.'}
                </p>
              )}
            </section>
          ) : null}
        </div>

        <footer className="flex items-center justify-between gap-2 border-t border-slate-100 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            data-testid="subscription-export-drawer-cancel"
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={selectedBlocked || submitting || !selected}
            aria-disabled={(selectedBlocked || submitting || !selected) || undefined}
            data-testid="subscription-export-drawer-generate"
            className="inline-flex items-center gap-1 rounded-full border border-slate-900 bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-3 w-3" />
            {submitting ? 'Generating…' : 'Generate export'}
          </button>
        </footer>
      </aside>
    </div>
  );
}
