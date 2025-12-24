---
id: SSOT_COVERAGE_MAP_V1
version: 1.0.0
status: active
date: 2025-12-24
owners: ["Jared", "Marty"]
scope: ["docs/**"]
tags: ["ssot", "coverage", "governance", "audit"]
---

# SSOT Coverage Map (V1)

## 1) Mission

Cette carte de couverture permet de **piloter la complétude documentaire** du SSOT PixelProwlers sans dérive. Elle identifie les zones documentées, les trous critiques, et les priorités de complétion. Document à mettre à jour à chaque sprint ou PR documentaire majeure.

---

## 2) Définitions

### 2.1 Document canonique vs non-canonique

| Type | Définition | Indicateurs |
|------|------------|-------------|
| **Canonique** | Source de vérité unique, référencé dans `ssot_registry.json`, status `active` ou `stable` | Frontmatter complet, ID unique, listé dans registry |
| **Non-canonique** | Brouillon, handoff, archive, ou doc non référencé | Status `draft`/`archived`, ou absent du registry |

### 2.2 Couverture

| État | Signification |
|------|---------------|
| ✅ **Couvert** | Doc canonique existant avec status `active`/`stable`, maintenu, owner identifié |
| ⚠️ **Partiel** | Doc existe mais incomplet, status `draft`, ou owner non assigné |
| ❌ **Non couvert** | Pas de doc canonique pour ce besoin, trou identifié |

---

## 3) Tableau de couverture par domaine

### 3.1 Foundations (00-foundations/)

| Sujet | Doc canonique | Status | Owner | Trou identifié |
|-------|---------------|--------|-------|----------------|
| Charte SSOT | `SSOT_RULEBOOK_V1.md` | ✅ active | Marty | - |
| DoD & Conventions | `DOCS_DOD_AND_CONVENTIONS_V1.md` | ✅ active | Marty | - |
| Coverage Map | `SSOT_COVERAGE_MAP_V1.md` | ✅ active | Marty | - |
| Environnements | `ENVIRONMENTS.md` | ✅ active | Marty | - |
| Setup DB | `DB_SETUP.md` | ✅ active | Marty | - |
| Phases dev | `PHASES_DEV.md` | ✅ active | Marty | - |
| Outils extraction | `UI_TEXTS_EXTRACTOR.md` | ✅ active | Marty | - |

**Couverture : 7/7 (100%)**

---

### 3.2 Vision & Roadmap (10-vision_roadmap/)

| Sujet | Doc canonique | Status | Owner | Trou identifié |
|-------|---------------|--------|-------|----------------|
| Vision produit | `vision_produit.md` | ⚠️ draft | Marty | Passer en active |
| Objectifs MVP | `mvp_objectives.md` | ⚠️ draft | Marty | Passer en active |
| Epics & Backlog | `epics_and_backlog.md` | ⚠️ draft | Marty | Structurer backlog V1.3 |
| Release notes | - | ❌ | Marty | **P2**: Créer RELEASE_NOTES_V1.md |

**Couverture : 3/4 (75%) — 1 trou P2**

---

### 3.3 Product Specs — Functional (20-product_specs/functional/)

| Sujet | Doc canonique | Status | Owner | Trou identifié |
|-------|---------------|--------|-------|----------------|
| P1 Panorama Model | `PX_V1_3_1_P1_PANORAMA_MODEL.md` | ✅ active | Marty | - |
| P1 Diagnostic Atelier | `PX_V1_3_P1_DIAGNOSTIC_ATELIER.md` | ✅ active | Marty | - |
| P1 Engagement Levels | `PX_V1_3_P1_ENGAGEMENT_LEVELS.md` | ✅ active | Marty | - |
| P1 Engagement Integration | `PX_V1_3_P1_ENGAGEMENT_INTEGRATION.md` | ✅ active | Marty | - |
| Operation 125 | `PX_V1_3_X_OPERATION_125_PRODUCT_SPEC.md` | ✅ active | Marty | - |
| Offre Formations | `PX_V1_3_X_OFFRE_FORMATIONS_ACCOMPAGNEMENT_OVERVIEW.md` | ✅ active | Marty | - |
| Engagement Public | `PX_V1_X_PIXELPROWLERS_ENGAGEMENT_LEVELS_PUBLIC.md` | ✅ active | Marty | - |
| Level 5 Internal | `PX_V1_X_PIXELPROWLERS_LEVEL5_INTERNAL_ONLY.md` | ⚠️ draft | Marty | Contenu interne |
| Homepage V1.3 Spec | - | ❌ | Marty | **P1**: Créer spec homepage V1.3 |

