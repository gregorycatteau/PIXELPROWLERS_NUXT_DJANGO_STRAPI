"""Outil d'extraction des textes UI depuis les templates Vue.

Limitations :
- Parse uniquement le bloc `<template>` via regex, ne traite pas les cas complexes (render functions, slots imbriqués).
- Ignore les interpolations dynamiques `{{ }}` et les textes trop courts.
- Destiné à fournir un corpus éditorial de référence, pas un parser Vue complet.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Iterable, List, Dict

TEMPLATE_RE = re.compile(r"<template>(.*?)</template>", re.DOTALL)
TEXT_NODE_RE = re.compile(r">(.*?)<", re.DOTALL)


def extract_texts_in_vue_file(path: Path) -> List[str]:
    """Extrait les textes utilisateur présents dans le bloc <template> d'un fichier .vue."""
    content = path.read_text(encoding="utf-8")
    template_match = TEMPLATE_RE.search(content)
    if not template_match:
        return []

    template_block = template_match.group(1)
    texts: List[str] = []
    for match in TEXT_NODE_RE.finditer(template_block):
        raw = match.group(1)
        text = raw.strip()
        if not text:
            continue
        if "{{" in text or "}}" in text:
            continue
        if len(text) < 3:
            continue
        if re.match(r"[A-Za-z_][A-Za-z0-9_]*\\([^)]*\\)$", text):
            # Ignore fragments de code capturés par erreur (ex. emitAnswer(...))
            continue
        normalized = " ".join(text.split())
        if any(token in normalized for token in ("emitAnswer(", "handleAnswer(", "$emit(")):
            # Ignore chaînes techniques capturées (handlers Vue) : pas de copy à exposer.
            continue
        if re.search(r'\)"\s*/?>', normalized):
            # Ignore les fragments de templates fermés (ex. />) qui ne sont pas de la copy.
            continue
        texts.append(text)
    return texts


def walk_vue_files(root: Path) -> Iterable[Path]:
    """
    Parcourt les dossiers Nuxt pour trouver les fichiers .vue.

    Périmètre général :
    - pages/, components/, layouts/ à la racine du projet
    - app/pages/, app/components/, app/layouts/ (cas Nuxt 3/4 avec srcDir=app)

    Parcours P1 :
    - inclus via app/components/journey/p1/* et app/pages/parcours/[journeySlug].vue
    - prêt à étendre à P2–P5 en ajoutant d’autres sous-dossiers journey si besoin.
    """
    targets = [
        root / "pages",
        root / "components",
        root / "layouts",
        root / "app" / "pages",
        root / "app" / "components",
        root / "app" / "layouts",
    ]
    for folder in targets:
        if not folder.exists():
            continue
        yield from folder.rglob("*.vue")


def build_schema(root: Path) -> Dict[str, str]:
    """Construit le dictionnaire clé -> texte à partir de tous les fichiers .vue trouvés."""
    schema: Dict[str, str] = {}
    for fpath in walk_vue_files(root):
        rel = fpath.relative_to(root).as_posix()
        texts = extract_texts_in_vue_file(fpath)
        for idx, text in enumerate(texts, start=1):
            key = f"{rel}:text_{idx}"
            schema[key] = text
    return schema


def main() -> None:
    parser = argparse.ArgumentParser(description="Extrait les textes UI des templates Vue pour éditorial/i18n.")
    parser.add_argument("--root", type=Path, default=Path("frontend_nuxt"), help="Racine du projet Nuxt (frontend_nuxt/).")
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("docs/ui_texts_schema.json"),
        help="Chemin du fichier JSON généré.",
    )
    args = parser.parse_args()

    root = args.root
    output = args.output

    if not root.exists():
        raise SystemExit(f"Le dossier {root} est introuvable.")

    schema = build_schema(root)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(schema, ensure_ascii=False, indent=2), encoding="utf-8")

    vue_files_count = sum(1 for _ in walk_vue_files(root))
    print(f"Fichiers .vue traités : {vue_files_count}")
    print(f"Textes extraits      : {len(schema)}")
    print(f"Fichier généré       : {output}")


if __name__ == "__main__":
    main()
