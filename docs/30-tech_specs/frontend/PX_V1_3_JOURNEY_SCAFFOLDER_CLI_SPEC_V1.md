---
id: PX_V1_3_JOURNEY_SCAFFOLDER_CLI_SPEC_V1
version: 1.0.0
status: active
date: 2025-12-27
owners: ["Dan"]
scope: ["docs/30-tech_specs/**"]
tags: ["tech_specs", "frontend", "journey", "spec", "cli", "security"]
---

# PX V1.3 — Journey Scaffolder CLI (Spec V1)

## Objectif
Spec d'un outil CLI qui genere un parcours conforme au contrat JourneySchema v1 et aux guards CI.

## Commande
Proposition:
```
npm run journey:scaffold -- --id p2 --slug parcours-p2 --label "Parcours P2"
```

## Fichiers generes (minimum)
- `frontend_nuxt/app/config/journeys/pXJourneySchema.ts`
- `frontend_nuxt/app/config/journeys/pXCopyV1_0.ts`
- `frontend_nuxt/app/config/journeys/pXQuestionsV1_0.ts`
- `frontend_nuxt/app/config/journeys/manifests/pX.manifest.ts`
- `frontend_nuxt/app/adapters/bilan/pX.ts`
- `docs/55-qa/PX_PX_BILAN_SMOKE_TESTS.md` (placeholder)

## Steps generes (minimum)
E0 -> E1 -> E_global_bilan -> E_resources -> E_exit

Step IDs standard:
- `E0_intro`
- `E1_panorama`
- `E_global_bilan`
- `E_resources`
- `E_exit`

## Branchement moteur
- `engine: 'universal'`
- `JourneyStepRenderer` utilise les steps universels.
- `GlobalBilanEngine` consomme le VM universel (empty/partial ok).

## Naming conventions
- `journeyId`: `p2` (lowercase)
- `schemaVersion`: `p2_v1.0`
- storage keys: `pp_journey_p2_scores_v1_0`, `pp_journey_p2_meta_v1_0`
- fichiers: `p2CopyV1_0.ts`, `p2QuestionsV1_0.ts`, `p2JourneySchema.ts`

## Registry & index
Le CLI doit:
- enregistrer le manifest dans `manifests/registry.ts`
- enregistrer les sources dans `journeyDataRegistry.ts` si requis
- ajouter l adapter bilan dans `adapters/bilan/registry.ts`
- mettre a jour `docs/30-tech_specs/frontend/README.md` si doc canonique ajoutee

## Guards CI
Le CLI doit:
- declarer une liste explicite des fichiers generes
- ajouter un guard ciblant ces fichiers (ex: `journey-scaffold:r1:guard`)
- garantir que les guards existants passent:
  - `journey-entrypoint:guard`
  - `journey:guard`
  - `bilan:guard`
  - `bilan-vm-keys:guard`
  - `no-v-html`, `no-innerhtml`, `data-only`, `resourcesdeeplink`

## Gating rules
Si le schema genere un `gatingRules`, alors:
- la navigation doit passer par `navigate` injecte
- un guard doit verifier la presence de l'injection pour ce parcours

## Securite
- No remote assets.
- No `v-html` / `innerHTML`.
- Ressources via SafeDeepLinkKit uniquement.
- Donnees bilan = agregats only, jamais de PII.

## Definition of Done (CLI)
- Generation en < 60s.
- Parcours stub accessible sur `/parcours/<slug>?step=E0_intro`.
- `npm run guards:ci` passe sans modification manuelle.

## References
- `docs/30-tech_specs/frontend/PX_V1_3_JOURNEY_SCHEMA_RFC_V1.md`
- `docs/30-tech_specs/frontend/PX_CREATE_JOURNEY_IN_60_MINUTES.md`
