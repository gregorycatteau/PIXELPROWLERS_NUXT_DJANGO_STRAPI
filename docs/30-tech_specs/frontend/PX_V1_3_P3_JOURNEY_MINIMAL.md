---
id: PX_V1_3_P3_JOURNEY_MINIMAL
version: "1.3"
status: active
date: 2026-01-08
owners: ["Marty"]
scope: tech_specs
tags:
  - tech_specs
  - frontend
  - journey
  - p3
  - v1.3
---

# P3 — Parcours minimal (dev)

## But du parcours
Le parcours P3 propose un panorama court pour clarifier la situation et poser un diagnostic simple, sans promesse avancee. Il sert de base jouable en dev et reste volontairement sobre.

## Etapes
- E0_intro
- E1_panorama
- E2_bilan
- E3_resources
- E4_exit

## Useful slice v0
- Panorama: 3 axes, 6 questions max (signaux, organisation, decisions).
- Bilan: scores 0-100 + score global + 2 priorites.
- Actions: 3 a 5 cartes action avec outcome + effort.
- Ressources: uniquement celles taggees `p3` (relatedJourneys).
- Smoke: `frontend_nuxt/scripts/smoke/smoke-p3-value.sh`.

## Regles d'acces
- Dev: visible uniquement via allowlist `NUXT_PUBLIC_JOURNEYS_DEV_ALLOWLIST=parcours-p3` (ou `p3`).
- Prod: 404 tant que `visibility=dev` dans le manifest.
