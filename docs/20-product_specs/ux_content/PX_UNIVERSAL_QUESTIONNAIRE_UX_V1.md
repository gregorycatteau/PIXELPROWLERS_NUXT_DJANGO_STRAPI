---
id: PX_UNIVERSAL_QUESTIONNAIRE_UX_V1
version: 1.0.0
status: active
date: 2025-12-24
owners: ["Talia", "Marty"]
scope: ["docs/20-product_specs/**"]
tags: ["product_specs", "ux_content"]
---

# PX Universal Questionnaire UX V1

## Statut
- Version: V1 (Sprint A)
- Portee: Frontend Nuxt, parcours P1 (reference), P2/P3 a venir
- Decision: Marty (OPTION A)

## Objectif
Industrialiser une UX questionnaire universelle, reutilisable et safe privacy, avant la production des parcours P2/P3.

## 1) Patterns UI obligatoires
### 1.0 Source unique de rendu
- Aucun layout bespoke par parcours.
- JourneyQuestionBlock est l'unique renderer questionnaire (titre + aide + likert + skip).

### 1.1 Echelle 1-5 en segmented control
- 5 segments alignes (pas de boutons empiles).
- Valeurs numeriques visibles (1..5).
- Labels textuels visibles.
- Comportement radio (selection unique) + navigation clavier (fleches).

Labels obligatoires:
1. Pas du tout d'accord
2. Plutôt pas d'accord
3. Mitigé
4. Plutôt d'accord
5. Tout à fait d'accord

### 1.2 Skip intentionnel visible
- Bouton explicite: "Ignorer cette question".
- Etat visuel indique (skipped) si selection null.
- Toujours present (skip always on, pas de desactivation par prop).

### 1.3 Progression
- Afficher la progression par question (ex: "Question 3 / 12") ou barre existante.
- Ne pas supprimer la progression existante.

## 2) Regles skip / missing
- value = null => skip intentionnel.
- undefined => non repondu.
- La validation d'etape doit accepter: au moins une reponse non-null.
- Le skip ne doit pas bloque l'avancement.

## 3) Privacy (non negociable)
Interdits explicites dans configs/VM/storage/export:
- mapping questionId -> reponse (answersByQuestionId, journeyAnswers, etc.)
- cles de type p1_q*, p2_q*, etc.
- objets serialisables contenant questionId, answers, responses, raw
- toute structure d'export contenant des reponses brutes

Autorise uniquement:
- agregats (scores, compteurs, themes, axes)
- meta de progression non sensible

## 4) Checklist A11y
- radiogroup + radios natifs
- navigation clavier fleches OK
- focus visible sur chaque segment
- aria-labelledby connecte au libelle de la question
- aria-describedby connecte a l'aide/skip si present
- texte visible suffisant pour comprendre l'echelle

## 5) Tests manuels
1. Panorama P1: selection 1-5 + skip, navigation clavier, focus visible.
2. Bloc P1: selection 1-5 + skip, au moins un bloc complet.
3. Validation: impossible si 0 reponse non-null.
4. Skip: valeur null, status "Mis de cote".
5. Storage: aucune reponse brute serialisee.
6. CI: typecheck + bilan:guard + journey:guard.
