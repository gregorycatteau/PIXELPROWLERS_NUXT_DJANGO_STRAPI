---
id: PX_QA_RESOURCES_CANONICAL_R1
version: 1.0.0
status: active
date: 2026-01-01
owners: ["Dan", "Eva"]
scope: ["docs/55-qa/**", "frontend_nuxt/**"]
tags: ["qa", "resources", "canonicalization", "security", "smoke"]
---

# PX QA — Resources Canonicalization (R1)

## Objectif
Valider la canonicalisation `/ressources` pour reduire la surface d'attaque, limiter le cache poisoning et garantir l'absence de log de query brute.

## Invariants
- Allowlist V1: `q`, `category`, `effort`, `level`, `page` (NO `sort`, NO `tags`).
- Duplicates => drop total.
- Toxic / oversize => 404.
- SSR: 307 + `Cache-Control: no-store` + Location relative safe.

## How to run
1) Smoke canon:
   - `npm run --prefix frontend_nuxt resources:canon:smoke`
2) Core CI set:
   - `npm run --prefix frontend_nuxt typecheck`
   - `npm run --prefix frontend_nuxt guards:ci`
   - `python3 tools/ssot_generate_indexes.py --check`
   - `python3 tools/ssot_lint.py --strict`
   - `python3 tools/ssot_linkcheck.py --strict --no-orphans`

## Expected outputs (short)
- Smoke: `✅ ressources-canon-smoke-r1 — OK`
- Typecheck/guards: OK sans violations.
- SSOT: indexes a jour, lint/linkcheck OK.

## References
- Decision: `docs/30-tech_specs/frontend/PX_V1_3_RESOURCES_DEEPLINK_V1_DECISION_R1.md`
- Script: `frontend_nuxt/scripts/smoke/ressources-canon-smoke-r1.sh`
- NPM: `resources:canon:smoke`
