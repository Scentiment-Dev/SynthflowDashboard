# Local QA Runbook — Wave 9

## First commands after unpacking

```bash
make validate-structure
make validate-no-drift
make validate-wave8
make validate-wave9
make qa-evidence
```

## Full local quality gate

```bash
make quality-gates
```

## Dependency-based test gates

After installing dependencies:

```bash
make install
make lint
make typecheck
make test
make dbt-test
make smoke
```

## Notes

Do not use missing vendor credentials as a reason to loosen tests. Vendor-dependent tests must use local fixtures until live credentials are explicitly approved.
