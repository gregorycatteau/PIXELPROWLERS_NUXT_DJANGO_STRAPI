# 55 Qa — Index

> **Périmètre** : Checklists, smoke tests

<!-- GENERATED:START -->
<!-- ⚠️ Section générée automatiquement par ssot_generate_indexes.py — 2026-01-08 -->

## Documents

| Document | Status | Description |
|----------|--------|-------------|
| [CI_CHECKLIST.md](./CI_CHECKLIST.md) | active | CI Checklist — Bilan Engine |
| [ENGAGEMENT_N1_N4_SMOKE_TESTS.md](./ENGAGEMENT_N1_N4_SMOKE_TESTS.md) | active | Engagement N1-N4 — Smoke tests |
| [P1_GLOBAL_BILAN_SMOKE_TESTS.md](./P1_GLOBAL_BILAN_SMOKE_TESTS.md) | active | P1 Global Bilan — Smoke tests (adapter/engine) |
| [P2_GLOBAL_BILAN_SMOKE_TESTS.md](./P2_GLOBAL_BILAN_SMOKE_TESTS.md) | active | P2 Global Bilan — Smoke tests (engine + adapter) |
| [P3_GLOBAL_BILAN_SMOKE_TESTS.md](./P3_GLOBAL_BILAN_SMOKE_TESTS.md) | active | P3 Global Bilan — Smoke tests |
| [P4_GLOBAL_BILAN_SMOKE_TESTS.md](./P4_GLOBAL_BILAN_SMOKE_TESTS.md) | active | P4 Global Bilan — Smoke tests |
| [P5_GLOBAL_BILAN_SMOKE_TESTS.md](./P5_GLOBAL_BILAN_SMOKE_TESTS.md) | active | P5 Global Bilan Smoke Tests |
| [PX_JOURNEY_ENGINE_SMOKE_TESTS.md](./PX_JOURNEY_ENGINE_SMOKE_TESTS.md) | active | PX Journey Engine — Smoke tests (P1/P2/P3/P4) |
| [PX_P1_JOURNEY_TESTS.md](./PX_P1_JOURNEY_TESTS.md) | active | PX P1 — Script de tests manuels |
| [PX_QA_NO_TECH_REVEAL_R1.md](./PX_QA_NO_TECH_REVEAL_R1.md) | active | PX QA - No Tech Reveal (R1) |
| [PX_QA_RESOURCES_CANONICAL_R1.md](./PX_QA_RESOURCES_CANONICAL_R1.md) | active | PX QA — Resources Canonicalization (R1) |
| [PX_QA_RESOURCES_PACK_PUBLISH_PROCEDURE_V1.md](./PX_QA_RESOURCES_PACK_PUBLISH_PROCEDURE_V1.md) | active | Procedure — Publish a Resource Pack (P1) |
| [PX_V1_MAINTENANCE_BACKLOG_RESOURCES_P1.md](./PX_V1_MAINTENANCE_BACKLOG_RESOURCES_P1.md) | active | V1 Maintenance Backlog — Ressources P1 |
| [QA_INDEX.md](./QA_INDEX.md) | draft | 55 Qa — Index |
| [RESOURCES_ACTIONS_PANEL_SMOKE_TESTS.md](./RESOURCES_ACTIONS_PANEL_SMOKE_TESTS.md) | active | Resources & Actions Panel — Smoke tests |
| [SECURITY_GUARDS_SMOKE_TESTS.md](./SECURITY_GUARDS_SMOKE_TESTS.md) | active | Security Guards — Smoke tests |

**Owners** : Dan, Eva

<!-- GENERATED:END -->

<!-- KEEP -->
## CI Guards (R1)

- `frontend_nuxt/scripts/guards/no-tech-reveal-r1.mjs` — bloque les termes techniques visibles côté UI.
- `frontend_nuxt/scripts/guards/journey-schema-integrity-r1.mjs` — vérifie l’intégrité minimale des schemas/parcours.
- `frontend_nuxt/scripts/guards/journey-prod-p1-only-r1.mjs` — guard prod visibility-driven (prod=visibility: "prod").

## Smoke scripts (ops)

- `frontend_nuxt/scripts/smoke/smoke-journey-dev-allowlist.sh`
- `frontend_nuxt/scripts/smoke/smoke-journey-prod-p1-only.sh` — smoke prod visibility-driven.
- `bash frontend_nuxt/scripts/smoke/smoke-journey-dev-allowlist.sh`
- `bash frontend_nuxt/scripts/smoke/smoke-journey-prod-p1-only.sh`
<!-- ENDKEEP -->

---

**Parent** : [docs/README.md](../README.md)
