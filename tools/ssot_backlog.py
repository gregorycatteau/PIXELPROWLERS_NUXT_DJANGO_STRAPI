#!/usr/bin/env python3
"""
SSOT Backlog Generator — PixelProwlers

Génère automatiquement un backlog priorisé depuis le SSOT,
avec tickets et prompts pour agents IA.

Usage:
    python3 tools/ssot_backlog.py list                     # Liste les docs éligibles
    python3 tools/ssot_backlog.py build                    # Génère backlog.generated.*
    python3 tools/ssot_backlog.py render <ticket_id> --format cline
    python3 tools/ssot_backlog.py render <ticket_id> --format agent --agent <name>

Outputs:
    docs/10-vision_roadmap/backlog.generated.md   (human-readable)
    docs/10-vision_roadmap/backlog.generated.json (machine-readable)
"""

import sys
import os
import re
import json
import hashlib
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Any

# ============================================================
# CONFIGURATION
# ============================================================

DOCS_DIR = Path("docs")
REGISTRY_PATH = DOCS_DIR / "00-foundations" / "ssot_registry.json"
OUTPUT_MD = DOCS_DIR / "10-vision_roadmap" / "backlog.generated.md"
OUTPUT_JSON = DOCS_DIR / "10-vision_roadmap" / "backlog.generated.json"

# Status éligibles pour le backlog
BUILDABLE_STATUS = {"active", "stable"}

# Priorités par défaut selon l'area (heuristique)
AREA_PRIORITY_MAP = {
    "security": "P0",
    "contracts": "P0",
    "backend": "P1",
    "frontend": "P1",
    "tech_specs": "P1",
    "product_specs": "P1",
    "ux_content": "P2",
    "ux_ui": "P2",
    "legal": "P2",
    "seo": "P2",
    "qa": "P1",
    "measurement": "P2",
    "governance": "P1",
    "roadmap": "P2",
}

# Règles de sécurité PixelProwlers (doctrine)
SECURITY_AC = [
    "NO v-html dans Vue — utiliser v-text ou composants sanitisés",
    "NO innerHTML/outerHTML/insertAdjacentHTML dans le code",
    "Erreurs neutres : pas d'exposition de stack traces ni de chemins internes",
    "Logs neutres : pas de données utilisateur sensibles",
    "Deep links safe : allowlist stricte, validation NFKC + stripZW",
    "Sanitization : NFKC normalization + strip zero-width characters",
]

# DoD qualité automatique
QA_DOD = [
    "`python3 tools/ssot_lint.py --strict` passe sans erreur",
    "`python3 tools/ssot_linkcheck.py --strict` passe sans erreur",
    "Tests unitaires ajoutés si code modifié",
    "Documentation mise à jour si API modifiée",
]


# ============================================================
# HELPERS
# ============================================================

