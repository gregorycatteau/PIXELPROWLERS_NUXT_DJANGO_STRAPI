# Strapi v5 — PixelProwlers (phase lab)

Strapi servira de **lab de composants éditoriaux** et de CMS interne. Aucune collection n'est créée dans cette phase.

## Démarrage (dev)

1. Copier `.env.dev.example` en `.env` et renseigner les valeurs.
2. Installer les dépendances : `npm install` ou `yarn install`.
3. Lancer en mode développeur : `npm run develop` ou `yarn develop`.

Environnements `test` et `prod` suivent la même logique en changeant le fichier `.env`.

## Notes

- Base de données : PostgreSQL uniquement, variables d'environnement requises (`DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`).
- Clés d'app : renseigner `APP_KEYS` dans vos `.env`.
- Les content-types et permissions seront ajoutés en Phase 2+.
