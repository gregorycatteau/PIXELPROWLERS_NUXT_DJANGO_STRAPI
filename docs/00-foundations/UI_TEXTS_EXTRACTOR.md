---
id: UI_TEXTS_EXTRACTOR
version: 1.0.0
status: active
date: 2025-12-24
owners: ["Jared", "Marty"]
  - Marty
scope:
  - docs/00-foundations/**
tags:
  - foundations
---

# Extracteur de textes UI (frontend Nuxt)

Ce script extrait les textes UI présents dans les templates Vue afin de travailler la rédaction (copy) ou préparer une future couche i18n/registry.

## Utilisation

Depuis la racine du repo :

```bash
python tools/extract_copy.py
```

Le script parcourt `frontend_nuxt/pages`, `frontend_nuxt/components` et `frontend_nuxt/layouts`, extrait les textes des blocs `<template>` et génère un JSON lisible dans `docs/ui_texts_schema.json`.

Options disponibles :
- `--root` : chemin du dossier Nuxt (défaut : `frontend_nuxt`)
- `--output` : chemin du fichier de sortie (défaut : `docs/ui_texts_schema.json`)
