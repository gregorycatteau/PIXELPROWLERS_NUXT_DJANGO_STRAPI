---
id: DOCS_DOD_AND_CONVENTIONS_V1
version: 1.0.0
status: active
date: 2025-12-24
owners: ["Jared", "Marty"]
scope: ["docs/**"]
tags: ["ssot", "dod", "conventions", "templates", "governance"]
---

# Documentation DoD & Conventions (V1)

## 1) Objectif

Ce document définit les **Definition of Done (DoD)** pour la documentation SSOT PixelProwlers, ainsi que les templates et conventions à respecter.

---

## 2) DoD Document SSOT

### 2.1 Checklist obligatoire

Un document est "Done" quand :

- [ ] **Frontmatter complet** avec les 7 champs obligatoires
- [ ] **Section "Objectif"** claire et concise
- [ ] **Section "Périmètre / Out of scope"** si applicable
- [ ] **Status approprié** (`draft`, `active`, `stable`, `deprecated`, `archived`)
- [ ] **Lien dans README.md** du dossier parent
- [ ] **ID unique** vérifié par `ssot_lint.py`
- [ ] **Pas de secrets ni PII** (voir §5)

### 2.2 Frontmatter obligatoire

```yaml
---
id: PX_V1_3_<DOMAINE>_<SUJET>
version: 1.0.0
status: draft|active|stable|deprecated|archived
date: YYYY-MM-DD
owners: ["Owner1", "Owner2"]
scope: ["docs/<path>/**", "frontend_nuxt/**"]
tags: ["tag1", "tag2"]
---
```

### 2.3 Nommage des fichiers

| Type | Pattern | Exemple |
|------|---------|---------|
| Spec fonctionnelle | `PX_V1_3_<FEATURE>_SPEC.md` | `PX_V1_3_JOURNEY_P1_SPEC.md` |
| User stories | `PX_V1_3_<FEATURE>_USER_STORIES.md` | `PX_V1_3_JOURNEY_P1_USER_STORIES.md` |
| Tech spec | `PX_V1_3_<COMPONENT>_TECH.md` | `PX_V1_3_BILAN_ENGINE_TECH.md` |
| Security contract | `PX_V1_3_SECURITY_<TOPIC>.md` | `PX_V1_3_SECURITY_DEEPLINKS.md` |

---

## 3) Templates courts

### 3.1 Template Product Spec

```markdown
---
id: PX_V1_3_<FEATURE>_SPEC
version: 1.0.0
status: draft
date: YYYY-MM-DD
owners: ["Marty"]
scope: ["docs/20-product_specs/**"]
tags: ["product-spec", "<feature>"]
---

# <Titre Feature>

## Objectif
<1-2 phrases>

## Périmètre
- ✅ Inclus : ...
- ❌ Out of scope : ...

## Exigences fonctionnelles
1. ...
2. ...

## Non-négociables
- ...

## Critères d'acceptation
- [ ] AC1: ...
- [ ] AC2: ...
```

### 3.2 Template User Stories

```markdown
---
id: PX_V1_3_<FEATURE>_USER_STORIES
version: 1.0.0
status: draft
date: YYYY-MM-DD
owners: ["Marty"]
scope: ["docs/20-product_specs/user_stories/**"]
tags: ["user-stories", "<feature>"]
---

# User Stories — <Feature>

## US-001: <Titre>
**En tant que** <persona>
**Je veux** <action>
**Afin de** <bénéfice>

### Critères d'acceptation
- [ ] ...

### Notes
- ...
```

### 3.3 Template Tech Spec

```markdown
---
id: PX_V1_3_<COMPONENT>_TECH
version: 1.0.0
status: draft
date: YYYY-MM-DD
owners: ["Dan"]
scope: ["docs/30-tech_specs/**", "frontend_nuxt/**"]
tags: ["tech-spec", "<component>"]
---

# Tech Spec — <Component>

## Objectif
<1-2 phrases>

## Architecture
- Composants : ...
- Dépendances : ...

## Interfaces
```typescript
// Types principaux
interface Example { ... }
```

## Contraintes
- Performance : ...
- Sécurité : ...

## Tests requis
- [ ] Unit tests
- [ ] Smoke tests
```

