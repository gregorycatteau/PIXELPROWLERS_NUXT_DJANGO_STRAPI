#!/usr/bin/env python3
"""
Agent Runtime CLI — PixelProwlers Option B

Gestion des worktrees agents avec isolation et audit.
Usage:
    python3 tools/agent_runtime.py start --agent tom --ticket TKT_backend_mvp
    python3 tools/agent_runtime.py prompt --agent tom --ticket TKT_backend_mvp
    python3 tools/agent_runtime.py scope-check --agent tom --ticket TKT_backend_mvp
    python3 tools/agent_runtime.py close --agent tom --ticket TKT_backend_mvp

Sécurité:
    - Jamais de shell injection (subprocess avec args list)
    - Chemins normalisés et vérifiés (pas d'escape repo)
    - Tickets/agents avec regex strict (NFKC + no ZW chars)
"""

import argparse
import json
import os
import re
import subprocess
import sys
import unicodedata
from datetime import datetime, timezone
from fnmatch import fnmatch
from pathlib import Path
from typing import Optional

# ==============================================================================
# CONFIGURATION
# ==============================================================================

REPO_ROOT = Path(__file__).parent.parent.resolve()
AGENTS_REGISTRY_PATH = REPO_ROOT / "agents" / "agents_registry.json"
AGENTS_PROFILES_DIR = REPO_ROOT / "agents" / "profiles"
WORKTREES_BASE = REPO_ROOT / ".worktrees"

# Regex stricte pour tickets et agents (anti-injection)
SAFE_NAME_PATTERN = re.compile(r"^[a-zA-Z][a-zA-Z0-9_-]{2,49}$")

# Zero-width characters à rejeter
ZERO_WIDTH_PATTERN = re.compile(r"[\u200b\u200c\u200d\u2060\ufeff]")

# Fichiers protégés (safety files) - agents ne peuvent pas les modifier
SAFETY_PATHS = [
    ".github/workflows/**",
    "scripts/guards/**",
    "tools/ssot_*.py",
    "tools/agent_runtime.py",
    "docs/40-security/**",
    "Makefile",
    ".gitignore",
]

# Scope par agent (défaut - peut être étendu)
DEFAULT_AGENT_SCOPES = {
    "tom": {
        "allowlist": [
            "backend_django/apps/**",
            "backend_django/pixel_backend/**",
            "docs/30-tech_specs/backend/**",
            "tests/backend/**",
        ],
        "denylist": [
            "backend_django/.env*",
            "backend_django/pixel_backend/settings/prod.py",
        ],
    },
    "bruce": {
        "allowlist": [
            "backend_django/apps/**/models.py",
            "backend_django/apps/**/migrations/**",
            "docs/00-foundations/DB_SETUP.md",
            "docs/30-tech_specs/backend/**",
        ],
        "denylist": [
            "backend_django/.env*",
        ],
    },
    "eva": {
        "allowlist": [
            "docs/40-security/**",
            "backend_django/apps/**/views.py",
            "backend_django/apps/**/serializers.py",
            "frontend_nuxt/scripts/guards/**",
            "tests/security/**",
        ],
        "denylist": [
            "**/.env*",
            "**/secrets/**",
        ],
    },
    "dan": {
        "allowlist": [
            "frontend_nuxt/app/**",
            "frontend_nuxt/scripts/**",
            "docs/30-tech_specs/frontend/**",
            "docs/20-product_specs/ux_ui/**",
        ],
        "denylist": [
            "frontend_nuxt/.env*",
        ],
    },
}


# ==============================================================================
# SÉCURITÉ - VALIDATION INPUTS
# ==============================================================================


def sanitize_name(value: str) -> str:
    """
    Sanitize agent/ticket name.
    - NFKC normalization
    - Remove zero-width characters
    - Validate against safe pattern
    """
    if not value:
        raise ValueError("Empty name not allowed")

    # NFKC normalization
    normalized = unicodedata.normalize("NFKC", value)

    # Remove zero-width characters
    cleaned = ZERO_WIDTH_PATTERN.sub("", normalized)

    # Strip and validate
    cleaned = cleaned.strip()

    if not SAFE_NAME_PATTERN.match(cleaned):
        raise ValueError(
            f"Invalid name '{cleaned}'. Must match pattern: "
            f"^[a-zA-Z][a-zA-Z0-9_-]{{2,49}}$"
        )

    return cleaned.lower()


