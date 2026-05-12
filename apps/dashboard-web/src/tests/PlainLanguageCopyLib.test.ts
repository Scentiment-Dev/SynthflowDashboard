import { describe, expect, it } from 'vitest';
import {
  BANNED_USER_FACING_STRINGS,
  BUSINESS_VALUE_NEXT_STEP,
  EXPORT_BLOCKED_REASON,
  EXPORT_MANIFEST_FIELD_LABEL,
  EXPORT_SCOPE_DESCRIPTION,
  EXPORT_SCOPE_LABEL,
  EXTENDED_FRESHNESS_DETAIL,
  EXTENDED_FRESHNESS_LABEL,
  FILTER_GROUP_LABELS,
  FILTER_GROUP_ORDER,
  FILTER_VALUE_LABEL,
  FRESHNESS_DETAIL,
  FRESHNESS_LABEL,
  PERMISSION_DENIED_COPY,
  SOURCE_AUTHORITY_EXPLANATION,
  SOURCE_AUTHORITY_LABEL,
  SOURCE_CONFIRMATION_DETAIL,
  STAYAI_MISSING_COPY,
  TECHNICAL_TO_PLAIN,
  TRUST_ANCHOR_SENTENCE,
  TRUST_LEVEL_DETAIL,
  TRUST_NEXT_STEP,
  WHAT_TO_DO_NEXT,
  groupForFilterId,
  humaniseEnumValue,
  isBannedStringFree,
  labelForFilterValue,
  plainLanguageDataDependency,
  scanForBannedStrings,
  toPlainLanguage,
  FILTER_ID_TO_GROUP,
} from '../lib/plainLanguageCopy';
import { SUBSCRIPTION_ADVANCED_FILTERS_FIXTURE } from '../data/subscriptionAdvancedFiltersFixtures';

describe('plainLanguageCopy: trust + source authority + freshness maps', () => {
  it('exposes the locked anchor sentence used on every trust tooltip', () => {
    expect(TRUST_ANCHOR_SENTENCE).toBe('How reliable this metric is right now.');
  });

  it('maps every trust enum to plain-language detail and next-step copy', () => {
    expect(TRUST_LEVEL_DETAIL.high).toMatch(/official confirmation from Stay\.ai/i);
    expect(TRUST_LEVEL_DETAIL.medium).toMatch(/most of the data we need/i);
    expect(TRUST_LEVEL_DETAIL.low).toMatch(/missing or out of date/i);
    expect(TRUST_LEVEL_DETAIL.untrusted).toMatch(/We cannot trust this number/);
    expect(TRUST_NEXT_STEP.high).toMatch(/quote/i);
    expect(TRUST_NEXT_STEP.untrusted).toMatch(/data quality/i);
  });

  it('maps every source-authority role to a plain-language label and explanation', () => {
    expect(SOURCE_AUTHORITY_LABEL.stayai_final).toBe('Stay.ai · official');
    expect(SOURCE_AUTHORITY_LABEL.shopify_context).toBe('Shopify · context only');
    expect(SOURCE_AUTHORITY_LABEL.synthflow_journey).toBe('Synthflow · journey only');
    expect(SOURCE_AUTHORITY_LABEL.portal_link_sent).toBe('Portal · link sent');
    expect(SOURCE_AUTHORITY_LABEL.portal_completion).toBe('Portal · completion confirmed');
    expect(SOURCE_AUTHORITY_EXPLANATION.stayai_final).toMatch(/owns the official subscription record/i);
    expect(SOURCE_AUTHORITY_EXPLANATION.portal_link_sent).toMatch(
      /received the link, but we have not confirmed/i,
    );
  });

  it('renders freshness states with a label + plain-language detail', () => {
    expect(FRESHNESS_LABEL.fresh).toBe('On time');
    expect(FRESHNESS_LABEL.stale).toBe('Too old to trust');
    expect(FRESHNESS_LABEL.unknown).toBe('Status unknown');
    expect(FRESHNESS_DETAIL.stale).toMatch(/older than our trust threshold/);
    expect(EXTENDED_FRESHNESS_LABEL.warning).toBe('Slightly delayed');
    expect(EXTENDED_FRESHNESS_LABEL.degraded).toBe('Behind schedule');
    expect(EXTENDED_FRESHNESS_DETAIL.warning).toMatch(/little behind schedule/);
    expect(EXTENDED_FRESHNESS_DETAIL.degraded).toMatch(/meaningfully behind/);
  });

  it('exposes source-confirmation detail copy for every contract enum', () => {
    expect(SOURCE_CONFIRMATION_DETAIL.confirmed).toMatch(/Stay\.ai has confirmed/);
    expect(SOURCE_CONFIRMATION_DETAIL.pending).toMatch(/has not yet confirmed/);
    expect(SOURCE_CONFIRMATION_DETAIL.missing).toMatch(/has not sent any final outcomes/);
  });
});

