---
id: SSOT_RULEBOOK_V1
version: 1.0.0
status: active
date: 2025-12-24
owners: ["Jared", "Marty"]
scope: ["docs/**"]
tags: ["ssot", "governance", "rules", "routing", "indexing", "agent-ready"]
---

# SSOT Rulebook (V1) — PixelProwlers

## 0) Mission du SSOT (la règle d’or)
Le SSOT est la **source unique de vérité** du projet :
- compréhensible par **n’importe quel humain** (nouveau venu inclus),
- exploitable par **n’importe quel agent IA** (routage, recherche, décisions),
- stable dans le temps, **sans dérive “fourre-tout”**.

> Si une info est importante et durable → elle vit dans le SSOT.
> Si elle est temporaire / conversationnelle → elle ne vit PAS dans le SSOT.

---

## 1) Invariants non négociables
### 1.1 Lisibilité & navigabilité
- Chaque dossier a un `README.md` d’index (ou équivalent).
- Chaque doc importante a un frontmatter YAML minimal (voir §3).
- Tout concept a **un seul doc canonique** (pas de doublons).

### 1.2 Sécurité & confidentialité (anti-leaks)
- **Interdit** : secrets, tokens, clés, mots de passe, URLs privées, adresses exactes d’événements publics non confirmés.
- **Interdit** : PII non nécessaire (noms, accusations, dumps de conflit).
- Les contenus sensibles vont dans des espaces dédiés (Relinium/SSOT interne chiffré), pas dans ce SSOT.

### 1.3 Doctrine PixelProwlers (cohérence)
- privacy-first
- no tracking, no pixels, no “remote assets” par défaut
- no v-html (doctrine front) + équivalents “dangerous DOM” côté code
- métriques **agrégées seulement** (pas de profils, pas de tracking cross-pages)

---

## 2) Taxonomie : où ranger quoi (routing)
### 2.1 Dossiers “autorisés” et rôle
- `00-foundations/` : règles, conventions, environnements, charte SSOT, schémas doc.
- `10-vision_roadmap/` : vision, objectifs, backlog/epics, phases.
- `20-product_specs/` : specs fonctionnelles, user stories, UX content, audits UX/UI, schémas.
- `30-tech_specs/` : architecture, frontend/backend, CI/quality.
- `40-security/` : doctrine sécu, modèles de menaces, contracts, guards.
- `55-qa/` : checklists, smoke tests.
- `50-measurement/` : plan de mesure, KPIs.
- `60-legal/` : RGPD, CGU, juridique.
- `70-seo/` : stratégie SEO.
- `90-placeholders_archive/` : brouillons/archives non-canon.
- `99_handoff/` : handoffs ponctuels.

### 2.2 Règle anti fourre-tout
- On ne crée PAS de nouveaux dossiers “à l’intuition”.
- Si un nouveau domaine apparaît (ex: offers), on suit le protocole §6.

---

## 3) Standard de document (frontmatter obligatoire)
Chaque doc canonique contient un frontmatter YAML au début.

### 3.1 Champs obligatoires
- `id` : identifiant unique
- `version` : version du doc (SemVer recommandé)
- `status` : `draft | active | stable | deprecated | archived`
- `date` : YYYY-MM-DD
- `owners` : ["Marty", ...]
- `scope` : ["pixelprowlers.io", "docs/**", ...]
- `tags` : [ ... ]

### 3.2 Définition des statuts
- `draft` : en discussion, non canonique.
- `active` : canonique et utilisable, peut évoluer.
- `stable` : canonique + “gelé” (changement via décision formelle).
- `deprecated` : remplacé, pointer vers remplaçant.
- `archived` : conservé uniquement à titre mémoire, hors usage.

---

## 4) Règles de nommage
### 4.1 Canon (PixelProwlers)
- Produit / feature : `PX_V1_3_X_...` pour une feature V1.3.x non livrée.
- Livré : `PX_V1_3_...` ou version exacte.

### 4.2 Format recommandé
`<ID>.md` où `<ID>` = `PX_<version_produit>_<DOMAINE>_<SUJET>_<TYPE>`

Exemples :
- `PX_V1_3_X_OPERATION_125_PRODUCT_SPEC.md`
- `PX_V1_3_X_OPERATION_125_USER_STORIES.md`

---

## 5) Indices & registres (agent-ready)
### 5.1 Indices humains
- Chaque dossier a un index `README.md` listant les docs et “à quoi ça sert”.

### 5.2 Registre agent IA (option mais recommandé)
- Un registre machine lisible recense les docs canoniques.
- Fichier recommandé : `docs/00-foundations/ssot_registry.json`

---

## 6) Protocole de changement (anti dérive)
### 6.1 Ajouter un doc canonique
1) Choisir le bon dossier (routing §2)
2) Créer le doc avec frontmatter §3
3) Ajouter un lien dans le `README.md` du dossier
4) Mettre à jour `ssot_registry.json` (si utilisé)

