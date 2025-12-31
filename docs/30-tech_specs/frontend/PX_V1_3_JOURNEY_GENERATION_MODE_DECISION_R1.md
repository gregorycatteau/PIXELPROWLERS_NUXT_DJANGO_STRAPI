---
id: PX_V1_3_JOURNEY_GENERATION_MODE_DECISION_R1
version: 1.0.0
status: active
date: 2025-12-27
owners: ["Dan", "Marty"]
scope: ["docs/30-tech_specs/**"]
tags: ["tech_specs", "frontend", "journey", "adr", "decision", "governance"]
---

# PX V1.3 — Journey Generation Mode (Decision R1)

## Decision
Generation des parcours via **CLI repo-first** (Mode A) maintenant.

Mode B (UI Django) est reporte a plus tard.

## Motivation
- Audit et review faciles (diffs Git).
- Compatibilite SSOT (docs, registry, index).
- Guards CI executables localement.
- Evite les parcours "hors contrat".

## Impacts
- Tous les parcours generes passent par une PR.
- Versioning explicite (schema/copy/questions/adapters).
- Documentation SSOT mise a jour (index + registry).

## Politique anti-derive
- Aucun parcours ne doit etre ajoute sans:
  - manifest + schema + adapter bilan
  - guards CI verts
  - docs SSOT de base si besoin

## References
- `docs/30-tech_specs/frontend/PX_V1_3_JOURNEY_SCHEMA_RFC_V1.md`
- `docs/30-tech_specs/frontend/PX_V1_3_JOURNEY_SCAFFOLDER_CLI_SPEC_V1.md`
