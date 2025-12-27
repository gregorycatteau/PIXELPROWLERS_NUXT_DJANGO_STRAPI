"""
Configuration pytest pour les tests backend PixelProwlers.

Fournit les fixtures et settings pour pytest-django.
"""
import os

import pytest

# Configuration Django pour les tests
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pixel_backend.settings.test")


@pytest.fixture
def api_client():
    """Client REST Framework pour tester les vues API."""
    from rest_framework.test import APIClient
    return APIClient()
