---
id: PX_V1_3_BACKEND_TESTS_DECISION_V1
version: 1.3.0
status: draft
date: 2025-12-27
owners: ["Tom"]
scope: ["backend_django", "api:v1", "tests"]
tags: ["backend", "tests", "pytest", "decision", "privacy", "security"]
---

# Backend Tests Decision (V1.3)

## Objectif
Fixer la décision de stack de tests backend pour V1.3 et cadrer la compatibilité CI.

## Périmètre
- ✅ Tests d'intégration DRF (APIClient) pour endpoints V1 publics.
- ✅ Configuration pytest pour Django (settings module de test).

## Out of scope
- ❌ Tests e2e frontend.
- ❌ Tests de charge/perf.
- ❌ Décision cache prod (Redis) et fail‑closed.

## Décision
- **Adopter pytest-django maintenant** pour les tests d'intégration backend.
- **Redis en prod plus tard** (hors scope de cette décision).
- **Fail-closed** en prod **à décider** après validation infra et monitoring.

## Justification (ROI++)
- Réduit les régressions API en prod (health/contact/resources).
- Supprime le warning de config pytest, clarifie le module settings de test.
- Sécurise le comportement “erreurs neutres” et honeypot.

## Menaces & mitigations (consult Eva)
- Menace: tests insuffisants -> faux sentiment de sécurité.
  - Mitigation: tests d'intégration ciblés sur 400/429/201 neutres.
- Menace: logs/PII exposés via fixtures.
  - Mitigation: aucune donnée sensible dans les asserts, payloads minimaux.

## DoD
- pytest-django installé en dev deps.
- `DJANGO_SETTINGS_MODULE` reconnu sans warning.
- 2–3 tests DRF d'intégration verts.

## Références
- `docs/30-tech_specs/backend/API_SPEC_V1.md`
- `docs/30-tech_specs/backend/openapi.v1.yaml`
- `docs/30-tech_specs/backend/PX_V1_3_BACKEND_MVP_M1_REPORT.md`
- `docs/40-security/INCIDENT_RESPONSE_V1.md`
