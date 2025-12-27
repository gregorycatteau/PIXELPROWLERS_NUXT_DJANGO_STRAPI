---
id: PX_V1_3_RESOURCES_CATALOG_OPTION_B_DECISION
version: 1.3.0
status: draft
date: 2025-12-27
owners: ["Tom", "Eva"]
scope: ["backend_django", "api:v1", "resources"]
tags: ["backend", "resources", "catalog", "decision", "migration", "security"]
---

# Resources Catalog Option B — Decision & Migration Plan

Consulted: Bruce (data), Eva (security)

## Objectif
Definir la decision et le plan de migration vers un catalog de ressources en base (Option B), sans implementer la DB maintenant.

## Périmètre
- Backend Django / API v1.
- Modèle de données cible, indexation, et plan de migration.
- Sécurité d’ingestion et d’exposition.

## Out of scope
- Implémentation et déploiement des migrations en prod.
- Back-office d’édition, workflows et UI d’administration.
- Choix d’infra de recherche avancée.

## Pourquoi Option A maintenant
- Vitesse de delivery: catalogue versionne, pas de schema DB.
- Robustesse SSOT: source canonique unique, audit facile.
- Risque faible: pas d'admin, pas d'exposition de nouveaux vecteurs.

## Triggers de bascule vers Option B
- Volume > 200 ressources ou besoin d'edition frequente.
- Gouvernance editorialle (roles, workflow, historisation).
- Besoin de recherche avancee (full-text, ranking).
- Requirements multi-language ou segmentation fine.

## Modele de donnees cible (Option B)
### Resource
- id (UUID)
- slug (unique, index)
- title (index)
- summary (index)
- content (text, optionnel)
- category (FK vers Category)
- level (enum)
- journey (enum)
- type (enum)
- tags (M2M Tag)
- status (draft/published/archived)
- published_at, updated_at, created_at (indexes)

### Tag
- id, slug (unique), label, created_at

### Category
- id, slug (unique), label, created_at

Indexes recommends:
- Resource.slug (unique)
- Resource.published_at + status
- Tag.slug, Category.slug

## Sécurité
- Validation stricte des inputs (allowlists + clamp + NFKC/stripZW).
- Erreurs neutres (400/401/429).
- Logs sans PII et sans payload brut.
- Si liens externes: allowlist de domaines + schema http/https uniquement.

## Strategie de migration
1) Importer le catalog Option A (SSOT) vers DB.
2) Reproduire l'API actuelle (compat stricte /api/v1/resources/).
3) Activer une feature flag pour basculer la source (SSOT -> DB).
4) Rollback simple: retour au catalog SSOT.
5) Verifier ETag et pagination identiques.

## DoD
- Schema DB defini + migrations prêtes (mais non deployees).
- Import one-shot depuis SSOT vers DB documente.
- API compatible (meme schema, memes filtres).
- Plan rollback documente.
