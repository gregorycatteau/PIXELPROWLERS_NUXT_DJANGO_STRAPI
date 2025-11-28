#!/usr/bin/env python
"""Point d'entrée Django pour les commandes administratives."""
import os
import sys


def main() -> None:
    """Configure l'environnement et délègue aux utilitaires Django."""
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pixel_backend.settings.dev")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Impossible d'importer Django. Assure-toi que les dépendances sont installées."
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
