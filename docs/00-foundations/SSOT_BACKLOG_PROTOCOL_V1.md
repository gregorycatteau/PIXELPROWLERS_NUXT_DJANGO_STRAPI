---
id: ssot_backlog_protocol_v1
title: SSOT Backlog Protocol V1
version: "1.0"
status: active
date: 2024-12-24
owners: ["Jared", "Marty"]
scope: foundations
tags: ["ssot", "backlog", "delivery", "agents"]
---

# 📋 SSOT Backlog Protocol V1

Protocole pour générer automatiquement un backlog priorisé depuis le SSOT, avec tickets et prompts prêts pour agents IA (Cline, Claude, etc.).

## 📌 Vue d'ensemble

Le générateur de backlog (`tools/ssot_backlog.py`) transforme la documentation SSOT en tickets actionnables pour accélérer la livraison produit.

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   docs/**/*.md  │────▶│  ssot_backlog.py │────▶│ Tickets + Prompts│
│ (status=active) │     │     (build)      │     │   (generated)   │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
                                                ┌─────────────────┐
                                                │  Agents IA      │
                                                │  (Cline, etc.)  │
                                                └─────────────────┘
```

## 🚀 Utilisation rapide

```bash
# Lister les docs éligibles
python3 tools/ssot_backlog.py list
make ssot-backlog-list

# Générer le backlog complet
python3 tools/ssot_backlog.py build
make ssot-backlog

# Afficher un ticket avec prompt Cline
python3 tools/ssot_backlog.py render TKT_xxx --format cline
make ssot-ticket TICKET=TKT_xxx

# Prompt pour un agent spécifique
python3 tools/ssot_backlog.py render TKT_xxx --format agent --agent Dan
```

---

## 📁 Fichiers générés

| Fichier | Format | Usage |
|---------|--------|-------|
| `docs/10-vision_roadmap/backlog.generated.md` | Markdown | Lecture humaine, README |
| `docs/10-vision_roadmap/backlog.generated.json` | JSON | Machine-readable, intégrations |

⚠️ **Ces fichiers sont auto-générés** — ne pas éditer manuellement.

---

## 🎯 Critères d'éligibilité

Un document est inclus dans le backlog si :

| Critère | Valeur |
|---------|--------|
| Extension | `.md` |
| Frontmatter status | `active` ou `stable` |
| Localisation | `docs/**/*.md` |
| Exclusions | `README.md`, `*generated*`, `*archive*`, `*legacy*` |

---

## 🏷️ Priorisation automatique

### Par frontmatter explicite

```yaml
---
priority: P0  # P0, P1, P2
---
```

### Par heuristique (si priority absent)

| Area | Priorité par défaut |
|------|---------------------|
| security, contracts | P0 |
| backend, frontend, tech_specs, qa | P1 |
| product_specs | P1 |
| ux_content, ux_ui, legal, seo, measurement | P2 |
| governance, roadmap | P1/P2 |

### Par tags

- Tags `security`, `contracts` → P0
- Tags `backend`, `api` → P1

---

## 📝 Structure d'un ticket

```json
{
  "ticket_id": "TKT_px_v1_3_security_p0_deeplinks",
  "title": "Security P0 Deeplinks DOM Guards",
  "owners": ["Eva", "Dan"],
  "priority": "P0",
  "area": "contracts",
  "source_docs": ["docs/40-security/contracts/..."],
  "tags": ["security", "guards", "dom"],
  "acceptance_criteria": [...],
  "security_ac": [...],
  "qa_dod": [...],
  "deliverables": [...],
  "prompt_cline": "..."
}
```

---

## 🔒 Exigences sécurité (doctrine PixelProwlers)

Chaque ticket inclut automatiquement ces contraintes de sécurité :

1. **NO v-html** dans Vue — utiliser `v-text` ou composants sanitisés
2. **NO innerHTML/outerHTML/insertAdjacentHTML** dans le code
3. **Erreurs neutres** : pas d'exposition de stack traces ni de chemins internes
4. **Logs neutres** : pas de données utilisateur sensibles
5. **Deep links safe** : allowlist stricte, validation NFKC + stripZW
6. **Sanitization** : NFKC normalization + strip zero-width characters

---

## ✅ Definition of Done (QA) automatique

Chaque ticket inclut ces critères de qualité :

- `python3 tools/ssot_lint.py --strict` passe sans erreur
- `python3 tools/ssot_linkcheck.py --strict` passe sans erreur
- Tests unitaires ajoutés si code modifié
- Documentation mise à jour si API modifiée

---

## 👥 Prompts par agent

Le système génère des prompts adaptés à chaque rôle :

| Agent | Focus |
|-------|-------|
| **Dan** | Composants Vue/Nuxt, tests Vitest, guards CI, accessibilité |
| **Tom** | Endpoints Django, OpenAPI sync, tests pytest, performances DB |
| **Eva** | Review sécurité, guards, doctrine, audit vulnérabilités |
| **Marty** | Validation fonctionnelle, specs, user stories, AC |
| **Talia** | Contenus UX, tonalité Talia, microcopy |
| **Heider** | Design tokens, composants UI, responsive, dark mode |

```bash
# Exemple : prompt pour Dan (frontend)
python3 tools/ssot_backlog.py render TKT_xxx --format agent --agent Dan
```

---

## 🔄 Workflow recommandé

### 1. Génération du backlog

```bash
# En début de sprint ou après mise à jour SSOT
make ssot-backlog
```

### 2. Sélection d'un ticket

```bash
# Voir la liste des tickets P0
python3 tools/ssot_backlog.py list
```

### 3. Exécution par agent IA

```bash
# Copier le prompt Cline
make ssot-ticket TICKET=TKT_px_v1_3_xxx
# Coller dans Cline/Claude
```

### 4. Validation

```bash
# Vérifier la DoD
make ssot-check
```

---

## 🏷️ Areas supportées

Le système détecte automatiquement l'area depuis le chemin du fichier :

| Chemin | Area |
|--------|------|
| `docs/40-security/contracts/` | contracts |
| `docs/40-security/` | security |
| `docs/30-tech_specs/backend/` | backend |
| `docs/30-tech_specs/frontend/` | frontend |
| `docs/30-tech_specs/` | tech_specs |
| `docs/20-product_specs/ux_content/` | ux_content |
| `docs/20-product_specs/ux_ui/` | ux_ui |
| `docs/20-product_specs/` | product_specs |
| `docs/60-legal/` | legal |
| `docs/70-seo/` | seo |
| `docs/55-qa/` | qa |
| `docs/50-measurement/` | measurement |
| `docs/00-foundations/` | governance |
| `docs/10-vision_roadmap/` | roadmap |

---

## 🔐 Sécurité du générateur

Le générateur applique ces principes :

1. **Pas d'exfiltration** : seuls chemins, titres et sections courtes sont exposés
2. **Pas de secrets** : le contenu complet des fichiers n'est pas inclus dans les prompts
3. **Audit trail** : les fichiers générés sont traçables (`generated_at`, `generator`)

---

## 📊 Métriques typiques

Après `make ssot-backlog` sur un SSOT mature :

| Métrique | Valeur typique |
|----------|----------------|
| Docs scannés | ~50-100 |
| Tickets P0 | ~5-10 |
| Tickets P1 | ~20-30 |
| Tickets P2 | ~15-25 |

---

## 🔗 Références

- [SSOT Rulebook](./SSOT_RULEBOOK_V1.md)
- [SSOT Tasks Catalog](./SSOT_TASKS_CATALOG_V1.md)
- [SSOT Registry](./ssot_registry.json)
- [Security Gates](../40-security/SECURITY_GATES.md)

---

---

## 🗓️ Sprint Planner

Le Sprint Planner (`tools/ssot_sprint_planner.py`) groupe les tickets en sprints exécutables avec prompts Cline.

### Modes de sprint

| Mode | Deliverables inclus | Usage |
|------|---------------------|-------|
| **delivery** | code, tests, assets, components, api, guards | Sprints de développement |
| **governance** | docs, specs, policy, audit, review, process | Sprints de documentation |

### Utilisation rapide

```bash
# Générer tous les sprints (mode delivery par défaut)
python3 tools/ssot_sprint_planner.py build --mode delivery
make ssot-sprints MODE=delivery

