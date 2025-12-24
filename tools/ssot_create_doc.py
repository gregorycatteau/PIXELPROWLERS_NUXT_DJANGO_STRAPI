#!/usr/bin/env python3
"""
SSOT Document Creator — PixelProwlers
======================================
Génère un document canonique avec frontmatter SSOT complet.

Usage:
    python3 tools/ssot_create_doc.py <doctype> <path> [options]

Doctypes:
    product_spec       Spec fonctionnelle (20-product_specs/functional/)
    user_story         User story (20-product_specs/user_stories/)
    tech_spec          Spec technique (30-tech_specs/)
    security_contract  Contrat sécurité (40-security/contracts/)

Options:
    --title "Title"      Titre du document
    --status draft       Status initial (draft, active)
    --priority P1        Priorité (P0, P1, P2)
    --register           Ajouter au ssot_registry.json
    --dry-run            Afficher sans créer
    -h, --help           Aide

Exemples:
    python3 tools/ssot_create_doc.py product_spec docs/20-product_specs/functional/NEW_FEATURE_SPEC.md --title "New Feature" --register
    python3 tools/ssot_create_doc.py user_story docs/20-product_specs/user_stories/US_LOGIN.md --dry-run
"""

import argparse
import json
import os
import re
import sys
from datetime import date
from pathlib import Path

# Chemins
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
REGISTRY_PATH = PROJECT_ROOT / "docs" / "00-foundations" / "ssot_registry.json"

# Dossiers autorisés par doctype
ALLOWED_DIRS = {
    "product_spec": ["docs/20-product_specs/functional"],
    "user_story": ["docs/20-product_specs/user_stories"],
    "tech_spec": ["docs/30-tech_specs/frontend", "docs/30-tech_specs/backend", "docs/30-tech_specs/architecture", "docs/30-tech_specs/quality", "docs/30-tech_specs/cms"],
    "security_contract": ["docs/40-security/contracts", "docs/40-security"],
    "ux_content": ["docs/20-product_specs/ux_content"],
    "ux_ui": ["docs/20-product_specs/ux_ui"],
    "qa": ["docs/55-qa"],
    "legal": ["docs/60-legal"],
    "seo": ["docs/70-seo"],
}

# Templates par doctype
TEMPLATES = {
    "product_spec": """
# {title}

> **Résumé** : [Description courte de la feature]

---

## 1. Contexte

[Pourquoi cette feature ?]

## 2. Objectifs

- [ ] Objectif 1
- [ ] Objectif 2

## 3. Scope

### In scope
- Item 1
- Item 2

### Out of scope
- Item exclu

## 4. Spécification fonctionnelle

### 4.1 Comportement attendu

[Décrire le comportement]

### 4.2 Cas limites

[Décrire les edge cases]

## 5. Critères d'acceptation

- [ ] Critère 1
- [ ] Critère 2

## 6. DoD (Definition of Done)

- [ ] Tests passent
- [ ] Review OK
- [ ] Documentation mise à jour

## 7. Références

| Document | Lien |
|----------|------|
| [Ref 1] | [lien] |

---

## Changelog

| Version | Date | Auteur | Changement |
|---------|------|--------|------------|
| 1.0 | {date} | {owner} | Création initiale |
""",

    "user_story": """
# {title}

> **En tant que** [persona], **je veux** [action], **afin de** [bénéfice].

---

## Contexte

[Contexte de la user story]

## Critères d'acceptation

### Scenario 1: [Nom]
- **Given** [condition initiale]
- **When** [action utilisateur]
- **Then** [résultat attendu]

### Scenario 2: [Nom]
- **Given** [condition]
- **When** [action]
- **Then** [résultat]

## Contraintes techniques

- Contrainte 1
- Contrainte 2

## Maquettes / Wireframes

[Liens vers Figma ou description]

## DoD

- [ ] Implémenté
- [ ] Testé
- [ ] Reviewed

---

## Changelog

| Version | Date | Auteur | Changement |
|---------|------|--------|------------|
| 1.0 | {date} | {owner} | Création initiale |
""",

    "tech_spec": """
# {title}

> **Périmètre** : [Description technique]

---

## 1. Overview

[Vue d'ensemble de la spec technique]

## 2. Architecture

### 2.1 Composants

```
[Diagramme ASCII ou description]
```

### 2.2 Dépendances

- Dépendance 1
- Dépendance 2

## 3. Implémentation

### 3.1 Structure

```
[Structure des fichiers]
```

### 3.2 Code samples

```typescript
// Example code
```

## 4. Sécurité

- [ ] Validation inputs
- [ ] No PII in logs
- [ ] Rate limiting si applicable

## 5. Tests

### 5.1 Tests unitaires

- Test 1
- Test 2

### 5.2 Tests d'intégration

- Test intégration 1

## 6. Références

| Document | Lien |
|----------|------|
| [Ref] | [lien] |

---

## Changelog

| Version | Date | Auteur | Changement |
|---------|------|--------|------------|
| 1.0 | {date} | {owner} | Création initiale |
""",

    "security_contract": """
# {title}

> **Classification** : [P0/P1/P2] | **Status** : {status}

---

## 1. Objectif sécurité

[Quel risque ce contrat mitige-t-il ?]

## 2. Menaces couvertes

| Menace | Severity | Mitigation |
|--------|----------|------------|
| [Menace 1] | High | [Mitigation] |
| [Menace 2] | Medium | [Mitigation] |

## 3. Règles

### 3.1 MUST (obligatoire)

- [ ] Règle obligatoire 1
- [ ] Règle obligatoire 2

### 3.2 SHOULD (recommandé)

- [ ] Règle recommandée 1

### 3.3 MUST NOT (interdit)

- ❌ Interdit 1
- ❌ Interdit 2

## 4. Implémentation

### 4.1 Guards

| Guard | Fichier | Scope |
|-------|---------|-------|
| [guard-name] | `scripts/guards/xxx.mjs` | [scope] |

### 4.2 Vérification

```bash
# Commande de vérification
```

## 5. Audit trail

| Date | Auditeur | Résultat |
|------|----------|----------|
| {date} | [Auditeur] | Initial |

## 6. Références

- [SECURITY_INDEX.md](../SECURITY_INDEX.md)
- [SECURITY_GATES.md](../SECURITY_GATES.md)

---

## Changelog

| Version | Date | Auteur | Changement |
|---------|------|--------|------------|
| 1.0 | {date} | {owner} | Création initiale |
""",
}


