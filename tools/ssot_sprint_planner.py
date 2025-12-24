#!/usr/bin/env python3
"""
SSOT Sprint Planner — PixelProwlers

Planification de sprints depuis le backlog SSOT avec modes delivery/governance.

Usage:
    python3 tools/ssot_sprint_planner.py build --mode delivery
    python3 tools/ssot_sprint_planner.py build --mode governance
    python3 tools/ssot_sprint_planner.py next --mode delivery --wip 7
    python3 tools/ssot_sprint_planner.py render-sprint SPRINT=<id> --format cline

Outputs:
    docs/10-vision_roadmap/sprints.generated.md   (human-readable)
    docs/10-vision_roadmap/sprints.generated.json (machine-readable)
"""

import sys
import os
import re
import json
import hashlib
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Any, Set

# ============================================================
# CONFIGURATION
# ============================================================

DOCS_DIR = Path("docs")
BACKLOG_JSON = DOCS_DIR / "10-vision_roadmap" / "backlog.generated.json"
OUTPUT_MD = DOCS_DIR / "10-vision_roadmap" / "sprints.generated.md"
OUTPUT_JSON = DOCS_DIR / "10-vision_roadmap" / "sprints.generated.json"
REGISTRY_PATH = DOCS_DIR / "00-foundations" / "ssot_registry.json"

# Modes de sprint
MODES = {"delivery", "governance"}

# Deliverables par mode
DELIVERY_DELIVERABLES = {"code", "tests", "assets", "components", "api", "guards"}
GOVERNANCE_DELIVERABLES = {"docs", "specs", "policy", "audit", "review", "process"}

# Mapping area → deliverable (heuristique si frontmatter absent)
AREA_DELIVERABLE_MAP = {
    # Delivery
    "frontend": "code",
    "backend": "code",
    "contracts": "guards",
    "qa": "tests",
    "tech_specs": "code",
    
    # Governance
    "governance": "docs",
    "product_specs": "specs",
    "ux_content": "specs",
    "ux_ui": "specs",
    "security": "policy",
    "legal": "policy",
    "measurement": "audit",
    "seo": "docs",
    "roadmap": "docs",
}

# Mapping area → workstream (heuristique)
AREA_WORKSTREAM_MAP = {
    "frontend": "engineering",
    "backend": "engineering",
    "tech_specs": "engineering",
    "contracts": "security",
    "security": "security",
    "qa": "quality",
    "governance": "operations",
    "product_specs": "product",
    "ux_content": "product",
    "ux_ui": "design",
    "legal": "operations",
    "measurement": "analytics",
    "seo": "marketing",
    "roadmap": "product",
}

# Priorité numérique pour tri
PRIORITY_ORDER = {"P0": 0, "P1": 1, "P2": 2}

# WIP par défaut
DEFAULT_WIP = 7

# Durée sprint par défaut (jours)
SPRINT_DURATION_DAYS = 14


# ============================================================
# HELPERS
# ============================================================

def load_backlog() -> Dict:
    """Charge le backlog généré."""
    if not BACKLOG_JSON.exists():
        print(f"❌ Backlog non trouvé. Exécuter d'abord: python3 tools/ssot_backlog.py build")
        sys.exit(1)
    with open(BACKLOG_JSON, "r", encoding="utf-8") as f:
        return json.load(f)


