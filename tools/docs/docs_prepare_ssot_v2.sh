#!/usr/bin/env bash
# tools/docs/docs_prepare_ssot_v2.sh
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$REPO_ROOT"

if [ ! -d "docs" ]; then
  echo "Erreur : dossier 'docs' introuvable à la racine du repo." >&2
  exit 1
fi

mkdir -p docs/{00-foundations,10-vision_roadmap,20-product_specs/{functional,user_stories,ux_content},30-tech_specs/{architecture,frontend,backend,cms,quality},40-security,50-measurement,60-legal,70-seo,90-placeholders_archive}

create_readme() {
  local dir="$1"; local title="$2"; local body="$3"
  if [ ! -f "$dir/README.md" ]; then
    cat > "$dir/README.md" <<EOF
# $title

$body
EOF
  fi
}

create_readme "docs/00-foundations" "Fondations (env, DB, outils)" "Contenus canoniques : ENVIRONMENTS, DB_SETUP, PHASES_DEV, outils d’extraction UI. Pas de brouillons ici."
create_readme "docs/10-vision_roadmap" "Vision & Roadmap" "Sources canoniques : vision produit, roadmap, gaps par version, overview parcours. Versions explicites."
create_readme "docs/20-product_specs" "Specs produit" "Specs fonctionnelles, user stories, UX/émotionnel. Canon = specs par parcours/feature ; brouillons à archiver ailleurs."
create_readme "docs/20-product_specs/functional" "Specs fonctionnelles" "Comportements attendus par parcours/feature. Canon par parcours."
create_readme "docs/20-product_specs/user_stories" "User stories" "User stories transverses. Alignées avec les specs fonctionnelles."
create_readme "docs/20-product_specs/ux_content" "UX & contenu" "Invariants émotionnels, patterns de dignité, chartes de ton. Référentiel partagé."
create_readme "docs/30-tech_specs" "Specs techniques" "Architecture, frontend, backend, CMS, qualité (perf, accessibilité, SEO technique). Canons techniques."
create_readme "docs/30-tech_specs/architecture" "Architecture" "Archi globale, diagrammes. Canons."
create_readme "docs/30-tech_specs/frontend" "Frontend" "Specs techniques front. Canons techniques."
create_readme "docs/30-tech_specs/backend" "Backend" "Specs techniques back. Canons techniques."
create_readme "docs/30-tech_specs/cms" "CMS" "Specs techniques CMS/Strapi. Canons techniques."
create_readme "docs/30-tech_specs/quality" "Qualité" "Tests, performance, accessibilité, SEO technique. Canons qualité."
create_readme "docs/40-security" "Sécurité / OPSEC" "Index, modèles de menaces, politiques, gates, logs/backups. Canons sécurité."
create_readme "docs/50-measurement" "Mesure & feedback" "Plan de mesure, KPIs, feedback utilisateur. Canons mesure."
create_readme "docs/60-legal" "Légal & conformité" "RGPD, ToS, mentions légales. Canons légaux."
create_readme "docs/70-seo" "SEO" "Guides et fichiers SEO. Canon SEO."
create_readme "docs/90-placeholders_archive" "Placeholders & archives" "Brouillons, placeholders, archives non canoniques. À trier/archiver."

echo "Arborescence préparée (idempotente)."
