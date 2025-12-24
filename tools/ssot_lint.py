#!/usr/bin/env python3
"""
SSOT Lint - Linter pour la conformité documentaire SSOT PixelProwlers.

Usage:
    python tools/ssot_lint.py [--strict] [--check-owners] [--check-versions] [--quiet]

Vérifie:
    1. Présence frontmatter YAML sur tous les .md (hors README.md)
    2. Champs obligatoires: id, version, status, date, owners, scope, tags
    3. Statuts autorisés: draft, active, stable, deprecated, archived
    4. Unicité des IDs
    5. Patterns de secrets évidents (mots de passe, clés privées, etc.)
    6. [--check-versions] Conformité version/status (V1_2/V1_0 = archived only)
    7. [--check-owners] Conformité owners selon Ownership Matrix + agents registry
"""

import json
import os
import re
import sys
from pathlib import Path
from typing import Dict, List, Tuple, Set, Optional

# Configuration
DOCS_DIR = "docs"
AGENTS_REGISTRY_PATH = Path("agents/agents_registry.json")
SSOT_REGISTRY_PATH = Path("docs/00-foundations/ssot_registry.json")
REQUIRED_FIELDS = {"id", "version", "status", "date", "owners", "scope", "tags"}
VALID_STATUSES = {"draft", "active", "stable", "deprecated", "archived"}

# Cache for valid owners (loaded from agents registry)
_VALID_OWNERS_CACHE: Optional[Set[str]] = None


def load_valid_owners() -> Set[str]:
    """Load valid owner names from agents registry. Cached after first call."""
    global _VALID_OWNERS_CACHE
    if _VALID_OWNERS_CACHE is not None:
        return _VALID_OWNERS_CACHE
    
    if AGENTS_REGISTRY_PATH.exists():
        try:
            with open(AGENTS_REGISTRY_PATH, 'r', encoding='utf-8') as f:
                data = json.load(f)
            _VALID_OWNERS_CACHE = {a["displayName"] for a in data.get("agents", [])}
        except (json.JSONDecodeError, KeyError) as e:
            print(f"⚠️ Warning: Could not load agents registry: {e}")
            _VALID_OWNERS_CACHE = set()
    else:
        _VALID_OWNERS_CACHE = set()
    
    return _VALID_OWNERS_CACHE


def load_ownership_matrix_from_ssot() -> Tuple[Dict[str, List[str]], Dict[str, List[str]]]:
    """Load ownershipMatrix and ownershipExceptions from ssot_registry.json."""
    if SSOT_REGISTRY_PATH.exists():
        try:
            with open(SSOT_REGISTRY_PATH, 'r', encoding='utf-8') as f:
                data = json.load(f)
            matrix = data.get("ownershipMatrix", {})
            exceptions = data.get("ownershipExceptions", {})
            return matrix, exceptions
        except (json.JSONDecodeError, KeyError):
            pass
    return {}, {}


# Versioning Policy
ACTIVE_RELEASE = "V1_3"
OBSOLETE_VERSION_PATTERNS = [r"V1_2", r"V1_0", r"HOME_V1_2"]
ACTIVE_VERSION_PATTERNS = [r"V1_3"]

# Ownership Matrix
OWNERSHIP_MATRIX = {
    "docs/00-foundations": ["Marty"],
    "docs/10-vision_roadmap": ["Marty"],
    "docs/20-product_specs/functional": ["Marty"],
    "docs/20-product_specs/user_stories": ["Marty"],
    "docs/20-product_specs/ux_content": ["Talia", "Marty"],
    "docs/20-product_specs/ux_ui": ["Heider", "Dan"],
    "docs/20-product_specs/schemas": ["Dan", "Marty"],
    "docs/30-tech_specs/frontend": ["Dan"],
    "docs/30-tech_specs/backend": ["Tom"],
    "docs/30-tech_specs/architecture": ["Dan"],
    "docs/30-tech_specs/quality": ["Eva", "Dan"],
    "docs/30-tech_specs/cms": ["Dan"],
    "docs/40-security": ["Eva", "Dan"],
    "docs/50-measurement": ["Claire", "Marty"],
    "docs/55-qa": ["Dan", "Eva"],
    "docs/60-legal": ["Marty"],
    "docs/70-seo": ["Rand", "Julien"],
    "docs/90-placeholders_archive": ["Marty"],
    "docs/99_handoff": ["Heider"],
}