describe('plainLanguageCopy: empty/permission/blocked state copy', () => {
  it('exposes locked permission-denied copy ending with the manager CTA', () => {
    expect(PERMISSION_DENIED_COPY.headline).toBe(
      "We don't have permission to load live data here.",
    );
    expect(PERMISSION_DENIED_COPY.cta).toBe('Ask my manager for access');
  });

  it('exposes the Stay.ai missing hard-fail headline + data-quality CTA', () => {
    expect(STAYAI_MISSING_COPY.headline).toMatch(/We're not getting Stay\.ai final results/);
    expect(STAYAI_MISSING_COPY.cta).toBe('Open data quality');
  });

  it('exposes a "what to do next" entry for every documented blocked state', () => {
    expect(WHAT_TO_DO_NEXT.permission_denied).toMatch(/manager for access/i);
    expect(WHAT_TO_DO_NEXT.fixture_unreachable).toMatch(/temporarily unavailable/i);
    expect(WHAT_TO_DO_NEXT.fixture_malformed).toMatch(/Refresh in a few minutes/);
    expect(WHAT_TO_DO_NEXT.stayai_missing).toMatch(/data quality/i);
    expect(WHAT_TO_DO_NEXT.stayai_pending).toMatch(/follow-up queue/i);
    expect(WHAT_TO_DO_NEXT.manifest_mismatch).toMatch(/Refresh and try again/);
    expect(WHAT_TO_DO_NEXT.low_trust).toMatch(/Stay\.ai before sharing/);
    expect(WHAT_TO_DO_NEXT.untrusted).toMatch(/data quality/i);
    expect(WHAT_TO_DO_NEXT.empty_window).toMatch(/widening|clearing/i);
    expect(WHAT_TO_DO_NEXT.blocked_by_data).toMatch(/required join/i);
    expect(WHAT_TO_DO_NEXT.blocked_by_data).not.toMatch(/cycle 00/i);
    expect(WHAT_TO_DO_NEXT.no_rows_selected).toMatch(/Tick at least one row/);
    expect(WHAT_TO_DO_NEXT.export_pending).toMatch(/audit reference/i);
  });

  it('maps business-value states to support-friendly next steps', () => {
    expect(BUSINESS_VALUE_NEXT_STEP.confirmed).toMatch(/board reporting/);
    expect(BUSINESS_VALUE_NEXT_STEP.estimated).toMatch(/trends/);
    expect(BUSINESS_VALUE_NEXT_STEP.pending).toMatch(/Stay\.ai/);
    expect(BUSINESS_VALUE_NEXT_STEP.unknown).toMatch(/data quality/);
    expect(BUSINESS_VALUE_NEXT_STEP.blocked_by_data).toMatch(/cannot publish yet/i);
    expect(BUSINESS_VALUE_NEXT_STEP.blocked_by_data).not.toMatch(/cycle 00/i);
  });
});

describe('plainLanguageCopy: technical-to-plain translation', () => {
  it('returns plain-language replacements for every banned token in TECHNICAL_TO_PLAIN', () => {
    expect(toPlainLanguage('pending_stayai_match')).toBe('Stay.ai · pending');
    expect(toPlainLanguage('confirmed_stayai_match')).toBe('Stay.ai · official');
    expect(toPlainLanguage('missing_stayai_final_state')).toBe('Stay.ai · not received');
    expect(toPlainLanguage('analytics-api unreachable')).toBe('Live data is temporarily unavailable');
    expect(toPlainLanguage('fixture')).toBe('last reviewed snapshot');
    expect(toPlainLanguage('starter_baseline')).toBe('No data yet');
  });

  it('passes through unknown tokens verbatim', () => {
    expect(toPlainLanguage('subscription_outcomes_v3.2')).toBe('subscription_outcomes_v3.2');
  });

  it('handles empty / null / whitespace input gracefully', () => {
    expect(toPlainLanguage('')).toBe('');
    expect(toPlainLanguage('   ')).toBe('');
    expect(toPlainLanguage(null)).toBe('');
    expect(toPlainLanguage(undefined)).toBe('');
  });

  it('keeps every banned token represented in TECHNICAL_TO_PLAIN', () => {
    expect(TECHNICAL_TO_PLAIN).toMatchObject({
      pending_stayai_match: expect.any(String),
      confirmed_stayai_match: expect.any(String),
      missing_stayai_final_state: expect.any(String),
    });
  });
});

describe('plainLanguageCopy: banned-string scanner', () => {
  it('detects every banned token and returns context for each hit', () => {
    const hits = scanForBannedStrings('Live data error: shape mismatch from analytics-api');
    const tokens = hits.map((h) => h.token);
    expect(tokens).toContain('shape mismatch');
    expect(tokens).toContain('analytics-api');
    expect(hits[0].context).toMatch(/shape mismatch/i);
    expect(hits.every((h) => typeof h.matchedAt === 'number' && h.matchedAt >= 0)).toBe(true);
  });

  it('matches case-insensitively', () => {
    expect(scanForBannedStrings('RBAC denied').map((h) => h.token)).toContain('rbac');
    expect(scanForBannedStrings('Shape Mismatch').map((h) => h.token)).toContain('shape mismatch');
  });

  it('returns no hits for clean copy and reports `isBannedStringFree=true`', () => {
    expect(scanForBannedStrings('Stay.ai · official outcome')).toEqual([]);
    expect(isBannedStringFree('Stay.ai · official outcome')).toBe(true);
    expect(isBannedStringFree('We have analytics-api errors')).toBe(false);
  });

  it('handles empty input safely', () => {
    expect(scanForBannedStrings('')).toEqual([]);
    expect(isBannedStringFree('')).toBe(true);
  });

  it('keeps the banned-strings list in sync with the copy guide', () => {
    expect(BANNED_USER_FACING_STRINGS).toContain('analytics-api');
    expect(BANNED_USER_FACING_STRINGS).toContain('shape mismatch');
    expect(BANNED_USER_FACING_STRINGS).toContain('cycle 00');
    expect(BANNED_USER_FACING_STRINGS).toContain('wave 00');
    expect(BANNED_USER_FACING_STRINGS).toContain('rbac');
  });
});

describe('plainLanguageCopy: filter group + value helpers', () => {
  it('orders the filter groups by IA v2 spec', () => {
    expect(FILTER_GROUP_ORDER).toEqual([
      'date_and_comparison',
      'outcome',
      'cancellation_and_retention',
      'customer_subscription',
      'product_sku',
      'value_and_risk',
      'source_and_trust',
      'flow_version',
      'portal_handoff',
      'saved_views',
    ]);
    expect(FILTER_GROUP_LABELS.date_and_comparison).toBe('Date and comparison');
    expect(FILTER_GROUP_LABELS.saved_views).toBe('Saved views');
  });

  it('groups every documented filter dimension into its IA section', () => {
    expect(groupForFilterId('date_preset')).toBe('date_and_comparison');
    expect(groupForFilterId('custom_date_range')).toBe('date_and_comparison');
    expect(groupForFilterId('comparison_period')).toBe('date_and_comparison');
    expect(groupForFilterId('cancellation_reason')).toBe('cancellation_and_retention');
    expect(groupForFilterId('offer_type')).toBe('cancellation_and_retention');
    expect(groupForFilterId('offer_version')).toBe('cancellation_and_retention');
    expect(groupForFilterId('save_or_cancel_or_pending')).toBe('outcome');
    expect(groupForFilterId('match_confidence')).toBe('source_and_trust');
    expect(groupForFilterId('trust_label')).toBe('source_and_trust');
    expect(groupForFilterId('current_vs_future_flow_state')).toBe('flow_version');
    expect(groupForFilterId('saved_view')).toBe('saved_views');
    expect(groupForFilterId('product_sku')).toBe('product_sku');
    expect(groupForFilterId('value_range')).toBe('value_and_risk');
    expect(groupForFilterId('repeat_contact')).toBe('outcome');
    expect(groupForFilterId('portal_state')).toBe('portal_handoff');
    expect(groupForFilterId('subscription_status')).toBe('customer_subscription');
    expect(groupForFilterId('synthflow_flow_version')).toBe('flow_version');
    expect(groupForFilterId('stayai_action_type')).toBe('flow_version');
    expect(groupForFilterId('stayai_offer_version')).toBe('flow_version');
    expect(groupForFilterId('stayai_freshness_state')).toBe('flow_version');
    expect(groupForFilterId('escalation_state')).toBe('outcome');
  });

  it('falls back to customer_subscription for unknown filter ids', () => {
    expect(groupForFilterId('totally_unknown')).toBe('customer_subscription');
  });

  it('humanises an enum value when no explicit translation exists', () => {
    expect(humaniseEnumValue('something_strange-here')).toBe('Something strange here');
    expect(humaniseEnumValue('')).toBe('');
  });

  it('uses FILTER_VALUE_LABEL when the value is documented', () => {
    expect(labelForFilterValue('date_preset', 'last_30_days')).toBe('Last 30 days');
    expect(labelForFilterValue('cancellation_reason', 'cost_too_high')).toBe('Cost too high');
    expect(labelForFilterValue('trust_label', 'untrusted')).toBe('Untrusted');
    expect(labelForFilterValue('portal_state', 'portal_completed')).toBe('Completion confirmed');
    expect(labelForFilterValue('repeat_contact', 'within_1_day')).toBe('Within 1 day');
    expect(labelForFilterValue('comparison_period', 'previous_year')).toBe('Previous year');
    expect(labelForFilterValue('current_vs_future_flow_state', 'compare')).toBe(
      'Compare current and future',
    );
  });

  it('falls back to humaniseEnumValue when the value is undocumented', () => {
    expect(labelForFilterValue('product_sku', 'sku_42')).toBe('Sku 42');
    expect(FILTER_VALUE_LABEL.cancellation_reason.unknown).toBe('Reason not captured');
  });

  it('maps known data_dependency keys to plain-language explanations', () => {
    expect(plainLanguageDataDependency('event_timestamp')).toMatch(/Accurate call timestamps/);
    expect(plainLanguageDataDependency('stayai_offer_sync')).toMatch(/Stay\.ai offer-version sync/);
  });

  it('humanises unknown data_dependency keys', () => {
    expect(plainLanguageDataDependency('some_other_feed')).toMatch(/Some other feed/);
  });

  it('advanced filter fixture includes every catalogued filter_id', () => {
    const ids = new Set(SUBSCRIPTION_ADVANCED_FILTERS_FIXTURE.options.map((o) => o.filter_id));
    for (const filterId of Object.keys(FILTER_ID_TO_GROUP)) {
      expect(ids.has(filterId)).toBe(true);
    }
  });
});

describe('plainLanguageCopy: export catalog', () => {
  it('exposes every export scope with a label and description', () => {
    expect(EXPORT_SCOPE_LABEL.current_page).toBe('Export current page');
    expect(EXPORT_SCOPE_LABEL.selected_widget).toBe('Export selected widget');
    expect(EXPORT_SCOPE_LABEL.selected_rows).toBe('Export table rows');
    expect(EXPORT_SCOPE_LABEL.filtered_csv).toBe('Export filtered CSV');
    expect(EXPORT_SCOPE_LABEL.pdf_snapshot).toBe('Export PDF snapshot');
    expect(EXPORT_SCOPE_LABEL.audit_manifest).toBe('Export audit manifest');
    expect(EXPORT_SCOPE_DESCRIPTION.audit_manifest).toMatch(/manifest only/i);
  });

  it('exposes a plain-language reason for every blocked-state', () => {
    expect(EXPORT_BLOCKED_REASON.allowed).toBe('Allowed');
    expect(EXPORT_BLOCKED_REASON.permission).toMatch(/role doesn't allow/);
    expect(EXPORT_BLOCKED_REASON.missing_metadata).toMatch(/manifest fields are missing/);
    expect(EXPORT_BLOCKED_REASON.low_trust).toMatch(/Trust is too low/);
    expect(EXPORT_BLOCKED_REASON.backend_not_connected).toMatch(/export pipeline is not connected/);
    expect(EXPORT_BLOCKED_REASON.no_rows_selected).toMatch(/at least one row/);
    expect(EXPORT_BLOCKED_REASON.pending_audit_reference).toMatch(/audit reference/);
    expect(EXPORT_BLOCKED_REASON.manifest_mismatch).toMatch(/metric definition has changed/);
    expect(EXPORT_BLOCKED_REASON.request_failed).toMatch(/could not finish/);
  });

  it('exposes the manifest field labels', () => {
    expect(EXPORT_MANIFEST_FIELD_LABEL.filters).toBe('Active filters');
    expect(EXPORT_MANIFEST_FIELD_LABEL.formula_versions).toBe('Formula version');
    expect(EXPORT_MANIFEST_FIELD_LABEL.audit_reference).toBe('Audit reference');
    expect(EXPORT_MANIFEST_FIELD_LABEL.fingerprint).toBe('Manifest fingerprint');
    expect(EXPORT_MANIFEST_FIELD_LABEL.included_widgets).toBe('Included widgets');
    expect(EXPORT_MANIFEST_FIELD_LABEL.excluded_widgets).toBe('Excluded widgets');
  });
});
