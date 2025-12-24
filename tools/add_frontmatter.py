#!/usr/bin/env python3
"""
Script pour ajouter les frontmatter YAML manquants aux fichiers .md du SSOT.
Conformément aux règles SSOT_RULEBOOK_V1.
"""

import os
import re
from datetime import date
from pathlib import Path

# Liste des fichiers à traiter (depuis ssot_registry.json.needsFrontmatter)
# Exclusion de DB_SETUP.md déjà traité
FILES_TO_PROCESS = [
    "docs/00-foundations/ENVIRONMENTS.md",
    "docs/00-foundations/PHASES_DEV.md",
    "docs/00-foundations/UI_TEXTS_EXTRACTOR.md",
    "docs/10-vision_roadmap/PIXELPROWLERS_V1_2_GAPS_ET_PHASES.md",
    "docs/10-vision_roadmap/PX_V1_2_PARCOURS_OVERVIEW.md",
    "docs/10-vision_roadmap/vision_produit.md",
    "docs/20-product_specs/functional/HOME_V1_2_Spec.md",
    "docs/20-product_specs/functional/PX_V1_2_LONGTAIL_DIAGNOSTIC_FONCTIONNEL.md",
    "docs/20-product_specs/functional/PX_V1_3_1_P1_PANORAMA_MODEL.md",
    "docs/20-product_specs/functional/PX_V1_3_P1_DIAGNOSTIC_ATELIER.md",
    "docs/20-product_specs/functional/PX_V1_3_P1_ENGAGEMENT_INTEGRATION.md",
    "docs/20-product_specs/functional/PX_V1_3_P1_ENGAGEMENT_LEVELS.md",
    "docs/20-product_specs/functional/PX_V1_3_X_OFFRE_FORMATIONS_ACCOMPAGNEMENT_OVERVIEW.md",
    "docs/20-product_specs/functional/PX_V1_3_X_OPERATION_125_PRODUCT_SPEC.md",
    "docs/20-product_specs/functional/PX_V1_X_PIXELPROWLERS_ENGAGEMENT_LEVELS_PUBLIC.md",
    "docs/20-product_specs/functional/PX_V1_X_PIXELPROWLERS_LEVEL5_INTERNAL_ONLY.md",
    "docs/20-product_specs/schemas/PX_V1_0_P1_ACTION_PLAN_SCHEMA.md",
    "docs/20-product_specs/schemas/PX_V1_3_P1_QUESTION_SCHEMA.md",
    "docs/20-product_specs/user_stories/homepage_core_user_stories.md",
    "docs/20-product_specs/user_stories/pages_ressources.md",
    "docs/20-product_specs/user_stories/parcours_utilisateurs_P1.md",
    "docs/20-product_specs/user_stories/PX_V1_3_PARCOURS_UTILISATEURS_P1.md",
    "docs/20-product_specs/user_stories/PX_V1_3_X_OPERATION_125_USER_STORIES.md",
    "docs/20-product_specs/ux_content/HOME_V1_2_HOMEPAGE_UX_CONTENT_TALA.md",
    "docs/20-product_specs/ux_content/P1_BLOCKS_NARRATIVE_TALIA.md",
    "docs/20-product_specs/ux_content/P1_PANORAMA_NARATIVE_TALIA.md",
    "docs/20-product_specs/ux_content/PX_SKIP_SIGNAL_POLICY_V1.md",
    "docs/20-product_specs/ux_content/PX_UNIVERSAL_QUESTIONNAIRE_UX_V1.md",
    "docs/20-product_specs/ux_content/PX_V1_2_TALIA_INVARIANTS_EMOTIONNELS.md",
    "docs/20-product_specs/ux_content/PX_V1_3_1_P1_ATERRISSAGE_SYSTEMIQUE_COPY.md",
    "docs/20-product_specs/ux_content/PX_V1_3_1_P1_HYPOTHESES_STRUCTURANTES_COPY.md",
    "docs/20-product_specs/ux_content/PX_V1_3_1_P1_SYSTEM_SCALPELS_COPY.md",
    "docs/20-product_specs/ux_content/PX_V1_3_RESOURCES_LIBRARY_SPEC.md",
    "docs/20-product_specs/ux_ui/DS_BADGE_MIGRATION_AUDIT_V1.md",
    "docs/20-product_specs/ux_ui/DS_CARD_MIGRATION_AUDIT_V1.md",
    "docs/20-product_specs/ux_ui/DS_COMPONENT_CATALOG_V1.md",
    "docs/20-product_specs/ux_ui/DS_CSS_ARCHITECTURE_V1.md",
    "docs/20-product_specs/ux_ui/DS_CTA_MIGRATION_AUDIT_V1.md",
    "docs/20-product_specs/ux_ui/DS_PAGEHEADER_MIGRATION_AUDIT_V1.md",
    "docs/20-product_specs/ux_ui/DS_QUESTIONNAIRE_MIGRATION_AUDIT_V1.md",
    "docs/20-product_specs/ux_ui/DS_SECTIONHEADER_MIGRATION_AUDIT_V1.md",
    "docs/20-product_specs/ux_ui/DS_TOKEN_REGISTRY_V1.md",
    "docs/20-product_specs/ux_ui/UX_INDEX_V1.md",
    "docs/30-tech_specs/architecture/HOME_V1_2_HOMEPAGE_UX_UI_ARCHITECTURE.md",
    "docs/30-tech_specs/frontend/BILAN_ENGINE_ADAPTER_GUIDE.md",
    "docs/30-tech_specs/frontend/DOCTRINE_UNIVERSAL_JOURNEYS_MANIFEST_V1.md",
    "docs/30-tech_specs/frontend/journeys.md",
    "docs/30-tech_specs/frontend/P1_GLOBAL_BILAN_REFACTOR_AUDIT.md",
    "docs/30-tech_specs/frontend/PX_CREATE_JOURNEY_IN_60_MINUTES.md",
    "docs/30-tech_specs/frontend/PX_JOURNEY_ENGINE_UNIVERSAL_V1.md",
    "docs/30-tech_specs/frontend/PX_NO_VHTML_DOCTRINE_V1.md",
    "docs/30-tech_specs/quality/mobile_accessibility.md",
    "docs/30-tech_specs/quality/performance_tracking.md",
    "docs/30-tech_specs/quality/seo.md",
    "docs/30-tech_specs/quality/testing_and_validation.md",
    "docs/40-security/ARCHITECTURE_SECURITE.md",
    "docs/40-security/LOGS_BACKUPS_ACCES.md",
    "docs/40-security/MODELES_DE_MENACES.md",
    "docs/40-security/POLITIQUES_OPSEC_PRIVACY.md",
    "docs/40-security/SECURITY_GATES.md",
    "docs/40-security/SECURITY_INDEX.md",
    "docs/50-measurement/kpis_and_dashboard.md",
    "docs/50-measurement/measurement_plan.md",
    "docs/50-measurement/user_feedback.md",
    "docs/55-qa/CI_CHECKLIST.md",
    "docs/55-qa/ENGAGEMENT_N1_N4_SMOKE_TESTS.md",
    "docs/55-qa/P1_GLOBAL_BILAN_SMOKE_TESTS.md",
    "docs/55-qa/P2_GLOBAL_BILAN_SMOKE_TESTS.md",
    "docs/55-qa/P3_GLOBAL_BILAN_SMOKE_TESTS.md",
    "docs/55-qa/P4_GLOBAL_BILAN_SMOKE_TESTS.md",
    "docs/55-qa/PX_JOURNEY_ENGINE_SMOKE_TESTS.md",
    "docs/55-qa/PX_P1_JOURNEY_TESTS.md",
    "docs/55-qa/QA_INDEX.md",
    "docs/55-qa/RESOURCES_ACTIONS_PANEL_SMOKE_TESTS.md",
    "docs/55-qa/SECURITY_GUARDS_SMOKE_TESTS.md",
    "docs/60-legal/rgpd_compliance.md",
    "docs/60-legal/terms_of_service.md",
    "docs/70-seo/SPRINT0_CONTEXT_PIXELPROWLERS.md",
    "docs/70-seo/SPRINT0_FILES_FOR_SEO.md",
    "docs/90-placeholders_archive/design_specifications_draft.md",
    "docs/90-placeholders_archive/future_sprints_draft.md",
    "docs/90-placeholders_archive/technical_debt_draft.md",
    "docs/99_handoff/P1_global_bilan_reperes_handoff.md",
]