### 6.2 Créer un nouveau sous-domaine
Si un dossier “nouveau type” est nécessaire :
- créer une note dans `10-vision_roadmap/epics_and_backlog.md` (ou ADR si vous en avez)
- ajouter la règle de routing correspondante dans ce Rulebook
- créer le README d’index du nouveau dossier
- ajouter guards/validations (si possible)

---

## 7) Qualité : définition de “Done” pour docs SSOT
Un doc “Done” :
- a un frontmatter complet
- a une section “Objectif / Périmètre”
- liste “Non négociables / Out of scope”
- contient des critères actionnables (AC/DoD si user stories)
- est indexé (README + registry si activé)

---

## 8) Tripwire SSOT Lint (anti régression)

### 8.1 Script canonique
**Fichier** : `tools/ssot_lint.py`

**Commandes npm** (depuis `frontend_nuxt/`) :
```bash
npm run ssot:lint          # Mode standard
npm run ssot:lint:strict   # Mode strict (exit 1 si violations)
```

**Invocation directe** :
```bash
python3 tools/ssot_lint.py [--strict] [--quiet]
```

### 8.2 Règles vérifiées

| Règle | Description | Niveau |
|-------|-------------|--------|
| `MISSING_FRONTMATTER` | Aucun frontmatter YAML détecté | ❌ Bloquant |
| `MISSING_FIELD` | Champ obligatoire manquant | ❌ Bloquant |
| `INVALID_STATUS` | Status non autorisé | ❌ Bloquant |
| `DUPLICATE_ID` | ID non unique | ❌ Bloquant |
| `POTENTIAL_SECRET` | Pattern sensible détecté | ⚠️ P0 Sécurité |

### 8.3 Champs obligatoires
Tous les `.md` (hors `README.md`) doivent avoir :
- `id` : identifiant unique
- `version` : version du doc (ex: `1.0.0`)
- `status` : `draft | active | stable | deprecated | archived`
- `date` : format `YYYY-MM-DD`
- `owners` : liste des responsables
- `scope` : périmètre d'application
- `tags` : liste de tags

### 8.4 Détection de secrets (patterns)
Le linter détecte (sans logger le contenu) :
- Patterns de mots de passe en clair
- URLs de base de données avec credentials
- Clés privées (RSA, PEM)
- Clés API (OpenAI, Stripe, etc.)
- Tokens GitHub (PAT, OAuth, etc.)

Voir `tools/ssot_lint.py` pour la liste exhaustive des patterns.

### 8.5 Intégration CI (recommandé)
```yaml
# .github/workflows/ssot-lint.yml
- name: SSOT Lint
  run: python3 tools/ssot_lint.py --strict
```

---

## 9) Ownership Matrix (responsabilité métier)

### 9.1 Règle générale
Chaque document canonique a un ou plusieurs **owners métier** responsables de :
- la pertinence et l'exactitude du contenu
- la décision d'archivage ou de mise à jour majeure
- la validation des changements structurels

### 9.2 Matrice par dossier

| Path pattern | Default owners | Notes |
|--------------|----------------|-------|
| `docs/00-foundations/**` | `["Marty"]` | Règles fondamentales SSOT |
| `docs/10-vision_roadmap/**` | `["Marty"]` | Vision produit, roadmap |
| `docs/20-product_specs/functional/**` | `["Marty"]` | Specs fonctionnelles |
| `docs/20-product_specs/user_stories/**` | `["Marty"]` | User stories |
| `docs/20-product_specs/ux_content/**` | `["Talia", "Marty"]` | Contenu UX, narratif |
| `docs/20-product_specs/ux_ui/**` | `["Heider", "Dan"]` | Design System, audits UI |
| `docs/20-product_specs/schemas/**` | `["Dan", "Marty"]` | Schémas de données |
| `docs/30-tech_specs/frontend/**` | `["Dan"]` | Architecture frontend |
| `docs/30-tech_specs/backend/**` | `["Tom"]` | Architecture backend |
| `docs/30-tech_specs/quality/**` | `["Eva", "Dan"]` | Qualité, CI |
| `docs/40-security/**` | `["Eva", "Dan"]` | Sécurité, contracts, guards |
| `docs/50-measurement/**` | `["Claire", "Marty"]` | KPIs, mesure |
| `docs/50-qa/**` | `["Dan", "Eva"]` | Tests, smoke tests |
| `docs/60-legal/**` | `["Marty"]` | RGPD, CGU |
| `docs/70-seo/**` | `["Rand", "Julien"]` | SEO |
| `docs/90-placeholders_archive/**` | `["Marty"]` | Archives (status=archived) |
| `docs/99_handoff/**` | `["Heider"]` | Handoffs (status=archived si non spécifié) |

### 9.3 Validation du linter
Le linter peut émettre un **warning** si `owners` ne correspond pas à la matrice (mode `--check-owners`).

---

## 10) Versioning → Status Policy

### 10.1 Release active
La release active est **V1.3** (incluant V1.3.1, V1.3.X).

