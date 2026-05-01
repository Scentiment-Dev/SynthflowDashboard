import type { DashboardModule, ModuleFixture, TrustLabel } from '../types/metrics';

const trend = (values: number[], trust: TrustLabel = 'medium') =>
  values.map((value, index) => ({
    period: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index] ?? `Day ${index + 1}`,
    value,
    trust_label: trust,
  }));

const cards = (
  module: DashboardModule,
  source: string,
  items: Array<[string, string, string | number, string, TrustLabel?]>,
) =>
  items.map(([key, label, value, description, trust_label = 'medium']) => ({
    key,
    label,
    value,
    delta: 'starter baseline',
    trust_label,
    description,
    source_of_truth: source,
    freshness: {
      source: 'warehouse',
      status: 'starter',
      warning_after_minutes: 60,
      hard_fail_after_minutes: 240,
    },
  }));

const definitions = (
  module: DashboardModule,
  source: string,
  items: Array<[string, string, string, string]>,
) =>
  items.map(([metric_key, display_name, formula, trust_rule]) => ({
    metric_key,
    display_name,
    module,
    formula,
    source_of_truth: source,
    trust_rule,
    owner: 'analytics',
    formula_version: 'v0.4.0-wave4',
    launch_scope: 'base_launch',
    description: trust_rule,
  }));

