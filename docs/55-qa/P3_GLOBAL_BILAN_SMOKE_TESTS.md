---
id: P3_GLOBAL_BILAN_SMOKE_TESTS
version: 1.0.0
status: active
date: 2026-01-08
owners: ["Marty"]
scope:
  - docs/55-qa/**
tags:
  - qa
  - testing
  - p3
---

# P3 Global Bilan — Smoke tests

## 1) Smoke script (CI/Local)
- Action: `bash frontend_nuxt/scripts/smoke/smoke-p3-value.sh`
- Attendu:
  - status 200 sur `/parcours/parcours-p3`
  - score global 0-100
  - au moins 2 priorites
  - 3 a 5 cartes action
  - recos ressources taggees p3 uniquement
