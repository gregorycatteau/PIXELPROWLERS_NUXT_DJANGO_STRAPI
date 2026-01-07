---
id: PX_V1_3_PARCOURS_CATALOG_R1
version: 1.0.0
status: active
date: 2026-01-10
owners: ["Dan"]
scope: ["docs/30-tech_specs/**"]
tags: ["tech_specs", "frontend", "journeys", "catalog"]
---

# Parcours Catalog (R1)

## But
Rendre visibles les parcours accessibles en production via `/parcours`.

## Regle
- Le catalog affiche uniquement les journeys `visibility: "prod"`.
- Aucun rendu HTML dynamique, aucune ressource distante.

## Preuves
- `bash frontend_nuxt/scripts/smoke/smoke-parcours-catalog.sh`
  - `/parcours` -> 200
  - slugs prod presents dans le HTML (P1, P2, P3, P4, P5)