**Couverture : 8/9 (89%) — 1 trou P1**

---

### 3.4 Product Specs — User Stories (20-product_specs/user_stories/)

| Sujet | Doc canonique | Status | Owner | Trou identifié |
|-------|---------------|--------|-------|----------------|
| Homepage | `homepage_core_user_stories.md` | ⚠️ draft | Marty | Passer en active |
| Formulaire contact | `formulaire_contact.md` | ⚠️ draft | Marty | Passer en active |
| Parcours P1 | `PX_V1_3_PARCOURS_UTILISATEURS_P1.md` | ✅ active | Marty | - |
| Pages ressources | `pages_ressources.md` | ⚠️ draft | Marty | Passer en active |
| Operation 125 US | `PX_V1_3_X_OPERATION_125_USER_STORIES.md` | ✅ active | Marty | - |

**Couverture : 5/5 (100%) — drafts à promouvoir**

---

### 3.5 Product Specs — UX Content (20-product_specs/ux_content/)

| Sujet | Doc canonique | Status | Owner | Trou identifié |
|-------|---------------|--------|-------|----------------|
| P1 Panorama Narrative | `P1_PANORAMA_NARATIVE_TALIA.md` | ✅ active | Talia, Marty | - |
| P1 Blocks Narrative | `P1_BLOCKS_NARRATIVE_TALIA.md` | ✅ active | Talia, Marty | - |
| P1 Hypothèses | `PX_V1_3_1_P1_HYPOTHESES_STRUCTURANTES_COPY.md` | ✅ active | Talia, Marty | - |
| P1 Atterrissage | `PX_V1_3_1_P1_ATERRISSAGE_SYSTEMIQUE_COPY.md` | ✅ active | Talia, Marty | - |
| P1 System Scalpels | `PX_V1_3_1_P1_SYSTEM_SCALPELS_COPY.md` | ✅ active | Talia, Marty | - |
| Skip Signal Policy | `PX_SKIP_SIGNAL_POLICY_V1.md` | ✅ active | Talia, Marty | - |
| Questionnaire UX | `PX_UNIVERSAL_QUESTIONNAIRE_UX_V1.md` | ✅ active | Talia, Marty | - |
| Resources Library | `PX_V1_3_RESOURCES_LIBRARY_SPEC.md` | ✅ active | Talia, Marty | - |

**Couverture : 8/8 (100%)**

---

### 3.6 Product Specs — UX/UI & Design System (20-product_specs/ux_ui/)

| Sujet | Doc canonique | Status | Owner | Trou identifié |
|-------|---------------|--------|-------|----------------|
| UX Index | `UX_INDEX_V1.md` | ✅ active | Heider, Dan | - |
| DS Component Catalog | `DS_COMPONENT_CATALOG_V1.md` | ✅ active | Heider, Dan | - |
| DS Token Registry | `DS_TOKEN_REGISTRY_V1.md` | ✅ active | Heider, Dan | - |
| DS CSS Architecture | `DS_CSS_ARCHITECTURE_V1.md` | ✅ active | Heider, Dan | - |
| DS Badge Migration | `DS_BADGE_MIGRATION_AUDIT_V1.md` | ✅ active | Heider, Dan | - |
| DS Card Migration | `DS_CARD_MIGRATION_AUDIT_V1.md` | ✅ active | Heider, Dan | - |
| DS CTA Migration | `DS_CTA_MIGRATION_AUDIT_V1.md` | ✅ active | Heider, Dan | - |
| DS PageHeader Migration | `DS_PAGEHEADER_MIGRATION_AUDIT_V1.md` | ✅ active | Heider, Dan | - |
| DS SectionHeader Migration | `DS_SECTIONHEADER_MIGRATION_AUDIT_V1.md` | ✅ active | Heider, Dan | - |
| DS Questionnaire Migration | `DS_QUESTIONNAIRE_MIGRATION_AUDIT_V1.md` | ✅ active | Heider, Dan | - |

