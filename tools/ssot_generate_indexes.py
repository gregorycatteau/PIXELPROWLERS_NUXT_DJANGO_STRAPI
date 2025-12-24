#!/usr/bin/env python3
"""
SSOT Index Generator — PixelProwlers
======================================
Génère/met à jour les README d'index à partir de ssot_registry.json.

Usage:
    python3 tools/ssot_generate_indexes.py [--dry-run | --apply]

Options:
    --dry-run    Affiche les changements sans modifier les fichiers
    --apply      Applique les changements aux fichiers

Conservation des sections humaines:
    Les sections entre <!-- KEEP --> et <!-- ENDKEEP --> sont préservées.
    
Exemples:
    python3 tools/ssot_generate_indexes.py --dry-run
    python3 tools/ssot_generate_indexes.py --apply
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
DOCS_ROOT = PROJECT_ROOT / "docs"

# Pattern pour extraire les sections KEEP
KEEP_PATTERN = re.compile(r'<!-- KEEP -->(.*?)<!-- ENDKEEP -->', re.DOTALL)

# Pattern pour extraire le frontmatter
FRONTMATTER_PATTERN = re.compile(r'^---\s*\n(.*?)\n---', re.DOTALL)


def load_registry() -> dict:
    """Charge le ssot_registry.json."""
    with open(REGISTRY_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)


def extract_frontmatter(filepath: Path) -> dict:
    """Extrait le frontmatter YAML d'un fichier .md."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        match = FRONTMATTER_PATTERN.match(content)
        if not match:
            return {}
        
        fm_text = match.group(1)
        result = {}
        
        # Parse simple du YAML
        for line in fm_text.split('\n'):
            if ':' in line and not line.strip().startswith('-'):
                key, value = line.split(':', 1)
                key = key.strip()
                value = value.strip().strip('"').strip("'")
                result[key] = value
        
        return result
    except Exception:
        return {}


def extract_keep_sections(content: str) -> list[str]:
    """Extrait toutes les sections KEEP."""
    return KEEP_PATTERN.findall(content)


def scan_directory_files(dir_path: Path) -> list[dict]:
    """Scanne les fichiers .md d'un répertoire (non récursif)."""
    files = []
    
    if not dir_path.exists():
        return files
    
    for item in sorted(dir_path.iterdir()):
        if item.is_file() and item.suffix == '.md' and item.name != 'README.md':
            fm = extract_frontmatter(item)
            
            # Déterminer la priorité depuis le frontmatter ou le nom
            priority = fm.get('priority', '')
            
            files.append({
                'name': item.name,
                'path': item,
                'id': fm.get('id', item.stem.upper()),
                'status': fm.get('status', 'draft'),
                'priority': priority,
                'title': extract_title(item),
            })
        elif item.is_file() and item.suffix in ['.yaml', '.yml', '.json']:
            # Fichiers de config/spec
            if item.name not in ['ssot_registry.json', 'ui_texts_schema.json']:
                files.append({
                    'name': item.name,
                    'path': item,
                    'id': item.stem.upper().replace('.', '_'),
                    'status': 'active',
                    'priority': '',
                    'title': f"Fichier {item.suffix.upper()[1:]}",
                })
    
    return files


def extract_title(filepath: Path) -> str:
    """Extrait le titre du premier H1 ou du nom du fichier."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Skip frontmatter
        if content.startswith('---'):
            end = content.find('---', 3)
            if end > 0:
                content = content[end+3:]
        
        # Find first H1
        for line in content.split('\n'):
            line = line.strip()
            if line.startswith('# '):
                return line[2:].strip()
        
        return filepath.stem.replace('_', ' ')
    except Exception:
        return filepath.stem.replace('_', ' ')


def get_directory_info(registry: dict, dir_key: str) -> dict:
    """Récupère les infos d'un répertoire depuis le registry."""
    return registry.get('directories', {}).get(dir_key, {})