# Patterns de secrets (précis pour éviter faux positifs)
SECRET_PATTERNS = [
    (r"password\s*[:=]\s*['\"][^'\"]+['\"]", "PASSWORD_IN_CLEAR"),
    (r"postgres://[^:]+:[^@]+@", "DATABASE_URL_WITH_CREDENTIALS"),
    (r"mysql://[^:]+:[^@]+@", "DATABASE_URL_WITH_CREDENTIALS"),
    (r"mongodb://[^:]+:[^@]+@", "DATABASE_URL_WITH_CREDENTIALS"),
    (r"-----BEGIN\s+(RSA\s+)?PRIVATE\s+KEY-----", "PRIVATE_KEY"),
    (r"-----BEGIN\s+PGP\s+PRIVATE\s+KEY-----", "PGP_PRIVATE_KEY"),
    (r"AKIA[0-9A-Z]{16}", "AWS_ACCESS_KEY"),
    (r"sk-[a-zA-Z0-9]{48}", "OPENAI_API_KEY"),
    (r"ghp_[a-zA-Z0-9]{36}", "GITHUB_TOKEN"),
    (r"xox[baprs]-[a-zA-Z0-9-]+", "SLACK_TOKEN"),
]


class SSOTViolation:
    """Représente une violation SSOT."""
    
    def __init__(self, filepath: str, violation_type: str, details: str = "", level: str = "error"):
        self.filepath = filepath
        self.violation_type = violation_type
        self.details = details
        self.level = level  # "error" ou "warning"
    
    def __str__(self):
        icon = "❌" if self.level == "error" else "⚠️"
        if self.details:
            return f"{icon} [{self.violation_type}] {self.filepath}: {self.details}"
        return f"{icon} [{self.violation_type}] {self.filepath}"


def get_owners_for_path(filepath: str) -> List[str]:
    """Get expected owners based on file path according to Ownership Matrix."""
    filepath_str = str(filepath).replace("\\", "/")
    
    # Check from most specific to least specific
    sorted_patterns = sorted(OWNERSHIP_MATRIX.keys(), key=len, reverse=True)
    for pattern in sorted_patterns:
        if filepath_str.startswith(pattern):
            return OWNERSHIP_MATRIX[pattern]
    
    return ["Marty"]  # Default


def is_versioned_obsolete(filename: str, frontmatter_id: str) -> bool:
    """Check if file is a versioned obsolete doc (V1_2, V1_0)."""
    combined = f"{filename} {frontmatter_id}"
    for pattern in OBSOLETE_VERSION_PATTERNS:
        if re.search(pattern, combined, re.IGNORECASE):
            # Exclude if also matches active patterns
            for active in ACTIVE_VERSION_PATTERNS:
                if re.search(active, combined, re.IGNORECASE):
                    return False
            return True
    return False


def is_versioned_active(filename: str, frontmatter_id: str) -> bool:
    """Check if file is a versioned active doc (V1_3)."""
    combined = f"{filename} {frontmatter_id}"
    for pattern in ACTIVE_VERSION_PATTERNS:
        if re.search(pattern, combined, re.IGNORECASE):
            return True
    return False


def parse_frontmatter(content: str) -> Tuple[Dict, bool]:
    """
    Parse le frontmatter YAML d'un fichier markdown.
    Retourne (dict_frontmatter, has_frontmatter)
    """
    if not content.strip().startswith("---"):
        return {}, False
    
    # Chercher la fin du frontmatter
    lines = content.split("\n")
    end_idx = -1
    for i, line in enumerate(lines[1:], start=1):
        if line.strip() == "---":
            end_idx = i
            break
    
    if end_idx == -1:
        return {}, False
    
    # Parser le YAML de manière simple (sans dépendance externe)
    frontmatter = {}
    current_key = None
    current_list = None
    
    for line in lines[1:end_idx]:
        if not line.strip() or line.strip().startswith("#"):
            continue
        
        # Détection de liste
        if line.startswith("  - ") or line.startswith("- "):
            if current_key and current_list is not None:
                item = line.strip()
                if item.startswith("- "):
                    item = item[2:].strip()
                current_list.append(item.strip('"').strip("'"))
            continue
        
        # Clé: valeur
        match = re.match(r"^(\w+):\s*(.*)", line)
        if match:
            key, value = match.groups()
            if current_key and current_list is not None:
                frontmatter[current_key] = current_list
            
            if value.strip():
                # Inline list: owners: ["Marty", "Dan"]
                if value.strip().startswith("["):
                    items = re.findall(r'"([^"]+)"|\'([^\']+)\'|([^\s,\[\]]+)', value)
                    frontmatter[key] = [next(x for x in item if x) for item in items]
                    current_key = None
                    current_list = None
                else:
                    frontmatter[key] = value.strip().strip('"').strip("'")
                    current_key = None
                    current_list = None
            else:
                # Liste à venir
                current_key = key
                current_list = []
    
    # Finaliser dernière liste
    if current_key and current_list is not None:
        frontmatter[current_key] = current_list
    
    return frontmatter, True


