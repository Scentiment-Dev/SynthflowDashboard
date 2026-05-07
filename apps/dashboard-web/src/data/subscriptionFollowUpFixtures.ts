import type {
  SubscriptionFollowUpRecord,
  SubscriptionFollowUpResponse,
  SubscriptionFollowUpScenario,
} from '../types/subscriptionFollowUp';

const TIMESTAMP = '2026-05-06T12:00:00Z';

const PRESENTATION = {
  display_label: 'Subscription Follow-up Queue',
  short_label: 'Follow-up',
  executive_summary:
    'Follow-up queue prioritizes cases needing human action with source-truth-safe status fields.',
  format_type: 'action_queue',
  unit: 'count',
  trend_direction: 'unknown',
  comparison_label: 'Comparison baseline unavailable in fixture preview',
  comparison_value: null,
  severity: 'warning',
  visual_tone: 'caution',
  source_authority_explanation:
    'Stay.ai is the authoritative source for final subscription outcomes.',
  trust_explanation:
    'Trust is medium because confirmations are still pending for part of the queue.',
  freshness_explanation: 'Data is fresh and within expected recency.',
  drilldown_hint: 'Use owner_queue and sla_status to triage support workloads.',
  empty_state_copy: 'No subscription calls in this view yet.',
  blocked_state_copy:
    'This metric is blocked until Stay.ai confirmation records are available.',
};

const BASELINE_RECORDS: SubscriptionFollowUpRecord[] = [
  {
    customer_or_case_id: 'case-1001',
    recommended_action: 'Confirm in Stay.ai',
    reason: 'Missing Stay.ai final state for cancel request',
    priority: 'high',
    status: 'open',
    source_system: 'stayai',
    blocking_data_gap: 'stayai_final_state',
    stayai_confirmation_status: 'pending',
    portal_completion_status: 'completion_unknown',
    estimated_value_at_risk: 540,
    last_event_at: '2026-05-05T20:30:00Z',
    owner_queue: 'support_lead',
    sla_status: 'due_soon',
    audit_reference: 'audit-follow-up-case-1001',
    support_label: 'Awaiting official confirmation',
    support_summary: 'This case still needs Stay.ai final state confirmation.',
    why_it_matters:
      'Final save/cancel reporting is blocked until official confirmation arrives.',
    what_to_do_next: 'Open Stay.ai and verify the final subscription outcome.',
    blocked_reason_plain_language:
      'We do not yet have official subscription confirmation.',
  },
  {
    customer_or_case_id: 'case-1002',
    recommended_action: 'Resend portal link',
    reason: 'Portal completion unknown after 4 hours',
    priority: 'high',
    status: 'open',
    source_system: 'portal',
    blocking_data_gap: null,
    stayai_confirmation_status: 'confirmed',
    portal_completion_status: 'link_sent',
    estimated_value_at_risk: 320,
    last_event_at: '2026-05-06T09:15:00Z',
    owner_queue: 'support_agent',
    sla_status: 'due_soon',
    audit_reference: 'audit-follow-up-case-1002',
    support_label: 'Portal completion unconfirmed',
    support_summary:
      'The customer received the link, but we have not confirmed they finished the action.',
    why_it_matters: 'Customer may not actually have completed the change.',
    what_to_do_next: 'Resend portal link and check completion.',
    blocked_reason_plain_language: null,
  },
  {
    customer_or_case_id: 'case-1003',
    recommended_action: 'Review',
    reason: 'Low trust on outcome match',
    priority: 'medium',
    status: 'open',
    source_system: 'analytics',
    blocking_data_gap: null,
    stayai_confirmation_status: 'pending',
    portal_completion_status: 'portal_started',
    estimated_value_at_risk: 180,
    last_event_at: '2026-05-06T07:42:00Z',
    owner_queue: 'support_lead',
    sla_status: 'on_track',
    audit_reference: 'audit-follow-up-case-1003',
    support_label: 'Low trust on this outcome',
    support_summary: 'Some signals do not agree on the final outcome.',
    why_it_matters: 'Reporting could overstate save rate if not reviewed.',
    what_to_do_next: 'Open the call and confirm the customer intent.',
    blocked_reason_plain_language: null,
  },
];

const PENDING_RECORDS = BASELINE_RECORDS.map((record) => ({
  ...record,
  stayai_confirmation_status: 'pending' as const,
  reason: 'Awaiting Stay.ai final state',
  recommended_action: 'Confirm in Stay.ai',
  what_to_do_next: 'Open Stay.ai and verify the final subscription outcome.',
  blocked_reason_plain_language: 'We do not yet have official subscription confirmation.',
}));

const MISSING_RECORDS: SubscriptionFollowUpRecord[] = Array.from({ length: 5 }).map(
  (_, index) => ({
    customer_or_case_id: `case-missing-${index + 1}`,
    recommended_action: 'Open data quality',
    reason: 'No Stay.ai final state available for this period',
    priority: 'high',
    status: 'open',
    source_system: 'stayai',
    blocking_data_gap: 'stayai_final_state',
    stayai_confirmation_status: 'missing',
    portal_completion_status: 'completion_unknown',
    estimated_value_at_risk: 0,
    last_event_at: TIMESTAMP,
    owner_queue: 'support_lead',
    sla_status: 'breached',
    audit_reference: `audit-missing-${index + 1}`,
    support_label: 'Stay.ai data missing',
    support_summary:
      "We're not getting Stay.ai final results right now. This case cannot be confirmed.",
    why_it_matters:
      'Numbers cannot be trusted until Stay.ai delivery is restored.',
    what_to_do_next: 'Open the data quality page to track the data outage.',
    blocked_reason_plain_language:
      'Stay.ai has not sent any final outcomes for this period yet.',
  }),
);

function buildResponse(
  scenario: SubscriptionFollowUpScenario,
  records: SubscriptionFollowUpRecord[],
  trustLabel: 'high' | 'medium' | 'low' | 'untrusted',
  status: 'confirmed' | 'pending' | 'missing',
): SubscriptionFollowUpResponse {
  return {
    module: 'subscriptions',
    generated_from_fixture: true,
    scenario,
    records,
    metadata: {
      metric_id: 'subscription_follow_up_queue',
      filters: { queue: 'open', priority: 'high_or_medium' },
      metric_definitions: [
        'Follow-up queue includes records with pending confirmation, portal completion unknown, or low trust.',
        'Stay.ai confirmation is required for final save/cancel truth.',
        'Portal link sent does not imply portal completion.',
      ],
      trust_label: trustLabel,
      freshness_status: 'fresh',
      formula_version: 'v1.0.0',
      owner: 'support_ops',
      timestamp: TIMESTAMP,
      fingerprint: `fixture-follow-up-${scenario}`,
      audit_reference: `audit-follow-up-${scenario}`,
      source_confirmation_status: status,
      presentation: PRESENTATION,
    },
  };
}

export const SUBSCRIPTION_FOLLOW_UP_FIXTURES: Record<
  SubscriptionFollowUpScenario,
  SubscriptionFollowUpResponse
> = {
  baseline: buildResponse('baseline', BASELINE_RECORDS, 'medium', 'pending'),
  pending_stayai_confirmation: buildResponse(
    'pending_stayai_confirmation',
    PENDING_RECORDS,
    'low',
    'pending',
  ),
  missing_stayai_final_state: buildResponse(
    'missing_stayai_final_state',
    MISSING_RECORDS,
    'untrusted',
    'missing',
  ),
  empty: buildResponse('empty', [], 'high', 'confirmed'),
};
