---
id: PX_V1_3_P2_PROMOTION_PROD_R1
version: 1.0.0
status: active
date: 2026-01-08
owners: ["Dan"]
scope: ["docs/30-tech_specs/**"]
tags: ["tech_specs", "frontend", "journeys", "p2", "release"]
---

# P2 — Promotion Prod (R1)

## Changement requis
- Mettre `visibility: "prod"` dans `p2.manifest.ts`.
- Ajouter `p2` dans `relatedJourneys` pour un micro-pack de ressources publiees (minimum 2).

## Verification
- `npm run guards:ci`
- `bash frontend_nuxt/scripts/smoke/smoke-journey-prod-p1-only.sh`
  - P1 + P2 -> 200
  - P3-P5 -> 404