def check_frontmatter(filepath: str, content: str) -> Tuple[List[SSOTViolation], Optional[str], Dict]:
    """Vérifie le frontmatter d'un fichier."""
    violations = []
    
    frontmatter, has_fm = parse_frontmatter(content)
    
    if not has_fm:
        violations.append(SSOTViolation(filepath, "MISSING_FRONTMATTER"))
        return violations, None, {}
    
    # Vérifier champs obligatoires
    missing = REQUIRED_FIELDS - set(frontmatter.keys())
    if missing:
        violations.append(SSOTViolation(
            filepath, "MISSING_FIELDS", f"Champs manquants: {', '.join(sorted(missing))}"
        ))
    
    # Vérifier status
    status = frontmatter.get("status", "")
    if status and status not in VALID_STATUSES:
        violations.append(SSOTViolation(
            filepath, "INVALID_STATUS", f"Status '{status}' invalide (autorisés: {', '.join(VALID_STATUSES)})"
        ))
    
    return violations, frontmatter.get("id"), frontmatter


def check_version_status(filepath: str, frontmatter: Dict) -> List[SSOTViolation]:
    """Vérifie la conformité version/status selon Versioning Policy."""
    violations = []
    
    if not frontmatter:
        return violations
    
    doc_id = frontmatter.get("id", "")
    status = frontmatter.get("status", "")
    filename = os.path.basename(filepath)
    
    # Skip files in archive folder (they're expected to be archived)
    if "90-placeholders_archive" in filepath:
        return violations
    
    # Check obsolete versions (V1_2, V1_0) - must be archived
    if is_versioned_obsolete(filename, doc_id):
        if status != "archived":
            violations.append(SSOTViolation(
                filepath, "VERSION_STATUS_MISMATCH",
                f"Doc V1.2/V1.0 avec status '{status}' doit être 'archived' (ou archivé dans legacy_v1_x/)",
                level="error"
            ))
    
    # Check active versions (V1_3) - should not be archived unless explicit
    if is_versioned_active(filename, doc_id):
        if status == "archived":
            violations.append(SSOTViolation(
                filepath, "ACTIVE_VERSION_ARCHIVED",
                f"Doc V1.3 avec status 'archived' - vérifier si c'est intentionnel",
                level="warning"
            ))
    
    return violations


def check_owners(filepath: str, frontmatter: Dict, validate_against_registry: bool = True) -> List[SSOTViolation]:
    """
    Vérifie la conformité des owners selon Ownership Matrix et agents registry.
    
    Args:
        filepath: Path to the file being checked
        frontmatter: Parsed frontmatter dict
        validate_against_registry: If True, also validate owners against agents registry
    """
    violations = []
    
    if not frontmatter:
        return violations
    
    current_owners = frontmatter.get("owners", [])
    if isinstance(current_owners, str):
        current_owners = [current_owners]
    
    # Skip files in archive folder
    if "90-placeholders_archive" in filepath:
        return violations
    
    # 1. Validate owners are valid agents (from registry)
    if validate_against_registry:
        valid_owners = load_valid_owners()
        if valid_owners:  # Only check if registry loaded successfully
            invalid_owners = [o for o in current_owners if o not in valid_owners]
            if invalid_owners:
                violations.append(SSOTViolation(
                    filepath, "INVALID_OWNER",
                    f"Owner(s) {invalid_owners} non reconnu(s) dans agents registry",
                    level="error"
                ))
    
    # 2. Load matrix from SSOT registry (dynamic) instead of hardcoded
    matrix, exceptions = load_ownership_matrix_from_ssot()
    
    # 3. Get expected owners (check exceptions first, then matrix)
    filepath_str = str(filepath).replace("\\", "/")
    expected_owners = None
    
    # Check exceptions first
    if filepath_str in exceptions:
        expected_owners = exceptions[filepath_str]
    else:
        # Find best match in matrix (longest prefix)
        sorted_patterns = sorted(matrix.keys(), key=len, reverse=True)
        for pattern in sorted_patterns:
            if filepath_str.startswith(pattern):
                expected_owners = matrix[pattern]
                break
    
    # Fallback to default if no match
    if expected_owners is None:
        expected_owners = ["Marty"]
    
    # 4. Check if owners match expected
    if set(current_owners) != set(expected_owners):
        violations.append(SSOTViolation(
            filepath, "OWNERS_MISMATCH",
            f"Owners actuels {current_owners} ≠ attendus {expected_owners} selon ssot_registry.json",
            level="warning"
        ))
    
    return violations