def load_registry() -> Dict:
    """Charge le ssot_registry.json."""
    if not REGISTRY_PATH.exists():
        print(f"❌ Registry non trouvé: {REGISTRY_PATH}")
        sys.exit(1)
    with open(REGISTRY_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def extract_frontmatter(filepath: Path) -> Optional[Dict]:
    """Extrait le frontmatter YAML d'un fichier MD."""
    try:
        content = filepath.read_text(encoding="utf-8")
        if not content.startswith("---"):
            return None
        
        # Find closing ---
        end_idx = content.find("---", 3)
        if end_idx == -1:
            return None
        
        yaml_block = content[3:end_idx].strip()
        
        # Parse YAML manually (simple key: value)
        fm = {}
        for line in yaml_block.split("\n"):
            if ":" in line:
                key, _, value = line.partition(":")
                key = key.strip()
                value = value.strip()
                
                # Handle arrays
                if value.startswith("[") and value.endswith("]"):
                    # Parse JSON-like array
                    try:
                        fm[key] = json.loads(value.replace("'", '"'))
                    except:
                        fm[key] = value
                elif value.startswith('"') and value.endswith('"'):
                    fm[key] = value[1:-1]
                elif value.startswith("'") and value.endswith("'"):
                    fm[key] = value[1:-1]
                else:
                    fm[key] = value
        
        return fm
    except Exception as e:
        return None


def get_area_from_path(filepath: Path) -> str:
    """Déduit l'area depuis le chemin du fichier."""
    parts = filepath.parts
    
    # docs/40-security/contracts/... → contracts
    # docs/30-tech_specs/backend/... → backend
    # docs/20-product_specs/functional/... → product_specs
    
    if "security" in str(filepath) or "40-security" in str(filepath):
        if "contracts" in str(filepath):
            return "contracts"
        return "security"
    if "backend" in str(filepath):
        return "backend"
    if "frontend" in str(filepath):
        return "frontend"
    if "tech_specs" in str(filepath) or "30-tech_specs" in str(filepath):
        return "tech_specs"
    if "product_specs" in str(filepath) or "20-product_specs" in str(filepath):
        if "ux_content" in str(filepath):
            return "ux_content"
        if "ux_ui" in str(filepath):
            return "ux_ui"
        return "product_specs"
    if "legal" in str(filepath) or "60-legal" in str(filepath):
        return "legal"
    if "seo" in str(filepath) or "70-seo" in str(filepath):
        return "seo"
    if "qa" in str(filepath) or "55-qa" in str(filepath):
        return "qa"
    if "measurement" in str(filepath) or "50-measurement" in str(filepath):
        return "measurement"
    if "foundations" in str(filepath) or "00-foundations" in str(filepath):
        return "governance"
    if "vision_roadmap" in str(filepath) or "10-vision_roadmap" in str(filepath):
        return "roadmap"
    
    return "other"


def get_owners_from_registry(filepath: Path, registry: Dict) -> List[str]:
    """Récupère les owners depuis l'ownershipMatrix."""
    ownership = registry.get("ownershipMatrix", {})
    path_str = str(filepath)
    
    # Chercher le match le plus spécifique
    for pattern, owners in sorted(ownership.items(), key=lambda x: -len(x[0])):
        if pattern in path_str or path_str.startswith(pattern):
            return owners
    
    return ["Marty"]  # Default owner


def generate_ticket_id(filepath: Path, fm: Dict) -> str:
    """Génère un ID de ticket stable depuis le doc."""
    doc_id = fm.get("id", filepath.stem)
    # Slug stable
    slug = re.sub(r'[^a-z0-9]+', '_', doc_id.lower()).strip('_')
    return f"TKT_{slug}"


def extract_title_from_content(filepath: Path) -> str:
    """Extrait le premier H1 du contenu."""
    try:
        content = filepath.read_text(encoding="utf-8")
        # Skip frontmatter
        if content.startswith("---"):
            end_idx = content.find("---", 3)
            if end_idx != -1:
                content = content[end_idx + 3:]
        
        # Find first H1
        for line in content.split("\n"):
            if line.startswith("# "):
                return line[2:].strip()
        
        return filepath.stem.replace("_", " ").title()
    except:
        return filepath.stem


def determine_priority(fm: Dict, area: str, tags: List[str]) -> str:
    """Détermine la priorité du ticket."""
    # Priority explicite dans frontmatter
    if "priority" in fm:
        return fm["priority"]
    
    # Heuristique par tags
    tag_set = set(t.lower() for t in tags)
    if "security" in tag_set or "contracts" in tag_set:
        return "P0"
    if "backend" in tag_set or "api" in tag_set:
        return "P1"
    
    # Heuristique par area
    return AREA_PRIORITY_MAP.get(area, "P2")


def generate_acceptance_criteria(fm: Dict, area: str) -> List[str]:
    """Génère les critères d'acceptation automatiques."""
    ac = []
    
    # AC génériques
    ac.append(f"✅ Document {fm.get('id', 'N/A')} est implémenté selon sa spécification")
    ac.append("✅ Tous les tests passent")
    
    # AC spécifiques par area
    if area in ["backend", "tech_specs"]:
        ac.append("✅ `python3 tools/openapi_validate.py` passe si API modifiée")
    if area in ["frontend", "ux_ui"]:
        ac.append("✅ Composants accessibles (ARIA, keyboard nav)")
        ac.append("✅ Responsive mobile/desktop")
    if area in ["security", "contracts"]:
        ac.append("✅ Review sécurité effectuée")
        ac.append("✅ Guards CI ajoutés si patterns détectés")
    
    return ac


def generate_deliverables(fm: Dict, area: str) -> List[str]:
    """Génère la liste des livrables attendus."""
    deliverables = []
    
    if area == "frontend":
        deliverables.append("frontend_nuxt/app/components/*.vue")
    if area == "backend":
        deliverables.append("backend_django/apps/**/*.py")
    if area in ["security", "contracts"]:
        deliverables.append("frontend_nuxt/scripts/guards/*.mjs")
        deliverables.append("docs/40-security/contracts/*.md")
    if area in ["product_specs", "ux_content"]:
        deliverables.append("docs/20-product_specs/**/*.md")
    
    return deliverables if deliverables else ["À définir selon implémentation"]


def generate_cline_prompt(ticket: Dict) -> str:
    """Génère le prompt optimisé pour Cline."""
    prompt = f"""Tu es Cline. Mission : implémenter le ticket {ticket['ticket_id']}.

## CONTEXTE
- **Titre** : {ticket['title']}
- **Area** : {ticket['area']}
- **Priorité** : {ticket['priority']}
- **Owner(s)** : {', '.join(ticket['owners'])}

## DOCUMENTS SOURCE
{chr(10).join(f"- {doc}" for doc in ticket['source_docs'])}

## CRITÈRES D'ACCEPTATION
{chr(10).join(ticket['acceptance_criteria'])}

## EXIGENCES SÉCURITÉ (doctrine PixelProwlers)
{chr(10).join(f"- {ac}" for ac in ticket['security_ac'])}

## DEFINITION OF DONE (QA)
{chr(10).join(f"- {dod}" for dod in ticket['qa_dod'])}

## LIVRABLES ATTENDUS
{chr(10).join(f"- {d}" for d in ticket['deliverables'])}

## WORKFLOW
1. Lire les documents source pour comprendre la spec
2. Implémenter selon les critères d'acceptation
3. Appliquer les règles de sécurité
4. Vérifier la DoD avant de terminer
5. Commit avec message : `feat({ticket['area']}): {ticket['title'][:50]}`

## CONTRAINTES
- Respecter l'architecture existante
- Utiliser les composants PP* du Design System
- Ne pas introduire de dépendances externes sans validation
"""
    return prompt


def generate_agent_prompt(ticket: Dict, agent_name: str) -> str:
    """Génère le prompt adapté à un agent spécifique."""
    # Adapter selon le nom de l'agent
    role_context = {
        "Dan": "développeur frontend senior, expert Vue/Nuxt",
        "Tom": "développeur backend senior, expert Django/Python",
        "Eva": "experte sécurité, responsable audit et guards",
        "Marty": "product owner, responsable specs et validation",
        "Talia": "UX writer, responsable contenus et narratifs",
        "Heider": "designer UI, responsable composants et tokens",
    }
    
    context = role_context.get(agent_name, f"agent {agent_name}")
    
    prompt = f"""Tu es {agent_name}, {context}.

Mission : implémenter le ticket {ticket['ticket_id']}.

## CONTEXTE
{ticket['title']}
Priority: {ticket['priority']} | Area: {ticket['area']}

## SOURCES
{chr(10).join(ticket['source_docs'])}

## TON FOCUS
"""
    
    # Focus selon l'agent
    if agent_name == "Dan":
        prompt += """- Composants Vue/Nuxt
- Tests unitaires Vitest
- Guards CI frontend
- Accessibilité ARIA"""
    elif agent_name == "Tom":
        prompt += """- Endpoints Django
- OpenAPI sync
- Tests pytest
- Performances DB"""
    elif agent_name == "Eva":
        prompt += """- Review sécurité
- Guards detection patterns
- Doctrine PixelProwlers
- Audit vulnérabilités"""
    elif agent_name == "Marty":
        prompt += """- Validation fonctionnelle
- Cohérence avec specs
- User stories coverage
- Acceptance criteria"""
    elif agent_name == "Talia":
        prompt += """- Contenus UX
- Tonalité Talia
- Microcopy
- Accessibilité textuelle"""
    elif agent_name == "Heider":
        prompt += """- Design tokens
- Composants UI
- Responsive
- Dark mode"""
    else:
        prompt += f"- Exécuter selon l'expertise de {agent_name}"
    
    prompt += f"""

## CRITÈRES D'ACCEPTATION
{chr(10).join(ticket['acceptance_criteria'])}

## SÉCURITÉ
{chr(10).join(f"- {ac}" for ac in ticket['security_ac'])}

## DOD
{chr(10).join(f"- {dod}" for dod in ticket['qa_dod'])}
"""
    return prompt


# ============================================================
# MAIN FUNCTIONS
# ============================================================

def scan_buildable_docs() -> List[Dict]:
    """Scanne docs/ pour trouver les docs éligibles au backlog."""
    registry = load_registry()
    docs = []
    
    for md_file in DOCS_DIR.rglob("*.md"):
        # Skip generated files
        if "generated" in md_file.name:
            continue
        # Skip README indexes
        if md_file.name == "README.md":
            continue
        # Skip archived
        if "archive" in str(md_file).lower() or "legacy" in str(md_file).lower():
            continue
        
        fm = extract_frontmatter(md_file)
        if not fm:
            continue
        
        status = fm.get("status", "").lower()
        if status not in BUILDABLE_STATUS:
            continue
        
        area = get_area_from_path(md_file)
        owners = fm.get("owners", get_owners_from_registry(md_file, registry))
        if isinstance(owners, str):
            owners = [owners]
        
        tags = fm.get("tags", [])
        if isinstance(tags, str):
            tags = [tags]
        
        priority = determine_priority(fm, area, tags)
        
        docs.append({
            "path": str(md_file),
            "frontmatter": fm,
            "area": area,
            "owners": owners,
            "tags": tags,
            "priority": priority,
            "title": fm.get("title", extract_title_from_content(md_file)),
        })
    
    # Sort by priority (P0 > P1 > P2)
    docs.sort(key=lambda x: x["priority"])
    
    return docs


def build_tickets(docs: List[Dict]) -> List[Dict]:
    """Génère les tickets depuis les docs."""
    tickets = []
    
    for doc in docs:
        fm = doc["frontmatter"]
        ticket_id = generate_ticket_id(Path(doc["path"]), fm)
        
        ticket = {
            "ticket_id": ticket_id,
            "title": doc["title"],
            "owners": doc["owners"],
            "priority": doc["priority"],
            "area": doc["area"],
            "source_docs": [doc["path"]],
            "tags": doc["tags"],
            "acceptance_criteria": generate_acceptance_criteria(fm, doc["area"]),
            "security_ac": SECURITY_AC,
            "qa_dod": QA_DOD,
            "deliverables": generate_deliverables(fm, doc["area"]),
            "created_at": datetime.now().isoformat(),
        }
        
        # Generate prompts
        ticket["prompt_cline"] = generate_cline_prompt(ticket)
        
        tickets.append(ticket)
    
    return tickets


def cmd_list():
    """Liste les docs éligibles au backlog."""
    docs = scan_buildable_docs()
    
    print("=" * 70)
    print("📋 SSOT Backlog — Docs éligibles")
    print("=" * 70)
    print()
    
    # Group by priority
    by_priority = {"P0": [], "P1": [], "P2": []}
    for doc in docs:
        by_priority[doc["priority"]].append(doc)
    
    for prio, icon in [("P0", "🔴"), ("P1", "🟡"), ("P2", "🟢")]:
        if by_priority[prio]:
            print(f"{icon} {prio} ({len(by_priority[prio])} docs)")
            print("-" * 40)
            for doc in by_priority[prio]:
                area = doc["area"][:12].ljust(12)
                title = doc["title"][:40]
                print(f"  [{area}] {title}")
            print()
    
    print(f"💡 Total: {len(docs)} docs éligibles")
    print()
    print("Usage:")
    print("  python3 tools/ssot_backlog.py build        # Génère le backlog")
    print("  python3 tools/ssot_backlog.py render <id>  # Affiche un ticket")


def cmd_build():
    """Génère les fichiers backlog."""
    print("=" * 70)
    print("🔨 SSOT Backlog Build")
    print("=" * 70)
    print()
    
    docs = scan_buildable_docs()
    tickets = build_tickets(docs)
    
    print(f"📊 {len(docs)} docs scannés, {len(tickets)} tickets générés")
    print()
    
    # Generate JSON
    backlog_json = {
        "meta": {
            "generated_at": datetime.now().isoformat(),
            "generator": "tools/ssot_backlog.py",
            "total_tickets": len(tickets),
            "by_priority": {
                "P0": len([t for t in tickets if t["priority"] == "P0"]),
                "P1": len([t for t in tickets if t["priority"] == "P1"]),
                "P2": len([t for t in tickets if t["priority"] == "P2"]),
            }
        },
        "tickets": tickets,
    }
    
    OUTPUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(backlog_json, f, indent=2, ensure_ascii=False)
    print(f"✅ {OUTPUT_JSON}")
    
    # Generate MD
    md_content = f"""---
id: backlog_generated
title: Backlog Généré (SSOT)
version: "1.0"
status: active
date: {datetime.now().strftime('%Y-%m-%d')}
owners: ["Marty"]
scope: roadmap
tags: ["backlog", "generated", "ssot"]
---

# 📋 Backlog Généré depuis le SSOT

> **Auto-généré** le {datetime.now().strftime('%Y-%m-%d %H:%M')} par `tools/ssot_backlog.py`
> 
> ⚠️ Ne pas éditer manuellement — regénérer avec `make ssot-backlog`

## 📊 Vue d'ensemble

| Priorité | Tickets |
|----------|---------|
| 🔴 P0 | {backlog_json['meta']['by_priority']['P0']} |
| 🟡 P1 | {backlog_json['meta']['by_priority']['P1']} |
| 🟢 P2 | {backlog_json['meta']['by_priority']['P2']} |
| **Total** | **{len(tickets)}** |

---

"""
    
    # Group tickets by priority
    for prio, icon in [("P0", "🔴"), ("P1", "🟡"), ("P2", "🟢")]:
        prio_tickets = [t for t in tickets if t["priority"] == prio]
        if prio_tickets:
            md_content += f"## {icon} Priorité {prio}\n\n"
            for t in prio_tickets:
                md_content += f"### `{t['ticket_id']}`\n\n"
                md_content += f"**{t['title']}**\n\n"
                md_content += f"- **Area** : {t['area']}\n"
                md_content += f"- **Owner(s)** : {', '.join(t['owners'])}\n"
                md_content += f"- **Sources** : {', '.join(t['source_docs'])}\n"
                md_content += f"\n```bash\nmake ssot-ticket TICKET={t['ticket_id']}\n```\n\n"
                md_content += "---\n\n"
    
    md_content += f"""
## 🔗 Utilisation

```bash
# Lister les docs éligibles
python3 tools/ssot_backlog.py list

# Régénérer ce fichier
python3 tools/ssot_backlog.py build
make ssot-backlog

# Afficher un ticket avec prompt Cline
python3 tools/ssot_backlog.py render TKT_xxx --format cline
make ssot-ticket TICKET=TKT_xxx

# Prompt pour un agent spécifique
python3 tools/ssot_backlog.py render TKT_xxx --format agent --agent Dan
```

---

*Généré automatiquement — voir [SSOT_BACKLOG_PROTOCOL_V1](../00-foundations/SSOT_BACKLOG_PROTOCOL_V1.md)*
"""
    
    with open(OUTPUT_MD, "w", encoding="utf-8") as f:
        f.write(md_content)
    print(f"✅ {OUTPUT_MD}")
    
    print()
    print("💡 Utiliser `make ssot-ticket TICKET=<id>` pour afficher un ticket")


def cmd_render(ticket_id: str, format_type: str = "cline", agent_name: str = None):
    """Affiche un ticket avec son prompt."""
    # Load generated backlog
    if not OUTPUT_JSON.exists():
        print("❌ Backlog non généré. Exécuter d'abord: python3 tools/ssot_backlog.py build")
        sys.exit(1)
    
    with open(OUTPUT_JSON, "r", encoding="utf-8") as f:
        backlog = json.load(f)
    
    # Find ticket
    ticket = None
    for t in backlog["tickets"]:
        if t["ticket_id"] == ticket_id:
            ticket = t
            break
    
    if not ticket:
        print(f"❌ Ticket non trouvé: {ticket_id}")
        print()
        print("Tickets disponibles:")
        for t in backlog["tickets"][:10]:
            print(f"  • {t['ticket_id']}: {t['title'][:40]}")
        if len(backlog["tickets"]) > 10:
            print(f"  ... et {len(backlog['tickets']) - 10} autres")
        sys.exit(1)
    
    print("=" * 70)
    print(f"🎫 Ticket: {ticket_id}")
    print("=" * 70)
    print()
    
    if format_type == "cline":
        print("📋 PROMPT CLINE — Copier-coller ci-dessous")
        print("-" * 70)
        print()
        print(ticket["prompt_cline"])
        print()
        print("=" * 70)
    elif format_type == "agent":
        if not agent_name:
            print("❌ --agent <name> requis avec --format agent")
            sys.exit(1)
        prompt = generate_agent_prompt(ticket, agent_name)
        print(f"📋 PROMPT AGENT ({agent_name}) — Copier-coller ci-dessous")
        print("-" * 70)
        print()
        print(prompt)
        print()
        print("=" * 70)
    else:
        # Human-readable
        print(f"**Titre** : {ticket['title']}")
        print(f"**Area** : {ticket['area']}")
        print(f"**Priorité** : {ticket['priority']}")
        print(f"**Owner(s)** : {', '.join(ticket['owners'])}")
        print()
        print("**Sources** :")
        for src in ticket["source_docs"]:
            print(f"  - {src}")
        print()
        print("**Critères d'acceptation** :")
        for ac in ticket["acceptance_criteria"]:
            print(f"  {ac}")
        print()
        print("**Sécurité** :")
        for sec in ticket["security_ac"]:
            print(f"  - {sec}")
        print()
        print("**DoD** :")
        for dod in ticket["qa_dod"]:
            print(f"  - {dod}")


def print_usage():
    """Affiche l'aide."""
    print(__doc__)


def main():
    """Point d'entrée CLI."""
    args = sys.argv[1:]
    
    if not args or args[0] in ["-h", "--help", "help"]:
        print_usage()
        sys.exit(0)
    
    command = args[0]
    
    if command == "list":
        cmd_list()
    
    elif command == "build":
        cmd_build()
    
    elif command == "render":
        if len(args) < 2:
            print("❌ Usage: ssot_backlog.py render <ticket_id> [--format cline|agent|human] [--agent <name>]")
            sys.exit(1)
        
        ticket_id = args[1]
        format_type = "cline"
        agent_name = None
        
        if "--format" in args:
            idx = args.index("--format")
            if idx + 1 < len(args):
                format_type = args[idx + 1]
        
        if "--agent" in args:
            idx = args.index("--agent")
            if idx + 1 < len(args):
                agent_name = args[idx + 1]
        
        cmd_render(ticket_id, format_type, agent_name)
    
    else:
        print(f"❌ Commande inconnue: {command}")
        print()
        print("Commandes disponibles: list, build, render")
        sys.exit(1)


if __name__ == "__main__":
    main()