def load_registry() -> dict:
    """Charge le ssot_registry.json."""
    if REGISTRY_PATH.exists():
        with open(REGISTRY_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}


def save_registry(registry: dict) -> None:
    """Sauvegarde le ssot_registry.json."""
    with open(REGISTRY_PATH, 'w', encoding='utf-8') as f:
        json.dump(registry, f, indent=2, ensure_ascii=False)
        f.write('\n')


def get_owners_from_path(path: str, registry: dict) -> list[str]:
    """Récupère les owners depuis ownershipMatrix."""
    ownership = registry.get("ownershipMatrix", {})
    
    # Chercher le match le plus spécifique
    path_parts = path.split('/')
    for i in range(len(path_parts), 0, -1):
        check_path = '/'.join(path_parts[:i])
        if check_path in ownership:
            return ownership[check_path]
    
    # Fallback
    return ["Marty"]


def get_domain_from_path(path: str) -> str:
    """Détermine le domain depuis le path."""
    if "security" in path:
        return "security"
    if "product_specs" in path:
        return "product_specs"
    if "tech_specs/backend" in path:
        return "backend"
    if "tech_specs/frontend" in path:
        return "frontend"
    if "tech_specs" in path:
        return "tech"
    if "legal" in path:
        return "legal"
    if "qa" in path:
        return "qa"
    return "general"


def get_tags_from_doctype(doctype: str, path: str) -> list[str]:
    """Génère les tags depuis doctype et path."""
    tags = [doctype.replace("_", "-")]
    
    if "security" in path:
        tags.append("security")
    if "frontend" in path:
        tags.append("frontend")
    if "backend" in path:
        tags.append("backend")
    if "product_specs" in path:
        tags.append("product")
    
    return tags


def validate_path(path: str, doctype: str) -> tuple[bool, str]:
    """Valide que le path est autorisé pour ce doctype."""
    allowed = ALLOWED_DIRS.get(doctype, [])
    
    for allowed_dir in allowed:
        if path.startswith(allowed_dir):
            return True, ""
    
    return False, f"❌ Dossier non autorisé pour {doctype}. Autorisés: {', '.join(allowed)}"


def generate_id_from_filename(filename: str) -> str:
    """Génère l'ID depuis le nom de fichier."""
    # Remove .md extension
    name = filename.replace('.md', '')
    # Convert to UPPER_SNAKE_CASE
    name = re.sub(r'[^a-zA-Z0-9]', '_', name)
    name = re.sub(r'_+', '_', name)
    return name.upper().strip('_')


def generate_frontmatter(
    doc_id: str,
    status: str,
    owners: list[str],
    path: str,
    tags: list[str],
    priority: str | None = None
) -> str:
    """Génère le frontmatter YAML."""
    today = date.today().isoformat()
    
    fm = f"""---
id: {doc_id}
version: "1.0"
status: {status}
date: {today}
owners:
"""
    for owner in owners:
        fm += f"  - {owner}\n"
    
    fm += f"scope:\n  - {path}\n"
    fm += "tags:\n"
    for tag in tags:
        fm += f"  - {tag}\n"
    
    if priority:
        fm += f"priority: {priority}\n"
    
    fm += "---\n"
    return fm