def ensure_path_in_repo(path: Path) -> Path:
    """
    Ensure path is within repository root.
    Prevents path traversal attacks.
    """
    try:
        resolved = path.resolve()
        resolved.relative_to(REPO_ROOT)
        return resolved
    except ValueError:
        raise ValueError(f"Path '{path}' is outside repository root")


# ==============================================================================
# REGISTRY & PROFILES
# ==============================================================================


def load_agents_registry() -> dict:
    """Load agents registry JSON."""
    if not AGENTS_REGISTRY_PATH.exists():
        raise FileNotFoundError(f"Agents registry not found: {AGENTS_REGISTRY_PATH}")

    with open(AGENTS_REGISTRY_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def get_agent_info(agent_slug: str) -> dict:
    """Get agent info from registry."""
    registry = load_agents_registry()
    agents = registry.get("agents", [])

    for agent in agents:
        if agent.get("slug") == agent_slug:
            return agent

    raise ValueError(f"Agent '{agent_slug}' not found in registry")


def load_agent_profile(agent_slug: str) -> dict:
    """Load agent profile JSON."""
    profile_path = AGENTS_PROFILES_DIR / f"{agent_slug}_agent.json"

    if not profile_path.exists():
        raise FileNotFoundError(f"Agent profile not found: {profile_path}")

    with open(profile_path, "r", encoding="utf-8") as f:
        return json.load(f)


def get_agent_scope(agent_slug: str) -> dict:
    """Get scope allowlist/denylist for agent."""
    if agent_slug in DEFAULT_AGENT_SCOPES:
        return DEFAULT_AGENT_SCOPES[agent_slug]

    # Default minimal scope
    return {
        "allowlist": ["docs/**"],
        "denylist": ["**/.env*", "**/secrets/**"],
    }


# ==============================================================================
# WORKTREE MANAGEMENT
# ==============================================================================


def get_worktree_path(ticket: str, agent: str) -> Path:
    """Get worktree path for ticket/agent."""
    return WORKTREES_BASE / ticket / agent


def get_branch_name(ticket: str, agent: str) -> str:
    """Get branch name for ticket/agent."""
    return f"feat/{ticket}-{agent}"


def worktree_exists(ticket: str, agent: str) -> bool:
    """Check if worktree already exists."""
    path = get_worktree_path(ticket, agent)
    return path.exists() and (path / ".git").exists()


def create_worktree(ticket: str, agent: str) -> Path:
    """Create git worktree for agent."""
    worktree_path = get_worktree_path(ticket, agent)
    branch_name = get_branch_name(ticket, agent)

    # Ensure parent directory exists
    worktree_path.parent.mkdir(parents=True, exist_ok=True)

    # Check if worktree already exists
    if worktree_exists(ticket, agent):
        print(f"⚠️  Worktree already exists: {worktree_path}")
        return worktree_path

    # Create branch from current HEAD
    print(f"📌 Creating branch: {branch_name}")
    subprocess.run(
        ["git", "branch", branch_name],
        cwd=REPO_ROOT,
        check=False,  # Branch might already exist
        capture_output=True,
    )

    # Create worktree
    print(f"📂 Creating worktree: {worktree_path}")
    result = subprocess.run(
        ["git", "worktree", "add", str(worktree_path), branch_name],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
    )

    if result.returncode != 0:
        raise RuntimeError(f"Failed to create worktree: {result.stderr}")

    return worktree_path


def create_agent_manifest(worktree_path: Path, agent: str, ticket: str) -> Path:
    """Create .agent/ directory with manifest.json."""
    agent_dir = worktree_path / ".agent"
    agent_dir.mkdir(exist_ok=True)

    scope = get_agent_scope(agent)
    agent_info = get_agent_info(agent)

    manifest = {
        "agent": agent,
        "displayName": agent_info.get("displayName", agent.capitalize()),
        "ticket": ticket,
        "branch": get_branch_name(ticket, agent),
        "worktreePath": str(get_worktree_path(ticket, agent).relative_to(REPO_ROOT)),
        "scopeAllowlist": scope["allowlist"],
        "scopeDenylist": scope["denylist"],
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "createdBy": "cline",
    }

    manifest_path = agent_dir / "manifest.json"
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)

    print(f"📋 Manifest created: {manifest_path}")
    return manifest_path


# ==============================================================================
# PROMPT GENERATION
# ==============================================================================