def load_registry() -> Dict:
    """Charge le ssot_registry.json."""
    if not REGISTRY_PATH.exists():
        return {}
    with open(REGISTRY_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def get_deliverable_from_ticket(ticket: Dict) -> str:
    """Détermine le deliverable d'un ticket."""
    # 1. Explicite dans frontmatter (via source_docs)
    if "deliverable" in ticket:
        return ticket["deliverable"]
    
    # 2. Heuristique par area
    area = ticket.get("area", "other")
    return AREA_DELIVERABLE_MAP.get(area, "docs")


def get_workstream_from_ticket(ticket: Dict) -> str:
    """Détermine le workstream d'un ticket."""
    # 1. Explicite dans frontmatter
    if "workstream" in ticket:
        return ticket["workstream"]
    
    # 2. Heuristique par area
    area = ticket.get("area", "other")
    return AREA_WORKSTREAM_MAP.get(area, "operations")


def is_delivery_ticket(ticket: Dict) -> bool:
    """Vérifie si un ticket est de type delivery."""
    deliverable = get_deliverable_from_ticket(ticket)
    return deliverable in DELIVERY_DELIVERABLES


def is_governance_ticket(ticket: Dict) -> bool:
    """Vérifie si un ticket est de type governance."""
    deliverable = get_deliverable_from_ticket(ticket)
    return deliverable in GOVERNANCE_DELIVERABLES


def filter_tickets_by_mode(tickets: List[Dict], mode: str) -> List[Dict]:
    """Filtre les tickets selon le mode."""
    if mode == "delivery":
        return [t for t in tickets if is_delivery_ticket(t)]
    elif mode == "governance":
        return [t for t in tickets if is_governance_ticket(t)]
    return tickets


def sort_tickets_deterministic(tickets: List[Dict]) -> List[Dict]:
    """Tri déterministe : P0 > P1 > P2, puis par area, puis par ID."""
    return sorted(tickets, key=lambda t: (
        PRIORITY_ORDER.get(t.get("priority", "P2"), 2),
        t.get("area", "zzz"),
        t.get("ticket_id", "")
    ))


def generate_sprint_id(mode: str, index: int) -> str:
    """Génère un ID de sprint."""
    date_str = datetime.now().strftime("%Y%m%d")
    return f"SPRINT_{mode.upper()}_{date_str}_{index:02d}"


def generate_cline_prompt_for_sprint(sprint: Dict) -> str:
    """Génère le prompt Cline pour un sprint complet."""
    tickets = sprint["tickets"]
    
    prompt = f"""Tu es Cline. Mission : exécuter le sprint {sprint['sprint_id']}.

## 📋 SPRINT OVERVIEW
- **Mode** : {sprint['mode']}
- **Tickets** : {len(tickets)}
- **Priorité dominante** : {sprint['priority_summary']}
- **Workstreams** : {', '.join(sprint['workstreams'])}

## 🎫 TICKETS À TRAITER (par priorité)

"""
    
    for i, ticket in enumerate(tickets, 1):
        prompt += f"""### {i}. `{ticket['ticket_id']}` [{ticket['priority']}]
**{ticket['title']}**
- Area: {ticket['area']}
- Owners: {', '.join(ticket['owners'])}
- Source: {', '.join(ticket['source_docs'][:1])}

"""
    
    prompt += f"""
## 🔒 EXIGENCES SÉCURITÉ (doctrine PixelProwlers)
- NO v-html dans Vue — utiliser v-text ou composants sanitisés
- NO innerHTML/outerHTML/insertAdjacentHTML dans le code
- Erreurs neutres : pas d'exposition de stack traces ni de chemins internes
- Deep links safe : allowlist stricte, validation NFKC + stripZW

## ✅ DEFINITION OF DONE (sprint)
- `python3 tools/ssot_lint.py --strict` passe sans erreur
- `python3 tools/ssot_linkcheck.py --strict` passe sans erreur
- Tests unitaires ajoutés si code modifié
- Documentation mise à jour si API modifiée

## 🔄 WORKFLOW RECOMMANDÉ
1. Traiter les tickets P0 en premier (bloquants sécurité)
2. Puis P1 (fonctionnalités core)
3. Puis P2 (améliorations)
4. Commit séparés par ticket : `feat(<area>): <title>`
5. Valider DoD après chaque ticket

## 📊 COMMANDES UTILES
```bash
# Voir détails d'un ticket
make ssot-ticket TICKET=<ticket_id>

# Validation après modifications
make ssot-check
```
"""
    return prompt


# ============================================================
# MAIN FUNCTIONS
# ============================================================

def cmd_build(mode: str):
    """Génère les sprints pour un mode donné."""
    if mode not in MODES:
        print(f"❌ Mode invalide: {mode}. Utiliser: {', '.join(MODES)}")
        sys.exit(1)
    
    print("=" * 70)
    print(f"🗓️  SSOT Sprint Planner — Build ({mode})")
    print("=" * 70)
    print()
    
    backlog = load_backlog()
    all_tickets = backlog.get("tickets", [])
    
    # Filtrer par mode
    filtered = filter_tickets_by_mode(all_tickets, mode)
    print(f"📊 {len(filtered)} tickets en mode {mode} (sur {len(all_tickets)} total)")
    
    # Enrichir avec deliverable et workstream
    for ticket in filtered:
        ticket["deliverable"] = get_deliverable_from_ticket(ticket)
        ticket["workstream"] = get_workstream_from_ticket(ticket)
    
    # Trier de manière déterministe
    sorted_tickets = sort_tickets_deterministic(filtered)
    
    # Grouper en sprints (par WIP de 7)
    sprints = []
    wip = DEFAULT_WIP
    
    for i in range(0, len(sorted_tickets), wip):
        batch = sorted_tickets[i:i + wip]
        sprint_id = generate_sprint_id(mode, len(sprints) + 1)
        
        # Calculer les métriques du sprint
        priorities = [t["priority"] for t in batch]
        workstreams = list(set(t["workstream"] for t in batch))
        owners = list(set(o for t in batch for o in t.get("owners", [])))
        
        priority_counts = {p: priorities.count(p) for p in ["P0", "P1", "P2"] if priorities.count(p) > 0}
        priority_summary = ", ".join(f"{k}:{v}" for k, v in priority_counts.items())
        
        sprint = {
            "sprint_id": sprint_id,
            "mode": mode,
            "tickets": batch,
            "ticket_count": len(batch),
            "priority_summary": priority_summary,
            "workstreams": workstreams,
            "owners": owners,
            "created_at": datetime.now().isoformat(),
        }
        
        sprints.append(sprint)
    
    print(f"📅 {len(sprints)} sprints générés")
    print()
    
    # Générer JSON
    output_data = {
        "meta": {
            "generated_at": datetime.now().isoformat(),
            "generator": "tools/ssot_sprint_planner.py",
            "mode": mode,
            "total_sprints": len(sprints),
            "total_tickets": len(filtered),
            "wip_limit": wip,
        },
        "sprints": sprints,
    }
    
    OUTPUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    print(f"✅ {OUTPUT_JSON}")
    
    # Générer MD
    md_content = f"""---
id: sprints_generated
title: Sprints Générés (SSOT)
version: "1.0"
status: active
date: {datetime.now().strftime('%Y-%m-%d')}
owners: ["Marty"]
scope: roadmap
tags: ["sprints", "generated", "ssot", "{mode}"]
---

# 🗓️ Sprints Générés — Mode {mode.upper()}

> **Auto-généré** le {datetime.now().strftime('%Y-%m-%d %H:%M')} par `tools/ssot_sprint_planner.py`
> 
> ⚠️ Ne pas éditer manuellement — regénérer avec `make ssot-sprints MODE={mode}`

## 📊 Vue d'ensemble

| Métrique | Valeur |
|----------|--------|
| Mode | {mode} |
| Sprints | {len(sprints)} |
| Tickets total | {len(filtered)} |
| WIP limit | {wip} |

---

"""
    
    for sprint in sprints:
        md_content += f"## 📅 {sprint['sprint_id']}\n\n"
        md_content += f"**{sprint['ticket_count']} tickets** | {sprint['priority_summary']} | Workstreams: {', '.join(sprint['workstreams'])}\n\n"
        
        md_content += "| Ticket | Titre | Area | Priorité | Owners |\n"
        md_content += "|--------|-------|------|----------|--------|\n"
        
        for t in sprint["tickets"]:
            title = t["title"][:35] + "..." if len(t["title"]) > 35 else t["title"]
            owners = ", ".join(t["owners"][:2])
            md_content += f"| `{t['ticket_id']}` | {title} | {t['area']} | {t['priority']} | {owners} |\n"
        
        md_content += f"\n```bash\npython3 tools/ssot_sprint_planner.py render-sprint SPRINT={sprint['sprint_id']} --format cline\n```\n\n"
        md_content += "---\n\n"
    
    md_content += f"""
## 🔗 Utilisation

```bash
# Générer les sprints
python3 tools/ssot_sprint_planner.py build --mode delivery
python3 tools/ssot_sprint_planner.py build --mode governance

# Prochain sprint (delivery, 7 tickets)
python3 tools/ssot_sprint_planner.py next --mode delivery --wip 7
make ssot-next-sprint MODE=delivery WIP=7

# Afficher un sprint avec prompt Cline
python3 tools/ssot_sprint_planner.py render-sprint SPRINT=<id> --format cline
```

---

*Généré automatiquement — voir [SSOT_BACKLOG_PROTOCOL_V1](../00-foundations/SSOT_BACKLOG_PROTOCOL_V1.md)*
"""
    
    with open(OUTPUT_MD, "w", encoding="utf-8") as f:
        f.write(md_content)
    print(f"✅ {OUTPUT_MD}")
    
    print()
    print(f"💡 Utiliser `make ssot-next-sprint MODE={mode}` pour le prochain sprint")


def cmd_next(mode: str, wip: int):
    """Affiche le prochain sprint à exécuter."""
    if mode not in MODES:
        print(f"❌ Mode invalide: {mode}. Utiliser: {', '.join(MODES)}")
        sys.exit(1)
    
    print("=" * 70)
    print(f"🚀 SSOT Sprint Planner — Next Sprint ({mode})")
    print("=" * 70)
    print()
    
    backlog = load_backlog()
    all_tickets = backlog.get("tickets", [])
    
    # Filtrer par mode
    filtered = filter_tickets_by_mode(all_tickets, mode)
    
    # Enrichir
    for ticket in filtered:
        ticket["deliverable"] = get_deliverable_from_ticket(ticket)
        ticket["workstream"] = get_workstream_from_ticket(ticket)
    
    # Trier
    sorted_tickets = sort_tickets_deterministic(filtered)
    
    # Prendre les N premiers (WIP)
    next_batch = sorted_tickets[:wip]
    
    if not next_batch:
        print(f"✅ Aucun ticket disponible en mode {mode}")
        return
    
    # Créer le sprint
    sprint_id = generate_sprint_id(mode, 1)
    priorities = [t["priority"] for t in next_batch]
    workstreams = list(set(t["workstream"] for t in next_batch))
    owners = list(set(o for t in next_batch for o in t.get("owners", [])))
    
    priority_counts = {p: priorities.count(p) for p in ["P0", "P1", "P2"] if priorities.count(p) > 0}
    priority_summary = ", ".join(f"{k}:{v}" for k, v in priority_counts.items())
    
    sprint = {
        "sprint_id": sprint_id,
        "mode": mode,
        "tickets": next_batch,
        "ticket_count": len(next_batch),
        "priority_summary": priority_summary,
        "workstreams": workstreams,
        "owners": owners,
        "created_at": datetime.now().isoformat(),
    }
    
    print(f"📅 Sprint: {sprint_id}")
    print(f"📊 {len(next_batch)} tickets | {priority_summary}")
    print(f"👥 Workstreams: {', '.join(workstreams)}")
    print(f"🎯 Owners: {', '.join(owners[:5])}" + ("..." if len(owners) > 5 else ""))
    print()
    print("-" * 70)
    print()
    
    for i, t in enumerate(next_batch, 1):
        prio_icon = {"P0": "🔴", "P1": "🟡", "P2": "🟢"}.get(t["priority"], "⚪")
        print(f"{prio_icon} {i}. [{t['ticket_id']}]")
        print(f"   {t['title']}")
        print(f"   Area: {t['area']} | Owners: {', '.join(t['owners'])}")
        print()
    
    print("-" * 70)
    print()
    print("📋 PROMPT CLINE — Copier-coller ci-dessous")
    print("-" * 70)
    print()
    print(generate_cline_prompt_for_sprint(sprint))
    print()
    print("=" * 70)


def cmd_render_sprint(sprint_id: str, format_type: str = "cline"):
    """Affiche un sprint spécifique avec son prompt."""
    # Charger les sprints générés
    if not OUTPUT_JSON.exists():
        print("❌ Sprints non générés. Exécuter d'abord: python3 tools/ssot_sprint_planner.py build --mode <mode>")
        sys.exit(1)
    
    with open(OUTPUT_JSON, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    # Trouver le sprint
    sprint = None
    for s in data.get("sprints", []):
        if s["sprint_id"] == sprint_id:
            sprint = s
            break
    
    if not sprint:
        print(f"❌ Sprint non trouvé: {sprint_id}")
        print()
        print("Sprints disponibles:")
        for s in data.get("sprints", [])[:10]:
            print(f"  • {s['sprint_id']}: {s['ticket_count']} tickets ({s['priority_summary']})")
        sys.exit(1)
    
    print("=" * 70)
    print(f"📅 Sprint: {sprint_id}")
    print("=" * 70)
    print()
    
    if format_type == "cline":
        print("📋 PROMPT CLINE — Copier-coller ci-dessous")
        print("-" * 70)
        print()
        print(generate_cline_prompt_for_sprint(sprint))
        print()
        print("=" * 70)
    else:
        # Format humain
        print(f"**Mode** : {sprint['mode']}")
        print(f"**Tickets** : {sprint['ticket_count']}")
        print(f"**Priorités** : {sprint['priority_summary']}")
        print(f"**Workstreams** : {', '.join(sprint['workstreams'])}")
        print()
        print("**Tickets** :")
        for t in sprint["tickets"]:
            print(f"  - [{t['priority']}] {t['ticket_id']}: {t['title']}")


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
    
    if command == "build":
        mode = "delivery"
        if "--mode" in args:
            idx = args.index("--mode")
            if idx + 1 < len(args):
                mode = args[idx + 1]
        cmd_build(mode)
    
    elif command == "next":
        mode = "delivery"
        wip = DEFAULT_WIP
        
        if "--mode" in args:
            idx = args.index("--mode")
            if idx + 1 < len(args):
                mode = args[idx + 1]
        
        if "--wip" in args:
            idx = args.index("--wip")
            if idx + 1 < len(args):
                try:
                    wip = int(args[idx + 1])
                except ValueError:
                    pass
        
        cmd_next(mode, wip)
    
    elif command == "render-sprint":
        sprint_id = None
        format_type = "cline"
        
        # Parse SPRINT=<id>
        for arg in args[1:]:
            if arg.startswith("SPRINT="):
                sprint_id = arg.split("=", 1)[1]
        
        if "--format" in args:
            idx = args.index("--format")
            if idx + 1 < len(args):
                format_type = args[idx + 1]
        
        if not sprint_id:
            print("❌ Usage: ssot_sprint_planner.py render-sprint SPRINT=<id> [--format cline|human]")
            sys.exit(1)
        
        cmd_render_sprint(sprint_id, format_type)
    
    else:
        print(f"❌ Commande inconnue: {command}")
        print()
        print("Commandes disponibles: build, next, render-sprint")
        sys.exit(1)


if __name__ == "__main__":
    main()
