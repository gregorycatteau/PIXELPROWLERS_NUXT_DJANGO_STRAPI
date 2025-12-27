---
id: PX_V1_3_RESOURCES_LIBRARY_INTEGRATION
version: 1.3.0
status: active
date: 2025-12-27
owners: ["Dan"]
scope: ["frontend_nuxt", "api:v1", "ressources"]
tags: ["frontend", "resources", "library", "ssot", "security"]
---

# Resources Library — Integration Frontend (V1.3)

## Objectif
Exposer la bibliotheque publique `/ressources` en consommant l'API `/api/v1/resources/`.

## Integration
- Listing: `app/pages/ressources/index.vue` + `PPResourcesLibraryShell`.
- Detail: `app/pages/ressources/[slug].vue` avec recuperation par slug.
- Filtres: `q`, `tags`, `category`, `level`, `journey`, `type`, `limit`, `offset`.
- Deep links: `resourcesDeepLink.ts` (allowlist stricte, canonicalisation soft).

## Securite
- Aucun `v-html` ni `innerHTML`.
- Pas d'assets distants; rendu texte uniquement.
- Query params sanitises (NFKC, strip zero-width, clamp longueurs).
- Erreurs neutres via `PPErrorState`.
