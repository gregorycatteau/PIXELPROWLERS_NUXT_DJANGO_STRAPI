---
id: P3_GLOBAL_BILAN_SMOKE_TESTS
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

# P3 Global Bilan — Smoke tests (engine + adapter)

## 1) E1 -> E2 -> Global
- Action: ouvrir `/parcours/je-suis-en-transition` puis repondre a 1-2 questions.
- Attendu: E2 affiche un bilan panorama (scores par axe), bouton vers bilan global OK.

## 2) Skip signal (Option C)
- Action: ignorer 2 questions d un meme axe, aller en E2 puis Global Bilan.
- Attendu: bandeau skip global visible; mention par axe si seuil atteint.

## 3) Export + reload
- Action: ouvrir Global Bilan, copier l export, puis recharger la page.
- Attendu: export genere cote client, aucune reponse brute, recharge conserve les agregats.
