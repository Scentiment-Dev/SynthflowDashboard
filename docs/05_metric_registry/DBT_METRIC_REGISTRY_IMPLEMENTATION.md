# dbt Metric Registry Implementation

Wave 5 converts the blueprint metric registry into seed-backed dbt models.

## Primary seed

`data/warehouse/seeds/metric_registry_seed.csv`

## Primary mart

`data/dbt/models/marts/mart_dashboard_metrics.sql`

## Required behavior

- Metrics remain visible even before all numerators/denominators are available.
- Missing metric inputs must not fabricate success.
- Formula versions are visible to the frontend and export layer.
- Trust labels and freshness labels are calculated in dbt/API systems only.
- Export-ready fields are included so the export API can attach filters, definitions, trust labels, freshness, formula versions, owner, timestamp, fingerprint, and audit reference.
