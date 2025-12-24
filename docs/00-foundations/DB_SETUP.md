---
id: DB_SETUP
version: 1.0.0
status: active
date: 2025-12-24
owners: ["Tom", "Shay"]
  - Marty
scope:
  - docs/00-foundations/**
tags:
  - foundations
  - database
  - infrastructure
---

# Création des bases PostgreSQL

> ⚠️ **AVERTISSEMENT SÉCURITÉ** : Ne jamais commiter de mots de passe ou credentials dans ce fichier ou tout autre fichier du repository.

## Prérequis

- PostgreSQL installé et accessible
- Compte administrateur PostgreSQL
- Variables d'environnement configurées (voir ci-dessous)

## Variables d'environnement requises

Créez un fichier `.env` (ou `.env.local`) à la racine du projet concerné avec :

```bash
# PostgreSQL - NE PAS COMMITER CE FICHIER
POSTGRES_USER=<votre_username>
POSTGRES_PASSWORD=<votre_password_securisé>
POSTGRES_DB=<nom_database>
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# URL de connexion complète (alternative)
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}
```

## Scripts de création (templates)

À exécuter avec un compte administrateur PostgreSQL. **Remplacer les placeholders** par vos valeurs.

### Environnement Dev

```sql
-- Créer l'utilisateur (remplacer <DEV_PASSWORD> par un mot de passe sécurisé)
CREATE USER striker_dev WITH PASSWORD '<DEV_PASSWORD>';

-- Créer la base de données
CREATE DATABASE db_nuxt_dango_strapi_dev OWNER striker_dev;

-- Accorder les privilèges nécessaires (éviter SUPERUSER en production)
GRANT ALL PRIVILEGES ON DATABASE db_nuxt_dango_strapi_dev TO striker_dev;
```

### Environnement Test

```sql
CREATE USER striker_test WITH PASSWORD '<TEST_PASSWORD>';
CREATE DATABASE db_nuxt_dango_strapi_test OWNER striker_test;
GRANT ALL PRIVILEGES ON DATABASE db_nuxt_dango_strapi_test TO striker_test;
```

### Environnement Prod

```sql
-- En production, utiliser des credentials forts et uniques
CREATE USER striker_prod WITH PASSWORD '<PROD_PASSWORD_STRONG>';
CREATE DATABASE db_nuxt_dango_strapi_prod OWNER striker_prod;

-- Privilèges minimaux (pas de SUPERUSER)
GRANT CONNECT ON DATABASE db_nuxt_dango_strapi_prod TO striker_prod;
GRANT USAGE ON SCHEMA public TO striker_prod;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO striker_prod;
```

## Bonnes pratiques

1. **Ne jamais commiter de secrets** : Utiliser `.env` et s'assurer qu'il est dans `.gitignore`
2. **Privilèges minimaux** : Éviter `SUPERUSER`, accorder uniquement les droits nécessaires
3. **Mots de passe forts** : Minimum 16 caractères, alphanumériques + caractères spéciaux
4. **Rotation** : Changer les mots de passe régulièrement (surtout en prod)
5. **Secrets Manager** : En production, utiliser un gestionnaire de secrets (Vault, AWS Secrets Manager, etc.)

## Vérification .gitignore

S'assurer que ces fichiers sont ignorés :

```gitignore
# Fichiers d'environnement
.env
.env.local
.env.*.local
*.env

# Ne pas commiter les credentials
backend_django/.env.dev
backend_django/.env.prod
```

---

*Document mis à jour le 2025-12-24 — Credentials purgés conformément à la doctrine SSOT.*
