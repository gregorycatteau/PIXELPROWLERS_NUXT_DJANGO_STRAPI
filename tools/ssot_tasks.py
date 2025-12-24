#!/usr/bin/env python3
"""
SSOT Task Runner — PixelProwlers

Catalogue de tâches SSOT prédéfinies pour humains et agents IA.
Chaque tâche inclut un prompt, une DoD (Definition of Done), et des commandes.

Usage:
    python3 tools/ssot_tasks.py list                     # Liste toutes les tâches
    python3 tools/ssot_tasks.py show <task_id>           # Affiche détails + DoD
    python3 tools/ssot_tasks.py render <task_id> --format cline  # Prompt copy-paste

Options:
    --format cline   Génère un prompt optimisé pour Cline/Claude
    --format human   Génère des instructions pour humain (par défaut)
"""

import sys
from typing import Dict, List, Optional
from datetime import datetime

# ============================================================
# TASKS CATALOG (declarative)
# ============================================================

TASKS_CATALOG: Dict[str, Dict] = {
    "ssot_frontmatter_backfill": {
        "id": "ssot_frontmatter_backfill",
        "name": "Frontmatter Backfill",
        "category": "maintenance",
        "priority": "P1",
        "description": "Ajoute les frontmatters YAML manquants aux docs existants",
        "when_to_use": [
            "Nouveaux docs créés manuellement sans frontmatter",
            "Migration depuis un autre système de documentation",
            "ssot_lint détecte des MISSING_FRONTMATTER"
        ],
        "prompt": """Tu es Cline. Mission : ajouter les frontmatters YAML manquants.

CONTEXTE
- Certains fichiers docs/**/*.md n'ont pas de frontmatter YAML
- Le SSOT exige id, title, status, date, owners, scope pour chaque doc
- L'outil tools/add_frontmatter.py peut être utilisé

ÉTAPES
1. Exécute `python3 tools/ssot_lint.py --strict` pour identifier les fichiers sans frontmatter
2. Pour chaque fichier MISSING_FRONTMATTER :
   - Génère un id unique basé sur le nom du fichier (snake_case, sans extension)
   - Détermine le scope depuis le chemin (ex: docs/20-product_specs → product_spec)
   - Ajoute frontmatter avec status=active, date=aujourd'hui, owners=["Marty"]
3. Re-exécute `python3 tools/ssot_lint.py --strict` pour vérifier

CONTRAINTES
- Ne PAS modifier le contenu existant, seulement ajouter frontmatter
- Utiliser le format YAML standard (---...---)
- Respecter la convention de nommage des IDs""",
        "dod": [
            "✅ `python3 tools/ssot_lint.py --strict` passe sans erreur MISSING_FRONTMATTER",
            "✅ Chaque frontmatter contient: id, title, status, date, owners, scope",
            "✅ Les IDs sont uniques (pas de doublons)",
            "✅ Aucun contenu existant n'a été supprimé ou altéré"
        ],
        "commands": [
            "python3 tools/ssot_lint.py --strict",
            "python3 tools/add_frontmatter.py --dry-run",
            "python3 tools/add_frontmatter.py --apply"
        ],
        "estimated_time": "15-30 min"
    },
    
    "ssot_archive_release": {
        "id": "ssot_archive_release",
        "name": "Archive Release Docs",
        "category": "lifecycle",
        "priority": "P2",
        "description": "Archive les docs d'une release obsolète vers le dossier legacy",
        "when_to_use": [
            "Nouvelle release majeure (V1.2 → V1.3)",
            "Docs devenus obsolètes mais à conserver pour référence",
            "Nettoyage périodique du SSOT"
        ],
        "prompt": """Tu es Cline. Mission : archiver les docs de la release {RELEASE_VERSION}.

CONTEXTE
- Les docs de la release {RELEASE_VERSION} doivent être archivés
- Destination : docs/90-placeholders_archive/legacy_{RELEASE_VERSION}/
- Les docs archivés doivent avoir status=archived dans leur frontmatter

ÉTAPES
1. Identifie tous les docs contenant {RELEASE_VERSION} dans leur nom ou frontmatter
2. Pour chaque doc à archiver :
   - Copie vers docs/90-placeholders_archive/legacy_{RELEASE_VERSION}/
   - Met à jour le frontmatter : status=archived, archivedAt=date
3. Supprime les originaux si confirmé
4. Met à jour ssot_registry.json si nécessaire
5. Exécute `python3 tools/ssot_generate_indexes.py --apply`

CONTRAINTES
- Ne PAS archiver les docs actifs de la release courante
- Préserver tous les liens internes (mettre à jour si nécessaire)
- Documenter les docs archivés dans le README du dossier legacy""",
        "dod": [
            "✅ Tous les docs {RELEASE_VERSION} sont dans le dossier legacy",
            "✅ Frontmatters mis à jour avec status=archived",
            "✅ ssot_registry.json nettoyé des entrées obsolètes",
            "✅ `make ssot-check` passe",
            "✅ README legacy mis à jour avec la liste des docs archivés"
        ],
        "commands": [
            "grep -r 'V1_2' docs/ --include='*.md' -l",
            "python3 tools/ssot_lint.py --strict",
            "python3 tools/ssot_generate_indexes.py --apply"
        ],
        "estimated_time": "30-60 min"
    },
    
    "ssot_openapi_sync": {
        "id": "ssot_openapi_sync",
        "name": "OpenAPI Spec Sync",
        "category": "api",
        "priority": "P0",
        "description": "Synchronise la spec OpenAPI avec l'implémentation backend",
        "when_to_use": [
            "Nouvel endpoint ajouté au backend",
            "Modification de schémas existants",
            "Divergence détectée entre spec et code"
        ],
        "prompt": """Tu es Cline. Mission : synchroniser la spec OpenAPI avec le backend.

CONTEXTE
- Spec OpenAPI : docs/30-tech_specs/backend/openapi.v1.yaml
- Backend Django : backend_django/
- La spec doit refléter exactement les endpoints implémentés

ÉTAPES
1. Liste les endpoints Django : `grep -r '@api_view\\|APIView' backend_django/`
2. Compare avec la spec OpenAPI existante
3. Pour chaque divergence :
   - Endpoint manquant → Ajoute à la spec avec schémas
   - Endpoint obsolète → Retire de la spec ou marque deprecated
   - Schéma différent → Met à jour les schemas et responses
4. Valide avec `python3 tools/openapi_validate.py`
5. Optionnel : Génère client avec redocly/openapi-generator

CONTRAINTES
- Respecter OpenAPI 3.0.3
- Documenter tous les codes de réponse (200, 400, 401, 404, 500)
- Inclure les schémas de validation pour chaque body""",
        "dod": [
            "✅ `python3 tools/openapi_validate.py` passe sans erreur",
            "✅ Tous les endpoints backend sont documentés dans la spec",
            "✅ Aucun endpoint fantôme dans la spec",
            "✅ Schémas Request/Response complets",
            "✅ Swagger UI affiche correctement la spec"
        ],
        "commands": [
            "python3 tools/openapi_validate.py",
            "grep -r '@api_view' backend_django/ -A 5",
            "npx @redocly/cli lint docs/30-tech_specs/backend/openapi.v1.yaml"
        ],
        "estimated_time": "45-90 min"
    },
    
    "ssot_indexes_rebuild": {
        "id": "ssot_indexes_rebuild",
        "name": "Rebuild All Indexes",
        "category": "maintenance",
        "priority": "P1",
        "description": "Régénère tous les README d'index depuis le registry",
        "when_to_use": [
            "Index drift détecté en CI",
            "Ajout de nombreux nouveaux docs",
            "Migration ou réorganisation du SSOT"
        ],
        "prompt": """Tu es Cline. Mission : reconstruire tous les index README.

CONTEXTE
- Les README.md dans docs/ sont générés depuis ssot_registry.json
- L'outil tools/ssot_generate_indexes.py gère cette génération
- Un drift signifie que les README ne reflètent plus le registry

ÉTAPES
1. Vérifie l'état actuel : `python3 tools/ssot_generate_indexes.py --dry-run`
2. Applique les changements : `python3 tools/ssot_generate_indexes.py --apply`
3. Vérifie la cohérence : `python3 tools/ssot_lint.py --strict`
4. Si des fichiers ne sont pas dans le registry :
   - Ajoute-les avec tools/ssot_create_doc.py --register
   - OU vérifie s'ils doivent être supprimés/archivés
5. Commit les changements

CONTRAINTES
- Préserver les sections <!-- KEEP --> ... <!-- ENDKEEP -->
- Ne PAS modifier le contenu custom des README
- Vérifier que chaque dossier a bien son README""",
        "dod": [
            "✅ `python3 tools/ssot_generate_indexes.py --check` retourne 0",
            "✅ Tous les README reflètent le contenu réel des dossiers",
            "✅ `make ssot-check` passe",
            "✅ Sections KEEP préservées"
        ],
        "commands": [
            "python3 tools/ssot_generate_indexes.py --dry-run",
            "python3 tools/ssot_generate_indexes.py --apply",
            "make ssot-check"
        ],
        "estimated_time": "5-15 min"
    },
    
    "ssot_linkcheck_fix": {
        "id": "ssot_linkcheck_fix",
        "name": "Fix Broken Links",
        "category": "maintenance",
        "priority": "P0",
        "description": "Corrige les liens internes cassés détectés par ssot_linkcheck",
        "when_to_use": [
            "CI échoue sur linkcheck --strict",
            "Après renommage ou déplacement de fichiers",
            "Après archivage de docs"
        ],
        "prompt": """Tu es Cline. Mission : corriger tous les liens cassés dans docs/.

CONTEXTE
- L'outil tools/ssot_linkcheck.py détecte les liens internes cassés
- Types de problèmes : BROKEN_LINK (fichier inexistant), BROKEN_ANCHOR (ancre invalide)

ÉTAPES
1. Exécute `python3 tools/ssot_linkcheck.py` pour lister les problèmes
2. Pour chaque BROKEN_LINK :
   - Vérifie si le fichier cible a été renommé/déplacé → Corrige le chemin
   - Vérifie si le fichier cible a été supprimé → Supprime le lien ou crée le fichier
3. Pour chaque BROKEN_ANCHOR :
   - Vérifie que l'ancre existe dans le fichier cible
   - Corrige l'ancre ou le heading correspondant
4. Re-exécute `python3 tools/ssot_linkcheck.py --strict`

CONTRAINTES
- Utiliser des chemins relatifs (../xxx) et non absolus
- Vérifier que les ancres suivent la convention GitHub (lowercase, tirets)
- Ne PAS supprimer de contenu utile""",
        "dod": [
            "✅ `python3 tools/ssot_linkcheck.py --strict` retourne 0",
            "✅ Aucun lien cassé ni ancre invalide",
            "✅ Tous les chemins sont relatifs et valides",
            "✅ Navigation entre docs fonctionne"
        ],
        "commands": [
            "python3 tools/ssot_linkcheck.py",
            "python3 tools/ssot_linkcheck.py --strict --no-orphans"
        ],
        "estimated_time": "15-45 min"
    },
    
    "ssot_secret_scan_review": {
        "id": "ssot_secret_scan_review",
        "name": "Secret Scan Review",
        "category": "security",
        "priority": "P0",
        "description": "Analyse et nettoie les potentiels secrets exposés dans docs/",
        "when_to_use": [
            "CI warning sur secret scan",
            "Audit sécurité périodique",
            "Avant publication de documentation"
        ],
        "prompt": """Tu es Cline. Mission : analyser et nettoyer les secrets potentiels.

CONTEXTE
- La CI scanne docs/ pour détecter des patterns de secrets
- Patterns : password, secret, api_key, token, private_key
- Certains sont des faux positifs (exemples, placeholders)

ÉTAPES
1. Exécute le scan : `grep -rniE '(password|secret|api_key|token).*[:=].*["\x27]' docs/`
2. Pour chaque match, évalue :
   - Est-ce un placeholder ? (ex: <YOUR_API_KEY>) → OK
   - Est-ce un exemple explicite ? (ex: "example_token_12345") → OK
   - Est-ce une vraie valeur ? → DANGER, remplacer immédiatement
3. Remplace les vraies valeurs par des placeholders
4. Ajoute les faux positifs à une allowlist si récurrents
5. Documente dans SECURITY_INDEX si nouveau pattern

CONTRAINTES
- NE JAMAIS committer de vrais secrets
- Utiliser des placeholders explicites (<PASSWORD>, <API_KEY>)
- Vérifier l'historique git si secret trouvé (git filter-branch si nécessaire)""",
        "dod": [
            "✅ Aucun secret réel dans docs/",
            "✅ Tous les exemples utilisent des placeholders",
            "✅ CI secret scan passe sans warning",
            "✅ Historique git nettoyé si nécessaire"
        ],
        "commands": [
            "grep -rniE '(password|secret|api_key|token).*[:=]' docs/ --include='*.md'",
            "git log -p docs/ | grep -i password | head -20"
        ],
        "estimated_time": "20-40 min"
    },
    
    "ssot_new_feature_docset": {
        "id": "ssot_new_feature_docset",
        "name": "New Feature DocSet",
        "category": "creation",
        "priority": "P1",
        "description": "Crée le set complet de docs pour une nouvelle feature",
        "when_to_use": [
            "Nouvelle feature à documenter",
            "Nouveau parcours utilisateur",
            "Nouvelle intégration API"
        ],
        "prompt": """Tu es Cline. Mission : créer le DocSet complet pour la feature {FEATURE_NAME}.

CONTEXTE
- Une feature bien documentée nécessite plusieurs docs liés
- Types requis : product_spec, user_story, tech_spec (optionnel: security_contract)

ÉTAPES
1. Crée la spec fonctionnelle :
   `python3 tools/ssot_create_doc.py product_spec docs/20-product_specs/functional/{FEATURE}_SPEC.md --title "{FEATURE} Spec" --register`

2. Crée les user stories :
   `python3 tools/ssot_create_doc.py user_story docs/20-product_specs/user_stories/{FEATURE}_USER_STORIES.md --title "{FEATURE} User Stories" --register`

3. Si technique requis, crée la tech spec :
   `python3 tools/ssot_create_doc.py tech_spec docs/30-tech_specs/frontend/{FEATURE}_TECH.md --title "{FEATURE} Tech Spec" --register`

4. Si sécurité requis, crée le contrat :
   `python3 tools/ssot_create_doc.py security_contract docs/40-security/contracts/{FEATURE}_SECURITY.md --priority P1 --register`

5. Mets à jour les liens croisés entre docs
6. Régénère les index : `python3 tools/ssot_generate_indexes.py --apply`

CONTRAINTES
- Respecter les templates de chaque doctype
- Ajouter les liens croisés (parent ↔ enfants)
- Utiliser des IDs cohérents (préfixe commun)""",
        "dod": [
            "✅ Product spec créée et dans registry",
            "✅ User stories créées et liées",
            "✅ Tech spec créée si applicable",
            "✅ Liens croisés fonctionnels",
            "✅ `make ssot-check` passe",
            "✅ Index mis à jour"
        ],
        "commands": [
            "python3 tools/ssot_create_doc.py product_spec --help",
            "python3 tools/ssot_generate_indexes.py --apply",
            "make ssot-check"
        ],
        "estimated_time": "30-60 min"
    },
    
    "ssot_ci_gates_review": {
        "id": "ssot_ci_gates_review",
        "name": "CI Gates Review",
        "category": "quality",
        "priority": "P1",
        "description": "Audit et amélioration des gates CI SSOT",
        "when_to_use": [
            "Nouvelle gate à ajouter",
            "Gate existante trop permissive ou trop stricte",
            "Faux positifs récurrents en CI"
        ],
        "prompt": """Tu es Cline. Mission : auditer et améliorer les gates CI SSOT.

CONTEXTE
- Workflow CI : .github/workflows/ssot_ci.yml
- Gates actuelles : ssot_lint, openapi_validate, index_drift, linkcheck, secret_scan
- Certaines gates sont en warning (continue-on-error), d'autres bloquantes

ÉTAPES
1. Liste les gates actuelles et leur mode (strict/warning)
2. Pour chaque gate, évalue :
   - Est-elle utile ? Quels bugs prévient-elle ?
   - Est-elle trop stricte ? (faux positifs fréquents)
   - Est-elle trop permissive ? (vrais bugs passent)
3. Propose des ajustements :
   - Passer warning → strict si gate stable
   - Ajouter allowlist si faux positifs récurrents
   - Ajouter nouvelle gate si besoin détecté
4. Implémente les changements dans ssot_ci.yml
5. Documente dans SECURITY_GATES.md ou QA_INDEX.md

CONTRAINTES
- Ne PAS casser la CI existante (tester localement d'abord)
- Documenter chaque changement de gate
- Prévoir un fallback si nouvelle gate trop stricte""",
        "dod": [
            "✅ Toutes les gates documentées dans SECURITY_GATES.md",
            "✅ CI locale simule correctement (`make ci-ssot`)",
            "✅ Pas de régression sur les gates existantes",
            "✅ Nouvelles gates en warning d'abord",
            "✅ Changelog des modifications"
        ],
        "commands": [
            "make ci-ssot",
            "cat .github/workflows/ssot_ci.yml",
            "python3 tools/ssot_lint.py --strict"
        ],
        "estimated_time": "30-60 min"
    },
    
    "ssot_backlog_build": {
        "id": "ssot_backlog_build",
        "name": "Build Backlog",
        "category": "delivery",
        "priority": "P1",
        "description": "Génère le backlog priorisé depuis le SSOT",
        "when_to_use": [
            "Début de sprint",
            "Après ajout de nouveaux docs",
            "Mise à jour des priorités"
        ],
        "prompt": """Tu es Cline. Mission : générer le backlog depuis le SSOT.

CONTEXTE
- L'outil tools/ssot_backlog.py génère des tickets depuis les docs actifs
- Outputs : backlog.generated.md et backlog.generated.json
- Chaque ticket inclut un prompt Cline et des critères d'acceptation

ÉTAPES
1. Exécute `python3 tools/ssot_backlog.py list` pour voir les docs éligibles
2. Exécute `python3 tools/ssot_backlog.py build` pour générer le backlog
3. Vérifie docs/10-vision_roadmap/backlog.generated.md
4. Utilise `make ssot-ticket TICKET=<id>` pour afficher un ticket

CONTRAINTES
- Ne PAS éditer les fichiers générés manuellement
- Les tickets sont priorisés automatiquement (P0 > P1 > P2)
- La doctrine sécurité est incluse dans chaque ticket""",
        "dod": [
            "✅ `python3 tools/ssot_backlog.py build` s'exécute sans erreur",
            "✅ backlog.generated.md est créé/mis à jour",
            "✅ backlog.generated.json est créé/mis à jour",
            "✅ Les tickets sont triés par priorité"
        ],
        "commands": [
            "python3 tools/ssot_backlog.py list",
            "python3 tools/ssot_backlog.py build",
            "make ssot-backlog"
        ],
        "estimated_time": "5-10 min"
    },
    
    "ssot_ticket_render": {
        "id": "ssot_ticket_render",
        "name": "Render Ticket Prompt",
        "category": "delivery",
        "priority": "P1",
        "description": "Affiche le prompt d'un ticket pour exécution par agent IA",
        "when_to_use": [
            "Exécuter un ticket du backlog",
            "Générer un prompt pour un agent spécifique",
            "Planifier le travail d'équipe"
        ],
        "prompt": """Tu es Cline. Mission : utiliser le système de tickets SSOT.

CONTEXTE
- Le backlog contient des tickets générés depuis les docs SSOT
- Chaque ticket a un prompt Cline et des critères d'acceptation
- Les prompts peuvent être adaptés par agent (Dan, Tom, Eva, etc.)

ÉTAPES
1. Exécute `python3 tools/ssot_backlog.py list` pour voir les tickets
2. Choisis un ticket selon sa priorité (P0 en premier)
3. Génère le prompt : `make ssot-ticket TICKET=<id>`
4. Copie-colle le prompt dans Cline pour exécution
5. Vérifie la DoD une fois le travail terminé

OPTIONS
- Format Cline : `--format cline` (par défaut)
- Format agent : `--format agent --agent Dan`

CONTRAINTES
- Respecter la priorité des tickets (P0 > P1 > P2)
- Valider les critères d'acceptation
- Appliquer la doctrine sécurité PixelProwlers""",
        "dod": [
            "✅ Le prompt est généré correctement",
            "✅ Les critères d'acceptation sont visibles",
            "✅ La doctrine sécurité est incluse",
            "✅ Le ticket peut être exécuté par un agent"
        ],
        "commands": [
            "python3 tools/ssot_backlog.py render TKT_xxx --format cline",
            "make ssot-ticket TICKET=TKT_xxx",
            "python3 tools/ssot_backlog.py render TKT_xxx --format agent --agent Dan"
        ],
        "estimated_time": "2-5 min"
    },
    
    "ssot_sprint_build": {
        "id": "ssot_sprint_build",
        "name": "Build Sprints",
        "category": "delivery",
        "priority": "P1",
        "description": "Génère les sprints depuis le backlog SSOT",
        "when_to_use": [
            "Début de sprint",
            "Après mise à jour du backlog",
            "Planification d'équipe"
        ],
        "prompt": """Tu es Cline. Mission : générer les sprints depuis le SSOT.

CONTEXTE
- L'outil tools/ssot_sprint_planner.py génère des sprints depuis le backlog
- Modes : delivery (code/tests/guards) ou governance (docs/specs/policy)
- Outputs : sprints.generated.md et sprints.generated.json

ÉTAPES
1. Assure-toi que le backlog est à jour : `python3 tools/ssot_backlog.py build`
2. Génère les sprints delivery : `python3 tools/ssot_sprint_planner.py build --mode delivery`
3. Vérifie docs/10-vision_roadmap/sprints.generated.md
4. Utilise `make ssot-next-sprint MODE=delivery` pour le prochain sprint

OPTIONS
- --mode delivery : tickets code/tests/assets/guards
- --mode governance : tickets docs/specs/policy/audit

CONTRAINTES
- Les sprints sont triés par priorité (P0 > P1 > P2)
- WIP limit par défaut : 7 tickets
- La doctrine sécurité est incluse dans chaque sprint""",
        "dod": [
            "✅ `python3 tools/ssot_sprint_planner.py build --mode <mode>` s'exécute sans erreur",
            "✅ sprints.generated.md est créé/mis à jour",
            "✅ sprints.generated.json est créé/mis à jour",
            "✅ Les sprints sont triés par priorité"
        ],
        "commands": [
            "python3 tools/ssot_backlog.py build",
            "python3 tools/ssot_sprint_planner.py build --mode delivery",
            "make ssot-sprints MODE=delivery"
        ],
        "estimated_time": "5-10 min"
    },
    
    "ssot_sprint_next": {
        "id": "ssot_sprint_next",
        "name": "Next Sprint",
        "category": "delivery",
        "priority": "P1",
        "description": "Affiche le prochain sprint à exécuter avec prompt Cline",
        "when_to_use": [
            "Démarrer un nouveau sprint",
            "Planifier le travail d'équipe",
            "Générer un prompt pour exécution"
        ],
        "prompt": """Tu es Cline. Mission : utiliser le système de sprints SSOT.

CONTEXTE
- Le sprint planner sélectionne les N tickets prioritaires (WIP)
- Modes : delivery (code) ou governance (docs)
- Prompt Cline inclus pour exécution directe

ÉTAPES
1. Génère le prochain sprint : `python3 tools/ssot_sprint_planner.py next --mode delivery --wip 7`
2. Copie le prompt Cline généré
3. Colle dans Cline pour exécuter le sprint
4. Valide la DoD une fois le sprint terminé

OPTIONS
- --mode delivery|governance
- --wip N (nombre de tickets, défaut: 7)

CONTRAINTES
- Traiter les tickets P0 en premier (sécurité)
- Commit séparés par ticket
- Valider make ssot-check entre les tickets""",
        "dod": [
            "✅ Le prochain sprint est affiché",
            "✅ Le prompt Cline est généré",
            "✅ Les tickets sont triés par priorité",
            "✅ La doctrine sécurité est incluse"
        ],
        "commands": [
            "python3 tools/ssot_sprint_planner.py next --mode delivery --wip 7",
            "make ssot-next-sprint MODE=delivery WIP=7",
            "python3 tools/ssot_sprint_planner.py next --mode governance --wip 5"
        ],
        "estimated_time": "5-10 min"
    },
    
    "ssot_orphan_cleanup": {
        "id": "ssot_orphan_cleanup",
        "name": "Orphan Docs Cleanup",
        "category": "maintenance",
        "priority": "P2",
        "description": "Identifie et traite les docs orphelins non référencés",
        "when_to_use": [
            "ssot_linkcheck --orphans détecte des orphelins",
            "Nettoyage périodique du SSOT",
            "Après suppression de features"
        ],
        "prompt": """Tu es Cline. Mission : traiter les docs orphelins détectés.

CONTEXTE
- Un doc orphelin est un doc canonique non référencé par aucun index ou autre doc
- L'outil tools/ssot_linkcheck.py --orphans détecte ces docs
- Les orphelins peuvent être légitimes (nouveaux) ou obsolètes

ÉTAPES
1. Exécute `python3 tools/ssot_linkcheck.py --orphans`
2. Pour chaque orphelin, décide :
   - Doc légitime manquant de référence → Ajoute lien dans README parent
   - Doc obsolète → Archive vers legacy/
   - Doc mal classé → Déplace vers bon dossier
3. Régénère les index si nécessaire
4. Re-exécute pour vérifier

CONTRAINTES
- Ne PAS supprimer de docs sans confirmation
- Archiver plutôt que supprimer
- Documenter la raison de chaque action""",
        "dod": [
            "✅ `python3 tools/ssot_linkcheck.py --orphans` retourne 0 orphelins",
            "✅ Chaque doc est référencé par au moins un index",
            "✅ Docs obsolètes archivés proprement",
            "✅ `make ssot-check` passe"
        ],
        "commands": [
            "python3 tools/ssot_linkcheck.py --orphans",
            "python3 tools/ssot_linkcheck.py --orphans --orphans-strict"
        ],
        "estimated_time": "20-45 min"
    }
}


