#!/usr/bin/env python3
"""
SSOT Owners Backfill Script
Aligns frontmatter owners with ownershipMatrix from ssot_registry.json
"""

import json
import os
import re
import sys
from pathlib import Path

DOCS_DIR = Path("docs")
REGISTRY_PATH = Path("docs/00-foundations/ssot_registry.json")
AGENTS_REGISTRY_PATH = Path("agents/agents_registry.json")

def load_registry():
    with open(REGISTRY_PATH) as f:
        return json.load(f)

def load_agents_registry():
    with open(AGENTS_REGISTRY_PATH) as f:
        data = json.load(f)
    return {a["displayName"] for a in data["agents"]}

def get_owners_for_file(filepath: str, registry: dict) -> list:
    """Determine owners for a file based on ownershipMatrix and exceptions."""
    exceptions = registry.get("ownershipExceptions", {})
    matrix = registry.get("ownershipMatrix", {})
    
    # Check exceptions first (file-level override)
    if filepath in exceptions:
        return exceptions[filepath]
    
    # Find best matching path in matrix (longest prefix match)
    best_match = None
    best_len = 0
    for path_prefix in matrix:
        if filepath.startswith(path_prefix) and len(path_prefix) > best_len:
            best_match = path_prefix
            best_len = len(path_prefix)
    
    if best_match:
        return matrix[best_match]
    
    # Fallback to parent directory
    parts = filepath.split("/")
    if len(parts) >= 2:
        parent = "/".join(parts[:2])  # e.g., docs/00-foundations
        if parent in matrix:
            return matrix[parent]
    
    return ["Marty"]  # Default fallback

def parse_frontmatter(content: str):
    """Parse YAML frontmatter from markdown."""
    match = re.match(r'^---\n(.*?)\n---\n', content, re.DOTALL)
    if not match:
        return None, content
    
    fm_text = match.group(1)
    body = content[match.end():]
    
    # Simple YAML parsing for owners
    fm = {}
    for line in fm_text.split('\n'):
        if ':' in line:
            key, value = line.split(':', 1)
            fm[key.strip()] = value.strip()
    
    return fm_text, body

def update_owners_in_frontmatter(fm_text: str, new_owners: list) -> str:
    """Update owners field in frontmatter text."""
    owners_str = json.dumps(new_owners)
    
    # Replace existing owners line
    if re.search(r'^owners:\s*\[', fm_text, re.MULTILINE):
        fm_text = re.sub(r'^owners:\s*\[.*?\]', f'owners: {owners_str}', fm_text, flags=re.MULTILINE)
    elif re.search(r'^owners:', fm_text, re.MULTILINE):
        fm_text = re.sub(r'^owners:.*$', f'owners: {owners_str}', fm_text, flags=re.MULTILINE)
    else:
        # Add owners after date line
        fm_text = re.sub(r'^(date:.*)$', f'\\1\nowners: {owners_str}', fm_text, flags=re.MULTILINE)
    
    return fm_text

def process_file(filepath: Path, registry: dict, valid_owners: set, dry_run: bool = False):
    """Process a single markdown file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return None, f"Error reading: {e}"
    
    fm_text, body = parse_frontmatter(content)
    if fm_text is None:
        return None, "No frontmatter"
    
    # Get current owners
    owners_match = re.search(r'^owners:\s*\[(.*?)\]', fm_text, re.MULTILINE)
    if owners_match:
        current_str = owners_match.group(1)
        # Parse owners list
        current_owners = [o.strip().strip('"\'') for o in current_str.split(',') if o.strip()]
    else:
        current_owners = []
    
    # Get target owners
    rel_path = str(filepath)
    target_owners = get_owners_for_file(rel_path, registry)
    
    # Check if update needed
    needs_update = False
    reason = []
    
    if not current_owners:
        needs_update = True
        reason.append("empty owners")
    elif set(current_owners) != set(target_owners):
        # Only update if current owners don't include any valid target
        if not any(o in valid_owners for o in current_owners):
            needs_update = True
            reason.append("invalid owners")
        elif current_owners == ['Marty'] and target_owners != ['Marty']:
            # Update default Marty to specific owners
            needs_update = True
            reason.append("more specific owners available")
    
    if needs_update:
        new_fm = update_owners_in_frontmatter(fm_text, target_owners)
        new_content = f"---\n{new_fm}\n---\n{body}"
        
        if not dry_run:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
        
        return {
            "file": str(filepath),
            "before": current_owners,
            "after": target_owners,
            "reason": ", ".join(reason)
        }, None
    
    return None, None

def main():
    dry_run = "--dry-run" in sys.argv
    
    print("=" * 60)
    print("SSOT Owners Backfill Script")
    print("=" * 60)
    
    if dry_run:
        print("DRY RUN MODE - No files will be modified")
    
    registry = load_registry()
    valid_owners = load_agents_registry()
    
    print(f"\nValid owners: {sorted(valid_owners)}")
    print(f"\nScanning {DOCS_DIR}...")
    
    updates = []
    errors = []
    skipped = 0
    
    for filepath in DOCS_DIR.rglob("*.md"):
        # Skip archived files
        if "90-placeholders_archive" in str(filepath):
            skipped += 1
            continue
        
        result, error = process_file(filepath, registry, valid_owners, dry_run)
        if error:
            if "No frontmatter" not in error:
                errors.append((str(filepath), error))
        elif result:
            updates.append(result)
    
    print(f"\n{'=' * 60}")
    print("RESULTS")
    print(f"{'=' * 60}")
    print(f"Files updated: {len(updates)}")
    print(f"Files skipped (archived): {skipped}")
    print(f"Errors: {len(errors)}")
    
    if updates:
        print(f"\n{'=' * 60}")
        print("UPDATES" + (" (would apply)" if dry_run else " (applied)"))
        print(f"{'=' * 60}")
        for u in updates:
            print(f"\n{u['file']}")
            print(f"  Before: {u['before']}")
            print(f"  After:  {u['after']}")
            print(f"  Reason: {u['reason']}")
    
    if errors:
        print(f"\n{'=' * 60}")
        print("ERRORS")
        print(f"{'=' * 60}")
        for f, e in errors:
            print(f"  {f}: {e}")
    
    print(f"\nDone!")
    return 0 if not errors else 1

if __name__ == "__main__":
    sys.exit(main())
