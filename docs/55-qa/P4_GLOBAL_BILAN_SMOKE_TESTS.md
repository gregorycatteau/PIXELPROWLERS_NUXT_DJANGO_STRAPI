---
id: P4_GLOBAL_BILAN_SMOKE_TESTS
version: 1.0.0
status: active
date: 2026-01-08
owners: ["Marty"]
scope:
  - docs/55-qa/**
tags:
  - qa
  - testing
  - p4
---

# P4 Global Bilan — Smoke tests

## 1) Smoke script (CI/Local)
- Action: `bash frontend_nuxt/scripts/smoke/smoke-p4-value.sh`
- Attendu:
  - status 200 sur `/parcours/parcours-p4`
  - score global 0-100
  - au moins 2 priorites
  - au moins 1 ressource taggee p4