def generate_document(
    doctype: str,
    path: str,
    title: str,
    status: str,
    priority: str | None,
    register: bool,
    dry_run: bool
) -> int:
    """Génère le document complet."""
    
    # Validation path
    is_valid, error = validate_path(path, doctype)
    if not is_valid:
        print(error)
        return 1
    
    # Load registry
    registry = load_registry()
    
    # Generate values
    filename = os.path.basename(path)
    doc_id = generate_id_from_filename(filename)
    owners = get_owners_from_path(path, registry)
    tags = get_tags_from_doctype(doctype, path)
    domain = get_domain_from_path(path)
    today = date.today().isoformat()
    
    # Check ID collision
    existing_ids = [doc.get("id") for doc in registry.get("documents", {}).get("canonical", [])]
    if doc_id in existing_ids:
        print(f"⚠️  ID '{doc_id}' existe déjà dans le registry")
        doc_id = f"{doc_id}_NEW"
        print(f"   Utilisation de '{doc_id}' à la place")
    
    # Generate frontmatter
    frontmatter = generate_frontmatter(doc_id, status, owners, path, tags, priority)
    
    # Get template
    template = TEMPLATES.get(doctype, TEMPLATES["tech_spec"])
    body = template.format(
        title=title,
        date=today,
        owner=owners[0] if owners else "TBD",
        status=status
    )
    
    # Full content
    content = frontmatter + body
    
    # Output
    print("=" * 60)
    print(f"📄 SSOT Document Creator")
    print("=" * 60)
    print(f"   Doctype:  {doctype}")
    print(f"   Path:     {path}")
    print(f"   ID:       {doc_id}")
    print(f"   Status:   {status}")
    print(f"   Owners:   {', '.join(owners)}")
    print(f"   Tags:     {', '.join(tags)}")
    print(f"   Priority: {priority or 'N/A'}")
    print(f"   Register: {register}")
    print("=" * 60)
    
    if dry_run:
        print("\n🔍 DRY-RUN — Contenu généré:\n")
        print(content[:500] + "..." if len(content) > 500 else content)
        print("\n✅ Dry-run terminé (aucun fichier créé)")
        return 0
    
    # Create file
    full_path = PROJECT_ROOT / path
    full_path.parent.mkdir(parents=True, exist_ok=True)
    
    if full_path.exists():
        print(f"❌ Le fichier existe déjà: {path}")
        return 1
    
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"\n✅ Fichier créé: {path}")
    
    # Register in SSOT
    if register:
        entry = {
            "id": doc_id,
            "path": path,
            "status": status,
            "hasFrontmatter": True,
            "domain": domain,
            "owners": owners
        }
        if priority:
            entry["priority"] = priority
        
        if "documents" not in registry:
            registry["documents"] = {"canonical": []}
        
        registry["documents"]["canonical"].append(entry)
        save_registry(registry)
        print(f"✅ Ajouté au ssot_registry.json")
    
    print("\n💡 Prochaines étapes:")
    print(f"   1. Éditer {path}")
    print(f"   2. python3 tools/ssot_lint.py --strict")
    
    return 0


def main():
    parser = argparse.ArgumentParser(
        description="SSOT Document Creator — Génère un document canonique avec frontmatter",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Doctypes disponibles:
  product_spec       Spec fonctionnelle
  user_story         User story
  tech_spec          Spec technique
  security_contract  Contrat sécurité

Exemples:
  %(prog)s product_spec docs/20-product_specs/functional/NEW_SPEC.md --title "Ma Spec"
  %(prog)s security_contract docs/40-security/contracts/NEW_GUARD.md --priority P0 --register
"""
    )
    
    parser.add_argument("doctype", choices=list(TEMPLATES.keys()), help="Type de document")
    parser.add_argument("path", help="Chemin du fichier (relatif à la racine projet)")
    parser.add_argument("--title", default="[TITLE]", help="Titre du document")
    parser.add_argument("--status", choices=["draft", "active"], default="draft", help="Status initial")
    parser.add_argument("--priority", choices=["P0", "P1", "P2"], help="Priorité")
    parser.add_argument("--register", action="store_true", help="Ajouter au ssot_registry.json")
    parser.add_argument("--dry-run", action="store_true", help="Afficher sans créer")
    
    args = parser.parse_args()
    
    # Ensure path ends with .md
    path = args.path
    if not path.endswith('.md'):
        path += '.md'
    
    return generate_document(
        doctype=args.doctype,
        path=path,
        title=args.title,
        status=args.status,
        priority=args.priority,
        register=args.register,
        dry_run=args.dry_run
    )


if __name__ == "__main__":
    sys.exit(main())
