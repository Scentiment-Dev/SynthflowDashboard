# Cycle 008 — Support-user comprehension matrix (C5)

Support-facing questions from the Cycle 008 prompt, mapped to **where** the dashboard answers them and **example copy / behavior**.

| Question | Where it is answered | Example |
| --- | --- | --- |
| **1. What happened?** | Status banners, KPI cards, `ActionableEmptyState`, filter/export blocked callouts | Empty states describe “no calls in this view”; export blocked explains missing rows or metadata |
| **2. Why does it matter?** | `MetricHelpDrawer`, `MetricDisclosure`, filter `plain_language_help`, trust/source summaries | Trust labels tie to revenue / quoting risk; filters explain denominator impact |
| **3. Can I trust it?** | `TrustExplanationPopover`, trust chips, `TRUST_LEVEL_DETAIL`, Business Value scenario messaging | “How reliable this metric is right now” anchor + band-specific detail |
| **4. What should I do next?** | `WHAT_TO_DO_NEXT`, blocked/export CTAs, `BlockedStateCallout` | e.g. widen date range, open data quality, tick table rows before export |
| **5. Can I export it?** | `SubscriptionExportDrawer`, `SubscriptionPageToolbar`, per-scope blocked reasons | Each scope shows allowed vs blocked with plain-language reason |
| **6. Why is this blocked?** | `EXPORT_BLOCKED_REASON`, disabled filter reasons, manifest missing-metadata path | Permission vs trust vs backend-not-connected vs no-rows-selected explicitly differentiated |

This matrix satisfies prompt **C5** as a documented comprehension pass over shipped components and copy; Agent B should reuse the same six questions when reviewing any new subscription surface.
