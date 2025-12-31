---
id: RFC_RESOURCES_TAXONOMY_V0
title: "RFC - Resources Taxonomy v0"
version: 0.1.0
status: draft
date: 2025-12-31
owners:
  - Marty
scope:
  - docs/20-product_specs/resources
  - frontend_nuxt
  - resources
  - journeys
  - security
tags:
  - product_specs
  - resources
  - taxonomy
  - rfc
---

# RFC - Resources Taxonomy v0

## Objectif
Definir une taxonomie minimale, stable et safe-by-default pour la V0 des ressources.

## Taxonomie V0 (allowlist)
- **diagnostic** : clarifier, cartographier, rendre visible la situation.
- **securite** : proteger les personnes et l'espace de travail (safe-by-default).
- **ux** : clarifier l'experience d'equipe et le flux quotidien.
- **gouvernance** : roles, arbitrages, regles du jeu explicites.
- **outillage** : supports et routines pour tenir dans la duree.

## Rationale
- **Minimaliste** : 5 categories pour eviter la dilution.
- **Lisible** : vocabulaire simple, sans jargon.
- **Transversal** : utilisable par tous les parcours (P2-P5 et P1).

## Non-goals
- Pas de tags libres en V0.
- Pas de sous-categories.
- Pas d'alignement SEO.

## Notes de securite
- Les labels affiches en UI restent statiques et allowlistes.
- Toute nouvelle categorie exige une mise a jour SSOT + guard.
