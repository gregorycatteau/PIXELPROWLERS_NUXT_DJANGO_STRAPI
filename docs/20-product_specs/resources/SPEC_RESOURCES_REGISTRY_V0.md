---
id: SPEC_RESOURCES_REGISTRY_V0
title: "SPEC - Resources Registry v0"
version: 0.1.0
status: draft
date: 2025-12-31
owners:
  - Marty
scope:
  - docs/20-product_specs/resources
  - frontend_nuxt
  - resources
  - security
tags:
  - product_specs
  - resources
  - registry
  - spec
---

# SPEC - Resources Registry v0

## Objectif
Definir le contrat canonique ResourceV0 et les regles de securite pour la V0.

## ResourceV0 (contrat)
Champs obligatoires :
- `id` : string, unique, stable.
- `slug` : string, ASCII kebab-case, unique.
- `title` : string, court et descriptif.
- `summary` : string, 1-2 phrases, texte uniquement.
- `category` : allowlist (diagnostic | securite | ux | gouvernance | outillage).
- `level` : allowlist (intro | intermediate | advanced).
- `effort` : allowlist (low | medium | high).
- `updatedAt` : string (YYYY-MM-DD).
- `relatedJourneys[]` : string[], ids de parcours (ex: p2, p3, p4, p5).
- `relatedResourceSlugs[]` : string[], slugs internes.

## Regles de securite (strict)
- Slugs : ASCII kebab-case uniquement (`^[a-z0-9]+(?:-[a-z0-9]+)*$`).
- Aucune URL externe obligatoire.
- Liens externes interdits en V0 (on stocke du texte, pas des redirects).
- Aucun HTML non-sanitize (pas de rendu HTML).
- Les erreurs de resolution doivent rester neutres.

## Source of Truth
- Registry TS: `frontend_nuxt/app/config/resources/registryV0.ts`
- Guard CI: `frontend_nuxt/scripts/guards/resources-registry-v0-r1.mjs`

## Non-goals
- Pas de contenu riche (HTML/Markdown) en V0.
- Pas de dependances externes.
