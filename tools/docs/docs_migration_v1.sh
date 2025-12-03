#!/usr/bin/env bash
# tools/docs/docs_migration_v1.sh
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$REPO_ROOT"

if [ ! -d "docs" ]; then
  echo "Erreur : dossier 'docs' introuvable à la racine du repo." >&2
  exit 1
fi

mkdir -p docs/{00-foundations,40-security,50-measurement,60-legal,70-seo}

# Fondations
for f in ENVIRONMENTS.md DB_SETUP.md PHASES_DEV.md UI_TEXTS_EXTRACTOR.md ui_texts_schema.json; do
  if [ -f "docs/$f" ]; then git mv "docs/$f" "docs/00-foundations/"; fi
done

# Mesure & feedback
if [ -d "docs/feedback_and_measurement" ]; then
  git mv docs/feedback_and_measurement/* docs/50-measurement/ || true
fi

# Légal
if [ -d "docs/legal_and_compliance" ]; then
  git mv docs/legal_and_compliance/* docs/60-legal/ || true
fi

# SEO
if [ -d "docs/seo" ]; then
  git mv docs/seo/* docs/70-seo/ || true
fi

# Sécurité
if [ -d "docs/security" ]; then
  git mv docs/security/* docs/40-security/ || true
fi

echo "Migration Vague 1 terminée (regroupements logique, sans suppression)."
