---
id: PX_V1_3_JOURNEY_NAVIGATION_SHELL_R1
version: 1.0.0
status: active
date: 2025-12-27
owners: ["Dan", "Marty"]
scope: ["docs/30-tech_specs/**"]
tags: ["tech_specs", "frontend", "journey", "navigation"]
---

# PX V1.3 — Navigation universelle Step Shell (R1)

## Symptome
Sur `/parcours/:journeySlug?step=E0_intro`, l intro s affiche mais aucun CTA ne permet d avancer vers le panorama.

## Root cause
Les steps “shell” n avaient pas de navigation universelle par defaut, et le CTA etait gere localement dans les steps.

## Fix
- `PPJourneyStepShell` calcule `prev/next` via le schema du parcours et le `step` courant.
- Un CTA par defaut (Commencer/Continuer + Retour) est rendu si aucun footer custom n est fourni.

## Regles de navigation universelle
- Allowlist stricte des steps (schema only).
- `step` invalide -> fallback sur le premier step (E0_intro).
- Navigation via router avec `?step=<nextStepId>` sur la meme page.

## Securite
- Aucun `v-html`, `innerHTML`, `insertAdjacentHTML`.
- Steps allowlistes uniquement (pas de step arbitraire).

