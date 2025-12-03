# Création des bases PostgreSQL

À exécuter avec un compte administrateur PostgreSQL. Adapter l’hôte si besoin.

```sql
-- Dev
CREATE USER striker_dev WITH PASSWORD 'Theokdiopa' SUPERUSER;
CREATE DATABASE db_nuxt_dango_strapi_dev OWNER striker_dev;

-- Test
CREATE USER striker_test WITH PASSWORD 'Theokdiopa' SUPERUSER;
CREATE DATABASE db_nuxt_dango_strapi_test OWNER striker_test;

-- Prod
CREATE USER striker_prod WITH PASSWORD 'Theokdiopa' SUPERUSER;
CREATE DATABASE db_nuxt_dango_strapi_prod OWNER striker_prod;
```

Notes :
- Utiliser ces identifiants uniquement via des fichiers `.env` locaux, jamais en dur dans le code.
- Remplacer les privilèges `SUPERUSER` par le niveau minimal requis selon votre politique.
