# Ingestion Source Contracts

## Synthflow

Synthflow events describe voice automation journey behavior: call start,
captured intent, node reached, abandonment, completion, and transfer. Synthflow
must not confirm subscription save or cancellation outcomes.

## Stay.ai

Stay.ai is the official source of truth for subscription state, save,
cancellation, retention, pause, skip, and frequency-change outcomes.

## Shopify

Shopify is official for order, product, customer, fulfillment, and tracking
context. Shopify does not override Stay.ai subscription outcomes.

## Portal

Portal events distinguish handoff from completion. Link sent is not success.
Confirmed portal completion is required before portal success metrics can count.

## Live-agent / RingCX

Live-agent/RingCX events track transfers, escalations, cases, and downstream
resolution. Transfers, unresolved calls, and abandoned calls are excluded from
successful containment.