### 3.4 Template Security Contract

```markdown
---
id: PX_V1_3_SECURITY_<TOPIC>
version: 1.0.0
status: draft
date: YYYY-MM-DD
owners: ["Eva", "Dan"]
scope: ["docs/40-security/**"]
tags: ["security", "contract", "<topic>"]
---

# Security Contract — <Topic>

## Menace adressée
<Description de la menace>

## Règles
1. INTERDIT : ...
2. OBLIGATOIRE : ...

## Guards associés
| Guard | Fichier | Scope |
|-------|---------|-------|
| `<guard-name>` | `frontend_nuxt/scripts/guards/<file>.mjs` | `<scope>` |

## Vérification
```bash
npm run guard:<name>
```

## Exceptions
Aucune exception sans PR documentée.
```

---

## 4) Statuts et cycle de vie

### 4.1 Définitions

| Status | Signification | Actions autorisées |
|--------|---------------|-------------------|
| `draft` | En cours de rédaction, non canonique | Modifications libres |
| `active` | Canonique, en usage, peut évoluer | Modifications via PR |
| `stable` | Canonique, gelé | Changements via ADR |
| `deprecated` | Remplacé, pointer vers successeur | Lecture seule |
| `archived` | Conservé pour mémoire | Aucune modification |

### 4.2 Transitions autorisées

```
draft → active → stable → deprecated → archived
                    ↘           ↗
                     deprecated
```

### 4.3 Règles de versioning

- **V1.3** = release active → status `active` ou `stable`
- **V1.2, V1.0** = releases obsolètes → status `archived` + déplacer vers `90-placeholders_archive/legacy_v1_x/`

---

## 5) Règles de sécurité documentaire

### 5.1 Interdits absolus (P0)

| Type | Pattern détecté | Détection |
|------|-----------------|-----------|
| Mots de passe | Chaînes `p_a_s_s_w_o_r_d` suivies de valeurs | `ssot_lint.py` |
| Clés API | Préfixes `sk-`, `AKIA`, tokens | `ssot_lint.py` |
| Clés privées | Blocs `BEGIN ... KEY` | `ssot_lint.py` |
| URLs avec credentials | Schémas `protocol://user:xxx@host` | `ssot_lint.py` |
| PII nominatifs | Noms complets, emails personnels | Revue manuelle |

### 5.2 Bonnes pratiques

```markdown
# ❌ INTERDIT
DB_CRED=valeur_en_clair_123

# ✅ CORRECT
DB_CRED=<STRONG_VALUE_FROM_ENV>
```

---

## 6) Checklist PR Documentation

Avant de merger une PR documentaire :

- [ ] Frontmatter valide (7 champs)
- [ ] `ssot_lint.py` passe sans erreur
- [ ] ID unique et explicite
- [ ] Lien ajouté dans README.md du dossier
- [ ] Pas de secrets/PII
- [ ] Status cohérent avec le contenu
- [ ] Owners selon [Ownership Matrix](./SSOT_RULEBOOK_V1.md#9-ownership-matrix-responsabilité-métier)

---

## 7) Indexation

### 7.1 README d'index

Chaque dossier `docs/<XX>-<nom>/` doit avoir un `README.md` listant :
- Rôle du dossier
- Liste des documents avec descriptions courtes
- Liens vers sous-dossiers si applicable

### 7.2 Registry machine

`docs/00-foundations/ssot_registry.json` référence les documents canoniques pour agents IA.

---

## 8) Commandes de validation

```bash
# Lint standard
python3 tools/ssot_lint.py

# Lint strict (CI)
python3 tools/ssot_lint.py --strict --check-versions

# Lint avec vérif owners
python3 tools/ssot_lint.py --check-owners
```

---

## Références

- [SSOT_RULEBOOK_V1](./SSOT_RULEBOOK_V1.md) — Règles fondamentales SSOT
- [ssot_registry.json](./ssot_registry.json) — Registre machine-readable
