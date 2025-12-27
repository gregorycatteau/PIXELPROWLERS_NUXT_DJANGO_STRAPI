---
id: PX_V1_3_JOURNEY_ENTRYPOINT_REGRESSION_R1
version: 1.0.0
status: active
date: 2025-12-27
owners: ["Dan", "Marty"]
scope: ["docs/30-tech_specs/**"]
tags: ["tech_specs", "frontend", "journey", "regression"]
---

# PX V1.3 — Regression entree parcours (R1)

## Symptome
Demarrer un parcours (P1) sans `step` affiche une landing avec ressources, sans panorama, sans bilan panorama, sans recos et sans questionnaires.

## Root cause
`/parcours/[journeySlug]` rendait une landing P1 par defaut quand `step` est absent, ce qui court-circuite le flux E0 -> E1 -> E2.

## Fix
- Par defaut, l entree d un parcours resolve le premier step du schema (E0_intro).
- La landing P1 devient opt-in via `?landing=1`.

## DoD
- Entrer sur `/parcours/:slug` ouvre E0_intro (ou premier step defini).
- `step` invalide retombe sur E0_intro, jamais sur ressources.
- `journey-entrypoint:guard` passe en CI.

## Prevention
- Guard `journey-entrypoint-e0` verifie que chaque schema commence par E0_intro et que la page d entree a un fallback vers le premier step.
