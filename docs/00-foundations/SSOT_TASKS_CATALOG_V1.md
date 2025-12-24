---
id: ssot_tasks_catalog_v1
title: SSOT Tasks Catalog V1
version: "1.0"
status: active
date: 2024-12-24
owners: ["Jared", "Marty"]
scope: foundations
tags: ["ssot", "tasks", "automation", "tooling"]
---

# 📋 SSOT Tasks Catalog V1

Catalogue de tâches prédéfinies pour la maintenance et l'évolution du SSOT PixelProwlers. Ces tâches peuvent être exécutées par des humains ou des agents IA (Cline, Claude, etc.).

## 📌 Vue d'ensemble

Le Task Runner SSOT (`tools/ssot_tasks.py`) fournit :
- Un catalogue déclaratif de tâches de maintenance
- Des prompts prêts à l'emploi pour agents IA
- Une Definition of Done (DoD) pour chaque tâche
- Des commandes CLI associées

## 🚀 Utilisation rapide

```bash
# Lister toutes les tâches
python3 tools/ssot_tasks.py list
make ssot-tasks

# Afficher les détails d'une tâche
python3 tools/ssot_tasks.py show ssot_linkcheck_fix
make ssot-task TASK=ssot_linkcheck_fix

# Générer un prompt pour Cline
python3 tools/ssot_tasks.py render ssot_linkcheck_fix --format cline
```

---

## 📁 Catalogue des tâches

### 🔴 Priorité P0 (Critique)

#### `ssot_openapi_sync`
**OpenAPI Spec Sync** — Synchronise la spec OpenAPI avec l'implémentation backend.

| Propriété | Valeur |
|-----------|--------|
| Catégorie | api |
| Durée | 45-90 min |
| Trigger | Nouvel endpoint, modification schéma, divergence détectée |

```bash
python3 tools/ssot_tasks.py render ssot_openapi_sync --format cline
```

#### `ssot_linkcheck_fix`
**Fix Broken Links** — Corrige les liens internes cassés détectés par ssot_linkcheck.

| Propriété | Valeur |
|-----------|--------|
| Catégorie | maintenance |
| Durée | 15-45 min |
| Trigger | CI échoue sur linkcheck, renommage de fichiers |

```bash
python3 tools/ssot_tasks.py render ssot_linkcheck_fix --format cline
```

#### `ssot_secret_scan_review`
**Secret Scan Review** — Analyse et nettoie les potentiels secrets exposés.

| Propriété | Valeur |
|-----------|--------|
| Catégorie | security |
| Durée | 20-40 min |
| Trigger | CI warning, audit sécurité |

```bash
python3 tools/ssot_tasks.py render ssot_secret_scan_review --format cline
```

---

### 🟡 Priorité P1 (Important)

#### `ssot_frontmatter_backfill`
**Frontmatter Backfill** — Ajoute les frontmatters YAML manquants aux docs existants.

| Propriété | Valeur |
|-----------|--------|
| Catégorie | maintenance |
| Durée | 15-30 min |
| Trigger | MISSING_FRONTMATTER en CI, nouveaux docs manuels |

```bash
python3 tools/ssot_tasks.py render ssot_frontmatter_backfill --format cline
```

#### `ssot_indexes_rebuild`
**Rebuild All Indexes** — Régénère tous les README d'index depuis le registry.

| Propriété | Valeur |
|-----------|--------|
| Catégorie | maintenance |
| Durée | 5-15 min |
| Trigger | Index drift en CI, réorganisation SSOT |

```bash
python3 tools/ssot_tasks.py render ssot_indexes_rebuild --format cline
```

#### `ssot_new_feature_docset`
**New Feature DocSet** — Crée le set complet de docs pour une nouvelle feature.

| Propriété | Valeur |
|-----------|--------|
| Catégorie | creation |
| Durée | 30-60 min |
| Trigger | Nouvelle feature, nouveau parcours |

```bash
python3 tools/ssot_tasks.py render ssot_new_feature_docset --format cline
```

#### `ssot_ci_gates_review`
**CI Gates Review** — Audit et amélioration des gates CI SSOT.

| Propriété | Valeur |
|-----------|--------|
| Catégorie | quality |
| Durée | 30-60 min |
| Trigger | Nouvelle gate, faux positifs récurrents |

```bash
python3 tools/ssot_tasks.py render ssot_ci_gates_review --format cline
```

---

### 🟢 Priorité P2 (Nice to have)

#### `ssot_archive_release`
**Archive Release Docs** — Archive les docs d'une release obsolète vers legacy.

| Propriété | Valeur |
|-----------|--------|
| Catégorie | lifecycle |
| Durée | 30-60 min |
| Trigger | Nouvelle release majeure, nettoyage périodique |

```bash
python3 tools/ssot_tasks.py render ssot_archive_release --format cline
```

#### `ssot_orphan_cleanup`
**Orphan Docs Cleanup** — Identifie et traite les docs orphelins non référencés.

| Propriété | Valeur |
|-----------|--------|
| Catégorie | maintenance |
| Durée | 20-45 min |
| Trigger | Orphans détectés, nettoyage périodique |

```bash
python3 tools/ssot_tasks.py render ssot_orphan_cleanup --format cline
```

---

## 🎯 Workflow recommandé

### Pour un agent IA (Cline)

1. **Identifier la tâche** : `make ssot-tasks` ou feedback CI
2. **Générer le prompt** : `make ssot-task TASK=<id>`
3. **Copier le prompt** dans Cline
4. **Exécuter et valider** selon la DoD
5. **Commit** avec message standardisé

### Pour un humain

1. **Identifier la tâche** : `python3 tools/ssot_tasks.py list`
2. **Lire les instructions** : `python3 tools/ssot_tasks.py show <id>`
3. **Suivre les étapes** et exécuter les commandes
4. **Vérifier la DoD** avant de committer

---

## 📝 Structure d'une tâche

Chaque tâche contient :

```python
{
    "id": "ssot_xxx",              # Identifiant unique
    "name": "Nom lisible",         # Titre court
    "category": "maintenance",     # maintenance|creation|lifecycle|security|api|quality
    "priority": "P1",              # P0|P1|P2
    "description": "...",          # Description courte
    "when_to_use": [...],          # Liste des triggers
    "prompt": "...",               # Prompt pour IA
    "dod": [...],                  # Definition of Done
    "commands": [...],             # Commandes CLI
    "estimated_time": "15-30 min"  # Durée estimée
}
```

---

## ➕ Ajouter une nouvelle tâche

1. Éditer `tools/ssot_tasks.py`
2. Ajouter l'entrée dans `TASKS_CATALOG`
3. Mettre à jour ce document
4. Tester : `python3 tools/ssot_tasks.py show <new_id>`

---

## 🔗 Références

- [SSOT Rulebook](./SSOT_RULEBOOK_V1.md)
- [SSOT Registry](./ssot_registry.json)
- [CI Gates](../40-security/SECURITY_GATES.md)
- [QA Index](../55-qa/QA_INDEX.md)

---

## 📊 Métriques

| Métrique | Valeur |
|----------|--------|
| Tâches P0 | 3 |
| Tâches P1 | 4 |
| Tâches P2 | 2 |
| **Total** | **9** |

---

*Dernière mise à jour : 2024-12-24*
