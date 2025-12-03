#!/usr/bin/env bash
# tools/docs/docs_migration_v2.sh
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$REPO_ROOT"

if [ ! -d "docs" ]; then
  echo "Erreur : dossier 'docs' introuvable à la racine du repo." >&2
  exit 1
fi

mkdir -p docs/{10-vision_roadmap,20-product_specs/{functional,user_stories,ux_content},30-tech_specs/{frontend,backend,cms,quality}}

# Vision / roadmap
if [ -d "docs/roadmap" ]; then
  git mv docs/roadmap/* docs/10-vision_roadmap/ || true
fi

# Specs produit – fonctionnel
if [ -d "docs/specs/functional" ]; then
  git mv docs/specs/functional/* docs/20-product_specs/functional/ || true
fi

# Specs produit – user stories
if [ -d "docs/specifications/user_stories" ]; then
  git mv docs/specifications/user_stories/* docs/20-product_specs/user_stories/ || true
fi

# UX / contenu (Talia)
if [ -f "docs/20-product_specs/functional/PX_V1_2_TALIA_INVARIANTS_EMOTIONNELS.md" ]; then
  git mv docs/20-product_specs/functional/PX_V1_2_TALIA_INVARIANTS_EMOTIONNELS.md docs/20-product_specs/ux_content/ || true
elif [ -f "docs/specs/functional/PX_V1_2_TALIA_INVARIANTS_EMOTIONNELS.md" ]; then
  git mv docs/specs/functional/PX_V1_2_TALIA_INVARIANTS_EMOTIONNELS.md docs/20-product_specs/ux_content/ || true
fi

# Specs techniques (répartition provisoire)
if [ -d "docs/specifications/specifications_techniques" ]; then
  git mv docs/specifications/specifications_techniques/* docs/30-tech_specs/quality/ || true
fi

# Testing & validation (gérer les deux emplacements)
if [ -f "docs/specifications/testing_and_validation.md" ]; then
  git mv docs/specifications/testing_and_validation.md docs/30-tech_specs/quality/ || true
elif [ -f "docs/testing_and_validation.md" ]; then
  git mv docs/testing_and_validation.md docs/30-tech_specs/quality/ || true
fi

echo "Migration Vague 2 terminée (produit/tech/UX regroupés)."
