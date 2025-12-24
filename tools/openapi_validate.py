#!/usr/bin/env python3
"""
OpenAPI Validator — PixelProwlers
=================================
Valide la syntaxe YAML et la structure OpenAPI basique du fichier openapi.v1.yaml.

Usage:
    python3 tools/openapi_validate.py
    python3 tools/openapi_validate.py --strict

Options:
    --strict    Valide également la conformité OpenAPI 3.0 (requiert openapi-spec-validator)

Exit codes:
    0   Validation réussie
    1   Erreur de syntaxe YAML
    2   Structure OpenAPI manquante
    3   Erreur de validation OpenAPI (mode strict)
"""

import sys
import os
from pathlib import Path

# Chemin vers l'OpenAPI
OPENAPI_PATH = Path(__file__).parent.parent / "docs" / "30-tech_specs" / "backend" / "openapi.v1.yaml"

def validate_yaml_syntax(filepath: Path) -> tuple[bool, str, dict | None]:
    """
    Valide la syntaxe YAML du fichier.
    
    Returns:
        (success, message, parsed_data)
    """
    try:
        import yaml
    except ImportError:
        print("⚠️  Module 'pyyaml' non installé. Installation: pip install pyyaml")
        sys.exit(1)
    
    if not filepath.exists():
        return False, f"❌ Fichier non trouvé: {filepath}", None
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f)
        return True, f"✅ Syntaxe YAML valide: {filepath.name}", data
    except yaml.YAMLError as e:
        return False, f"❌ Erreur syntaxe YAML:\n{e}", None


def validate_openapi_structure(data: dict) -> tuple[bool, list[str]]:
    """
    Valide la structure de base OpenAPI 3.0.
    
    Returns:
        (success, messages)
    """
    messages = []
    errors = 0
    
    # Champs requis OpenAPI 3.0
    required_fields = ['openapi', 'info', 'paths']
    for field in required_fields:
        if field not in data:
            messages.append(f"❌ Champ requis manquant: '{field}'")
            errors += 1
        else:
            messages.append(f"✅ Champ présent: '{field}'")
    
    # Vérifier version OpenAPI
    if 'openapi' in data:
        version = data['openapi']
        if not str(version).startswith('3.'):
            messages.append(f"⚠️  Version OpenAPI non 3.x: {version}")
        else:
            messages.append(f"✅ Version OpenAPI: {version}")
    
    # Vérifier info
    if 'info' in data:
        info = data['info']
        if 'title' not in info:
            messages.append("❌ info.title manquant")
            errors += 1
        if 'version' not in info:
            messages.append("❌ info.version manquant")
            errors += 1
    
    # Vérifier paths
    if 'paths' in data:
        paths = data['paths']
        messages.append(f"📍 Endpoints trouvés: {len(paths)}")
        for path in paths:
            messages.append(f"   • {path}")
    
    # Vérifier components (optionnel mais recommandé)
    if 'components' in data:
        components = data['components']
        if 'schemas' in components:
            messages.append(f"📦 Schemas trouvés: {len(components['schemas'])}")
    
    # Vérifier tags
    if 'tags' in data:
        messages.append(f"🏷️  Tags trouvés: {len(data['tags'])}")
    
    return errors == 0, messages


def validate_openapi_strict(filepath: Path) -> tuple[bool, str]:
    """
    Validation stricte avec openapi-spec-validator.
    
    Returns:
        (success, message)
    """
    try:
        from openapi_spec_validator import validate_spec
        from openapi_spec_validator.readers import read_from_filename
    except ImportError:
        return True, "⚠️  openapi-spec-validator non installé (pip install openapi-spec-validator). Skipping strict validation."
    
    try:
        spec_dict, _ = read_from_filename(str(filepath))
        validate_spec(spec_dict)
        return True, "✅ Validation OpenAPI stricte réussie"
    except Exception as e:
        return False, f"❌ Erreur validation OpenAPI stricte:\n{e}"


def main():
    print("=" * 60)
    print("🔍 OpenAPI Validator — PixelProwlers")
    print("=" * 60)
    print(f"📄 Fichier: {OPENAPI_PATH}")
    print()
    
    strict_mode = "--strict" in sys.argv
    
    # Étape 1: Syntaxe YAML
    print("── Étape 1: Validation syntaxe YAML ──")
    success, message, data = validate_yaml_syntax(OPENAPI_PATH)
    print(message)
    if not success:
        sys.exit(1)
    print()
    
    # Étape 2: Structure OpenAPI
    print("── Étape 2: Validation structure OpenAPI ──")
    success, messages = validate_openapi_structure(data)
    for msg in messages:
        print(msg)
    if not success:
        print("\n❌ Structure OpenAPI invalide")
        sys.exit(2)
    print()
    
    # Étape 3: Validation stricte (optionnelle)
    if strict_mode:
        print("── Étape 3: Validation OpenAPI stricte ──")
        success, message = validate_openapi_strict(OPENAPI_PATH)
        print(message)
        if not success:
            sys.exit(3)
        print()
    
    # Résumé
    print("=" * 60)
    print("✅ VALIDATION RÉUSSIE")
    print("=" * 60)
    print()
    print("💡 Commandes utiles:")
    print("   • Swagger UI: npx @redocly/cli preview-docs docs/30-tech_specs/backend/openapi.v1.yaml")
    print("   • Lint avancé: npx @redocly/cli lint docs/30-tech_specs/backend/openapi.v1.yaml")
    print("   • Générer client: npx openapi-generator-cli generate -i openapi.v1.yaml -g typescript-axios -o client/")
    
    sys.exit(0)


if __name__ == "__main__":
    main()
