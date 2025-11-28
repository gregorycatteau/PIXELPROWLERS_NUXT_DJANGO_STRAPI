# PixelProwlers — Nuxt 4 + Django 5 + Strapi 5

PixelProwlers est un studio pluriactif pour collectifs/individus en tension. Objectifs : vitrine claire, filtrage des bons profils, onboarding structuré et, à terme, un lab éditorial via Strapi.

## Structure
- `frontend_nuxt/` : Nuxt 4 + TailwindCSS 4 (TypeScript), formulaires vers l’API Django.
- `backend_django/` : Django 5 + DRF, settings multi-env, endpoint `POST /api/contact/`.
- `cms_strapi/` : Strapi 5 prêt pour PostgreSQL uniquement (aucun content-type encore).
- `docs/` : environnement, bases de données, feuille de route.
- `tools/` : utilitaires internes (extraction des textes UI depuis les templates Vue).

## Environnements
- 3 environnements : `dev`, `test`, `prod`.
- Bases PostgreSQL distinctes : `db_nuxt_dango_strapi_dev`, `db_nuxt_dango_strapi_test`, `db_nuxt_dango_strapi_prod` avec utilisateurs `striker_*` (mot de passe `Theokdiopa`) à placer uniquement dans vos `.env`. Voir `docs/DB_SETUP.md`.
- Variables d’environnement : exemples dans chaque sous-projet (`*.env.example`). Ne jamais committer de `.env` réels.

## Commandes usuelles

### Frontend (Nuxt)
```bash
cd frontend_nuxt
npm install
npm run dev           # démarre Nuxt en dev
npm run build         # build production
npm run start         # prévisualisation
```

### Backend (Django via Poetry)
```bash
cd backend_django
poetry install
poetry run python manage.py migrate
DJANGO_SETTINGS_MODULE=pixel_backend.settings.dev poetry run python manage.py runserver
```

### CMS (Strapi)
```bash
cd cms_strapi
npm install
npm run develop       # nécessite .env.dev configuré
```

### Outils internes
- Extraction des textes UI (front) : `python tools/extract_copy.py` (génère `docs/ui_texts_schema.json`).

## Initialiser le repo Git
```bash
git init
git add .
git commit -m "chore: initial skeleton for Nuxt + Django + Strapi stack"
# git remote add origin <votre-url>
```

Pour plus de détails : `docs/ENVIRONMENTS.md`, `docs/PHASES_DEV.md`.