# ============================================================
# CLI FUNCTIONS
# ============================================================

def list_tasks() -> None:
    """Liste toutes les tâches disponibles."""
    print("=" * 70)
    print("📋 SSOT Tasks Catalog — PixelProwlers")
    print("=" * 70)
    print()
    
    # Group by category
    categories = {}
    for task_id, task in TASKS_CATALOG.items():
        cat = task.get("category", "other")
        if cat not in categories:
            categories[cat] = []
        categories[cat].append(task)
    
    for cat, tasks in sorted(categories.items()):
        print(f"📁 {cat.upper()}")
        print("-" * 40)
        for task in sorted(tasks, key=lambda t: t["priority"]):
            priority_icon = {"P0": "🔴", "P1": "🟡", "P2": "🟢"}.get(task["priority"], "⚪")
            print(f"  {priority_icon} {task['id']:<30} {task['name']}")
        print()
    
    print(f"💡 Total: {len(TASKS_CATALOG)} tâches disponibles")
    print()
    print("Usage:")
    print("  python3 tools/ssot_tasks.py show <task_id>")
    print("  python3 tools/ssot_tasks.py render <task_id> --format cline")


def show_task(task_id: str) -> None:
    """Affiche les détails d'une tâche."""
    if task_id not in TASKS_CATALOG:
        print(f"❌ Tâche inconnue: {task_id}")
        print()
        print("Tâches disponibles:")
        for tid in sorted(TASKS_CATALOG.keys()):
            print(f"  • {tid}")
        sys.exit(1)
    
    task = TASKS_CATALOG[task_id]
    
    print("=" * 70)
    print(f"📌 {task['name']}")
    print("=" * 70)
    print()
    print(f"ID:          {task['id']}")
    print(f"Catégorie:   {task['category']}")
    print(f"Priorité:    {task['priority']}")
    print(f"Durée est.:  {task['estimated_time']}")
    print()
    print("📝 DESCRIPTION")
    print("-" * 40)
    print(task['description'])
    print()
    print("🎯 QUAND UTILISER")
    print("-" * 40)
    for item in task['when_to_use']:
        print(f"  • {item}")
    print()
    print("✅ DEFINITION OF DONE")
    print("-" * 40)
    for item in task['dod']:
        print(f"  {item}")
    print()
    print("💻 COMMANDES UTILES")
    print("-" * 40)
    for cmd in task['commands']:
        print(f"  $ {cmd}")
    print()
    print(f"💡 Pour générer le prompt Cline: python3 tools/ssot_tasks.py render {task_id} --format cline")


