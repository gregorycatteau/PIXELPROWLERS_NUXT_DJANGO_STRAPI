---
id: PX_V1_3_ACTIONS_PANEL_UNIVERSAL_R1
version: 1.0.0
status: active
date: 2025-12-27
owners: ["Dan", "Eva", "Marty"]
scope: ["docs/30-tech_specs/**"]
tags: ["tech_specs", "frontend", "actions", "bilan"]
---

# PX V1.3 — Actions Panel universel (R1)

## Objectif
Livrer un panneau d’actions universel (Duolingo-like) pour tous les parcours, branche dans le shell/engine commun, sans duplication par parcours.

## Perimetre
- Cellule DS `PPActionsPanel` (actions + etats vides/erreur).
- Builder `buildActionsFromBilan(...)` base sur les donnees bilan/reco (aucune reponse brute).
- Integration dans `GlobalBilanEngine` pour tous les parcours avec `modules.recommendations`.

## Out of scope
- Liens externes (interdits).
- Actions par parcours ou mapping manuel des reponses.
- Modification des adapters de bilan existants.

## Securite
- NO `v-html`, NO `innerHTML/outerHTML/insertAdjacentHTML`.
- Deep links uniquement via SafeDeepLinkKit (`buildResourcesDeepLink`), allowlist stricte + clamp.
- Texte libre normalise (NFKC + strip zero-width).
- Erreurs neutres (pas de logs PII, pas de message brut).
- Liens internes uniquement.

## DoD
- `PPActionsPanel` affiche actions ou etat vide/erreur.
- `buildActionsFromBilan` construit au moins un lien `/ressources` via SafeDeepLinkKit.
- Visible sur P1 + un autre parcours (P2 ou P3) sans code duplique.
- `npm run typecheck`, `npm run build`, `make ssot-check` passent.
