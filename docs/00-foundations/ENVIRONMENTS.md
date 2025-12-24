---
id: ENVIRONMENTS
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

# Environnements

Trois environnements cohérents pour toutes les briques : `dev`, `test`, `prod`. Chaque environnement dispose de sa propre base PostgreSQL.

## Règles communes
- Variables d’environnement obligatoires pour les secrets et les connexions DB.
- Pas de `.env` committés : uniquement les `*.env.example`.
- `DB_HOST` et `DB_PORT` à adapter selon votre instance PostgreSQL.

## Nuxt (frontend)
- Fichier : `frontend_nuxt/.env.example`.
- Variable clé : `NUXT_PUBLIC_API_BASE` (URL de l’API Django).

## Django (backend)
- Fichiers : `.env.dev.example`, `.env.test.example`, `.env.prod.example` dans `backend_django/`.
- Variables : `DJANGO_SECRET_KEY`, `DJANGO_SETTINGS_MODULE`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`.

## Strapi (CMS)
- Fichiers : `.env.dev.example`, `.env.test.example`, `.env.prod.example` dans `cms_strapi/`.
- Variables : `APP_KEYS`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_SSL`, `HOST`, `PORT`.

## Choix des settings Django
- Dev : `DJANGO_SETTINGS_MODULE=pixel_backend.settings.dev`
- Test : `DJANGO_SETTINGS_MODULE=pixel_backend.settings.test`
- Prod : `DJANGO_SETTINGS_MODULE=pixel_backend.settings.prod`