# Mapping dossier -> tag principal
FOLDER_TAGS = {
    "00-foundations": ["foundations"],
    "10-vision_roadmap": ["roadmap", "vision"],
    "20-product_specs/functional": ["product_specs", "functional"],
    "20-product_specs/schemas": ["product_specs", "schemas"],
    "20-product_specs/user_stories": ["product_specs", "user_stories"],
    "20-product_specs/ux_content": ["product_specs", "ux_content"],
    "20-product_specs/ux_ui": ["product_specs", "ux_ui", "design_system"],
    "30-tech_specs/architecture": ["tech_specs", "architecture"],
    "30-tech_specs/frontend": ["tech_specs", "frontend"],
    "30-tech_specs/quality": ["tech_specs", "quality"],
    "40-security": ["security"],
    "40-security/contracts": ["security", "contracts"],
    "50-measurement": ["measurement", "kpis"],
    "55-qa": ["qa", "testing"],
    "60-legal": ["legal", "rgpd"],
    "70-seo": ["seo"],
    "90-placeholders_archive": ["archive"],
    "99_handoff": ["handoff"],
}

# Statut par défaut selon le dossier
def get_status(filepath: str, content: str) -> str:
    """Détermine le statut selon les règles SSOT."""
    if "90-placeholders_archive" in filepath or "99_handoff" in filepath:
        return "archived"
    # Fichier vide ou placeholder
    if len(content.strip()) < 100:
        return "draft"
    if "placeholder" in content.lower() or "todo" in content.lower()[:500]:
        return "draft"
    return "active"