def generate_prompt(agent: str, ticket: str) -> str:
    """Generate Cline prompt for agent."""
    profile = load_agent_profile(agent)
    scope = get_agent_scope(agent)
    agent_info = get_agent_info(agent)

    display_name = agent_info.get("displayName", agent.capitalize())
    description = profile.get("description", "")
    instructions = profile.get("instructions", "")
    domains = agent_info.get("primaryDomains", [])

    # Build prompt
    prompt = f"""# Agent Activation — {display_name}

## Identité
Tu es **{display_name}**, agent PixelProwlers.
{description}

## Mission — Ticket {ticket}
{instructions}

## Domaines d'expertise
{', '.join(domains)}

## Scope autorisé (fichiers modifiables)
```
Allowlist:
{chr(10).join('- ' + p for p in scope['allowlist'])}

Denylist (INTERDIT):
{chr(10).join('- ' + p for p in scope['denylist'])}
```

## Contraintes Doctrine PixelProwlers (NON NÉGOCIABLES)
- ❌ **Jamais de secrets en clair** dans les fichiers, logs ou commits
- ❌ **Jamais de push sur main** — toujours via PR
- ❌ **No v-html, no dangerous DOM, no remote assets**
- ✅ **Privacy-first** : minimisation des données, logs sans PII
- ✅ **Commits conventionnels** : feat(<area>): ... / fix(<area>): ...

## Menaces attendues (à mitiger)
- Spam / Rate limiting abuse
- Probing / Enumération d'endpoints
- Injection (SQL, XSS, command)
- Doxxing / Fuite PII
- Supply chain attacks

## DoD technique
- [ ] make ssot-check OK
- [ ] Tests passants (si backend modifié)
- [ ] Scope check OK : `make agent-scope-check AGENT={agent} TICKET={ticket}`
- [ ] Aucun fichier hors périmètre
- [ ] Note de clôture générée

## Commandes utiles
```bash
# Vérification scope
make agent-scope-check AGENT={agent} TICKET={ticket}

# Clôture du run
make agent-close AGENT={agent} TICKET={ticket}

# Checks SSOT
make ssot-check
```

---
**Tu es activé. Commence par analyser le ticket et planifie ton approche.**
"""

    return prompt


# ==============================================================================
# SCOPE CHECK
# ==============================================================================


def path_matches_pattern(path: str, pattern: str) -> bool:
    """Check if path matches glob pattern."""
    # Handle ** (recursive)
    if "**" in pattern:
        # Convert to fnmatch-compatible
        parts = pattern.split("**")
        if len(parts) == 2:
            prefix, suffix = parts
            prefix = prefix.rstrip("/")
            suffix = suffix.lstrip("/")

            if prefix and not path.startswith(prefix):
                return False
            if suffix and not path.endswith(suffix) and suffix not in path:
                return fnmatch(path, f"*{suffix}")
            return True
        return fnmatch(path, pattern.replace("**", "*"))

    return fnmatch(path, pattern)


def check_file_in_scope(file_path: str, allowlist: list, denylist: list) -> tuple[bool, str]:
    """Check if file is in agent's scope."""
    # Check denylist first (takes precedence)
    for pattern in denylist:
        if path_matches_pattern(file_path, pattern):
            return False, f"File matches denylist pattern: {pattern}"

    # Check safety paths (global protection)
    for pattern in SAFETY_PATHS:
        if path_matches_pattern(file_path, pattern):
            return False, f"File is a protected safety file: {pattern}"

    # Check allowlist
    for pattern in allowlist:
        if path_matches_pattern(file_path, pattern):
            return True, "OK"

    return False, "File not in allowlist"


def get_modified_files(worktree_path: Path) -> list[str]:
    """Get list of modified files in worktree."""
    result = subprocess.run(
        ["git", "diff", "--name-only", "HEAD"],
        cwd=worktree_path,
        capture_output=True,
        text=True,
    )

    if result.returncode != 0:
        raise RuntimeError(f"Failed to get modified files: {result.stderr}")

    # Also get staged files
    result_staged = subprocess.run(
        ["git", "diff", "--name-only", "--cached"],
        cwd=worktree_path,
        capture_output=True,
        text=True,
    )

    files = set(result.stdout.strip().split("\n")) | set(
        result_staged.stdout.strip().split("\n")
    )
    return [f for f in files if f]  # Remove empty strings


