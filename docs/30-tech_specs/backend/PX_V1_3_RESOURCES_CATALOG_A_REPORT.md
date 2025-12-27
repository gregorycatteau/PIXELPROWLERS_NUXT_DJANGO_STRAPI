---
id: PX_V1_3_RESOURCES_CATALOG_A_REPORT
version: 1.3.0
status: active
date: 2025-12-27
owners: ["Tom", "Eva"]
scope: ["backend_django", "api:v1", "resources"]
tags: ["backend", "resources", "catalog", "report", "privacy", "security"]
---

# Resources Catalog V1 — Report A

## Objectif
Publier un catalogue SSOT‑backed via `/api/v1/resources/` avec filtres safe.

## Scope
- Chargement catalog depuis SSOT.
- Filtres: q, tags, category, level, journey, limit, offset.
- ETag sur le catalog.

## Implementation
- Validation stricte (allowlists + clamp + NFKC/stripZW).
- Reponses neutres (400).
- Liens relatifs `/ressources/<slug>`.

## Tests
- 200 + schema minimal.
- Filtres valides.
- Params invalides -> 400 neutre.

## DoD
- Endpoint `/api/v1/resources/` conforme OpenAPI.
- Validation stricte + erreurs neutres.
- Tests d'integration verts.

## Risques & mitigations
- Input hostile -> validation stricte.
- URLs dangereuses -> path relatif derive du slug.

## Commandes validation
```bash
cd backend_django && PATH=.venv/bin:$PATH python -m pytest -q && cd ..
python3 tools/ssot_lint.py --strict
python3 tools/ssot_linkcheck.py --strict
python3 tools/openapi_validate.py
```

## Fichiers touches
- `docs/20-product_specs/ux_content/PX_V1_3_RESOURCES_CATALOG_V1.json`
- `docs/30-tech_specs/backend/PX_V1_3_RESOURCES_CATALOG_A_SPEC.md`
- `backend_django/apps/resources/catalog.py`
- `backend_django/apps/resources/views.py`
- `backend_django/tests/test_resources_api.py`
- `docs/30-tech_specs/backend/API_SPEC_V1.md`
- `docs/30-tech_specs/backend/openapi.v1.yaml`
