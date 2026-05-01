# Project Overview

The dashboard measures Scentiment's automated phone support system across subscription handling, cancellation/retention, order status, escalations, containment, abandonment, revenue/churn impact, and data-governance quality.

The first implementation priority is **subscription handling analytics**. Cancellation/retention, order-status, escalation, trust, RBAC, exports, and audit follow the same source-of-truth rules.

The frontend must never call source platforms directly or invent official outcomes. Data should be ingested, normalized, transformed by dbt, served by the analytics API, and displayed with trust labels and definitions.


## Wave 7 Governance Lock
Wave 7 adds explicit-deny RBAC, export audit metadata, trust-label enforcement, audit logs, and governed backfill skeletons.