def run_scope_check(ticket: str, agent: str) -> bool:
    """Run scope check for agent worktree."""
    worktree_path = get_worktree_path(ticket, agent)

    if not worktree_exists(ticket, agent):
        print(f"❌ Worktree not found: {worktree_path}")
        return False

    scope = get_agent_scope(agent)
    modified_files = get_modified_files(worktree_path)

    if not modified_files:
        print("✅ No modified files")
        return True

    all_ok = True
    print(f"\n🔍 Checking {len(modified_files)} modified files...\n")

    for file_path in modified_files:
        ok, reason = check_file_in_scope(
            file_path, scope["allowlist"], scope["denylist"]
        )
        if ok:
            print(f"  ✅ {file_path}")
        else:
            print(f"  ❌ {file_path} — {reason}")
            all_ok = False

    print()
    if all_ok:
        print("✅ All files within scope")
    else:
        print("❌ SCOPE VIOLATION — Some files outside agent scope")

    return all_ok


# ==============================================================================
# CLOSE / REPORT
# ==============================================================================


def generate_report(ticket: str, agent: str, summary: str = "") -> str:
    """Generate REPORT.md for run closure."""
    worktree_path = get_worktree_path(ticket, agent)
    agent_info = get_agent_info(agent)
    display_name = agent_info.get("displayName", agent.capitalize())

    # Get manifest
    manifest_path = worktree_path / ".agent" / "manifest.json"
    if manifest_path.exists():
        with open(manifest_path, "r", encoding="utf-8") as f:
            manifest = json.load(f)
    else:
        manifest = {"createdAt": "unknown"}

    # Get modified files
    modified_files = get_modified_files(worktree_path)

    # Run scope check
    scope_ok = run_scope_check(ticket, agent)

    report = f"""# Agent Run Report

## Metadata
- **Agent**: {display_name}
- **Ticket**: {ticket}
- **Started**: {manifest.get('createdAt', 'unknown')}
- **Closed**: {datetime.now(timezone.utc).isoformat()}
- **Branch**: {get_branch_name(ticket, agent)}

## Summary
{summary if summary else '<TODO: Add summary of changes>'}

## Files Modified
{chr(10).join('- ' + f for f in modified_files) if modified_files else '- No files modified'}

## DoD Checklist
- [ ] make ssot-check OK
- [ ] Tests backend OK (if applicable)
- {'[x]' if scope_ok else '[ ]'} Scope check OK
- [ ] Security review completed

## Risks & Notes
<TODO: Document any risks, limitations, or technical debt>

## Next Actions
- [ ] PR review
- [ ] Merge after validation
"""

    return report


def close_run(ticket: str, agent: str, summary: str = "") -> bool:
    """Close agent run and generate report."""
    worktree_path = get_worktree_path(ticket, agent)

    if not worktree_exists(ticket, agent):
        print(f"❌ Worktree not found: {worktree_path}")
        return False

    # Generate report
    report = generate_report(ticket, agent, summary)

    # Write report
    report_path = worktree_path / ".agent" / "REPORT.md"
    report_path.parent.mkdir(exist_ok=True)

    with open(report_path, "w", encoding="utf-8") as f:
        f.write(report)

    print(f"📝 Report generated: {report_path}")

    # Print summary
    print("\n" + "=" * 60)
    print("AGENT RUN CLOSURE")
    print("=" * 60)
    print(report)

    return True


# ==============================================================================
# COMMAND HANDLERS
# ==============================================================================


def cmd_start(args) -> int:
    """Handle 'start' command."""
    try:
        agent = sanitize_name(args.agent)
        ticket = sanitize_name(args.ticket)
    except ValueError as e:
        print(f"❌ Validation error: {e}")
        return 1

    print(f"\n🚀 Starting agent run: {agent} / {ticket}\n")

    try:
        # Verify agent exists
        get_agent_info(agent)

        # Create worktree
        worktree_path = create_worktree(ticket, agent)

        # Create manifest
        create_agent_manifest(worktree_path, agent, ticket)

        print(f"\n✅ Agent run started successfully!")
        print(f"   Worktree: {worktree_path}")
        print(f"   Branch: {get_branch_name(ticket, agent)}")
        print(f"\n   Next: make agent-prompt AGENT={agent} TICKET={ticket}")

        return 0
    except Exception as e:
        print(f"❌ Error: {e}")
        return 1


def cmd_prompt(args) -> int:
    """Handle 'prompt' command."""
    try:
        agent = sanitize_name(args.agent)
        ticket = sanitize_name(args.ticket)
    except ValueError as e:
        print(f"❌ Validation error: {e}")
        return 1

    try:
        prompt = generate_prompt(agent, ticket)

        if args.output:
            output_path = Path(args.output)
            with open(output_path, "w", encoding="utf-8") as f:
                f.write(prompt)
            print(f"📝 Prompt written to: {output_path}")
        else:
            print(prompt)

        return 0
    except Exception as e:
        print(f"❌ Error: {e}")
        return 1


