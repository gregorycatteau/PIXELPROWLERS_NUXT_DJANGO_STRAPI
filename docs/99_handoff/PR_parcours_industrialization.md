<!--
PR HANDOFF SUMMARY
Branch: parcours_industrialization
-->

# PR Title
Industrialize journeys visibility + resource filtering + SSOT-backed guards

## Contexte
Cette PR industrialise la mise en production des parcours en verrouillant la visibilite en prod, en filtrant les ressources par journey, et en branchant les guards sur une source SSOT. L'objectif est d'eviter toute fuite cross-journey, d'imposer P1-only en prod, et d'apporter des preuves claires (smokes + gates + docs).

## Invariants
- PROD = P1 only
- P2–P5 = 404 strict prod
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

## Notes / risques
- Warnings Tailwind sourcemap en build (non bloquant).
- `relatedJourneys` doit rester a jour lors de publication de ressources multi-journeys.

## Checklist merge
- [ ] smokes ok
- [ ] gates ok
- [ ] prod invariant validated
- [ ] docs SSOT ok
