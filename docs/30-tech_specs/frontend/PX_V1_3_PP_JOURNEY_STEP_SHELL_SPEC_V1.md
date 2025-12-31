---
id: PX_V1_3_PP_JOURNEY_STEP_SHELL_SPEC_V1
version: 1.0.0
status: active
date: 2025-12-27
owners: ["Dan"]
scope: ["docs/30-tech_specs/**"]
tags: ["tech_specs", "frontend", "journey", "navigation", "spec"]
---

# PX V1.3 — PPJourneyStepShell Spec (V1)

## Objectif
Definir l'API et les responsabilites de `PPJourneyStepShell` pour assurer une navigation fiable et securisee entre steps.

## Scope
- Steps "shell" (intro, bilan, ressources) du parcours.
- Exclusion: steps questionnaire/bilan specialises qui possedent leur propre shell.

## API
### Props (public)
- `density`: `'compact' | 'default' | 'comfort'` (defaut: `default`)
- `align`: `'center' | 'wide'` (defaut: `center`)
- `as`: `'section' | 'main' | 'article'` (defaut: `section`)
- `ariaLabelledby`: `string | undefined`
- `focusTargetId`: `string | undefined`
- `withCard`: `boolean` (defaut: `false`)
- `showNav`: `boolean` (defaut: `true`)
- `nextLabel`: `string | undefined`
- `prevLabel`: `string | undefined` (defaut: `Retour`)

### Slots
- `header`: facultatif
- default slot: body
- `footer`: facultatif; si present, la nav par defaut est masquee

### Injection (navigation)
- `ppJourneyNavigate` (function)
  - Signature: `(stepId: string) => void`
  - Source: `P1JourneyOrchestrator` ou orchestrateur universel.
  - Objectif: garantir l'allowlist + gating avant navigation.

## Navigation par defaut
- `PPJourneyStepShell` calcule `prevStepId` / `nextStepId` depuis le schema.
- `showDefaultNav` == `showNav` **et** aucun `footer` **et** au moins un step voisin.
- Les CTA par defaut utilisent:
  - `ppJourneyNavigate` si injecte,
  - sinon `goToStep` interne (allowlist uniquement).

## Securite
- `?step` est allowliste par schema (orchestrateur/page).
- Aucune navigation vers un step hors schema.
- Aucun rendu HTML non sanitise (pas de `v-html`).

## Etats & UX
- Si aucun `prev/next`, pas de nav visible.
- Labels par defaut:
  - `Commencer` si `E0_*`
  - `Continuer` sinon
- Focus management optionnel via `focusTargetId`.

## Definition of Done
- E0 affiche un CTA Next via le shell.
- Le shell utilise la navigation securisee injectee quand disponible.
- Regression guard detecte la disparition du shell/nav sur E0.
