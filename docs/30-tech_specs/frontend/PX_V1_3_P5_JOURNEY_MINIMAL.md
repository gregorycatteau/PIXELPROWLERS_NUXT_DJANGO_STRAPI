---
id: PX_V1_3_P5_JOURNEY_MINIMAL
version: 1.0.0
status: active
date: 2026-01-08
owners: ["Dan"]
scope: ["frontend_nuxt/app/**", "frontend_nuxt/scripts/smoke/**", "docs/30-tech_specs/frontend/**"]
tags: ["tech_specs", "frontend", "journey", "p5", "v1.3", "useful-slice"]
---

# P5 — Useful Slice V0 (Minimal)

## Objectif
- Panorama 3 axes / 6 questions, data-only.
- Bilan VM deterministe avec scores 0-100, priorites, actions.
- Recos P5-only (relatedJourneys contient p5).
- Smoke valeur: `frontend_nuxt/scripts/smoke/smoke-p5-value.sh`.

## Axes
- Symptomes
- Rythmes
- Alignement

## Invariants
- No tech reveal, no v-html, no remote assets.
- Isolation stricte: ressources uniquement taggees p5.
- Pas de nouvelles ressources published.

## Smoke
- `bash frontend_nuxt/scripts/smoke/smoke-p5-value.sh`
