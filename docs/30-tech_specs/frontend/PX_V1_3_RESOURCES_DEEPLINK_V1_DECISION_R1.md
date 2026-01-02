---
id: PX_V1_3_RESOURCES_DEEPLINK_V1_DECISION_R1
version: 1.0.0
status: active
date: 2026-01-01
owners: ["Dan", "Heider"]
scope: ["frontend_nuxt/**", "docs/30-tech_specs/frontend/**"]
tags: ["tech_specs", "frontend", "resources", "deeplink", "security", "decision"]
---

# PX V1.3 — Resources DeepLink V1 (Decision R1)

## Objectif
Fixer une politique V1 minimale et stable pour les deep links `/ressources` afin de reduire la surface d'attaque et eviter une promesse produit non specifiee.

## Perimetre
- SSR et client pour `/ressources` et `/ressources/[slug]`.
- DeepLinkKit V1 (parse/build + canonicalisation).

## Decision
1) **Allowlist minimale V1** : `q`, `category`, `effort`, `level`, `page`.
   - **Aucun** `sort`.
   - **Aucun** `tags`.
2) **Duplicates => drop total** (pas de keep-first) pour `/ressources`.
3) **Toxic / oversize => 404**.
4) **Canonicalisation SSR** : redirection **307** vers l'URL canonique.
   - 308 possible apres stabilisation et verifications cache.

## Rationale
- Surface d'attaque reduite (moins de params = moins de bypass).
- Eviter une promesse UX implicite sans enum, spec ni tests.
- Stabiliser SSR/CSR (meme logique, meme URL canon).

## Security invariants
- Cap raw `q` : 512 avant NFKC.
- Cap `q` final : 120.
- Strip control chars + zero-width + trim.
- Cap QueryString total : 1024.
- Aucune journalisation de query brute.

## Consequences
- Les liens partageables n'exposent que la recherche et les filtres allowlistes.
- Tout parametre hors allowlist est neutralise par canonicalisation.

## Non-negociables
- Pas de `v-html` / `innerHTML`.
- 404 neutre (pas de fuite interne).
- Canonicalisation uniquement via DeepLinkKit.

## Out of scope
- Enum de tri ou de tags.
- UI de tri/filtrage non specifiee.

## References
- `docs/40-security/contracts/PX_V1_3_SECURITY_P0_DEEPLINKS_DOM_GUARDS.md`
- `docs/30-tech_specs/frontend/PX_V1_3_RESOURCES_LIBRARY_INTEGRATION.md`
