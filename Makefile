SHELL := /bin/bash
.PHONY: install dev stop test test-backend test-ingestion test-frontend test-contract smoke lint typecheck dbt-test dbt-build data-validate validate-structure validate-no-drift validate-wave8 validate-wave9 qa-evidence quality-gates manifest clean

install:
	cd apps/dashboard-web && npm install
	cd services/analytics-api && python -m pip install -e .[dev]
	cd services/ingestion-worker && python -m pip install -e .[dev]

dev:
	docker compose up --build

stop:
	docker compose down

test: test-backend test-ingestion test-contract test-frontend

test-backend:
	cd services/analytics-api && pytest

test-ingestion:
	cd services/ingestion-worker && pytest

test-frontend:
	cd apps/dashboard-web && npm test -- --run

test-contract:
	pytest tests/contracts

lint:
	cd services/analytics-api && ruff check app tests
	cd services/ingestion-worker && ruff check app tests
	cd apps/dashboard-web && npm run lint

typecheck:
	cd services/analytics-api && mypy app
	cd services/ingestion-worker && mypy app
	cd apps/dashboard-web && npm run typecheck

dbt-test:
	cd data/dbt && dbt parse && dbt test

dbt-build:
	cd data/dbt && dbt build

data-validate: validate-structure validate-no-drift
	python -S scripts/validate_wave5_data_files.py

smoke:
	pytest tests/smoke

validate-structure:
	python -S scripts/validate_repo_structure.py

validate-no-drift:
	python -S scripts/validate_no_drift_rules.py

validate-wave8:
	python -S scripts/validate_wave8_agent_system.py

validate-wave9:
	python -S scripts/validate_wave9_qa_ci.py

qa-evidence:
	python -S scripts/qa_collect_evidence.py

quality-gates:
	python -S scripts/run_local_quality_gates.py

manifest:
	python -S scripts/generate_repo_manifest.py

clean:
	find . -type d -name __pycache__ -prune -exec rm -rf {} +
	rm -rf apps/dashboard-web/dist apps/dashboard-web/coverage data/dbt/target .qa-evidence


validate-wave10:
	python -S scripts/validate_wave10_final_pack.py
