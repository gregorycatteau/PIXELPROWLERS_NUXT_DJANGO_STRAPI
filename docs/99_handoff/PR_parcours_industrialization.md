---
id: PX_V1_3_PR_HANDOFF_PARCOURS_INDUSTRIALIZATION
version: 1.0.0
status: draft
date: 2026-01-07
owners: ["Dan"]
scope: ["pixelprowlers.io", "ssot", "ci", "journeys"]
tags: ["handoff", "pr", "ci", "journeys", "resources"]
---

<!--
PR HANDOFF SUMMARY
Branch: parcours_industrialization
-->

# PR Title
Industrialize journeys visibility + resource filtering + SSOT-backed guards

## Contexte
Cette PR industrialise la mise en production des parcours en verrouillant la visibilite en prod, en filtrant les ressources par journey, et en branchant les guards sur une source SSOT. L'objectif est d'eviter toute fuite cross-journey, d'imposer une visibilite prod pilotee par les manifests, et d'apporter des preuves claires (smokes + gates + docs). P2–P5 restent developpables en dev via allowlist, et sont accessibles en prod lorsqu'ils sont promus.

## Invariants GO-PROD (phase actuelle)
- PROD = visibility-driven (`visibility: "prod"` dans le manifest)
- P1–P5 = 200 en prod (parcours promus)
- DEV allowlist via `NUXT_PUBLIC_JOURNEYS_DEV_ALLOWLIST`
- Ressources filtrees par `relatedJourneys`
- no-tech-reveal guard base sur SSOT

## Changements
### Journeys
- Visibility gate dans les manifests + helper `visibility.ts`
- Enforcement dans middleware + page validate (route-validate guard fix inclus)

### Resources
- Filtrage des ressources par journey dans `StepResourcesE3` + recommandations

### Guards CI
- `journey-prod-p1-only-r1`
- `journey-schema-integrity-r1`
- `resources-filter-by-journey-r1`
- `no-tech-reveal-r1` adosse au SSOT

### Smokes
- Scripts dev/prod pour valider allowlist et 404 prod

### Docs / SSOT
- Spec visibility P2–P5
- SSOT/QA no-tech-reveal + index updates

## Comment tester
```
cd frontend_nuxt && npm run typecheck
cd frontend_nuxt && npm run guards:ci
cd frontend_nuxt && ./scripts/smoke/smoke-journey-dev-allowlist.sh
cd frontend_nuxt && ./scripts/smoke/smoke-journey-prod-p1-only.sh
```

## Activation plan (quand un nouveau parcours est pret)
- Changer la visibility du manifest de "dev" -> "prod".
- S'assurer que le pack ressources est pret (pas de fuite cross-journey).
- Smokes + gates + QA no-tech-reveal OK.

## Why this matters
- Eviter les pages fantomes.
- Eviter les promesses non tenues.
- Eviter le leak de ressources/copy.
- Garder le SEO propre.

## Notes / risques
- Warnings Tailwind sourcemap en build (non bloquant).
- `relatedJourneys` doit rester a jour lors de publication de ressources multi-journeys.

## Checklist merge
- [ ] smokes ok
- [ ] gates ok
- [ ] prod invariant validated
- [ ] docs SSOT ok
