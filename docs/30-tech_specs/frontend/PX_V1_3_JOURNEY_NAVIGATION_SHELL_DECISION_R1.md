---
id: PX_V1_3_JOURNEY_NAVIGATION_SHELL_DECISION_R1
version: 1.0.0
status: active
date: 2025-12-27
owners: ["Dan"]
scope: ["docs/30-tech_specs/**"]
tags: ["tech_specs", "frontend", "journey", "navigation", "adr", "security"]
---

# PX V1.3 — Journey Navigation Shell (Decision R1)

## Objectif
Restaurer une navigation fiable sur les steps de parcours (E0 -> E1) tout en garantissant l'allowlist et le gating.

## Contexte
- Regression UX: l'intro E0 n'affiche plus de CTA vers E1.
- Les steps "shell" n'ont pas de CTA local et dependent de `PPJourneyStepShell`.
- Risque: navigation interne du shell peut bypasser le gating (ex: E2 sans panorama).

## Decision
1) **Navigation centralisee dans PPJourneyStepShell.**
   - Les steps ne dupliquent pas les CTA, sauf fallback explicite si le shell est absent.
2) **Allowlist stricte par schema.**
   - Toute navigation passe par une liste de steps definie par schema.
   - `?step` invalide -> fallback E0 (ou landing si `?landing=1`).
3) **Gating injecte par l'orchestrateur.**
   - `P1JourneyOrchestrator` expose une fonction `navigate(stepId)` securisee.
   - `PPJourneyStepShell` utilise l'injection si disponible; sinon fallback sur son `goToStep` interne.

## Consequences
- Les rules de gating restent centralisees (orchestrator/composable).
- Le shell reste le point unique de navigation UI.
- La resolution du composant shell doit etre robuste (imports explicites ou auto-import fiable).

## Non-negociables
- Aucun `v-html` / `innerHTML`.
- Erreurs neutres, pas de leakage.
- Navigation uniquement via allowlist du schema.

## References
- `docs/30-tech_specs/frontend/PX_V1_3_JOURNEY_NAVIGATION_SHELL_R1.md`
- `docs/30-tech_specs/frontend/PX_V1_3_PP_JOURNEY_STEP_SHELL_SPEC_V1.md`