**Couverture : 10/10 (100%)**

---

### 3.7 Product Specs — Schemas (20-product_specs/schemas/)

| Sujet | Doc canonique | Status | Owner | Trou identifié |
|-------|---------------|--------|-------|----------------|
| P1 Question Schema | `PX_V1_3_P1_QUESTION_SCHEMA.md` | ✅ active | Dan, Marty | - |
| Action Plan Schema | - | ❌ | Dan, Marty | **P2**: Créer PX_V1_3_ACTION_PLAN_SCHEMA.md |

**Couverture : 1/2 (50%) — 1 trou P2**

---

### 3.8 Tech Specs — Frontend (30-tech_specs/frontend/)

| Sujet | Doc canonique | Status | Owner | Trou identifié |
|-------|---------------|--------|-------|----------------|
| Journey Engine | `PX_JOURNEY_ENGINE_UNIVERSAL_V1.md` | ✅ active | Dan | - |
| Journeys Manifest | `DOCTRINE_UNIVERSAL_JOURNEYS_MANIFEST_V1.md` | ✅ active | Dan | - |
| Create Journey Guide | `PX_CREATE_JOURNEY_IN_60_MINUTES.md` | ✅ active | Dan | - |
| Bilan Engine Adapter | `BILAN_ENGINE_ADAPTER_GUIDE.md` | ✅ active | Dan | - |
| P1 Bilan Refactor | `P1_GLOBAL_BILAN_REFACTOR_AUDIT.md` | ✅ active | Dan | - |
| No v-html Doctrine | `PX_NO_VHTML_DOCTRINE_V1.md` | ✅ active | Dan | - |
| Journeys Overview | `journeys.md` | ⚠️ draft | Dan | Passer en active |

**Couverture : 7/7 (100%)**

---

### 3.9 Tech Specs — Backend (30-tech_specs/backend/)

| Sujet | Doc canonique | Status | Owner | Trou identifié |
|-------|---------------|--------|-------|----------------|
| API Django Spec | - | ❌ | Tom | **P1**: Créer API_SPEC_V1.md |
| Data Models | - | ❌ | Tom | **P2**: Créer DATA_MODELS_V1.md |

**Couverture : 0/2 (0%) — Zone critique**

---

### 3.10 Tech Specs — CMS (30-tech_specs/cms/)

| Sujet | Doc canonique | Status | Owner | Trou identifié |
|-------|---------------|--------|-------|----------------|
| Strapi Configuration | - | ❌ | Dan | **P2**: Créer STRAPI_CONFIG_V1.md |
| Content Types | - | ❌ | Dan | **P2**: Créer CONTENT_TYPES_V1.md |

**Couverture : 0/2 (0%) — Zone faible**

---

### 3.11 Tech Specs — Quality (30-tech_specs/quality/)

| Sujet | Doc canonique | Status | Owner | Trou identifié |
|-------|---------------|--------|-------|----------------|
| Coding Rulebook | `CODING_RULEBOOK_V1.md` | ✅ active | Eva, Dan | - |
| Testing & Validation | `testing_and_validation.md` | ⚠️ draft | Eva, Dan | Passer en active |
| Performance Tracking | `performance_tracking.md` | ⚠️ draft | Eva, Dan | Passer en active |
| Mobile Accessibility | `mobile_accessibility.md` | ⚠️ draft | Eva, Dan | Passer en active |
| SEO Technical | `seo.md` | ⚠️ draft | Eva, Dan | Passer en active |

