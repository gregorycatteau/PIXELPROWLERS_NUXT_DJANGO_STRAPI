---
id: PX_V1_3_P4_PROMOTION_PROD_R1
version: 1.0.0
status: active
date: 2026-01-09
owners: ["Dan"]
scope: ["docs/30-tech_specs/**"]
tags: ["tech_specs", "frontend", "journeys", "p4", "release"]
---

# P4 — Promotion Prod (R1)

## Changement requis
- Mettre `visibility: "prod"` dans `p4.manifest.ts`.
- Ajouter `p4` dans `relatedJourneys` pour un micro-pack de ressources publiees (minimum 2).

## Ressources taggees p4 (published)
- inventaire-acces-30min
- compte-rendu-utile-1page

## Verification
- `npm run guards:ci`
- `bash frontend_nuxt/scripts/smoke/smoke-journey-prod-p1-only.sh`
  - P1 + P2 + P3 + P4 -> 200
  - P5 -> 404