export const MODULE_FIXTURES: Record<DashboardModule, ModuleFixture> = {
  overview: {
    module: 'overview',
    title: 'Executive Overview',
    eyebrow: 'cross-platform command center',
    description:
      'Top-level health view across Synthflow calls, Stay.ai subscription outcomes, Shopify order context, portal completion, and live-agent escalation paths.',
    sourcePriority: ['Synthflow for call journey', 'Stay.ai for subscription outcomes', 'Shopify for order context', 'Portal completion events', 'RingCX/support case systems'],
    lockedRules: ['Containment cannot count abandoned, unresolved, or transferred calls as success.', 'Trust labels are calculated only.'],
    summary: {
      module: 'overview',
      cards: cards('overview', 'Synthflow + Warehouse', [
        ['automation_containment_rate', 'Automation Containment', 'starter', 'Resolved calls and confirmed portal completions only.', 'medium'],
        ['eligible_calls', 'Eligible Calls', 'starter', 'Calls eligible for containment measurement after exclusions.', 'medium'],
        ['high_trust_metric_rate', 'High-Trust Metrics', 'starter', 'Share of major metrics backed by confirmed source data.', 'medium'],
      ]),
      definitions: definitions('overview', 'Synthflow + Warehouse', [
        ['automation_containment_rate', 'Automation Containment Rate', 'resolved_or_portal_completed / eligible_calls', 'Abandoned, unresolved, and transferred calls are excluded from success.'],
        ['high_trust_metric_rate', 'High Trust Metric Rate', 'high_trust_metrics / major_metrics', 'Trust labels are system-calculated.'],
      ]),
      recent_events: [],
    },
    trend: trend([42, 46, 51, 56, 61, 64, 67]),
    funnel: [
      { id: 'calls', label: 'Inbound automated calls', count: 4200, rate: 100, source_of_truth: 'Synthflow', trust_label: 'medium' },
      { id: 'eligible', label: 'Eligible after exclusions', count: 3440, rate: 82, source_of_truth: 'Warehouse', trust_label: 'medium' },
      { id: 'resolved', label: 'Resolved or portal completed', count: 2310, rate: 55, source_of_truth: 'Warehouse', trust_label: 'medium' },
      { id: 'high_trust', label: 'High-trust confirmed', count: 1760, rate: 42, source_of_truth: 'Warehouse', trust_label: 'medium' },
    ],
    journey: [
      { id: 'call', label: 'Call captured', description: 'Synthflow call journey is logged.', status: 'neutral', source: 'Synthflow' },
      { id: 'intent', label: 'Intent classified', description: 'Intent and module routing are normalized.', status: 'neutral', source: 'Warehouse' },
      { id: 'source', label: 'Source matched', description: 'Official source confirmation is attached.', status: 'warning', source: 'Stay.ai / Shopify / Portal' },
      { id: 'metric', label: 'Metric locked', description: 'Formula, trust label, and audit metadata are applied.', status: 'success', source: 'Analytics API' },
    ],
  },
  subscriptions: {
    module: 'subscriptions',
    title: 'Subscription Analytics',
    eyebrow: 'stay.ai source of truth',
    description: 'Tracks Stay.ai-confirmed subscription actions, handoffs, portal completions, and source match quality.',
    sourcePriority: ['Stay.ai confirmed state/action outcome', 'Portal completion events', 'Synthflow call journey'],
    lockedRules: ['Stay.ai is the source of truth for subscription outcomes.', 'Portal link sent is not completion.'],
    summary: {
      module: 'subscriptions',
      cards: cards('subscriptions', 'Stay.ai', [
        ['subscription_action_completion_rate', 'Action Completion', 'starter', 'Confirmed completed subscription actions.', 'medium'],
        ['portal_completion_rate', 'Portal Completion', 'starter', 'Confirmed portal completion, not link delivery.', 'medium'],
        ['stayai_match_rate', 'Stay.ai Match Rate', 'starter', 'Calls successfully matched to a Stay.ai subscription record.', 'medium'],
      ]),
      definitions: definitions('subscriptions', 'Stay.ai', [
        ['subscription_action_completion_rate', 'Subscription Action Completion Rate', 'stayai_confirmed_actions / eligible_subscription_action_attempts', 'Stay.ai confirmed state/action outcome required.'],
        ['portal_completion_rate', 'Portal Completion Rate', 'confirmed_portal_completed / portal_started', 'Link sent is diagnostic only.'],
      ]),
      recent_events: [],
    },
    trend: trend([34, 39, 44, 48, 53, 55, 58]),
    funnel: [
      { id: 'intent', label: 'Subscription intent calls', count: 1200, rate: 100, source_of_truth: 'Synthflow', trust_label: 'medium' },
      { id: 'matched', label: 'Stay.ai subscription matched', count: 1018, rate: 85, source_of_truth: 'Stay.ai', trust_label: 'medium' },
      { id: 'portal_completed', label: 'Portal completion confirmed', count: 652, rate: 54, source_of_truth: 'Portal + Stay.ai', trust_label: 'medium' },
      { id: 'action_confirmed', label: 'Action outcome confirmed', count: 591, rate: 49, source_of_truth: 'Stay.ai', trust_label: 'medium' },
    ],
    journey: [
      { id: 'voice', label: 'Subscription intent', description: 'Synthflow captures the caller intent.', status: 'neutral', source: 'Synthflow' },
      { id: 'portal', label: 'Portal handoff', description: 'Customer receives default portal path when needed.', status: 'warning', source: 'Portal' },
      { id: 'stayai', label: 'Stay.ai confirmation', description: 'State or action outcome is confirmed in Stay.ai.', status: 'success', source: 'Stay.ai', lockedRule: 'Stay.ai remains the source of truth.' },
      { id: 'dashboard', label: 'Metric update', description: 'Dashboard updates only with confirmed outcome.', status: 'success', source: 'Analytics API' },
    ],
  },
  cancellations: {
    module: 'cancellations',
    title: 'Cancellation Analytics',
    eyebrow: 'confirmed cancellation outcomes',
    description: 'Measures cancellation requests, confirmed cancellations, official completion paths, and cancellation reason quality.',
    sourcePriority: ['Stay.ai cancellation state', 'Approved official completion path', 'Synthflow cancellation reason'],
    lockedRules: ['Cancellation request alone is not a confirmed cancellation.', 'Confirmed cancellation requires Stay.ai cancelled state or approved official completion path.'],
    summary: {
      module: 'cancellations',
      cards: cards('cancellations', 'Stay.ai', [
        ['confirmed_cancellation_rate', 'Confirmed Cancellation', 'starter', 'Only official cancellation state or approved path.', 'medium'],
        ['cancellation_reason_capture', 'Reason Capture', 'starter', 'Cancellation reason captured before outcome lock.', 'medium'],
        ['official_path_rate', 'Official Path Rate', 'starter', 'Cancellations completed through approved official path.', 'medium'],
      ]),
      definitions: definitions('cancellations', 'Stay.ai', [
        ['confirmed_cancellation_rate', 'Confirmed Cancellation Rate', 'confirmed_cancelled / eligible_cancellation_attempts', 'Request alone is not cancellation.'],
        ['official_path_rate', 'Official Path Rate', 'approved_official_completion_path / cancellation_attempts', 'Approved path must be explicitly marked.'],
      ]),
      recent_events: [],
    },
    trend: trend([19, 18, 21, 20, 23, 22, 21]),
    funnel: [
      { id: 'attempts', label: 'Cancellation attempts', count: 880, rate: 100, source_of_truth: 'Synthflow', trust_label: 'medium' },
      { id: 'reason', label: 'Reason captured', count: 771, rate: 88, source_of_truth: 'Synthflow', trust_label: 'medium' },
      { id: 'official', label: 'Official state/path confirmed', count: 476, rate: 54, source_of_truth: 'Stay.ai', trust_label: 'medium' },
      { id: 'locked', label: 'Metric eligible', count: 452, rate: 51, source_of_truth: 'Warehouse', trust_label: 'medium' },
    ],
    journey: [
      { id: 'request', label: 'Cancel request', description: 'Caller expresses cancellation intent.', status: 'neutral', source: 'Synthflow' },
      { id: 'evidence', label: 'Official evidence', description: 'Stay.ai state or approved path is required.', status: 'warning', source: 'Stay.ai' },
      { id: 'decision', label: 'Cancel confirmed', description: 'Cancellation metric only counts confirmed evidence.', status: 'success', source: 'Analytics API' },
      { id: 'audit', label: 'Audit trail', description: 'Reference IDs and source timestamps attach to export-ready rows.', status: 'success', source: 'Warehouse' },
    ],
  },
  retention: {
    module: 'retention',
    title: 'Cancellation / Retention Analytics',
    eyebrow: 'save rate and offer journey',
    description: 'Tracks retention offers, save outcomes, declined offers, Cost Too High sequence compliance, and confirmed retained subscriptions.',
    sourcePriority: ['Stay.ai retained/cancelled state', 'Synthflow offer path', 'Portal completion'],
    lockedRules: ['Save requires confirmed retained subscription outcome.', 'Cost Too High follows frequency change → 25% off → cancellation if declined.'],
    summary: {
      module: 'retention',
      cards: cards('retention', 'Stay.ai', [
        ['subscription_save_rate', 'Save Rate', 'starter', 'Confirmed retained subscription outcomes only.', 'medium'],
        ['cost_too_high_offer_progression', 'Cost Too High Compliance', 'starter', 'Frequency offer before 25% off before cancellation.', 'medium'],
        ['retention_offer_acceptance_rate', 'Offer Acceptance', 'starter', 'Accepted retention offers with confirmed Stay.ai retention.', 'medium'],
      ]),
      definitions: definitions('retention', 'Stay.ai', [
        ['subscription_save_rate', 'Subscription Save Rate', 'confirmed_saved / eligible_cancellation_attempts', 'Confirmed retained subscription outcome required.'],
        ['cost_too_high_offer_progression', 'Cost Too High Offer Progression', 'frequency_change -> 25_percent_offer -> cancellation_if_declined', 'Offer sequence is locked.'],
      ]),
      recent_events: [],
    },
    trend: trend([25, 28, 29, 32, 34, 36, 38]),
    funnel: [
      { id: 'eligible', label: 'Eligible cancellation journeys', count: 760, rate: 100, source_of_truth: 'Synthflow', trust_label: 'medium' },
      { id: 'freq_offer', label: 'Frequency change offered', count: 612, rate: 81, source_of_truth: 'Synthflow', trust_label: 'medium' },
      { id: 'discount_offer', label: '25% offer after decline', count: 391, rate: 51, source_of_truth: 'Synthflow', trust_label: 'medium' },
      { id: 'retained', label: 'Retained state confirmed', count: 228, rate: 30, source_of_truth: 'Stay.ai', trust_label: 'medium' },
    ],
    journey: [
      { id: 'reason', label: 'Cost reason detected', description: 'Cost Too High path selected only after cancellation reason capture.', status: 'neutral', source: 'Synthflow' },
      { id: 'frequency', label: 'Frequency change offer', description: 'Required first offer for Cost Too High.', status: 'warning', source: 'Synthflow', lockedRule: 'Frequency change must precede 25% discount.' },
      { id: 'discount', label: '25% offer', description: 'Second offer appears only after frequency change decline.', status: 'warning', source: 'Synthflow' },
      { id: 'stayai', label: 'Retained/cancelled confirmed', description: 'Stay.ai outcome determines save or confirmed cancellation.', status: 'success', source: 'Stay.ai' },
    ],
  },
  order_status: {
    module: 'order_status',
    title: 'Order Status Analytics',
    eyebrow: 'shopify order context',
    description: 'Tracks order-status journeys, ETA resolution, tracking availability, fulfillment context, and source match quality.',
    sourcePriority: ['Shopify order/customer/fulfillment data', 'Synthflow order-status journey', 'EasyPost/tracking if integrated'],
    lockedRules: ['Shopify remains the source of truth for order, product, customer, fulfillment, and order-status context.'],
    summary: {
      module: 'order_status',
      cards: cards('order_status', 'Shopify', [
        ['order_status_resolution_rate', 'Order Status Resolution', 'starter', 'Resolved with confirmed Shopify context.', 'medium'],
        ['shopify_match_rate', 'Shopify Match Rate', 'starter', 'Calls matched to official Shopify order context.', 'medium'],
        ['eta_confidence_rate', 'ETA Confidence', 'starter', 'ETA answer backed by order date, tags, shipping method, and fulfillment context.', 'medium'],
      ]),
      definitions: definitions('order_status', 'Shopify', [
        ['order_status_resolution_rate', 'Order Status Resolution Rate', 'resolved_order_status_calls / eligible_order_status_calls', 'Shopify provides official order context.'],
        ['eta_confidence_rate', 'ETA Confidence Rate', 'eta_high_confidence_answers / eta_answers', 'ETA must be backed by required Shopify fields.'],
      ]),
      recent_events: [],
    },
    trend: trend([57, 59, 60, 63, 66, 68, 70]),
    funnel: [
      { id: 'calls', label: 'Order-status calls', count: 1800, rate: 100, source_of_truth: 'Synthflow', trust_label: 'medium' },
      { id: 'matched', label: 'Shopify order matched', count: 1512, rate: 84, source_of_truth: 'Shopify', trust_label: 'medium' },
      { id: 'eta', label: 'ETA logic eligible', count: 1288, rate: 72, source_of_truth: 'Shopify', trust_label: 'medium' },
      { id: 'resolved', label: 'Resolved without escalation', count: 1106, rate: 61, source_of_truth: 'Warehouse', trust_label: 'medium' },
    ],
    journey: [
      { id: 'caller', label: 'Caller order inquiry', description: 'Synthflow captures order-status intent.', status: 'neutral', source: 'Synthflow' },
      { id: 'shopify', label: 'Shopify context', description: 'Order/customer/fulfillment context retrieved from Shopify.', status: 'success', source: 'Shopify' },
      { id: 'eta', label: 'ETA evaluation', description: 'ETA confidence and reason are generated from normalized fields.', status: 'success', source: 'Analytics API' },
      { id: 'answer', label: 'Answer or escalation', description: 'Resolved if answer delivered; escalated paths are not containment success.', status: 'warning', source: 'Synthflow' },
    ],
  },
  escalations: {
    module: 'escalations',
    title: 'Escalations Analytics',
    eyebrow: 'live-agent handoff quality',
    description: 'Tracks live transfers, unresolved journeys, queue abandonment, escalation reasons, and downstream support outcomes.',
    sourcePriority: ['Synthflow escalation event', 'RingCX/live-agent call transfer', 'Support case outcome'],
    lockedRules: ['Transferred calls are not counted as successful automation containment.'],
    summary: {
      module: 'escalations',
      cards: cards('escalations', 'Synthflow + RingCX', [
        ['escalation_rate', 'Escalation Rate', 'starter', 'Live-agent handoffs over eligible calls.', 'medium'],
        ['unresolved_rate', 'Unresolved Rate', 'starter', 'Journeys ending without customer resolution.', 'medium'],
        ['queue_abandonment_rate', 'Queue Abandonment', 'starter', 'Transfers abandoned after handoff attempt.', 'medium'],
      ]),
      definitions: definitions('escalations', 'Synthflow + RingCX', [
        ['escalation_rate', 'Escalation Rate', 'human_escalations / eligible_calls', 'Transfers are not containment success.'],
        ['queue_abandonment_rate', 'Queue Abandonment Rate', 'queue_abandoned / human_escalation_attempts', 'Abandoned transfer attempts must remain unresolved unless later case outcome confirms resolution.'],
      ]),
      recent_events: [],
    },
    trend: trend([17, 16, 15, 14, 14, 13, 12]),
    funnel: [
      { id: 'attempts', label: 'Escalation attempts', count: 640, rate: 100, source_of_truth: 'Synthflow', trust_label: 'medium' },
      { id: 'transfer', label: 'Live transfer initiated', count: 512, rate: 80, source_of_truth: 'RingCX', trust_label: 'medium' },
      { id: 'answered', label: 'Agent connected', count: 381, rate: 60, source_of_truth: 'RingCX', trust_label: 'medium' },
      { id: 'case', label: 'Downstream outcome captured', count: 244, rate: 38, source_of_truth: 'Support case system', trust_label: 'medium' },
    ],
    journey: [
      { id: 'trigger', label: 'Escalation trigger', description: 'Policy, confidence, or customer request requires handoff.', status: 'warning', source: 'Synthflow' },
      { id: 'transfer', label: 'Transfer attempted', description: 'RingCX/live-agent transfer event is captured.', status: 'neutral', source: 'RingCX' },
      { id: 'outcome', label: 'Outcome required', description: 'Downstream support outcome determines final journey label.', status: 'warning', source: 'Support cases' },
      { id: 'exclude', label: 'Excluded from containment success', description: 'Escalated path cannot be counted as automation-contained.', status: 'failure', source: 'Analytics API' },
    ],
  },
  data_quality: {
    module: 'data_quality',
    title: 'Data Quality / Trust Analytics',
    eyebrow: 'freshness, schema, confirmation',
    description: 'Tracks freshness, schema validity, official source confirmation, duplicate risk, formula versions, and calculated trust labels.',
    sourcePriority: ['Warehouse normalized tables', 'Source sync logs', 'Contract validation results', 'Metric registry'],
    lockedRules: ['Trust labels are system-calculated and cannot be manually elevated.'],
    summary: {
      module: 'data_quality',
      cards: cards('data_quality', 'Warehouse', [
        ['high_trust_metric_rate', 'High Trust Metric Rate', 'starter', 'Major metrics with high trust labels.', 'medium'],
        ['source_freshness_sla', 'Freshness SLA', 'starter', 'Source syncs inside freshness thresholds.', 'medium'],
        ['contract_validity_rate', 'Contract Validity', 'starter', 'Events matching JSON/dbt contracts.', 'medium'],
      ]),
      definitions: definitions('data_quality', 'Warehouse', [
        ['high_trust_metric_rate', 'High Trust Metric Rate', 'high_trust_metrics / major_metrics', 'Trust labels are calculated only.'],
        ['contract_validity_rate', 'Contract Validity Rate', 'valid_contract_events / all_contract_events', 'Schema validation must pass before high trust.'],
      ]),
      recent_events: [],
    },
    trend: trend([72, 74, 76, 77, 79, 81, 82]),
    funnel: [
      { id: 'events', label: 'Raw events', count: 9200, rate: 100, source_of_truth: 'Source systems', trust_label: 'medium' },
      { id: 'valid', label: 'Contract-valid events', count: 8500, rate: 92, source_of_truth: 'Contracts', trust_label: 'medium' },
      { id: 'fresh', label: 'Fresh events', count: 7710, rate: 84, source_of_truth: 'Source sync logs', trust_label: 'medium' },
      { id: 'trusted', label: 'High/medium trust', count: 7064, rate: 77, source_of_truth: 'Warehouse', trust_label: 'medium' },
    ],
    journey: [
      { id: 'raw', label: 'Raw source event', description: 'Source event lands with original payload.', status: 'neutral', source: 'Source systems' },
      { id: 'contract', label: 'Contract validation', description: 'JSON/schema and required field checks pass.', status: 'success', source: 'Shared contracts' },
      { id: 'source', label: 'Source truth validation', description: 'Official evidence rules are applied.', status: 'warning', source: 'Analytics API' },
      { id: 'trust', label: 'Trust label calculated', description: 'Trust label is assigned by system logic only.', status: 'success', source: 'Warehouse' },
    ],
  },
  governance: {
    module: 'governance',
    title: 'Governance / RBAC / Exports',
    eyebrow: 'explicit deny and auditability',
    description: 'Tracks server-side permissions, export metadata completeness, audit fingerprints, trust-label controls, and no-drift compliance.',
    sourcePriority: ['Analytics API permission checks', 'Export audit records', 'Metric registry', 'Warehouse audit tables'],
    lockedRules: ['Permissions are enforced server-side using explicit deny.', 'Exports must include required metadata and audit reference.'],
    summary: {
      module: 'governance',
      cards: cards('governance', 'Analytics API', [
        ['export_audit_compliance_rate', 'Export Audit Compliance', 'starter', 'Exports with required metadata fields.', 'medium'],
        ['permission_denial_rate', 'Explicit Deny Events', 'starter', 'Denied requests when permission is absent.', 'medium'],
        ['manual_trust_elevation_blocks', 'Trust Elevation Blocks', 'starter', 'Manual trust label changes rejected.', 'medium'],
      ]),
      definitions: definitions('governance', 'Analytics API', [
        ['export_audit_compliance_rate', 'Export Audit Compliance Rate', 'compliant_exports / all_exports', 'Fingerprint and audit reference required.'],
        ['permission_denial_rate', 'Permission Denial Rate', 'explicit_denials / authorization_checks', 'Permissions default to explicit deny.'],
      ]),
      recent_events: [],
    },
    trend: trend([88, 89, 90, 92, 93, 94, 95]),
    funnel: [
      { id: 'exports', label: 'Export requests', count: 210, rate: 100, source_of_truth: 'Analytics API', trust_label: 'medium' },
      { id: 'permitted', label: 'Permission granted', count: 176, rate: 84, source_of_truth: 'Analytics API', trust_label: 'medium' },
      { id: 'metadata', label: 'Required metadata present', count: 171, rate: 81, source_of_truth: 'Export audit', trust_label: 'medium' },
      { id: 'fingerprint', label: 'Fingerprint + audit ref', count: 169, rate: 80, source_of_truth: 'Export audit', trust_label: 'medium' },
    ],
    journey: [
      { id: 'request', label: 'Export or admin request', description: 'User attempts export or governance operation.', status: 'neutral', source: 'Dashboard Web' },
      { id: 'permission', label: 'Server permission check', description: 'Backend applies explicit-deny policy.', status: 'warning', source: 'Analytics API', lockedRule: 'Permissions are server-side explicit deny.' },
      { id: 'metadata', label: 'Audit metadata', description: 'Filters, formulas, trust labels, freshness, owner, timestamp, fingerprint are attached.', status: 'success', source: 'Export API' },
      { id: 'archive', label: 'Audit record stored', description: 'Audit reference is ready for review and compliance.', status: 'success', source: 'Warehouse' },
    ],
  },
};
