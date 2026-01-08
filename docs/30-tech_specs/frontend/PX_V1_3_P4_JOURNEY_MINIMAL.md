---
id: PX_V1_3_P4_JOURNEY_MINIMAL
version: "1.3"
status: active
date: 2026-01-08
owners: ["Marty"]
scope: tech_specs
tags:
  - tech_specs
  - frontend
  - journey
  - p4
  - v1.3
---

# P4 — Parcours minimal (dev)

## But du parcours
Le parcours P4 propose un panorama court pour clarifier le rythme et la coordination, sans promesse avancee. Il sert de base jouable en dev et reste volontairement sobre.

## Etapes
- E0_intro
- E1_panorama
- E2_bilan
- E3_resources
- E4_exit

## Useful slice v0
- Panorama: 3 axes, 6 questions max (signaux, rythmes, coordination).
- Bilan: scores 0-100 + score global + 2 priorites.
- Actions: 3 a 5 cartes action avec outcome + effort.
- Ressources: uniquement celles taggees `p4` (relatedJourneys).
- Smoke: `frontend_nuxt/scripts/smoke/smoke-p4-value.sh`.

## Regles d'acces
- Dev: visible uniquement via allowlist `NUXT_PUBLIC_JOURNEYS_DEV_ALLOWLIST=parcours-p4` (ou `p4`).
- Prod: 404 tant que `visibility=dev` dans le manifest.
