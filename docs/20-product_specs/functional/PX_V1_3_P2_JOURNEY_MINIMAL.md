---
id: PX_V1_3_P2_JOURNEY_MINIMAL
version: "1.3"
status: active
date: 2026-01-08
owners: ["Marty"]
scope: product_specs
tags:
  - product_specs
  - journey
  - p2
  - v1.3
---

# P2 — Parcours minimal (dev)

## But du parcours
Le parcours P2 propose un panorama court (3 axes, 6 questions) pour cadrer la situation, un bilan deterministe (3 scores, 3 priorites, 3 actions) et un set de ressources filtre P2. Le scope reste volontairement sobre et local-only.

## Etapes
- E0_intro
- E1_panorama
- E2_bilan
- E3_resources
- E4_exit

## V0 utile (useful slice)
- Panorama: 3 axes (gouvernance, coordination, securite), 6 questions max.
- Bilan: 3 scores (0-100) + 3 priorites ordonnees.
- Actions: 3 cartes immediates, reliees a des ressources taggees P2.
- Ressources: 3 a 5 ressources published taggees P2 (filtre local).

## Regles d'acces
- Dev: visible uniquement via allowlist `NUXT_PUBLIC_JOURNEYS_DEV_ALLOWLIST=parcours-p2` (ou `p2`).
- Prod: 404 tant que `visibility=dev` dans le manifest.
