#!/usr/bin/env python3
"""
SSOT Link Checker + Orphan Detector V2 — PixelProwlers

Scanne docs/**/*.md et :
1. Vérifie que les liens internes Markdown pointent vers des fichiers existants
2. Détecte les ancres (#section) invalides
3. Détecte les docs "orphelins" via graphe de références (V2)

Usage:
    python tools/ssot_linkcheck.py [--strict] [--quiet]
    python tools/ssot_linkcheck.py --orphans [--orphans-strict] [--report <path>]
    
Options:
    --strict          Exit 1 si liens cassés trouvés (bloquant CI)
    --quiet           Sortie minimale
    --no-orphans      Ne pas détecter les orphelins
    --orphans         Mode orphan detection V2 uniquement
    --orphans-strict  Exit 1 si orphelins trouvés (bloquant CI)
    --report <path>   Export rapport JSON vers fichier

Exit codes:
    0 = Aucun problème
    1 = Liens cassés détectés (mode strict uniquement)
    1 = Orphelins détectés (mode --orphans-strict uniquement)
"""

import os
import re
import sys
import json
from pathlib import Path
from typing import Dict, List, Set, Tuple, Optional
from urllib.parse import unquote
from datetime import datetime

# Configuration
DOCS_DIR = "docs"
REGISTRY_PATH = "docs/00-foundations/ssot_registry.json"

# Patterns pour extraire les liens Markdown
# Format: [texte](lien)  ou  [texte](lien#ancre)
MARKDOWN_LINK_PATTERN = re.compile(r'\[([^\]]*)\]\(([^)]+)\)')

# Fichiers d'index (exclus de la détection orphelins)
INDEX_FILES = {"README.md", "QA_INDEX.md", "SECURITY_INDEX.md"}
INDEX_SUFFIXES = ("_INDEX.md", "_index.md")

# Status canoniques pour orphan detection V2
CANONICAL_STATUSES = {"active", "stable"}


class LinkIssue:
    """Représente un problème de lien."""
    
    def __init__(self, source_file: str, target: str, issue_type: str, line_num: int = 0):
        self.source_file = source_file
        self.target = target
        self.issue_type = issue_type
        self.line_num = line_num
    
    def __str__(self):
        if self.line_num:
            return f"  📍 {self.source_file}:{self.line_num} → {self.target} [{self.issue_type}]"
        return f"  📍 {self.source_file} → {self.target} [{self.issue_type}]"
    
    def to_dict(self) -> Dict:
        return {
            "source_file": self.source_file,
            "target": self.target,
            "issue_type": self.issue_type,
            "line_num": self.line_num
        }


def is_internal_link(link: str) -> bool:
    """Vérifie si un lien est interne (relatif ou vers docs/)."""
    # Ignorer les liens externes
    if link.startswith(("http://", "https://", "mailto:", "tel:", "ftp://")):
        return False
    
    # Ignorer les liens d'ancre pure (#section)
    if link.startswith("#"):
        return False
    
    # Ignorer les liens de code/assets
    if link.startswith(("data:", "javascript:")):
        return False
    
    return True


def extract_path_and_anchor(link: str) -> Tuple[str, Optional[str]]:
    """Extrait le chemin et l'ancre d'un lien."""
    # Décoder les URL encodées
    link = unquote(link)
    
    if "#" in link:
        path, anchor = link.split("#", 1)
        return path, anchor
    return link, None


def resolve_link_path(source_file: str, link: str) -> str:
    """Résout un lien relatif par rapport au fichier source."""
    link_path, _ = extract_path_and_anchor(link)
    
    if not link_path:
        return ""
    
    source_dir = os.path.dirname(source_file)
    
    # Chemin absolu depuis la racine du projet
    if link_path.startswith("/"):
        return link_path.lstrip("/")
    
    # Chemin relatif
    resolved = os.path.normpath(os.path.join(source_dir, link_path))
    return resolved


def extract_headings(content: str) -> Set[str]:
    """Extrait les ancres (headings) d'un fichier Markdown."""
    headings = set()
    
    # Pattern pour les headings Markdown: # Titre, ## Sous-titre, etc.
    heading_pattern = re.compile(r'^#{1,6}\s+(.+)$', re.MULTILINE)
    
    for match in heading_pattern.finditer(content):
        heading_text = match.group(1).strip()
        # Convertir en ancre (slug)
        # Règles GitHub/GitLab: lowercase, espaces → tirets, supprimer caractères spéciaux
        anchor = heading_text.lower()
        anchor = re.sub(r'[^\w\s-]', '', anchor)
        anchor = re.sub(r'\s+', '-', anchor)
        anchor = anchor.strip('-')
        headings.add(anchor)
    
    return headings


