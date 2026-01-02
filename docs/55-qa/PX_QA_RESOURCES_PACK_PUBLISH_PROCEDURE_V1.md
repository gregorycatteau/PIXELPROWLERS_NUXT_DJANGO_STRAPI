---
id: PX_QA_RESOURCES_PACK_PUBLISH_PROCEDURE_V1
version: 1.0.0
status: active
date: 2026-01-02
owners: ["Dan", "Eva"]
scope: ["docs/55-qa/**", "docs/20-product_specs/resources/**", "frontend_nuxt/**"]
tags: ["qa", "procedure", "resources", "release", "p1"]
---

# Procedure — Publish a Resource Pack (P1)

## Steps (minimal)
1) Copy: dupliquer la structure pack precedente (sans drift de contenu).
2) Registry: mettre a jour `registryV0.data.mjs` uniquement si necessaire.
3) Pack list: maintenir la liste officielle des slugs published.
4) Recos mapping: verifier les recos deterministes (pack-only, <= 3).
5) Guards: `npm run --prefix frontend_nuxt guards:ci`.
6) Smokes: `npm run --prefix frontend_nuxt resources:pack:smoke`.
7) Tag: tagger la release (produit) apres green line.

## Regles non negociables
- Texte-only, no-URL, no HTML.
- `outcome` obligatoire pour published.
- Graphe related acyclique (hub -> children uniquement en V1).
- Cap published V1 = **10** exact.
- Recos pack-only, deterministes, <= 3.

## Commit/Tag discipline
- Produit, outillage QA, SSOT = commits separes.
- Tags uniquement sur commit produit ou tooling explicitement mentionne.

## Checklist attaquant
- Cache poisoning: 404 toxiques => `Cache-Control: no-store`.
- Open redirect: Location relative seulement.
- SSR/CSR: pas de divergence de statut (200/404/307).
- Injection via URL: aucune URL en contenu, aucune URL render.
- Drift published count: guard `resources:published:guard` doit rester a 10.