**Couverture : 5/5 (100%) — drafts à promouvoir**

---

### 3.12 Security (40-security/)

| Sujet | Doc canonique | Status | Owner | Trou identifié |
|-------|---------------|--------|-------|----------------|
| Security Index | `SECURITY_INDEX.md` | ✅ active | Eva, Dan | - |
| Architecture Sécurité | `ARCHITECTURE_SECURITE.md` | ✅ active | Eva, Dan | - |
| Modèles de Menaces | `MODELES_DE_MENACES.md` | ✅ active | Eva, Dan | - |
| Politiques OpSec | `POLITIQUES_OPSEC_PRIVACY.md` | ✅ active | Eva, Dan | - |
| Security Gates | `SECURITY_GATES.md` | ✅ active | Eva, Dan | - |
| Logs & Backups | `LOGS_BACKUPS_ACCES.md` | ✅ active | Eva, Dan | - |
| Guards Registry | `contracts/PX_V1_3_SECURITY_GUARDS_REGISTRY.md` | ✅ active | Eva, Dan | - |
| Deeplinks DOM Guards | `contracts/PX_V1_3_SECURITY_P0_DEEPLINKS_DOM_GUARDS.md` | ✅ active | Eva, Dan | - |
| Incident Response | - | ❌ | Eva, Dan | **P0**: Créer INCIDENT_RESPONSE_V1.md |

**Couverture : 8/9 (89%) — 1 trou P0**

---

### 3.13 QA (55-qa/)

| Sujet | Doc canonique | Status | Owner | Trou identifié |
|-------|---------------|--------|-------|----------------|
| QA Index | `QA_INDEX.md` | ✅ active | Dan, Eva | - |
| CI Checklist | `CI_CHECKLIST.md` | ✅ active | Dan, Eva | - |
| Journey Engine Tests | `PX_JOURNEY_ENGINE_SMOKE_TESTS.md` | ✅ active | Dan, Eva | - |
| P1 Journey Tests | `PX_P1_JOURNEY_TESTS.md` | ✅ active | Dan, Eva | - |
| P1-P4 Bilan Tests | `P1_GLOBAL_BILAN_SMOKE_TESTS.md` + P2/P3/P4 | ✅ active | Dan, Eva | - |
| Engagement Tests | `ENGAGEMENT_N1_N4_SMOKE_TESTS.md` | ✅ active | Dan, Eva | - |
| Resources Panel Tests | `RESOURCES_ACTIONS_PANEL_SMOKE_TESTS.md` | ✅ active | Dan, Eva | - |
| Security Guards Tests | `SECURITY_GUARDS_SMOKE_TESTS.md` | ✅ active | Dan, Eva | - |

**Couverture : 11/11 (100%)**

---

### 3.14 Measurement (50-measurement/)

| Sujet | Doc canonique | Status | Owner | Trou identifié |
|-------|---------------|--------|-------|----------------|
| Measurement Plan | `measurement_plan.md` | ⚠️ draft | Claire, Marty | Passer en active |
| KPIs Dashboard | `kpis_and_dashboard.md` | ⚠️ draft | Claire, Marty | Passer en active |
| User Feedback | `user_feedback.md` | ⚠️ draft | Claire, Marty | Passer en active |

**Couverture : 3/3 (100%) — drafts à promouvoir**

---

### 3.15 Legal (60-legal/)

| Sujet | Doc canonique | Status | Owner | Trou identifié |
|-------|---------------|--------|-------|----------------|
| RGPD Compliance | `rgpd_compliance.md` | ⚠️ draft | Marty | Passer en active |
| Terms of Service | `terms_of_service.md` | ⚠️ draft | Marty | Passer en active |
| Privacy Policy | - | ❌ | Marty | **P1**: Créer PRIVACY_POLICY_V1.md |

**Couverture : 2/3 (67%) — 1 trou P1**

---

### 3.16 SEO (70-seo/)