def extract_frontmatter(content: str) -> Optional[Dict]:
    """Extrait le frontmatter YAML d'un fichier Markdown."""
    if not content.startswith("---"):
        return None
    
    try:
        # Trouver la fin du frontmatter
        end_idx = content.find("---", 3)
        if end_idx == -1:
            return None
        
        frontmatter_text = content[3:end_idx].strip()
        
        # Parse basique du YAML (sans dépendance externe)
        result = {}
        for line in frontmatter_text.split("\n"):
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if ":" in line:
                key, value = line.split(":", 1)
                key = key.strip()
                value = value.strip().strip('"').strip("'")
                result[key] = value
        
        return result
    except Exception:
        return None


def is_index_file(filepath: str) -> bool:
    """Vérifie si un fichier est un index (README, *_INDEX.md)."""
    filename = os.path.basename(filepath)
    
    if filename in INDEX_FILES:
        return True
    
    if filename.endswith(INDEX_SUFFIXES):
        return True
    
    return False


def scan_file_for_links(filepath: str) -> List[Tuple[str, int]]:
    """Scanne un fichier et retourne tous les liens Markdown avec leur numéro de ligne."""
    links = []
    
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            for line_num, line in enumerate(f, start=1):
                for match in MARKDOWN_LINK_PATTERN.finditer(line):
                    link = match.group(2)
                    if is_internal_link(link):
                        links.append((link, line_num))
    except Exception as e:
        print(f"⚠️ Erreur lecture {filepath}: {e}")
    
    return links


def find_all_md_files(docs_dir: str) -> List[str]:
    """Trouve tous les fichiers .md dans docs/."""
    md_files = []
    for root, dirs, files in os.walk(docs_dir):
        for f in files:
            if f.endswith(".md"):
                md_files.append(os.path.join(root, f))
    return sorted(md_files)


def load_registry() -> Dict:
    """Charge le registry SSOT."""
    if not os.path.exists(REGISTRY_PATH):
        return {}
    
    try:
        with open(REGISTRY_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"⚠️ Erreur chargement registry: {e}")
        return {}


def get_canonical_docs_v2(quiet: bool = False) -> Set[str]:
    """
    V2: Identifie tous les docs canoniques via deux sources:
    1. ssot_registry.json (si présent)
    2. Scan docs/**/*.md et lecture frontmatter (status: active|stable)
    
    Retourne: Set de chemins de fichiers canoniques (ex: "docs/00-foundations/SSOT_RULEBOOK_V1.md")
    """
    canonical_docs = set()
    
    # Source A: Registry SSOT
    registry = load_registry()
    if registry:
        directories = registry.get("directories", {})
        for dir_name, dir_info in directories.items():
            if not isinstance(dir_info, dict):
                continue
            
            files = dir_info.get("files", [])
            if isinstance(files, list):
                for f in files:
                    filepath = f"docs/{dir_name}/{f}"
                    if os.path.exists(filepath):
                        canonical_docs.add(filepath)
    
    # Source B: Scan frontmatter (fallback et complément)
    md_files = find_all_md_files(DOCS_DIR)
    
    for filepath in md_files:
        # Déjà dans canonical via registry
        if filepath in canonical_docs:
            continue
        
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            
            frontmatter = extract_frontmatter(content)
            if frontmatter:
                status = frontmatter.get("status", "").lower()
                if status in CANONICAL_STATUSES:
                    canonical_docs.add(filepath)
        except Exception:
            pass
    
    if not quiet:
        print(f"📋 {len(canonical_docs)} docs canoniques identifiés (registry + frontmatter)")
    
    return canonical_docs


def check_links(quiet: bool = False) -> Tuple[List[LinkIssue], Dict[str, List[str]]]:
    """
    Vérifie tous les liens internes.
    Retourne (liste d'issues, map fichier -> fichiers qui le référencent).
    """
    issues = []
    references = {}  # file -> list of files that reference it
    
    md_files = find_all_md_files(DOCS_DIR)
    
    if not quiet:
        print(f"🔍 Scan de {len(md_files)} fichiers Markdown...")
    
    # Cache des headings par fichier (pour vérification ancres)
    headings_cache = {}
    
    for filepath in md_files:
        links = scan_file_for_links(filepath)
        
        for link, line_num in links:
            resolved = resolve_link_path(filepath, link)
            
            if not resolved:
                continue
            
            link_path, anchor = extract_path_and_anchor(link)
            resolved_path = resolve_link_path(filepath, link_path) if link_path else None
            
            # Enregistrer la référence
            if resolved_path:
                if resolved_path not in references:
                    references[resolved_path] = []
                references[resolved_path].append(filepath)
            
            # Vérifier si le fichier cible existe
            if resolved_path and not os.path.exists(resolved_path):
                issues.append(LinkIssue(
                    filepath, link, "BROKEN_LINK", line_num
                ))
                continue
            
            # Vérifier l'ancre si présente
            if anchor and resolved_path and os.path.exists(resolved_path):
                if resolved_path not in headings_cache:
                    try:
                        with open(resolved_path, "r", encoding="utf-8") as f:
                            headings_cache[resolved_path] = extract_headings(f.read())
                    except:
                        headings_cache[resolved_path] = set()
                
                if anchor not in headings_cache[resolved_path]:
                    issues.append(LinkIssue(
                        filepath, link, "BROKEN_ANCHOR", line_num
                    ))
    
    return issues, references


