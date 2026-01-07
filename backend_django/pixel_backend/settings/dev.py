"""Paramètres de développement local."""
from .base import *  # noqa

DEBUG = True
ALLOWED_HOSTS = ["localhost", "127.0.0.1"]
CORS_ALLOWED_ORIGINS = ["http://localhost:3000"]

PX_CACHE_FAIL_CLOSED = False
PX_CACHE_FAIL_RETRY_AFTER = 60
PX_HEALTH_CHECK_CACHE = False

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
