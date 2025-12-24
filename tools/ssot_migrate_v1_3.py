#!/usr/bin/env python3
"""
SSOT Migration Script V1.3
- Met à jour owners selon la matrice
- Met à jour status=archived pour V1_2/V1_0
- Prépare les git mv pour l'archivage physique
"""

import os
import re
import subprocess
from pathlib import Path
from datetime import date

DOCS_DIR = Path("docs")
TODAY = date.today().strftime("%Y-%m-%d")

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
    "docs/50-qa": ["Dan", "Eva"],
    "docs/60-legal": ["Marty"],
    "docs/70-seo": ["Rand", "Julien"],
    "docs/90-placeholders_archive": ["Marty"],
    "docs/99_handoff": ["Heider"],
}

# Patterns for versioned docs
OBSOLETE_VERSION_PATTERNS = [r"V1_2", r"V1_0", r"HOME_V1_2"]
ACTIVE_VERSION_PATTERNS = [r"V1_3"]


def get_owners_for_path(filepath: str) -> list:
    """Get default owners based on file path"""
    filepath_str = str(filepath).replace("\\", "/")
    
    # Check from most specific to least specific
    sorted_patterns = sorted(OWNERSHIP_MATRIX.keys(), key=len, reverse=True)
    for pattern in sorted_patterns:
        if filepath_str.startswith(pattern):
            return OWNERSHIP_MATRIX[pattern]
    
    return ["Marty"]  # Default


def is_versioned_obsolete(filename: str, frontmatter_id: str) -> bool:
    """Check if file is a versioned obsolete doc (V1_2, V1_0)"""
    combined = f"{filename} {frontmatter_id}"
    for pattern in OBSOLETE_VERSION_PATTERNS:
        if re.search(pattern, combined, re.IGNORECASE):
            # Exclude if also matches active patterns
            for active in ACTIVE_VERSION_PATTERNS:
                if re.search(active, combined, re.IGNORECASE):
                    return False
            return True
    return False


def parse_frontmatter(content: str) -> tuple:
    """Parse frontmatter and return (frontmatter_dict, body)"""
    if not content.startswith("---"):
        return None, content
    
    parts = content.split("---", 2)
    if len(parts) < 3:
        return None, content
    
    fm_text = parts[1].strip()
    body = "---".join(parts[2:])
    
    fm = {}
    current_key = None
    current_list = None
    
    for line in fm_text.split("\n"):
        # List item
        if line.strip().startswith("- "):
            if current_key and current_list is not None:
                current_list.append(line.strip()[2:].strip().strip('"').strip("'"))
            continue
        
        # Key-value
        if ":" in line:
            key, _, value = line.partition(":")
            key = key.strip()
            value = value.strip()
            
            if not value:  # Start of list
                fm[key] = []
                current_key = key
                current_list = fm[key]
            elif value.startswith("["):  # Inline list
                items = re.findall(r'"([^"]+)"|\'([^\']+)\'|([^\s,\[\]]+)', value)
                fm[key] = [next(x for x in item if x) for item in items]
                current_key = None
                current_list = None
            else:
                fm[key] = value.strip('"').strip("'")
                current_key = None
                current_list = None
    
    return fm, body


def format_frontmatter(fm: dict) -> str:
    """Format frontmatter dict back to YAML string"""
    lines = ["---"]
    for key, value in fm.items():
        if isinstance(value, list):
            if len(value) <= 3:  # Short lists inline
                formatted = "[" + ", ".join(f'"{v}"' for v in value) + "]"
                lines.append(f"{key}: {formatted}")
            else:  # Long lists as YAML list
                lines.append(f"{key}:")
                for item in value:
                    lines.append(f"  - {item}")
        else:
            lines.append(f"{key}: {value}")
    lines.append("---")
    return "\n".join(lines)


def process_files():
    """Main processing function"""
    stats = {
        "owners_updated": 0,
        "status_archived": 0,
        "files_to_move": [],
        "warnings": []
    }
    
    md_files = list(DOCS_DIR.rglob("*.md"))
    md_files = [f for f in md_files if f.name != "README.md"]
    
    for filepath in md_files:
        # Skip archive folder for status changes (but still update owners)
        in_archive = "90-placeholders_archive" in str(filepath)
        
        content = filepath.read_text(encoding="utf-8")
        fm, body = parse_frontmatter(content)
        
        if fm is None:
            continue
        
        changed = False
        filepath_str = str(filepath)
        
        # Get expected owners
        expected_owners = get_owners_for_path(filepath_str)
        current_owners = fm.get("owners", [])
        if isinstance(current_owners, str):
            current_owners = [current_owners]
        
        # Update owners if different
        if set(current_owners) != set(expected_owners):
            fm["owners"] = expected_owners
            changed = True
            stats["owners_updated"] += 1
        
        # Check for versioned obsolete docs
        fm_id = fm.get("id", "")
        current_status = fm.get("status", "active")
        
        if is_versioned_obsolete(filepath.name, fm_id):
            if current_status != "archived" and not in_archive:
                fm["status"] = "archived"
                fm["date"] = TODAY
                changed = True
                stats["status_archived"] += 1
                
                # Determine archive path
                version = "v1_2" if re.search(r"V1_2|HOME_V1_2", f"{filepath.name} {fm_id}", re.IGNORECASE) else "v1_0"
                rel_path = filepath.relative_to(DOCS_DIR)
                archive_path = DOCS_DIR / "90-placeholders_archive" / f"legacy_{version}" / rel_path
                stats["files_to_move"].append((filepath, archive_path))
        
        if changed:
            new_content = format_frontmatter(fm) + body
            filepath.write_text(new_content, encoding="utf-8")
            print(f"✅ Updated: {filepath}")
    
    return stats


def generate_git_mv_commands(files_to_move: list) -> list:
    """Generate git mv commands for archiving"""
    commands = []
    for src, dst in files_to_move:
        dst.parent.mkdir(parents=True, exist_ok=True)
        commands.append(f"git mv \"{src}\" \"{dst}\"")
    return commands


if __name__ == "__main__":
    print("🚀 SSOT Migration V1.3\n")
    
    if not DOCS_DIR.exists():
        print("❌ Dossier 'docs' non trouvé")
        exit(1)
    
    stats = process_files()
    
    print(f"\n📊 RÉSUMÉ:")
    print(f"   - Owners mis à jour: {stats['owners_updated']}")
    print(f"   - Status -> archived: {stats['status_archived']}")
    print(f"   - Fichiers à déplacer: {len(stats['files_to_move'])}")
    
    if stats["files_to_move"]:
        print(f"\n📁 COMMANDES git mv à exécuter:")
        for cmd in generate_git_mv_commands(stats["files_to_move"]):
            print(f"   {cmd}")
    
    print("\n✅ Migration terminée")