def check_secrets(filepath: str, content: str) -> List[SSOTViolation]:
    """Détecte les patterns de secrets évidents."""
    violations = []
    
    # Skip the Rulebook (contains examples of patterns, not real secrets)
    if "SSOT_RULEBOOK" in filepath:
        return violations
    
    for pattern, secret_type in SECRET_PATTERNS:
        if re.search(pattern, content, re.IGNORECASE):
            # NE PAS logger le contenu sensible, seulement le type
            violations.append(SSOTViolation(filepath, f"SECRET_DETECTED_{secret_type}"))
    
    return violations


def find_md_files(docs_dir: str) -> List[str]:
    """Trouve tous les fichiers .md (hors README.md et *_INDEX.md) dans docs/."""
    md_files = []
    
    # Fichiers d'index exclus de la vérification frontmatter
    INDEX_PATTERNS = {"README.md", "QA_INDEX.md", "SECURITY_INDEX.md"}
    
    for root, dirs, files in os.walk(docs_dir):
        for f in files:
            if f.endswith(".md") and f not in INDEX_PATTERNS:
                md_files.append(os.path.join(root, f))
    
    return sorted(md_files)


def lint_ssot(strict: bool = False, quiet: bool = False, 
              check_versions: bool = False, check_owners: bool = False) -> Tuple[int, int]:
    """
    Point d'entrée principal du linter.
    Retourne (nombre_erreurs, nombre_warnings).
    """
    errors = []
    warnings = []
    ids_seen: Dict[str, str] = {}  # id -> filepath
    
    if not os.path.isdir(DOCS_DIR):
        print(f"❌ Dossier '{DOCS_DIR}' non trouvé")
        return 1, 0
    
    md_files = find_md_files(DOCS_DIR)
    
    if not quiet:
        print(f"🔍 SSOT Lint - Analyse de {len(md_files)} fichiers .md...")
        options = []
        if strict:
            options.append("strict")
        if check_versions:
            options.append("check-versions")
        if check_owners:
            options.append("check-owners")
        if options:
            print(f"   Options: {', '.join(options)}")
        print()
    
    for filepath in md_files:
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
        except Exception as e:
            errors.append(SSOTViolation(filepath, "READ_ERROR", str(e)))
            continue
        
        # Check frontmatter
        fm_violations, doc_id, frontmatter = check_frontmatter(filepath, content)
        for v in fm_violations:
            if v.level == "warning":
                warnings.append(v)
            else:
                errors.append(v)
        
        # Check ID uniqueness
        if doc_id:
            if doc_id in ids_seen:
                errors.append(SSOTViolation(
                    filepath, "DUPLICATE_ID", 
                    f"ID '{doc_id}' déjà utilisé dans {ids_seen[doc_id]}"
                ))
            else:
                ids_seen[doc_id] = filepath
        
        # Check secrets
        for v in check_secrets(filepath, content):
            errors.append(v)
        
        # Check version/status (if enabled or strict mode)
        if check_versions or strict:
            for v in check_version_status(filepath, frontmatter):
                if v.level == "warning":
                    warnings.append(v)
                else:
                    errors.append(v)
        
        # Check owners (if enabled)
        if check_owners:
            for v in check_owners(filepath, frontmatter):
                warnings.append(v)
    
    # Afficher résultats
    all_violations = errors + warnings
    
    if all_violations:
        if not quiet:
            print("=" * 60)
            print("VIOLATIONS SSOT DÉTECTÉES")
            print("=" * 60)
        
        # Errors first
        for v in errors:
            print(v)
        
        # Then warnings
        if warnings:
            if not quiet and errors:
                print()
                print("--- WARNINGS ---")
            for v in warnings:
                print(v)
        
        if not quiet:
            print()
            print(f"📊 Total: {len(errors)} erreur(s), {len(warnings)} warning(s) sur {len(md_files)} fichiers")
    else:
        if not quiet:
            print("✅ Aucune violation SSOT détectée")
            print(f"📊 {len(md_files)} fichiers analysés, {len(ids_seen)} IDs uniques")
    
    return len(errors), len(warnings)


def main():
    """Point d'entrée CLI."""
    strict = "--strict" in sys.argv
    quiet = "--quiet" in sys.argv or "-q" in sys.argv
    check_versions_flag = "--check-versions" in sys.argv
    check_owners_flag = "--check-owners" in sys.argv
    
    errors, warnings = lint_ssot(
        strict=strict, 
        quiet=quiet,
        check_versions=check_versions_flag,
        check_owners=check_owners_flag
    )
    
    # En mode strict, toute erreur = exit 1
    if strict and errors > 0:
        sys.exit(1)
    
    # En mode normal, exit 0 si seulement warnings
    sys.exit(0 if errors == 0 else 1)


if __name__ == "__main__":
    main()