def detect_orphans_v2(references: Dict[str, List[str]], quiet: bool = False) -> List[str]:
    """
    V2: Détecte les docs canoniques non référencés via graphe de références.
    
    Un doc est ORPHAN si :
    - Il est canonique (status active|stable via registry ou frontmatter)
    - Il n'est PAS un index (README.md, *_INDEX.md)
    - Il n'est référencé par AUCUN des:
        a) docs/README.md (index racine)
        b) README de son propre dossier
        c) Un autre doc canonique
    """
    orphans = []
    
    # Identifier tous les docs canoniques
    canonical_docs = get_canonical_docs_v2(quiet)
    
    if not canonical_docs:
        if not quiet:
            print("ℹ️ Aucun doc canonique trouvé, skip orphan check")
        return orphans
    
    # Identifier tous les docs canoniques pour filtrage des références
    canonical_set = canonical_docs.copy()
    
    # Index racine docs/README.md
    root_readme = "docs/README.md"
    
    for doc in sorted(canonical_docs):
        # Exclure les index eux-mêmes
        if is_index_file(doc):
            continue
        
        # Récupérer les fichiers qui référencent ce doc
        referencing_files = references.get(doc, [])
        
        # Vérifier les critères de référencement
        is_referenced = False
        
        for ref in referencing_files:
            # a) Référencé par docs/README.md
            if ref == root_readme:
                is_referenced = True
                break
            
            # b) Référencé par le README de son dossier
            doc_dir = os.path.dirname(doc)
            dir_readme = os.path.join(doc_dir, "README.md")
            if ref == dir_readme:
                is_referenced = True
                break
            
            # c) Référencé par un autre doc canonique
            if ref in canonical_set:
                is_referenced = True
                break
            
            # Référencé par un index quelconque (tolérance)
            if is_index_file(ref):
                is_referenced = True
                break
        
        if not is_referenced:
            orphans.append(doc)
    
    return sorted(orphans)


def run_linkcheck(strict: bool = False, quiet: bool = False, 
                  check_orphans: bool = True, orphans_strict: bool = False,
                  report_path: Optional[str] = None) -> int:
    """
    Point d'entrée principal.
    Retourne le code de sortie.
    """
    if not os.path.isdir(DOCS_DIR):
        print(f"❌ Dossier '{DOCS_DIR}' non trouvé")
        return 1
    
    print("=" * 60)
    print("🔗 SSOT Link Checker + Orphan Detector V2")
    print("=" * 60)
    
    # Vérifier les liens
    issues, references = check_links(quiet)
    
    # Détecter les orphelins (V2)
    orphans = []
    if check_orphans:
        orphans = detect_orphans_v2(references, quiet)
    
    # Rapport liens cassés
    broken_links = [i for i in issues if i.issue_type == "BROKEN_LINK"]
    broken_anchors = [i for i in issues if i.issue_type == "BROKEN_ANCHOR"]
    
    if broken_links:
        print()
        print(f"❌ LIENS CASSÉS ({len(broken_links)}):")
        print("-" * 40)
        for issue in broken_links:
            print(issue)
    
    if broken_anchors:
        print()
        print(f"⚠️ ANCRES INVALIDES ({len(broken_anchors)}):")
        print("-" * 40)
        for issue in broken_anchors:
            print(issue)
    
    # Rapport orphelins
    if orphans:
        print()
        print(f"📦 DOCS ORPHELINS ({len(orphans)}):")
        print("   (canoniques mais non référencés par un index ou doc canonique)")
        print("-" * 40)
        for orphan in orphans:
            print(f"  📄 {orphan}")
    
    # Export rapport JSON si demandé
    if report_path:
        report = {
            "timestamp": datetime.now().isoformat(),
            "summary": {
                "broken_links": len(broken_links),
                "broken_anchors": len(broken_anchors),
                "orphans": len(orphans)
            },
            "broken_links": [i.to_dict() for i in broken_links],
            "broken_anchors": [i.to_dict() for i in broken_anchors],
            "orphans": orphans
        }
        try:
            with open(report_path, "w", encoding="utf-8") as f:
                json.dump(report, f, indent=2, ensure_ascii=False)
            print(f"\n📊 Rapport exporté: {report_path}")
        except Exception as e:
            print(f"⚠️ Erreur export rapport: {e}")
    
    # Résumé
    print()
    print("=" * 60)
    total_issues = len(broken_links) + len(broken_anchors)
    
    if total_issues == 0 and len(orphans) == 0:
        print("✅ Aucun problème détecté")
        print(f"   {len(references)} liens internes vérifiés")
        return 0
    else:
        print(f"📊 Résumé:")
        print(f"   • Liens cassés: {len(broken_links)}")
        print(f"   • Ancres invalides: {len(broken_anchors)}")
        print(f"   • Docs orphelins: {len(orphans)}")
        
        exit_code = 0
        
        if strict and len(broken_links) > 0:
            print()
            print("❌ Mode strict: échec CI (liens cassés)")
            exit_code = 1
        elif len(broken_links) > 0:
            print()
            print("⚠️ Mode warning: liens cassés détectés mais non bloquants")
        
        if orphans_strict and len(orphans) > 0:
            print()
            print("❌ Mode orphans-strict: échec CI (docs orphelins)")
            exit_code = 1
        elif len(orphans) > 0:
            print()
            print("⚠️ Mode warning: docs orphelins détectés mais non bloquants")
        
        return exit_code


