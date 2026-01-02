---
id: PX_RELEASE_RESOURCES_P1_PATCH_V1_3_R1
version: 1.3.1
status: active
date: 2026-01-02
owners: ["Jared", "Marty"]
scope: ["P1", "ressources", "release"]
tags: ["release", "resources", "p1", "v1.0.1", "qa"]
---

# Release Note — Resources Pack P1 v1.0.1

## Objectif
Patch tooling-only: ajout d'un smoke test déterministe pour prouver `draft => 404` en preview/prod, sans aucun changement produit.

## Tag
- `resources-p1-v1.0.1`
- Le pack `resources-p1-v1.0.0` reste scellé (produit inchange).

## Invariants (non negociables)
- Exactly **10** resources `published`.
- `draft` => **404** en prod/preview.
- Recos deterministes, pack-only, **<= 3**.
- Texte-only, **no-URL**.
- Hub -> children, graphe acyclique.
- Canon SSR: redirect relatif + `Cache-Control: no-store` sur 404 toxiques.

## Green line (a rejouer)
- `npm run --prefix frontend_nuxt typecheck`
- `npm run --prefix frontend_nuxt guards:ci`
- `npm run --prefix frontend_nuxt build`
- `npm run --prefix frontend_nuxt resources:pack:smoke`

## Known caveat (si observe)
- Warnings Tailwind sourcemap pendant `npm run --prefix frontend_nuxt build` (non bloquant).

## Notes
- Aucun changement registry/pack/reco.
- Tag utilise pour audit smoke sur slug published vs draft.
