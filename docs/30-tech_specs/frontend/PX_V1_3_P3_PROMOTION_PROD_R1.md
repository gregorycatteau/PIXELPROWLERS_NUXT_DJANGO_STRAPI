---
id: PX_V1_3_P3_PROMOTION_PROD_R1
version: 1.0.0
status: active
date: 2026-01-08
owners: ["Dan"]
scope: ["docs/30-tech_specs/**"]
tags: ["tech_specs", "frontend", "journeys", "p3", "release"]
---

# P3 — Promotion Prod (R1)

## Changement requis
- Mettre `visibility: "prod"` dans `p3.manifest.ts`.
- Ajouter `p3` dans `relatedJourneys` pour un micro-pack de ressources publiees (minimum 2).

## Ressources taggees p3 (published)
- inventaire-acces-30min
- decision-log-minimal

## Verification
- `npm run guards:ci`
- `bash frontend_nuxt/scripts/smoke/smoke-journey-prod-p1-only.sh`
  - P1 + P2 + P3 -> 200
  - P4 + P5 -> 404
