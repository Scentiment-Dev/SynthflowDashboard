# Dashboard No-Drift E2E Spec — Wave 9

## Goal

Verify that the dashboard never presents unconfirmed outcomes as successful business outcomes.

## Scenarios

### Portal handoff

Given a customer was sent a portal link  
And no portal completion event exists  
Then the dashboard must not count the journey as portal success.

### Subscription save

Given Synthflow or Shopify reports an apparent save  
And Stay.ai has not confirmed a retained subscription outcome  
Then the dashboard must not count the save.

### Cancellation

Given a customer requested cancellation  
And Stay.ai has not confirmed cancelled status or an approved official path  
Then the dashboard must not count the cancellation as confirmed.

### Containment

Given the call abandoned, transferred, or remained unresolved  
Then the dashboard must not count the call as contained.

### Export

Given a user exports dashboard metrics  
Then the export must include filters, definitions, trust labels, freshness, formula version, owner, timestamp, fingerprint, and audit reference.
