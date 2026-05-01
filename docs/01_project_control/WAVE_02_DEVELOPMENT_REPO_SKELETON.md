# Wave 2 — Development Repo Skeleton

Wave 2 converts the locked blueprint into an actual development root folder.

## What changed

The repository now includes root-level development configuration, ownership maps, devcontainer/VS Code setup, local non-secret config, validation scripts, and a machine-readable repo manifest generator.

## Required validation commands

```bash
make validate-structure
make validate-no-drift
make manifest
```

## Locked rule

Do not replace this with a documentation-only pack. All future waves must continue updating actual development files plus supporting docs.