def generate_index_content(
    dir_key: str,
    dir_info: dict,
    files: list[dict],
    subdirs: list[str],
    keep_sections: list[str],
    owners: list[str]
) -> str:
    """Génère le contenu d'un README d'index."""
    
    # En-tête
    title = dir_key.replace('-', ' ').replace('_', ' ').title()
    role = dir_info.get('role', 'Documentation')
    
    content = f"# {title} — Index\n\n"
    content += f"> **Périmètre** : {role}\n\n"
    
    # Section générée automatiquement
    content += "<!-- GENERATED:START -->\n"
    content += f"<!-- ⚠️ Section générée automatiquement par ssot_generate_indexes.py — {date.today().isoformat()} -->\n\n"
    
    # Tableau des documents
    if files:
        content += "## Documents\n\n"
        content += "| Document | Status | Description |\n"
        content += "|----------|--------|-------------|\n"
        
        for f in files:
            priority_badge = f"**{f['priority']}** — " if f['priority'] else ""
            status_badge = f['status']
            link = f"[{f['name']}](./{f['name']})"
            content += f"| {link} | {status_badge} | {priority_badge}{f['title']} |\n"
        
        content += "\n"
    
    # Sous-répertoires
    if subdirs:
        content += "## Sous-dossiers\n\n"
        for subdir in subdirs:
            content += f"- [{subdir}/](./{subdir}/)\n"
        content += "\n"
    
    # Owners
    if owners:
        content += f"**Owners** : {', '.join(owners)}\n\n"
    
    content += "<!-- GENERATED:END -->\n\n"
    
    # Sections KEEP préservées
    for i, section in enumerate(keep_sections):
        content += f"<!-- KEEP -->{section}<!-- ENDKEEP -->\n\n"
    
    # Footer
    if '/' in dir_key:
        parent_dir = '/'.join(dir_key.split('/')[:-1])
        content += f"---\n\n**Parent** : [{parent_dir}/README.md](../README.md)\n"
    else:
        content += "---\n\n**Parent** : [docs/README.md](../README.md)\n"
    
    return content


def read_existing_readme(readme_path: Path) -> str:
    """Lit le README existant ou retourne une chaîne vide."""
    if readme_path.exists():
        with open(readme_path, 'r', encoding='utf-8') as f:
            return f.read()
    return ""


