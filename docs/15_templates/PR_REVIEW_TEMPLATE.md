# PR Review Checklist

## Required before review

- [ ] PR maps to one active wave/task.
- [ ] Agent run report is attached.
- [ ] Files changed match agent ownership or include a reason.
- [ ] `make validate-structure` passed or was honestly marked not run.
- [ ] `make validate-no-drift` passed or was honestly marked not run.
- [ ] Wave-specific validation passed or was honestly marked not run.
- [ ] Tests were added/updated when behavior changed.

## No-drift gate

- [ ] Stay.ai subscription outcome source-of-truth preserved.
- [ ] Shopify order-context source-of-truth preserved.
- [ ] Portal completion requires confirmed completion.
- [ ] Containment excludes abandoned/unresolved/transferred.
- [ ] Trust labels cannot be manually elevated.
- [ ] Export audit metadata preserved.
- [ ] Explicit-deny permissions preserved.