def cmd_scope_check(args) -> int:
    """Handle 'scope-check' command."""
    try:
        agent = sanitize_name(args.agent)
        ticket = sanitize_name(args.ticket)
    except ValueError as e:
        print(f"❌ Validation error: {e}")
        return 1

    try:
        ok = run_scope_check(ticket, agent)
        return 0 if ok else 1
    except Exception as e:
        print(f"❌ Error: {e}")
        return 1


def cmd_close(args) -> int:
    """Handle 'close' command."""
    try:
        agent = sanitize_name(args.agent)
        ticket = sanitize_name(args.ticket)
    except ValueError as e:
        print(f"❌ Validation error: {e}")
        return 1

    try:
        summary = args.summary or ""
        ok = close_run(ticket, agent, summary)
        return 0 if ok else 1
    except Exception as e:
        print(f"❌ Error: {e}")
        return 1


def cmd_list(args) -> int:
    """Handle 'list' command - list active worktrees."""
    if not WORKTREES_BASE.exists():
        print("📭 No worktrees directory found")
        return 0

    print("\n📂 Active Agent Worktrees\n")

    found = False
    for ticket_dir in sorted(WORKTREES_BASE.iterdir()):
        if ticket_dir.is_dir():
            for agent_dir in sorted(ticket_dir.iterdir()):
                if agent_dir.is_dir() and (agent_dir / ".git").exists():
                    manifest_path = agent_dir / ".agent" / "manifest.json"
                    if manifest_path.exists():
                        with open(manifest_path, "r", encoding="utf-8") as f:
                            manifest = json.load(f)
                        created = manifest.get("createdAt", "unknown")
                        print(f"  • {ticket_dir.name}/{agent_dir.name}")
                        print(f"    Branch: {manifest.get('branch', 'unknown')}")
                        print(f"    Created: {created}")
                        print()
                        found = True

    if not found:
        print("  No active worktrees found")

    return 0


# ==============================================================================
# MAIN
# ==============================================================================


def main():
    parser = argparse.ArgumentParser(
        description="Agent Runtime CLI — PixelProwlers Option B",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python3 tools/agent_runtime.py start --agent tom --ticket TKT_backend_mvp
  python3 tools/agent_runtime.py prompt --agent tom --ticket TKT_backend_mvp
  python3 tools/agent_runtime.py scope-check --agent tom --ticket TKT_backend_mvp
  python3 tools/agent_runtime.py close --agent tom --ticket TKT_backend_mvp
  python3 tools/agent_runtime.py list
        """,
    )

    subparsers = parser.add_subparsers(dest="command", help="Commands")

    # Start command
    start_parser = subparsers.add_parser("start", help="Start agent run (create worktree)")
    start_parser.add_argument("--agent", "-a", required=True, help="Agent slug (e.g., tom)")
    start_parser.add_argument("--ticket", "-t", required=True, help="Ticket ID (e.g., TKT_backend_mvp)")

    # Prompt command
    prompt_parser = subparsers.add_parser("prompt", help="Generate agent prompt")
    prompt_parser.add_argument("--agent", "-a", required=True, help="Agent slug")
    prompt_parser.add_argument("--ticket", "-t", required=True, help="Ticket ID")
    prompt_parser.add_argument("--output", "-o", help="Output file (default: stdout)")

    # Scope-check command
    scope_parser = subparsers.add_parser("scope-check", help="Check modified files are in scope")
    scope_parser.add_argument("--agent", "-a", required=True, help="Agent slug")
    scope_parser.add_argument("--ticket", "-t", required=True, help="Ticket ID")

    # Close command
    close_parser = subparsers.add_parser("close", help="Close agent run and generate report")
    close_parser.add_argument("--agent", "-a", required=True, help="Agent slug")
    close_parser.add_argument("--ticket", "-t", required=True, help="Ticket ID")
    close_parser.add_argument("--summary", "-s", help="Summary of changes")

    # List command
    subparsers.add_parser("list", help="List active agent worktrees")

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        return 1

    handlers = {
        "start": cmd_start,
        "prompt": cmd_prompt,
        "scope-check": cmd_scope_check,
        "close": cmd_close,
        "list": cmd_list,
    }

    handler = handlers.get(args.command)
    if handler:
        return handler(args)
    else:
        parser.print_help()
        return 1


if __name__ == "__main__":
    sys.exit(main())