# Afficher le prochain sprint (7 tickets par défaut)
python3 tools/ssot_sprint_planner.py next --mode delivery --wip 7
make ssot-next-sprint MODE=delivery WIP=7

# Afficher un sprint spécifique avec prompt Cline
python3 tools/ssot_sprint_planner.py render-sprint SPRINT=SPRINT_DELIVERY_20241224_01 --format cline
make ssot-render-sprint SPRINT=SPRINT_DELIVERY_20241224_01
```

### Fichiers générés

| Fichier | Format | Usage |
|---------|--------|-------|
| `docs/10-vision_roadmap/sprints.generated.md` | Markdown | Lecture humaine |
| `docs/10-vision_roadmap/sprints.generated.json` | JSON | Machine-readable |

### Champs optionnels (frontmatter)

Les tickets sont enrichis automatiquement par heuristique. Pour plus de précision, ajoutez ces champs au frontmatter des docs sources :

```yaml
---
workstream: engineering  # engineering, security, quality, product, design, operations, analytics, marketing
deliverable: code        # code, tests, assets, guards (delivery) / docs, specs, policy, audit (governance)
---
```

### Heuristiques par défaut

| Area | Deliverable | Workstream |
|------|-------------|------------|
| frontend, backend, tech_specs | code | engineering |
| contracts | guards | security |
| qa | tests | quality |
| product_specs, ux_content | specs | product |
| ux_ui | specs | design |
| security | policy | security |
| governance, legal | docs | operations |

### Tri des sprints

Les tickets sont triés de manière **déterministe** :

1. **Priorité** : P0 > P1 > P2
2. **Area** : ordre alphabétique
3. **Ticket ID** : ordre alphabétique

### Exemple de prompt Cline généré

```
Tu es Cline. Mission : exécuter le sprint SPRINT_DELIVERY_20241224_01.

## 📋 SPRINT OVERVIEW
- Mode : delivery
- Tickets : 7
- Priorité dominante : P0:3, P1:4
- Workstreams : engineering, security

## 🎫 TICKETS À TRAITER (par priorité)

### 1. `TKT_px_v1_3_security_p0_deeplinks` [P0]
**Security P0 Deeplinks DOM Guards**
- Area: contracts
- Owners: Eva, Dan
[...]

## 🔒 EXIGENCES SÉCURITÉ (doctrine PixelProwlers)
- NO v-html dans Vue
- NO innerHTML/outerHTML
- Erreurs neutres
[...]
```

---

## ➕ Extension future

### Dépendances entre tickets

```json
{
  "dependencies": ["TKT_other_ticket_id"]
}
```

### Intégration Jira/Linear

```bash
python3 tools/ssot_backlog.py sync --provider jira
```

### Dashboard backlog

```bash
python3 tools/ssot_backlog.py dashboard
```

---

*Dernière mise à jour : 2024-12-24*
