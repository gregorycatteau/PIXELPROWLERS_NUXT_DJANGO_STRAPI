"""Configuration WSGI pour PixelProwlers."""
import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pixel_backend.settings.dev")

application = get_wsgi_application()
