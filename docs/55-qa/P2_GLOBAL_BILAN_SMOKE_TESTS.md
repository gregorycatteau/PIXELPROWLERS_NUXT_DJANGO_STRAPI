---
id: P2_GLOBAL_BILAN_SMOKE_TESTS
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

# P2 Global Bilan — Smoke tests (engine + adapter)

Scenarios rapides pour valider le flow P2 core (E1 -> E2 -> E3 + ressources).

## 1) E1 -> E2 -> E3
- Action: ouvrir `/parcours/parcours-p2` puis repondre a 1-2 questions.
- Attendu: E2 affiche un bilan panorama (3 axes, scores 0-100) + 3 priorites.
- Attendu: E3 affiche 3 ressources taggees P2.

## 2) Smoke script (CI/Local)
- Action: `bash frontend_nuxt/scripts/smoke/smoke-p2-value.sh`
- Attendu: statut 200 sur E2/E3, bilan non vide, actions presentes, ressources P2 uniquement.

## 3) Export + reload
- Action: ouvrir E2, copier l export, puis recharger la page.
- Attendu: export genere cote client, aucune reponse brute, recharge conserve les agregats.
