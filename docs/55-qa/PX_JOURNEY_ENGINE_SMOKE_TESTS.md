---
id: PX_JOURNEY_ENGINE_SMOKE_TESTS
version: 1.0.0
status: active
date: 2025-12-24
owners: ["Dan", "Eva"]
  - Marty
scope:
  - docs/55-qa/**
tags:
  - qa
  - testing
---

# PX Journey Engine — Smoke tests (P1/P2/P3/P4)

Checklist rapide pour valider le moteur universel et le pipeline bilan (E0 -> E1 -> E2 -> Global).

## P1 (legacy)
- Parcours: `/parcours/ma-structure-dysfonctionne?step=E0_intro`.
- E0 -> E1 -> E2 -> Global: progresser jusqu au bilan global.
- Skip signal (Option C): ignorer plusieurs questions d un axe, verifier signal en E2 puis Global.
- Reload + export: recharger Global Bilan, export reste agrege (pas de reponses brutes).

## P2 (universal)
- Parcours: `/parcours/nos-outils-numeriques-nous-epuisent`.
- E0 -> E1 -> E2 -> Global: repondre a 1-2 questions, verifier affichage des scores par axe.
- Skip signal (Option C): ignorer 2 questions d un meme axe, verifier signal en E2 puis Global.
- Reload + export: recharger Global Bilan, export reste agrege.

## P3 (universal)
- Parcours: `/parcours/je-suis-en-transition`.
- E0 -> E1 -> E2 -> Global: repondre a 1-2 questions, verifier affichage des scores par axe.
- Skip signal (Option C): ignorer 2 questions d un meme axe, verifier signal en E2 puis Global.
- Reload + export: recharger Global Bilan, export reste agrege.

## P4 (universal)
- Parcours: `/parcours/parcours-60-minutes`.
- E0 -> E1 -> E2 -> Global: repondre a 1-2 questions, verifier affichage des scores par axe.
- Skip signal (Option C): ignorer 2 questions d un meme axe, verifier signal en E2 puis Global.
- Reload + export: recharger Global Bilan, export reste agrege.
