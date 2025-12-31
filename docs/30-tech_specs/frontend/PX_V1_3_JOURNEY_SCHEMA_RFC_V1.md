---
id: PX_V1_3_JOURNEY_SCHEMA_RFC_V1
version: 1.0.0
status: active
date: 2025-12-27
owners: ["Dan"]
scope: ["docs/30-tech_specs/**"]
tags: ["tech_specs", "frontend", "journey", "rfc", "contract", "security"]
---

# PX V1.3 — JourneySchema (RFC V1)

## Objectif
Definir un contrat stable pour generer et maintenir des parcours P2..P5 et des parcours generes a la volee, sans dette technique.

Le contrat couvre:
- le **manifest** (moteur + modules + pointeurs),
- le **schema** (steps allowlist),
- les **packs de copy** (labels et microcopy data-only).

## Portee
- Journey Engine universel (parcours data-only).
- Gating optionnel et securise (via navigation injectee).
- Entrypoint E0 + landing optionnel.

## Nommage
- `journeyId`: `p2`, `p3`, `p4`, `p5` (lowercase).
- `slug`: kebab-case, stable (ex: `diagnostic-sobriete`).
- Fichiers:
  - `frontend_nuxt/app/config/journeys/pXJourneySchema.ts`
  - `frontend_nuxt/app/config/journeys/pXCopyV1_0.ts`
  - `frontend_nuxt/app/config/journeys/pXQuestionsV1_0.ts`
  - `frontend_nuxt/app/config/journeys/manifests/pX.manifest.ts`

## Manifest V1 (rappel)
Source: `frontend_nuxt/app/config/journeys/manifests/types.ts`.
Champs obligatoires pour un parcours core:
- `id`, `slug`, `engine`, `maturity`
- `modules` (panorama, export, actions, resources, etc.)
- `pointers` (copy/questions/resources/actions)
- `adapters` (globalBilanAdapterId)
- `storage` (schemaVersion, keys, ttlPolicy)

## JourneySchema V1 (contrat)

### Champs obligatoires
- `id`: string (ex: `p2`)
- `slug`: string
- `label`: string (nom public)
- `entrypoint`: `E0_intro` (fixe)
- `steps`: liste ordonnee allowlist
- `modules`: { panorama, bilan, resources, exit }
- `copyPack`: chemin des labels/microcopy
- `gatingRules?`: optionnel (voir ci-dessous)

### Typage des steps
Type fonctionnel attendu:
- `intro`
- `questionnaire`
- `bilan_global`
- `ressources`
- `sortie`

Compatibilite avec le runtime actuel:
- `bilan_global` mappe vers le step type existant `bilan` + `meta.bilanType = "global"`.
- `sortie` mappe vers `carrefour` ou step terminal custom selon parcours.

### Exemple (shape)
```ts
export const p2JourneySchema = {
  id: 'p2',
  slug: 'parcours-p2',
  label: 'Parcours P2',
  entrypoint: 'E0_intro',
  modules: { panorama: true, bilan: true, resources: true, exit: true },
  copyPack: 'app/config/journeys/p2CopyV1_0',
  steps: [
    { stepId: 'E0_intro', type: 'intro', componentName: 'StepIntroE0', next: 'E1_panorama' },
    { stepId: 'E1_panorama', type: 'questionnaire', componentName: 'StepPanoramaE1', prev: 'E0_intro', next: 'E_global_bilan' },
    { stepId: 'E_global_bilan', type: 'bilan', componentName: 'GlobalBilanEngine', prev: 'E1_panorama', isTerminal: true }
  ],
  gatingRules: []
};
```

## Allowlist + Entrypoint
- `?step` doit etre allowliste par `steps[]` uniquement.
- Step invalide -> fallback sur `entrypoint` (E0).
- `?landing=1` permet une page d'atterrissage optionnelle, sans modifier `entrypoint`.

## GatingRules (optionnel)
Usage: declarer des conditions de passage (ex: bilan accessible si panorama complete).

Format recommande:
```ts
gatingRules: [
  {
    id: 'panorama_required',
    when: 'E_global_bilan',
    allow: false,
    redirectTo: 'E1_panorama',
    reason: 'Panorama requis'
  }
]
```

Regle de securite:
- Si `gatingRules` sont declarees, **navigation injectee obligatoire** (safe navigate).
- Objectif: eviter le bypass via navigation directe.

## Parcours stub (generation)
Un parcours stub doit contenir a minima:
- E0, E1, E_global_bilan, E_resources, E_exit
- copy placeholders data-only
- adapter bilan qui retourne un VM "empty/partial"

## Securite
- No PII, no raw answers, no questionId dans les VM.
- No `v-html` / `innerHTML`.
- Ressources via SafeDeepLinkKit uniquement (liens internes).
- Erreurs neutres, pas de logs sensibles.

## References
- `docs/30-tech_specs/frontend/PX_JOURNEY_ENGINE_UNIVERSAL_V1.md`
- `docs/30-tech_specs/frontend/PX_CREATE_JOURNEY_IN_60_MINUTES.md`
- `docs/30-tech_specs/frontend/PX_V1_3_UNIVERSAL_BILAN_VIEWMODEL_RFC_V1.md`
