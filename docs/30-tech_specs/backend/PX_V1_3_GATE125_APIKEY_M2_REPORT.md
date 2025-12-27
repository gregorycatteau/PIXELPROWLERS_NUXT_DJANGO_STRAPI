---
id: PX_V1_3_GATE125_APIKEY_M2_REPORT
version: 1.3.0
status: active
date: 2025-12-27
owners: ["Tom", "Eva"]
scope: ["backend_django", "api:v1", "gate125"]
tags: ["backend", "gate125", "auth", "api-key", "privacy", "security"]
---

# Gate125 API Key — Report M2

## Objectif
Fermer `/api/v1/gate125/register/` via une auth API Key minimaliste, privacy‑first.

## Scope
- Auth API Key Gate125 (Authorization: Api-Key / X-API-Key).
- Réponses 401 neutres, comparaison constant‑time, clés configurables.

## Implémentation
- Permission DRF `Gate125ApiKeyPermission` + exception 401 neutre.
- Validation stricte du format (ASCII visible, sans espaces).
- Hash SHA256 côté serveur et comparaison constant‑time.
- Rotation simple via liste de clés/hashes dans settings.

## Tests
- Intégration DRF: no key / bad key / good key.

## Risques & mitigations
- Brute‑force clé: rate limit + cooldown existants, clé longue recommandée.
- Leak via logs: aucune clé loggée, pas de payload brut.
- Header smuggling: format strict + rejet caractères non ASCII.

## Commandes validation
```bash
cd backend_django && python -m pytest -q && cd ..
python3 tools/ssot_lint.py --strict
python3 tools/ssot_linkcheck.py --strict
python3 tools/openapi_validate.py
```

## Fichiers touchés
- `backend_django/apps/gate125/auth.py`
- `backend_django/apps/gate125/views.py`
- `backend_django/pixel_backend/settings/base.py`
- `backend_django/tests/test_api_integration.py`
- `docs/30-tech_specs/backend/API_SPEC_V1.md`
- `docs/30-tech_specs/backend/openapi.v1.yaml`