def run_orphans_only(orphans_strict: bool = False, quiet: bool = False,
                     report_path: Optional[str] = None) -> int:
    """
    Mode orphan-only: vérifie uniquement les orphelins.
    """
    if not os.path.isdir(DOCS_DIR):
        print(f"❌ Dossier '{DOCS_DIR}' non trouvé")
        return 1
    
    print("=" * 60)
    print("📦 SSOT Orphan Detector V2 (mode standalone)")
    print("=" * 60)
    
    # Construire le graphe de références
    _, references = check_links(quiet)
    
    # Détecter les orphelins
    orphans = detect_orphans_v2(references, quiet)
    
    # Rapport orphelins
    if orphans:
        print()
        print(f"📦 DOCS ORPHELINS ({len(orphans)}):")
        print("   (canoniques mais non référencés par un index ou doc canonique)")
        print("-" * 40)
        for orphan in orphans:
            print(f"  📄 {orphan}")
    else:
        print()
        print("✅ Aucun doc orphelin détecté")
    
    # Export rapport JSON si demandé
    if report_path:
        report = {
            "timestamp": datetime.now().isoformat(),
            "mode": "orphans-only",
            "summary": {
                "orphans": len(orphans)
            },
            "orphans": orphans
        }
        try:
            with open(report_path, "w", encoding="utf-8") as f:
                json.dump(report, f, indent=2, ensure_ascii=False)
            print(f"\n📊 Rapport exporté: {report_path}")
        except Exception as e:
            print(f"⚠️ Erreur export rapport: {e}")
    
    # Résumé
    print()
    print("=" * 60)
    print(f"📊 Résumé: {len(orphans)} docs orphelins")
    
    if orphans_strict and len(orphans) > 0:
        print()
        print("❌ Mode orphans-strict: échec CI")
        return 1
    elif len(orphans) > 0:
        print()
        print("⚠️ Mode warning: docs orphelins non bloquants")
    
    return 0


def main():
    """Point d'entrée CLI."""
    args = sys.argv[1:]
    
    # Parse arguments
    strict = "--strict" in args
    quiet = "--quiet" in args or "-q" in args
    no_orphans = "--no-orphans" in args
    orphans_only = "--orphans" in args
    orphans_strict = "--orphans-strict" in args
    
    # Parse --report <path>
    report_path = None
    if "--report" in args:
        idx = args.index("--report")
        if idx + 1 < len(args):
            report_path = args[idx + 1]
    
    # Mode orphans-only
    if orphans_only:
        exit_code = run_orphans_only(
            orphans_strict=orphans_strict,
            quiet=quiet,
            report_path=report_path
        )
        sys.exit(exit_code)
    
    # Mode standard
    exit_code = run_linkcheck(
        strict=strict,
        quiet=quiet,
        check_orphans=not no_orphans,
        orphans_strict=orphans_strict,
        report_path=report_path
    )
    
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
