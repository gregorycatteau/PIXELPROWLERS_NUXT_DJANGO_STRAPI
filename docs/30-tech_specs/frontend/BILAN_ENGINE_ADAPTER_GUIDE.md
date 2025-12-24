---
id: BILAN_ENGINE_ADAPTER_GUIDE
version: 1.0.0
status: active
date: 2025-12-24
owners: ["Dan"]
scope: ["docs/30-tech_specs/**"]
tags: ["tech_specs", "frontend"]
---

# Guide d’adaptation — Bilan Engine (GlobalBilanEngine)

Objectif: ajouter un nouvel adapter de bilan pour un parcours (P2/P3…) sans modifier l’UI ni le moteur.

## Où brancher
- Types VM communs: `frontend_nuxt/app/types/bilan.ts`
- Contrat adapter: `frontend_nuxt/app/adapters/bilan/types.ts`
- Registry: `frontend_nuxt/app/adapters/bilan/registry.ts` (whitelist explicite)
- Exemple P1: `frontend_nuxt/app/adapters/bilan/p1.ts`
- Engine: `frontend_nuxt/app/components/journey/bilan/GlobalBilanEngine.vue`

## Règles IDs / ancrages
- Conserver les IDs d’ancres UI (`gb_*`, `p1-atterrissage`…) pour compatibilité sommaire et scroll.
- `journeyId` sert de clé pour l’adapter; ne pas utiliser d’import dynamique non maîtrisé.

## Mapping ViewModel
- Build un `GlobalBilanViewModel` **sans dépendance UI** (POJO uniquement).
- Champs principaux:
  - `panorama.axes` (`BilanAxisVM`) triés, avec `emoji`, `score`, `isPriority`, `filledSegments`.
  - `panorama.blocks` (`BilanBlockVM`) avec complétude, `detailsOpen` facultatif.
  - `issues.list` / `issues.watchlist` (`BilanIssueVM`) avec bullets dérivées, jamais de texte brut long dans bullets.
  - `hypotheses.list` (`BilanHypothesisVM`), `secondary`, `verificationPlans`.
  - `landing.plans` (`BilanLandingPlanVM`) côté adapter (state “done” géré par l’engine).
  - `actions`, `resources`, `exportPanel`, `engagement`, `supports` selon besoins parcours.
- **Interdiction**: intégrer des réponses brutes ou PII; utiliser seulement agrégats déjà disponibles (scoring, meta).

## Pipeline (texte)
```
GlobalBilanEngine -> getBilanAdapter(journeyId) -> buildViewModel() -> props des composants UI
```
State UI (sélections, toggles, scroll) reste dans l’engine/composables.

## Checklist ajout d’un adapter
1. Créer `frontend_nuxt/app/adapters/bilan/<journeyId>.ts` en implémentant `JourneyBilanAdapter`.
2. Alimenter tous les champs requis du `GlobalBilanViewModel` à partir des composables/logic métier existants.
3. Ne **pas** enregistrer de template vide dans le registry.
4. Ajouter l’adapter au switch du `registry.ts`.
5. Lancer `npm run --prefix frontend_nuxt typecheck`.
6. Lancer `npm run --prefix frontend_nuxt bilan:guard` (tripwire anti “raw answers” en CI).
7. Faire un smoke test ciblé (voir `docs/55-qa/P1_GLOBAL_BILAN_SMOKE_TESTS.md` comme référence).
