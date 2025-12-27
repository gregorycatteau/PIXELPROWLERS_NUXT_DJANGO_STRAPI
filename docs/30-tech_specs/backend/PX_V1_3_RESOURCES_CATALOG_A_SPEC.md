---
id: PX_V1_3_RESOURCES_CATALOG_A_SPEC
version: 1.3.0
status: active
date: 2025-12-27
owners: ["Tom", "Eva"]
scope: ["backend_django", "api:v1", "resources"]
tags: ["backend", "resources", "catalog", "ssot", "security", "privacy"]
---

# Resources Catalog V1 — Option A (SSOT‑backed)

## Objectif
Servir un catalogue de ressources versionne via un fichier SSOT machine‑readable, sans DB ni CMS.

## Perimetre
- Source canonique: `docs/20-product_specs/ux_content/PX_V1_3_RESOURCES_CATALOG_V1.json`
- Endpoint public: `GET /api/v1/resources/`

## Out of scope
- DB/CMS/admin.
- Recherche full‑text serveur.
- URLs externes vers des ressources.

## Format du catalog
- `version`: semver.
- `resources[]`:
  - `id`, `slug`, `title`, `summary`
  - `tags[]`, `category`, `level`, `journey`, `type`

## Validation & securite
- Params query allowlist + clamp + NFKC/stripZW.
- Erreurs neutres (400/429).
- Aucune URL dangereuse: on renvoie `path` relatif `/ressources/<slug>`.
- Logs no‑PII.
