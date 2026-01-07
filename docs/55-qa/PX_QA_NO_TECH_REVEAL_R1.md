---
id: PX_QA_NO_TECH_REVEAL_R1
version: 1.0.0
status: active
date: 2026-01-07
owners: ["Dan", "Eva"]
scope: ["docs/55-qa/**", "frontend_nuxt/app/**", "frontend_nuxt/scripts/guards/no-tech-reveal-r1.mjs"]
tags: ["qa", "security", "copy", "guard", "no-tech-reveal"]
---

# PX QA - No Tech Reveal (R1)

## But & invariants
- P1-only prod: aucune exposition de vocabulaire technique dans les textes visibles du public.
- No tech reveal: pas d'indices sur le stack, l'infra, les outils, ni les details d'implementation.
- Exceptions legales: pages legales possibles (RGPD, cookies) avec garde-fous explicites.

## Liste officielle des termes interdits (FR + EN)
Cette liste est la source de verite unique pour le guard. Tout ajout/retrait passe par ce document.

## Forbidden terms (machine)
<!-- SSOT_FORBIDDEN_TERMS:START -->
- nuxt
- vitejs
- vite.js
- nitro
- node
- npm
- yarn
- pnpm
- tailwind
- typescript
- javascript
- vuejs
- vue.js
- react
- django
- strapi
- api
- endpoint
- endpoints
- json
- http
- https
- ssl
- tls
- server
- serveur
- client
- backend
- frontend
- build
- runtime
- env
- environment
- localhost
- git
- pipeline
- docker
- kubernetes
- database
- db
- sql
- postgres
- postgresql
- mysql
- redis
- cache
- stack trace
- stacktrace
- traceback
- exception
- typeerror
- referenceerror
- token
- oauth
- jwt
- graphql
- rest
- sdk
- cli
- package
- dependency
<!-- SSOT_FORBIDDEN_TERMS:END -->

## Regles de detection
- Matching case-insensitive, mots entiers quand possible.
- Les termes multi-mots sont detects via espaces flexibles.
- Les termes contenant des signes non alphanumeriques sont traites sans bornes.
- Les termes ambigus en FR sont listes en version explicite (ex: vitejs, vuejs).

## Exceptions / allowlist
- Pages legales: autorisees uniquement si necessaire et documente.
- Override inline: ajouter `TECH_REVEAL_OK` sur la ligne a ignorer.
- Allowlist par fichier: ajouter un chemin relatif dans le guard.
- Allowlist temporaire: certains fichiers de copy parcours (mention "serveur/client") en attente de re-ecriture.

## DoD + execution
- Guard OK: `npm run --prefix frontend_nuxt no-tech-reveal:guard`
- CI guards: `npm run --prefix frontend_nuxt guards:ci`
- SSOT: `python3 tools/ssot_generate_indexes.py --check`

## Evolutions
- Mettre a jour la liste dans la section machine.
- Re-run SSOT indexes + lint + linkcheck.
