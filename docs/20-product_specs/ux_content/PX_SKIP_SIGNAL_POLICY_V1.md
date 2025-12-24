---
id: PX_SKIP_SIGNAL_POLICY_V1
version: 1.0.0
status: active
date: 2025-12-24
owners: ["Talia", "Marty"]
scope: ["docs/20-product_specs/**"]
tags: ["product_specs", "ux_content"]
---

# PX Skip Signal Policy V1

## Statut
- Version: V1
- Portee: parcours P1 (Panorama E2 + Global Bilan)
- Decision: Marty (Option C - hybride)

## Definitions
- skip_intentional: question explicitement ignoree par l'utilisateur (value = null).
- missing: question non repondue (value = undefined / non vue).

## Regle d'affichage
### Global
- Afficher un bandeau neutre si skip_intentional > 0.

### Par axe
- Afficher une mention par axe si:
  - skippedCount >= 2, OU
  - skippedCount / totalCount >= 0.2.

## Copy canon
- "Tu as laisse de cote certaines questions. Ce bilan reflete ce que tu as pu poser aujourd'hui."
- "Les suggestions tiennent compte de ce que tu as repondu et de ce que tu as choisi de ne pas traiter."

## Interdits
- Pas d'inference psychologique ou morale.
- Pas de granularite par question ou bloc.
- Pas de mention causale (ex: "a cause de...").

## Privacy
- Agrégats uniquement (skippedCount/totalCount).
- Aucun mapping questionId -> reponse en config/VM/storage/export.

## QA checklist
- Skip >= 1 au panorama => bandeau global visible.
- Skip >= 2 sur un axe OU >= 20% => mention axe visible.
- Aucun skip => aucun bandeau.
- Reponse 1-5 apres skip => unskip, bandeau mis a jour.
