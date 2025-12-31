---
id: SPEC_RESOURCE_PAGE_V0
title: "SPEC - Resource Page v0"
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
  - journeys
tags:
  - product_specs
  - resources
  - spec
  - ux
---

# SPEC - Resource Page v0

## Objectif
Definir la page /ressources et la page detail /ressources/[slug] en mode V0, sans reseau.

## /ressources (liste)
- Source: registry v0 en local (no fetch, no API).
- Filtre unique: `category` via SafeDeepLinkKit.
- Recherche optionnelle (title/summary), sanitization NFKC + clamp.
- Pagination locale (limit/offset).
- UI DS: PPResourcesLibraryShell + PPResourceCard.

## /ressources/[slug] (detail)
- Resolution locale via `getResourceBySlug`.
- 404 neutre si slug invalide ou inconnu: `createError(404, 'Not Found')`.
- Affiche: title, summary, category, level, effort, meta basique.

## SafeDeepLinkKit
- Route canonique: `buildResourcesDeepLink`.
- Parse strict: `parseResourcesDeepLink`.
- Allowlist: q, category, limit, offset.

## Contraintes de securite
- Zero fetch externe.
- Zero v-html / innerHTML.
- Slugs stricts, allowlistes.
- Aucun asset distant.
