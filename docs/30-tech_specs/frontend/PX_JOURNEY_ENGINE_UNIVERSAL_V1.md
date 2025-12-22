# PX Journey Engine Universal V1

## Doctrine

L Engine universel fournit une ossature unique pour tous les parcours core.
Les parcours sont data-only : copy, questions, schema, manifest, adapter bilan.
Le runtime ne depend pas de composants specifiques par parcours (sauf P1 legacy).
Les variables sont portees par le manifest V1 (axes, modules, pointers, storage, adapters).

Objectifs :
- Un seul moteur d orchestration.
- Un renderer de steps commun (E0, E1, E2, Global).
- Des manifests data-only comme source of truth.
- Privacy hard gate : uniquement des agregats persistes.

## Pipeline (SSOT)

1) Registry manifest
- `frontend_nuxt/app/config/journeys/manifests/registry.ts`
- source de verite pour la liste des parcours.

2) Engine universel
- `frontend_nuxt/app/components/journey/JourneyEngineUniversal.vue`
- orchestre l etape courante, resume, navigation via `useJourneyEngine`.

3) Renderer universel
- `frontend_nuxt/app/components/journey/JourneyStepRenderer.vue`
- map stepId vers composants universels E0/E1/E2/Global.

4) Steps universels
- `frontend_nuxt/app/components/journey/steps/StepIntroE0.vue`
- `frontend_nuxt/app/components/journey/steps/StepPanoramaE1.vue`
- `frontend_nuxt/app/components/journey/steps/StepPanoramaBilanE2.vue`

5) Adapters bilan (global)
- `frontend_nuxt/app/adapters/bilan/registry.ts`
- chaque parcours core expose un adapter (p2, p3, p4).
- le global bilan est rendu par `frontend_nuxt/app/components/journey/bilan/GlobalBilanEngine.vue`.

## Manifest V1

Types source : `frontend_nuxt/app/config/journeys/manifests/types.ts`.
Champs principaux :
- `id`, `slug`, `engine`, `maturity`
- `axes` (liste d axes libres)
- `modules` (panorama, blocks, export, etc.)
- `pointers` (copy/questions/resources/actions)
- `adapters` (globalBilanAdapterId)
- `storage` (schemaVersion, scoresKey, metaKey)

Exemple : `frontend_nuxt/app/config/journeys/manifests/p4.manifest.ts`.

Schema V1 (extrait) :
```ts
export type JourneyManifestV1 = {
  id: string;
  slug: string;
  engine?: 'legacy' | 'universal';
  maturity: 'stub' | 'core' | 'full' | 'prod';
  axes?: { axisId: string; label: string; description?: string; renderHint?: string }[];
  modules: {
    panorama?: boolean;
    blocks?: boolean;
    issues?: boolean;
    hypotheses?: boolean;
    landing?: boolean;
    actions?: boolean;
    resources?: boolean;
    engagement?: boolean;
    export?: boolean;
  };
  pointers: { questions?: string; copy?: string; resources?: string; actions?: string };
  adapters: { globalBilanAdapterId?: string };
  storage: { schemaVersion: string; scoresKey: string; metaKey: string; ttlPolicy: 'unchanged' };
};
```

## Privacy hard gate

Regle absolue : aucun mapping questionId -> reponse n est serialise.
Seuls des agregats sont persistents.

Interdits explicites (exemples) :
- `answersByQuestionId`
- `questionId` comme cle de reponse persistante
- `answers`, `responses`, `journeyAnswers`, `raw`

Les verifications sont enforcees par `frontend_nuxt/tools/journey_manifest_guard.ts`.

## Guards CI

Commandes :
- `npm run --prefix frontend_nuxt typecheck`
  - verifie types Nuxt + Vue.
- `npm run --prefix frontend_nuxt bilan:guard`
  - verifie que les adapters bilan respectent les invariants (no raw answers).
- `npm run --prefix frontend_nuxt journey:guard`
  - verifie la forme du manifest + privacy patterns.
- `npm run --prefix frontend_nuxt journey:nodup`
  - verifie l absence de wrappers specifiques P2/P3/P4.

Le workflow CI est defini dans `/.github/workflows/frontend_nuxt.yml`.

## Maturity

- `stub` : squelette minimal, pas de parcours complet.
- `core` : E0/E1/E2/Global fonctionnels, data-only.
- `full` : enrichissements (issues/hypotheses/resources/actions).
- `prod` : stable, compatible exigences legales/UX.

Le champ `maturity` sert a declarer le niveau de readiness.

## Extensions

Ajouter un nouveau step universel :
1) Implementer le composant dans `frontend_nuxt/app/components/journey/steps/`.
2) Declarer le mapping dans `frontend_nuxt/app/components/journey/JourneyStepRenderer.vue`.
3) Ajouter l etape dans le schema de parcours (ex: `frontend_nuxt/app/config/journeys/p4JourneySchema.ts`).
4) Garder la compatibilite des steps existants (aucun breaking change).

La source of truth reste le schema de parcours, et le renderer universel.
