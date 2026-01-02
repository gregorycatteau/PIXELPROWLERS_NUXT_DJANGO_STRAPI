---
id: PX_V1_MAINTENANCE_BACKLOG_RESOURCES_P1
version: 1.0.0
status: active
date: 2026-01-02
owners: ["Jared", "Dan"]
scope: ["pixelprowlers.io", "ressources", "release"]
tags: ["maintenance", "supply-chain", "ci", "resources", "p1"]
---

# V1 Maintenance Backlog — Ressources P1

## Contexte
Release canonique : resources-p1-v1.0.1 (smoke OK, invariants V1 inchangés).

## Backlog (V1 maintenance)
1) **Signer les tags release (GPG)** + ajouter un **guard CI** qui refuse les tags non signés.
2) Ajouter un hook CI : **toute modification du registry ressources** déclenche un **smoke test** (preview build + checks essentiels).
3) **Warnings Tailwind sourcemap** : non bloquants en V1, à suivre mais ne doivent pas interrompre la fabrique de ressources.

## Invariants V1 (à ne pas casser)
- hard cap 10 published
- draft = 404 prod/preview
- recos deterministic pack-only <= 3
- no-URL tant que SafeLink n'existe pas
- related graph hub → children
---
