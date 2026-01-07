---
id: PX_V1_3_P5_PROMOTION_PROD_R1
version: 1.0.0
status: active
date: 2026-01-10
owners: ["Dan"]
scope: ["docs/30-tech_specs/**"]
tags: ["tech_specs", "frontend", "journeys", "p5", "release"]
---

# P5 — Promotion Prod (R1)

## Changement requis
- Mettre `visibility: "prod"` dans `p5.manifest.ts`.
- Ajouter `p5` dans `relatedJourneys` pour un micro-pack de ressources publiees (minimum 2).

## Ressources taggees p5 (published)
- decision-log-minimal
- mfa-partout-en-20min

## Verification
- `npm run guards:ci`
- `bash frontend_nuxt/scripts/smoke/smoke-journey-prod-p1-only.sh`
  - P1 + P2 + P3 + P4 + P5 -> 200
