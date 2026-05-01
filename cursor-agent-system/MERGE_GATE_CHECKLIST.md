# Merge Gate Checklist

No PR should merge unless all required gates are satisfied.

## Gates

1. Active wave alignment confirmed.
2. Agent ownership alignment confirmed.
3. No-drift review complete.
4. Required local checks run or explicitly marked not run with reason.
5. Tests added/updated or non-test rationale documented.
6. Export/RBAC/trust-label impacts reviewed.
7. Handoff packet attached.
8. AI PM acceptance recorded.
9. Agent C review complete for functional changes.
10. Kevin approval linked for any locked-scope change.

## Automatic blockers

- Direct-to-main changes.
- Missing no-drift review.
- Manual trust-label elevation.
- Treating Stay.ai non-authoritative data as official subscription outcome.
- Treating portal link sent as portal completion.
- Exporting metrics without audit metadata.
- Weakening explicit deny permissions.
