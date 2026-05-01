# QA Evidence Register — Wave 9

## Current evidence process

Run:

```bash
make qa-evidence
```

This generates:

```text
.qa-evidence/qa_evidence.json
.qa-evidence/qa_evidence.md
```

## Evidence contents

- Generated timestamp.
- Wave number.
- Workflow list and checksums.
- Test file list and checksums.
- QA docs and checksums.
- No-drift summary.

## PR expectation

Agent C must attach or summarize the QA evidence packet in every implementation PR that changes:

- source-of-truth logic,
- metrics,
- dbt models,
- ingestion normalization,
- export metadata,
- RBAC,
- trust labels,
- frontend dashboard outcome displays.