| Sujet | Doc canonique | Status | Owner | Trou identifié |
|-------|---------------|--------|-------|----------------|
| Sprint 0 Context | `SPRINT0_CONTEXT_PIXELPROWLERS.md` | ⚠️ draft | Rand, Julien | Passer en active |
| Sprint 0 Files | `SPRINT0_FILES_FOR_SEO.md` | ⚠️ draft | Rand, Julien | Passer en active |
| SEO Strategy V1.3 | - | ❌ | Rand, Julien | **P2**: Créer SEO_STRATEGY_V1.3.md |

**Couverture : 2/3 (67%) — 1 trou P2**

---

## 4) Top Trous par Priorité

### P0 — Sécurité / Incidents (à traiter immédiatement)

| # | Domaine | Trou | Owner | Impact |
|---|---------|------|-------|--------|
| 1 | Security | INCIDENT_RESPONSE_V1.md | Eva, Dan | Procédure en cas de breach/incident |

### P1 — Scale Exécution (avant prochain sprint)

| # | Domaine | Trou | Owner | Impact |
|---|---------|------|-------|--------|
| 1 | Backend | API_SPEC_V1.md | Tom | Doc API Django pour intégrations |
| 2 | Functional | Homepage V1.3 Spec | Marty | Spec fonctionnelle page d'accueil |
| 3 | Legal | PRIVACY_POLICY_V1.md | Marty | Conformité RGPD utilisateurs |

### P2 — Nice-to-Have (backlog)

| # | Domaine | Trou | Owner | Impact |
|---|---------|------|-------|--------|
| 1 | Roadmap | RELEASE_NOTES_V1.md | Marty | Changelog utilisateurs |
| 2 | Schemas | PX_V1_3_ACTION_PLAN_SCHEMA.md | Dan, Marty | Schema action plan |
| 3 | Backend | DATA_MODELS_V1.md | Tom | Documentation modèles Django |
| 4 | CMS | STRAPI_CONFIG_V1.md | Dan | Configuration Strapi |
| 5 | CMS | CONTENT_TYPES_V1.md | Dan | Content types Strapi |
| 6 | SEO | SEO_STRATEGY_V1.3.md | Rand, Julien | Stratégie SEO consolidée |

---

## 5) Méthode d'entretien

### 5.1 Quand mettre à jour cette map

- **Sprint review** : Vérifier les trous P0/P1 restants
- **Création doc canonique** : Ajouter dans le tableau correspondant
- **Changement de status** : Mettre à jour (draft → active)
- **PR documentaire majeure** : Réviser les zones impactées

### 5.2 Impact PR sur la map

```
Si PR crée/modifie un doc dans docs/ :
  1. Vérifier que le doc est listé dans cette map
  2. Mettre à jour le status si changement
  3. Si nouveau doc, l'ajouter au tableau du domaine
  4. Recalculer le % de couverture
```

---

## 6) KPIs de Couverture SSOT

| KPI | Valeur actuelle | Cible | Status |
|-----|-----------------|-------|--------|
| Total docs canoniques | 8 (dans registry) | - | 📊 |
| Total fichiers .md actifs | 92 | - | 📊 |
| Trous P0 | 1 | 0 | 🔴 |
| Trous P1 | 3 | 0 | 🟠 |
| Trous P2 | 6 | - | 🟡 |
| Zones à 100% | 9/16 | 16/16 | ⚠️ |
| Zones à 0% | 2 (backend, cms) | 0 | 🔴 |
| Drafts à promouvoir | ~15 | 0 | 🟡 |

### Calcul couverture globale

```
Couverts: 72 docs
Partiels (drafts): 15 docs
Non couverts: 10 trous identifiés

Couverture estimée: 72/97 = 74%
Cible V1.3: 90%
```

---

## Références

- [SSOT_RULEBOOK_V1](./SSOT_RULEBOOK_V1.md) — Règles fondamentales SSOT
- [DOCS_DOD_AND_CONVENTIONS_V1](./DOCS_DOD_AND_CONVENTIONS_V1.md) — DoD et conventions docs
- [ssot_registry.json](./ssot_registry.json) — Registre machine-readable
