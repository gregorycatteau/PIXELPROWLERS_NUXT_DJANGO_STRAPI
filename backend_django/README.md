# Backend Django — PixelProwlers

Backend Django 5 + DRF avec settings multi-environnements et endpoint `POST /api/contact/`.

## Commandes courantes
- Installer les dépendances : `poetry install`
- Appliquer les migrations : `poetry run python manage.py migrate --settings=pixel_backend.settings.dev`
- Lancer le serveur dev : `poetry run python manage.py runserver --settings=pixel_backend.settings.dev`

Variables d’environnement attendues : voir les fichiers `.env.*.example`.
