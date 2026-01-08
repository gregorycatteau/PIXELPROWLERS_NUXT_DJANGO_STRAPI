---
id: P5_GLOBAL_BILAN_SMOKE_TESTS
version: 1.0.0
status: active
date: 2026-01-08
owners: ["Dan"]
scope: ["frontend_nuxt/scripts/smoke/smoke-p5-value.sh", "frontend_nuxt/app/adapters/bilan/p5.ts"]
tags: ["qa", "smoke", "p5", "bilan"]
---

# P5 Global Bilan Smoke Tests

## Ce que le smoke valide
- /parcours/parcours-p5 repond 200 en prod build.
- Bilan VM: score global 0-100 + au moins 2 priorites.
- Au moins 1 ressource recommandee taggee p5 et publiee.

## Commande
- `bash frontend_nuxt/scripts/smoke/smoke-p5-value.sh`