### 10.2 Règles de status pour docs versionnés
Un document est considéré "versionné" si son `id` ou filename contient un pattern de version (`V1_0`, `V1_2`, `V1_3`, etc.).

| Pattern dans id/filename | Status autorisé | Action |
|--------------------------|-----------------|--------|
| `V1_3`, `V1_3_1`, `V1_3_X` | `active`, `stable`, `deprecated` | Docs de la release active |
| `V1_2`, `V1_0` | `archived` uniquement | Docs obsolètes |
| Aucun pattern de version | Tous statuts | Docs transverses (foundations, security) |

### 10.3 Règle strict (linter)
En mode `--strict`, le linter rejette :
- Un doc avec `V1_2` ou `V1_0` et status ≠ `archived`
- Un doc avec `V1_3` et status = `archived` (sauf décision explicite)

---

## 11) Archive Policy (cycle de vie)

### 11.1 Déclenchement d'archivage
Un document versionné est archivé quand :
- Sa version produit est remplacée (ex: V1.2 → V1.3)
- Son contenu est entièrement intégré dans un doc plus récent
- Il n'a plus de valeur référentielle

### 11.2 Processus d'archivage
1. **Mettre status = archived** dans le frontmatter
2. **Déplacer physiquement** (si versionné obsolète) vers :
   - `docs/90-placeholders_archive/legacy_v1_2/<chemin_original>/`
   - `docs/90-placeholders_archive/legacy_v1_0/<chemin_original>/`
3. **Mettre à jour les liens** Markdown qui pointaient vers ce fichier
4. **Mettre à jour les README** d'index concernés
5. **Mettre à jour le registry** (`ssot_registry.json`)

### 11.3 Règles de conservation
- Les docs archivés restent accessibles (lecture seule, traçabilité)
- Pas de suppression définitive sans décision formelle (ADR)
- Le dossier `90-placeholders_archive/` n'est pas scanné pour les checks "active"

---

## 12) CI Gates Obligatoires (automatisation)

### 12.1 Workflow GitHub Actions
**Fichier** : `.github/workflows/ssot_ci.yml`

Le workflow CI SSOT est déclenché sur :
- Push sur `main` ou `develop` modifiant `docs/**` ou `tools/ssot_*.py`
- Pull Request sur `main` ou `develop` modifiant ces mêmes paths

### 12.2 Gates obligatoires

| Gate | Commande | Description | Bloquant |
|------|----------|-------------|----------|
| **SSOT Lint** | `python3 tools/ssot_lint.py --strict` | Valide frontmatter, status, unicité ID | ✅ Oui |
| **OpenAPI Validate** | `python3 tools/openapi_validate.py` | Valide spec OpenAPI backend | ✅ Oui |
| **Resources Catalog Validate** | `python3 tools/ssot_resources_catalog_validate.py` | Valide le catalog resources (schema + sécurité) | ✅ Oui |
| **Index Drift Check** | `python3 tools/ssot_generate_indexes.py --check` | Détecte drift README vs fichiers réels | ✅ Oui |
| **Secret Scan** | grep patterns sensibles | Détecte secrets/tokens/clés | ✅ Oui |

### 12.3 Principe "dry-run only"
**Règle absolue** : Les jobs CI ne modifient JAMAIS le repository.
- Mode `--check` ou `--dry-run` uniquement
- Si drift détecté → exit 1 (échec CI)
- Développeur doit appliquer les corrections localement puis push

### 12.4 Commandes locales (Makefile)

```bash
# Vérification complète (avant commit)
make ssot-check

# Commandes individuelles
make ssot-lint           # Lint strict
make ssot-openapi        # Validation OpenAPI
make ssot-resources-validate  # Validation catalog resources
make ssot-index-check    # Détection drift index

# Correction (après détection drift)
make ssot-index-apply    # Applique les corrections d'index
```

### 12.5 Workflow développeur recommandé

1. **Avant commit** : `make ssot-check`
2. **Si drift détecté** : `make ssot-index-apply`
3. **Commit** avec les corrections
4. **Push** → CI valide automatiquement

### 12.6 Patterns de secrets détectés

Le secret scan bloque si détecté :
- `password\s*[:=]` (mot de passe en clair)
- `postgresql://.*:.*@` (URL DB avec credentials)
- `-----BEGIN.*PRIVATE KEY-----` (clé privée)
- `sk-[a-zA-Z0-9]{20,}` (clé OpenAI)
- `ghp_[a-zA-Z0-9]{36}` (GitHub PAT)
- `github_pat_[a-zA-Z0-9_]{82}` (GitHub Fine-grained PAT)
- `gho_[a-zA-Z0-9]{36}` (GitHub OAuth token)

### 12.7 Exceptions et overrides
- Aucun override autorisé pour le secret scan
- Les fichiers `90-placeholders_archive/**` sont exclus du lint strict
- Les `README.md` sont exclus de la validation frontmatter