def process_directory(
    dir_key: str,
    registry: dict,
    dry_run: bool
) -> dict:
    """Traite un répertoire et génère/met à jour son README."""
    
    dir_info = get_directory_info(registry, dir_key)
    index_name = dir_info.get('index', 'README.md')
    dir_path = DOCS_ROOT / dir_key
    readme_path = dir_path / index_name
    
    result = {
        'dir': dir_key,
        'readme': str(readme_path.relative_to(PROJECT_ROOT)),
        'status': 'unchanged',
        'files_count': 0,
        'message': ''
    }
    
    if not dir_path.exists():
        result['status'] = 'skipped'
        result['message'] = 'Dossier inexistant'
        return result
    
    # Lire le README existant
    existing_content = read_existing_readme(readme_path)
    keep_sections = extract_keep_sections(existing_content)
    
    # Scanner les fichiers
    files = scan_directory_files(dir_path)
    result['files_count'] = len(files)
    
    # Récupérer les subdirs et owners
    subdirs = dir_info.get('subdirs', [])
    owners = dir_info.get('owners', registry.get('ownershipMatrix', {}).get(f'docs/{dir_key}', ['Marty']))
    
    # Générer le nouveau contenu
    new_content = generate_index_content(
        dir_key,
        dir_info,
        files,
        subdirs,
        keep_sections,
        owners
    )
    
    # Comparer
    if existing_content.strip() == new_content.strip():
        result['status'] = 'unchanged'
        result['message'] = 'Aucun changement'
    elif dry_run:
        result['status'] = 'would_update'
        result['message'] = f'{len(files)} docs, {len(keep_sections)} sections KEEP'
    else:
        # Écrire le fichier
        with open(readme_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        result['status'] = 'updated'
        result['message'] = f'{len(files)} docs, {len(keep_sections)} sections KEEP préservées'
    
    return result


def get_all_directories(registry: dict) -> list[str]:
    """Récupère la liste de tous les répertoires à traiter."""
    dirs = []
    
    for dir_key, dir_info in registry.get('directories', {}).items():
        dirs.append(dir_key)
        
        # Ajouter les subdirs
        for subdir in dir_info.get('subdirs', []):
            dirs.append(f"{dir_key}/{subdir}")
    
    return sorted(dirs)


def main():
    parser = argparse.ArgumentParser(
        description="SSOT Index Generator — Génère/met à jour les README d'index",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Sections préservées:
  Les contenus entre <!-- KEEP --> et <!-- ENDKEEP --> sont conservés.
  Utilisez ces délimiteurs pour vos notes personnalisées.

Exemples:
  %(prog)s --dry-run     Prévisualiser les changements
  %(prog)s --apply       Appliquer les changements
"""
    )
    
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('--dry-run', action='store_true', help='Prévisualiser sans modifier')
    group.add_argument('--apply', action='store_true', help='Appliquer les changements')
    group.add_argument('--check', action='store_true', help='CI mode: échoue si drift détecté (exit 1)')
    
    parser.add_argument('--dir', help='Traiter uniquement ce répertoire (ex: 30-tech_specs/backend)')
    
    args = parser.parse_args()
    
    # Charger le registry
    registry = load_registry()
    
    # Déterminer les répertoires à traiter
    if args.dir:
        directories = [args.dir]
    else:
        directories = get_all_directories(registry)
    
    # Header
    mode = "CHECK" if args.check else ("DRY-RUN" if args.dry_run else "APPLY")
    print("=" * 60)
    print(f"📚 SSOT Index Generator — Mode: {mode}")
    print("=" * 60)
    print(f"   Registry: {REGISTRY_PATH.relative_to(PROJECT_ROOT)}")
    print(f"   Répertoires: {len(directories)}")
    print("=" * 60)
    print()
    
    # Traiter chaque répertoire (check et dry-run = même comportement, pas d'écriture)
    is_dry = args.dry_run or args.check
    results = []
    for dir_key in directories:
        result = process_directory(dir_key, registry, is_dry)
        results.append(result)
    
    # Afficher les résultats
    updated = [r for r in results if r['status'] in ['updated', 'would_update']]
    unchanged = [r for r in results if r['status'] == 'unchanged']
    skipped = [r for r in results if r['status'] == 'skipped']
    
    if updated:
        status_label = "Seraient mis à jour" if args.dry_run else "Mis à jour"
        print(f"📝 {status_label}:")
        for r in updated:
            print(f"   ✏️  {r['readme']} — {r['message']}")
        print()
    
    if unchanged:
        print(f"✅ Inchangés: {len(unchanged)} fichiers")
    
    if skipped:
        print(f"⏭️  Ignorés: {len(skipped)} dossiers")
        for r in skipped:
            print(f"   ⚠️  {r['dir']} — {r['message']}")
    
    print()
    print("=" * 60)
    
    # Mode --check : échoue si drift détecté
    if args.check:
        if updated:
            print("❌ INDEX DRIFT DETECTED!")
            print(f"   {len(updated)} README désynchronisés.")
            print()
            print("🔧 Pour corriger localement:")
            print("   python3 tools/ssot_generate_indexes.py --apply")
            print("   git add docs/")
            print("   git commit -m 'chore(docs): sync SSOT indexes'")
            return 1
        else:
            print("✅ Tous les index sont à jour (pas de drift)")
            return 0
    
    if args.dry_run and updated:
        print("💡 Pour appliquer: python3 tools/ssot_generate_indexes.py --apply")
    elif not args.dry_run and updated:
        print(f"✅ {len(updated)} README mis à jour avec succès")
    else:
        print("✅ Tous les index sont à jour")
    
    return 0


if __name__ == "__main__":
    sys.exit(main())
