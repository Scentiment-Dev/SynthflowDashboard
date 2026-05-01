# Local Validation Commands

Run these from the repository root.

## Required every work block

```bash
make validate-structure
make validate-no-drift
python -S scripts/validate_wave8_agent_system.py
make manifest
```

## Backend/API work

```bash
cd services/analytics-api
pytest
ruff check app tests
mypy app
```

## Ingestion work

```bash
cd services/ingestion-worker
pytest
ruff check app tests
mypy app
```

## Frontend work

```bash
cd apps/dashboard-web
npm install
npm run typecheck
npm run test -- --run
npm run lint
```

## dbt/data work

```bash
cd data/dbt
dbt parse
dbt test
dbt build
```

If a dependency is not installed, document that in the agent run report. Do not claim a check passed unless it actually ran.
