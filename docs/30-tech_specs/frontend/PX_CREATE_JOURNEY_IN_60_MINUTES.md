---
id: PX_CREATE_JOURNEY_IN_60_MINUTES
version: 1.0.0
status: active
date: 2025-12-24
owners: ["Dan"]
scope: ["docs/30-tech_specs/**"]
tags: ["tech_specs", "frontend"]
---

# PX Create Journey In 60 Minutes

## Objectif

Creer un parcours data-only compatible Journey Engine universel.
Le parcours doit fonctionner en E0 -> E1 -> E2 -> Global avec un adapter bilan.

## Checklist pas a pas

1) Creer la copy
- `frontend_nuxt/app/config/journeys/pXCopyV1_0.ts`
- sections: `intro`, `panorama`, `panoramaBilan`, `global`, `export`

2) Creer les questions
- `frontend_nuxt/app/config/journeys/pXQuestionsV1_0.ts`
- axes libres + questions (8 a 12 max)

3) Creer le schema
- `frontend_nuxt/app/config/journeys/pXJourneySchema.ts`
- steps: `E0_intro`, `E1_panorama`, `E2_panorama_bilan`, `E_global_bilan`

4) Creer le manifest
- `frontend_nuxt/app/config/journeys/manifests/pX.manifest.ts`
- `engine: 'universal'`
- pointers vers copy/questions

5) Enregistrer le manifest
- `frontend_nuxt/app/config/journeys/manifests/registry.ts`

6) Enregistrer les sources data
- `frontend_nuxt/app/config/journeys/journeyDataRegistry.ts`

7) Ajouter l adapter bilan
- `frontend_nuxt/app/adapters/bilan/pX.ts`
- enregistrer dans `frontend_nuxt/app/adapters/bilan/registry.ts`

8) Ajouter smoke tests
- `docs/55-qa/PX_GLOBAL_BILAN_SMOKE_TESTS.md`

## Snippets minimaux

Manifest (exemple) :
```ts
export const p4Manifest: JourneyManifestV1 = {
  id: 'p4',
  slug: 'parcours-60-minutes',
  engine: 'universal',
  maturity: 'core',
  axes: [
    { axisId: 'clarity', label: 'Clarte de la direction' }
  ],
  modules: { panorama: true, blocks: true, export: true },
  pointers: {
    questions: 'app/config/journeys/p4QuestionsV1_0',
    copy: 'app/config/journeys/p4CopyV1_0'
  },
  adapters: { globalBilanAdapterId: 'p4' },
  storage: {
    schemaVersion: 'p4_v1.0',
    scoresKey: 'pp_journey_p4_scores_v1_0',
    metaKey: 'pp_journey_p4_meta_v1_0',
    ttlPolicy: 'unchanged'
  }
};
```

Questions (extrait) :
```ts
export const P4_PANORAMA_AXIS_ORDER = ['clarity', 'capacity', 'support'];
export const p4PanoramaQuestions = [
  { id: 'p4_panorama_clarity_q1', axisId: 'clarity', label: 'Je peux expliquer en une phrase ce que je veux obtenir.' }
];
```

Adapter bilan (extrait) :
```ts
export const p4BilanAdapter: JourneyBilanAdapter = {
  journeyId: 'p4',
  buildViewModel() {
    const storage = useCoreJourneyStorage({ journeyId: 'p4' });
    const panoramaScores = computed(() => storage.scores.value?.panorama ?? null);
    // construire un GlobalBilanViewModel a base d agregats
    const vm: GlobalBilanViewModel = { /* ... */ };
    assertNoRawAnswers(vm);
    return vm;
  }
};
```

## Validation

Commandes :
- `npm run --prefix frontend_nuxt typecheck`
- `npm run --prefix frontend_nuxt bilan:guard`
- `npm run --prefix frontend_nuxt journey:guard`
- `npm run --prefix frontend_nuxt journey:nodup`

## Tests manuels

Routes de test :
- `/parcours/mon-slug?step=E0_intro`
- `/parcours/mon-slug?step=E1_panorama`
- `/parcours/mon-slug?step=E2_panorama_bilan`
- `/parcours/mon-slug?step=E_global_bilan`

Smoke tests :
- E0 -> E1 -> E2 -> Global
- Skip signal (Option C)
- Reload + export (agregats uniquement)
