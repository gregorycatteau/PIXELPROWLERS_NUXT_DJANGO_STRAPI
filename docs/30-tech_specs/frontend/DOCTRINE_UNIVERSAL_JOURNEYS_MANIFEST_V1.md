---
id: DOCTRINE_UNIVERSAL_JOURNEYS_MANIFEST_V1
version: 1.0.0
status: active
date: 2025-12-24
owners: ["Dan"]
scope: ["docs/30-tech_specs/**"]
tags: ["tech_specs", "frontend"]
---

# Doctrine — Parcours universels + Journey Manifest (V1)

## 0. Statut
- Version: V1
- Décisions actées (Marty): 2025-12-22
- Portée: Frontend (Nuxt), parcours P1/P2/P3 (extensible)

## 1. Intention
Standardiser tous les parcours PixelProwlers autour d’une ossature universelle, afin de :
- réduire le coût de création/évolution de parcours,
- garantir une cohérence UX,
- garantir des invariants privacy/souveraineté,
- permettre la mutualisation (resources/actions/export/engagement N1–N4).

## 2. Principes non négociables (Sécurité / Privacy)
1) **Aucun mapping questionId → réponse** n’est autorisé dans :
   - configs,
   - view models (VM),
   - storage,
   - exports.
2) **Agrégats uniquement** (scores/counters par axes, blocs, thèmes…).
3) **Guard CI obligatoire** :
   - `npm run --prefix frontend_nuxt typecheck`
   - `npm run --prefix frontend_nuxt bilan:guard`
   - et désormais `journey:guard` (manifest)
4) Les clés storage sont **versionnées**, TTL **inchangé**, et format contrôlé.

## 3. Architecture cible
### 3.1 Ossature universelle
- Un **moteur** (engine) rend les écrans bilans en modules standard.
- Une **VM universelle** (GlobalBilanViewModel) est la forme d’échange stable entre :
  - données parcours (agrégats) → adapter → VM → UI components.

### 3.2 Variantes par parcours (Journey Manifest)
Chaque parcours fournit un **manifest** unique, typé, validé par guard CI, qui déclare :
- identité (id/slug),
- maturité (stub|core|full|prod),
- modules activés (panorama/blocs/atterrissage/ressources/engagement/export…),
- pointeurs vers les configs (questions/copy/resources/actions),
- adapter(s) utilisés (ex: global bilan adapter id).

Le manifest peut importer des modules data (questions/copy/resources…), mais doit rester :
- **data-only** (pas de fonctions métier),
- sérialisable / audit-able,
- stable et versionné.

### 3.3 Axes
- Axes **libres par parcours** (axisId stable, label, description optionnelle, renderHint optionnel).
- Rendu assuré par un composant universel (pas de code spécifique par parcours).

### 3.4 Actions / Ressources
- Structure standard imposée :
  - ids stables, tags, horizons, format, et filePath sous allowlist.
- Objectif : mutualisation, recommandation, export, et compatibilité inter-parcours.

## 4. Schéma Journey Manifest V1 (TypeScript)
> Le manifest doit exister pour chaque parcours, même si certains modules sont vides (maturity=stub/core).

- id: string (ex: "p1")
- slug: string (ex: "ma-structure-dysfonctionne")
- maturity: "stub" | "core" | "full" | "prod"
- modules: { panorama?: boolean; blocks?: boolean; issues?: boolean; hypotheses?: boolean; landing?: boolean; actions?: boolean; resources?: boolean; engagement?: boolean; export?: boolean; }
- pointers: { questions?: string; copy?: string; resources?: string; actions?: string; }
- adapters: { globalBilanAdapterId?: string; }
- storage: { schemaVersion: string; scoresKey: string; metaKey: string; ttlPolicy: "unchanged"; }

## 5. Checklist — “Créer un parcours en 60 minutes”
1) Dupliquer `app/config/journeys/manifests/_template.manifest.ts` → `<pid>.manifest.ts`
2) Définir `id`, `slug`, `maturity`, `modules`
3) Brancher les pointeurs :
   - questions (si panorama/blocs)
   - copy (si engagement/intro/bilan)
   - resources/actions (si activés)
4) Ajouter un adapter minimal :
   - `app/adapters/bilan/<pid>.ts` (core-only au départ)
   - l’enregistrer via manifest (pas directement en dur)
5) Lancer :
   - `npm run --prefix frontend_nuxt typecheck`
   - `npm run --prefix frontend_nuxt bilan:guard`
   - `npm run --prefix frontend_nuxt journey:guard`
6) Vérifier en dev :
   - parcours → bilan global
   - export
   - reload (hydration agrégats)
7) Vérifier privacy :
   - aucun objet sérialisable n’inclut de “answersByQuestionId”, “questionId”, “pX_q”, “answers”, etc.

## 6. Hors-scope V1
- Unifier entièrement le moteur de scoring (on garde l’existant par parcours, mais alimenté par configs data).
- Backend / persistance serveur.