def render_task(task_id: str, format_type: str = "human") -> None:
    """Génère un prompt copy-paste pour la tâche."""
    if task_id not in TASKS_CATALOG:
        print(f"❌ Tâche inconnue: {task_id}")
        sys.exit(1)
    
    task = TASKS_CATALOG[task_id]
    
    if format_type == "cline":
        # Format optimisé pour Cline/Claude
        print("=" * 70)
        print("📋 PROMPT CLINE — Copier-coller ci-dessous")
        print("=" * 70)
        print()
        print(task['prompt'].strip())
        print()
        print("---")
        print()
        print("DEFINITION OF DONE")
        for item in task['dod']:
            print(item)
        print()
        print("COMMANDES DISPONIBLES")
        for cmd in task['commands']:
            print(f"- {cmd}")
        print()
        print("=" * 70)
    else:
        # Format human-readable
        print("=" * 70)
        print(f"📋 Instructions: {task['name']}")
        print("=" * 70)
        print()
        print("DESCRIPTION")
        print("-" * 40)
        print(task['description'])
        print()
        print("ÉTAPES À SUIVRE")
        print("-" * 40)
        # Extract steps from prompt (between ÉTAPES and CONTRAINTES)
        prompt = task['prompt']
        if "ÉTAPES" in prompt:
            start = prompt.find("ÉTAPES")
            end = prompt.find("CONTRAINTES") if "CONTRAINTES" in prompt else len(prompt)
            steps = prompt[start:end].strip()
            print(steps)
        else:
            print(prompt)
        print()
        print("CRITÈRES DE VALIDATION")
        print("-" * 40)
        for item in task['dod']:
            print(item)
        print()
        print("COMMANDES")
        print("-" * 40)
        for cmd in task['commands']:
            print(f"$ {cmd}")


def print_usage() -> None:
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
        list_tasks()
    
    elif command == "show":
        if len(args) < 2:
            print("❌ Usage: ssot_tasks.py show <task_id>")
            sys.exit(1)
        show_task(args[1])
    
    elif command == "render":
        if len(args) < 2:
            print("❌ Usage: ssot_tasks.py render <task_id> [--format cline|human]")
            sys.exit(1)
        
        task_id = args[1]
        format_type = "human"
        
        if "--format" in args:
            idx = args.index("--format")
            if idx + 1 < len(args):
                format_type = args[idx + 1]
        
        render_task(task_id, format_type)
    
    else:
        print(f"❌ Commande inconnue: {command}")
        print()
        print("Commandes disponibles: list, show, render")
        sys.exit(1)


if __name__ == "__main__":
    main()
