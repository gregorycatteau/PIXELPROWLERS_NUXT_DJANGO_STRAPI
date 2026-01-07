---
id: PX_V1_3_P5_JOURNEY_MINIMAL
version: "1.3"
status: active
date: 2026-01-08
owners: ["Marty"]
scope: product_specs
tags:
  - product_specs
  - journey
  - p5
  - v1.3
---

# P5 — Parcours minimal (dev)

## But du parcours
Le parcours P5 propose un panorama court pour clarifier la situation et poser un diagnostic simple, sans promesse avancee. Il sert de base jouable en dev et reste volontairement sobre.

## Etapes
- E0_intro
- E1_panorama
- E2_bilan
- E3_resources
- E4_exit

## Regles d'acces
- Dev: visible uniquement via allowlist `NUXT_PUBLIC_JOURNEYS_DEV_ALLOWLIST=parcours-p5` (ou `p5`).
- Prod: 404 tant que `visibility=dev` dans le manifest.
