---
id: RFC_UNIVERSAL_BILAN_VIEWMODEL_V1
version: 1.0.0
status: draft
date: 2025-12-31
owners: ["Marty"]
scope: ["pixelprowlers.io", "journeys:*", "bilan:*"]
tags: ["rfc", "bilan", "contract", "security"]
---

# RFC — UniversalBilanViewModel v1

## Objectif
Unifier le contrat de bilan multi-parcours avec un modèle unique, **agrégats only**, sans fuite de données brutes. Le contrat doit être stable pour P1 aujourd’hui et extensible pour P2–P5 sans changer de format.

## Principes de sécurité
- **Aucune réponse brute** (pas de per-question, pas d’answersBy, pas de raw).
- **Allowlist stricte des clés** (rejet des clés inattendues).
- **Pas de proto-pollution** (`__proto__`, `constructor`, `prototype`).
- **Aucune injection HTML** (pas de `v-html` / `innerHTML` côté rendu).
- **Erreurs neutres** (ne pas révéler de détails internes).

## Sections obligatoires
Le VM **doit** exposer 4 sections **toujours présentes** :
- `reperes` (repères / panorama agrégé)
- `risques`
- `recommandations`
- `actions`

Chaque section porte un `state` (`empty` | `partial` | `full`) et un `itemsCount`.

## Contrat TypeScript (v1)
```ts
export type UniversalBilanSectionId = 'reperes' | 'risques' | 'recommandations' | 'actions';
export type UniversalBilanSectionState = 'empty' | 'partial' | 'full';

export type UniversalBilanSectionVM = {
  id: UniversalBilanSectionId;
  title: string;
  summary: string;
  state: UniversalBilanSectionState;
  itemsCount: number;
};

export type UniversalBilanSectionsVM = {
  reperes: UniversalBilanSectionVM;
  risques: UniversalBilanSectionVM;
  recommandations: UniversalBilanSectionVM;
  actions: UniversalBilanSectionVM;
};

export type UniversalBilanViewModelV1 = {
  // Tronc commun (agrégats only)
  copy: { title: string; subtitle?: string };
  axisSummaryLabel: string;
  completedBlocksLabel: string;
  panoramaAnsweredLabel: string;
  summaryNav: { id: string; label: string }[];
  blocksSummaryHeading: string;
  completedBlocks: string;
  panorama: {
    answeredCount: number;
    skippedCount: number;
    completenessLabel: string;
    axes: Array<{
      id: string;
      label: string;
      emoji?: string;
      score: number;
      isPriority?: boolean;
      priorityLabel?: string;
      filledSegments?: number;
    }>;
    blocks: Array<{
      id: string;
      title: string;
      answeredCount: number;
      skippedCount: number;
      unseenCount: number;
      completion: number;
      isComplete: boolean;
      detailsOpen?: boolean;
      themes?: { name: string; average: number; count: number }[];
    }>;
    completedLabel: string;
  };

  // Sections obligatoires (clé de standardisation)
  sections: UniversalBilanSectionsVM;

  // Modules optionnels (agrégats only)
  modules?: {
    issues?: {
      list: Array<{
        id: string;
        label: string;
        icon?: string;
        summary: string;
        summaryShort: string;
        interpretation?: string;
        impactScore: number;
        effects: Array<{ lead: string; detail?: string }>;
        signals: Array<{ lead: string; detail?: string }>;
        expanded: boolean;
      }>;
      watchlist: Array<{
        id: string;
        label: string;
        icon?: string;
        summary: string;
        summaryShort: string;
        interpretation?: string;
        impactScore: number;
        effects: Array<{ lead: string; detail?: string }>;
        signals: Array<{ lead: string; detail?: string }>;
        expanded: boolean;
      }>;
      focusDetails: boolean;
      title: string;
      intro: string;
      emptyText: string;
    };
    recommendations?: {
      recommended: Array<{ id: string; label: string; summary?: string }>;
      library: Array<{ id: string; label: string; summary?: string }>;
    };
    actions?: {
      hasAnyAction: boolean;
      filteredActionsByHorizon: Record<string, Array<{ id: string; label: string; description: string }>>;
      copy: unknown;
    };
    resourcesActions?: {
      recommended: Array<{
        id: string;
        kind: 'resource' | 'action';
        title: string;
        description?: string;
        tags?: string[];
        horizon?: string;
        effort?: number;
        format?: string;
        cta: { type: 'contact' | 'resources' | 'route' | 'file' | 'export' | 'none'; label: string; target?: string };
        reason?: string;
      }>;
      library: Array<{
        id: string;
        kind: 'resource' | 'action';
        title: string;
        description?: string;
        tags?: string[];
        horizon?: string;
        effort?: number;
        format?: string;
        cta: { type: 'contact' | 'resources' | 'route' | 'file' | 'export' | 'none'; label: string; target?: string };
        reason?: string;
      }>;
      tags: string[];
    };
  };

  exportPanel: {
    exportText: string;
    clearMessage: string;
    copied: boolean;
    missingInfo: unknown;
    eraseCopyLabel: string;
    focusDetails: boolean;
    hasGlobalMissing: boolean;
    globalSkipText: string;
    globalMissing: number;
  };

  meta?: {
    isEmpty?: boolean;
    partial?: boolean;
    maturity?: 'stub' | 'core' | 'full' | 'prod';
    exportMode?: 'minimal' | 'full';
  };
};
```

## Champs interdits (exemples)
- `rawAnswers`, `answersByQuestionId`, `answersByQuestion`, `perQuestion`, `responses`
- tout champ de type `pX_qY`, `qX_*`, `questionId`, `journeyAnswers`

## Invariants
- `sections` est **toujours présent** avec 4 clés fixes.
- `itemsCount` est un entier ≥ 0.
- `state` suit :
  - `empty` si `itemsCount === 0`
  - `partial` si `itemsCount > 0` mais incomplet
  - `full` si `itemsCount > 0` et complet
- Les clés dynamiques sont interdites. Si besoin de dictionnaire, utiliser `Object.create(null)` ou `Map` côté production, mais sérialiser en liste stricte dans le VM.

## Compatibilité multi-parcours
- P1 produit déjà un VM complet : `sections` doit être dérivé des modules existants.
- P2–P5 peuvent produire un VM minimal : `sections.*` en `empty` avec `itemsCount = 0`, sans casser le rendu.
- Le format **ne change pas** : seule la densité de contenu varie.