def get_id(filepath: str) -> str:
    """Génère l'id selon les règles SSOT."""
    filename = Path(filepath).stem  # sans extension
    # Si commence par PX_, garder tel quel
    if filename.startswith("PX_"):
        return filename
    # Sinon, convertir en majuscules
    return filename.upper()

def get_tags(filepath: str) -> list:
    """Détermine les tags selon le dossier."""
    for folder, tags in FOLDER_TAGS.items():
        if folder in filepath:
            return tags
    return ["docs"]

def get_scope(filepath: str) -> list:
    """Génère le scope selon le dossier."""
    parts = Path(filepath).parts
    if len(parts) >= 2:
        return [f"docs/{parts[1]}/**"]
    return ["docs/**"]

def has_frontmatter(content: str) -> bool:
    """Vérifie si le fichier a déjà un frontmatter."""
    return content.strip().startswith("---")

def create_frontmatter(filepath: str, content: str) -> str:
    """Crée le frontmatter YAML pour un fichier."""
    doc_id = get_id(filepath)
    status = get_status(filepath, content)
    tags = get_tags(filepath)
    scope = get_scope(filepath)
    today = date.today().isoformat()
    
    frontmatter = f"""---
id: {doc_id}
version: 1.0.0
status: {status}
date: {today}
owners:
  - Marty
scope:
  - {scope[0]}
tags:
  - {tags[0]}"""
    
    for tag in tags[1:]:
        frontmatter += f"\n  - {tag}"
    
    frontmatter += "\n---\n\n"
    return frontmatter

def process_file(filepath: str) -> bool:
    """Traite un fichier en ajoutant le frontmatter si nécessaire."""
    full_path = Path(filepath)
    
    if not full_path.exists():
        print(f"⚠️  Fichier non trouvé: {filepath}")
        return False
    
    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if has_frontmatter(content):
        print(f"✓  Frontmatter déjà présent: {filepath}")
        return True
    
    frontmatter = create_frontmatter(filepath, content)
    new_content = frontmatter + content
    
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✅ Frontmatter ajouté: {filepath}")
    return True

def main():
    """Point d'entrée principal."""
    print("🚀 Ajout des frontmatters SSOT...\n")
    
    success = 0
    failed = 0
    
    for filepath in FILES_TO_PROCESS:
        try:
            if process_file(filepath):
                success += 1
            else:
                failed += 1
        except Exception as e:
            print(f"❌ Erreur sur {filepath}: {e}")
            failed += 1
    
    print(f"\n📊 Résultat: {success} succès, {failed} échecs")

if __name__ == "__main__":
    main()
