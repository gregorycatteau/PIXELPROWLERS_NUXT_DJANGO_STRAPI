# PixelProwlers — Documentation SSOT

> **Single Source of Truth** — Toute la documentation canonique du projet.

---

## 📁 Structure de la documentation

| Dossier | Description | Index |
|---------|-------------|-------|
| **00-foundations/** | Règles fondamentales, conventions, SSOT rulebook | [README](./00-foundations/README.md) |
| **10-vision_roadmap/** | Vision produit, roadmap, épics et backlog | [README](./10-vision_roadmap/README.md) |
| **20-product_specs/** | Spécifications fonctionnelles, user stories, UX/UI | [README](./20-product_specs/README.md) |
| **30-tech_specs/** | Spécifications techniques (backend, frontend, CMS) | [README](./30-tech_specs/README.md) |
| **40-security/** | Sécurité, gates, contrats, incident response | [README](./40-security/README.md) |
| **50-measurement/** | KPIs, dashboard, feedback utilisateur | [README](./50-measurement/README.md) |
| **55-qa/** | Tests, smoke tests, CI checklist | [README](./55-qa/QA_INDEX.md) |
| **60-legal/** | RGPD, CGU, politique de confidentialité | [README](./60-legal/README.md) |
| **70-seo/** | Stratégie SEO, fichiers techniques | [README](./70-seo/README.md) |
| **90-placeholders_archive/** | Drafts et archives (hors scope actif) | [README](./90-placeholders_archive/README.md) |
| **99_handoff/** | Documents de passation inter-équipes | [README](./99_handoff/README.md) |

---

## 🔧 Outillage SSOT

```bash
# Depuis la racine du projet
make ssot-lint          # Lint des frontmatters YAML
make ssot-lint-strict   # Lint strict (bloquant)
make ssot-linkcheck     # Vérification des liens internes
make ssot-index-check   # Vérification des README d'index
make ssot-index-apply   # Régénération des README d'index
make ssot-check         # Tous les checks SSOT
```

### Outils disponibles

| Outil | Fonction |
|-------|----------|
| `tools/ssot_lint.py` | Lint des frontmatters YAML |
| `tools/ssot_linkcheck.py` | Vérification des liens Markdown |
| `tools/ssot_generate_indexes.py` | Génération des README d'index |
| `tools/ssot_create_doc.py` | Création de nouveaux documents |
| `tools/add_frontmatter.py` | Ajout de frontmatter aux fichiers existants |
| `tools/openapi_validate.py` | Validation de la spec OpenAPI |

---

## 📚 Documents clés

### Fondations
- [SSOT_RULEBOOK_V1.md](./00-foundations/SSOT_RULEBOOK_V1.md) — Règles canoniques du SSOT
- [DOCS_DOD_AND_CONVENTIONS_V1.md](./00-foundations/DOCS_DOD_AND_CONVENTIONS_V1.md) — Definition of Done documentation
- [SSOT_COVERAGE_MAP_V1.md](./00-foundations/SSOT_COVERAGE_MAP_V1.md) — Cartographie de couverture

### Produit
- [vision_produit.md](./10-vision_roadmap/vision_produit.md) — Vision et positionnement
- [mvp_objectives.md](./10-vision_roadmap/mvp_objectives.md) — Objectifs MVP
- [epics_and_backlog.md](./10-vision_roadmap/epics_and_backlog.md) — Épics et backlog

### Technique
- [API_SPEC_V1.md](./30-tech_specs/backend/API_SPEC_V1.md) — Spécification API REST
- [OPENAPI_CLIENT_HOWTO.md](./30-tech_specs/frontend/OPENAPI_CLIENT_HOWTO.md) — Guide génération client TypeScript
- [CODING_RULEBOOK_V1.md](./30-tech_specs/quality/CODING_RULEBOOK_V1.md) — Règles de code

### Sécurité
- [SECURITY_INDEX.md](./40-security/SECURITY_INDEX.md) — Index sécurité
- [SECURITY_GATES.md](./40-security/SECURITY_GATES.md) — Gates de sécurité CI

---

## 🏗️ Conventions

### Nommage des fichiers
- `UPPER_CASE_V1.md` — Documents canoniques versionnés
- `lower_case.md` — Documents de travail ou drafts
- `README.md` — Index de dossier (exemptés de frontmatter)

### Frontmatter obligatoire
```yaml
---
id: unique-id
title: "Titre du document"
status: active|draft|deprecated
owner: Tom|Dan|Talia
created: YYYY-MM-DD
updated: YYYY-MM-DD
version: "X.Y.Z"
tags: [tag1, tag2]
---
```

### Statuts
- `active` — Document canonique en vigueur
- `draft` — En cours de rédaction
- `deprecated` — Remplacé ou obsolète

---

## 📖 Voir aussi

- [README projet racine](../README.md) — Vue d'ensemble du monorepo
- [ssot_registry.json](./00-foundations/ssot_registry.json) — Registry des dossiers SSOT

---

**Maintenu par** : Tom (SSOT Owner)  
**Dernière mise à jour** : 2025-12-24
